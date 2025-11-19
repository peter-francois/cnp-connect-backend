import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Req,
  UseGuards,
  Param,
  Get,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { SigninDto } from "./dto/signin.dto";
import { RoleEnum, StatusEnum, User } from "@prisma/client";
import { CustomException } from "src/utils/custom-exception";
import { TokenService } from "./token.service";
import {
  ResponseInterface,
  ResponseInterfaceMessage,
} from "src/utils/interfaces/response.interface";
import { type RequestWithPayloadAndRefreshInterface } from "./interfaces/payload.interface";
import { RefreshTokenGuard } from "./guard/refresh-token.guard";
import { EmailService } from "src/utils/mail/email.service";
import { SafeUserResponse } from "src/user/interface/user.interface";
import { AccesTokenGuard } from "./guard/access-token.guard";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import type { Response } from "express";
import { CreateUserDtoForGoogleOauth } from "src/user/dto/create-user.dto";
import { GoogleOpenIdGuard } from "./guard/google-openid.guard";
import { v4 as uuidv4 } from "uuid";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  @Post("signin")
  async signin(
    @Body() body: SigninDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseInterface<string | SafeUserResponse>> {
    let user: User = await this.userService.getUserByEmail(body.email);
    // compare hash
    if (user.password) {
      const comparePassword: boolean = await this.authService.compare(
        user.password,
        body.password,
      );
      if (!comparePassword)
        throw new CustomException(
          "Bad credentials",
          HttpStatus.PRECONDITION_FAILED,
          "AC-s-1",
        );
    }

    //changement de isConnected
    user = await this.userService.update(user.id, { isConnected: true });

    // remove "password" | "createdAt" | "updatedAt" from user before send it to front
    const { password, createdAt, updatedAt, ...userSigninResponse } = user;

    // create accessToken and refreshToken
    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      user.id,
      user.role,
    );

    // add access token in cookies
    this.tokenService.addRefreshTokenInResponseAsCookie(response, refreshToken);

    // hash refreshToken
    const hashedRefreshToken = await this.authService.hash(refreshToken);

    // upsert refresh token
    // no await so, the token can be inserted in db before return => performance gain, but if exeption => client don't know about it
    this.tokenService.upsert(user.id, hashedRefreshToken);

    return {
      data: { accessToken, userSigninResponse },
      message: "Connexion réussie.",
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Post("refresh-token")
  async refreshToken(
    @Req() req: RequestWithPayloadAndRefreshInterface,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseInterface<string>> {
    // get refresh from DB
    if (!req.user)
      throw new CustomException(
        "Unauthorized",
        HttpStatus.UNAUTHORIZED,
        "AC-rt-1",
      );

    const oldHashedRefresh = await this.tokenService.getRefreshToken(
      req.user.id,
    );

    //compare tokens
    const compareTokens: boolean = await this.authService.compare(
      oldHashedRefresh.token,
      // req.refreshToken,
      req.cookies["refreshToken"] as string,
    );

    if (!compareTokens)
      throw new CustomException(
        "Unauthorized",
        HttpStatus.UNAUTHORIZED,
        "AC-rt-2",
      );

    // create accessToken and refreshToken
    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      req.user.id,
      req.user.role,
    );

    // add access token in cookies
    this.tokenService.addRefreshTokenInResponseAsCookie(response, refreshToken);
    // response.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 3600 * 1000,
    // });

    const hahedRefreshToken = await this.authService.hash(refreshToken);

    this.tokenService.upsert(req.user.id, hahedRefreshToken);

    return {
      data: { accessToken },
      message: "Connexion réussis.",
    };
  }

  @Post("forgot-password")
  async forgotPassword(
    @Body() body: { email: string },
  ): Promise<ResponseInterfaceMessage> {
    const user = await this.userService.getUserByEmail(body.email);

    await this.emailService.sendResetPassword(user);

    return {
      message:
        "Si vous avez un compte, un e-mail de réinitialisation de mot de passe a été envoyé.",
    };
  }

  @Post("reset-password")
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<ResponseInterfaceMessage> {
    const { password, confirmPassword, token } = body;
    const userId = await this.tokenService.getUserIdByToken(token);

    if (password !== confirmPassword)
      throw new CustomException(
        "BadRequest",
        HttpStatus.BAD_REQUEST,
        "AC-rp-1",
      );

    // check if not same password
    await this.authService.resetPassword(body, userId);
    return {
      message: "Mot de passe modifié avec succés.",
    };
  }

  @Get("google")
  // @UseGuards(AuthGuard("google"))
  // @Redirect(
  //   "https://accounts.google.com/v3/signin/accountchooser?client_id=523043882330-pneqc8n3rao6rppf6b2pjhb2g4an1nv7.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgoogle%2Fcallback&response_type=code&scope=email+profile&dsh=S537080426%3A1763555539813285&o2v=2&service=lso&flowName=GeneralOAuthFlow&opparams=%253F&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAOyem_pWzL-wu24cDeRo-UeojCTE1rLtfkUy8tVU6eZ3-vhnU-ufC8_sPsBCUR-b7o5y3crOihzyYHdY_WD9XzqkoXDUBxP0AMv2rMAjgjNIJgRRPuFYSl-aZ9iYU_lJ6zk9zKsNctIoFYS8BQzoRK6RK3zRtWkec1F-tG2Vs7h1wT4q4OlMWg4RTuZbuEvgZ8BnGUV8jmnL5h83SD_6m_28EadgEqraS7U3tMadp2YNYHHRbCmdClViueQQiWxA6GbIz9FaoidAmbo-AgNiyWnoNQ51mufxyl6h1OAKAJdZgtLMrdBljPLBLba7rtnG_rJnxK2aEoEKCXph47DuKgb_-6GK4XODjmsIjxQy_dxItb2D6YLTklEpHeY7mVY61PDwmUb_d-otnCq5HxHfCrQDFtAhkaZn6vkK-Mp-SJtswi6s-wxTWEhm-0LGiLh1YCM7Gi5JpMkbsh00lFMBVTMnC6shw%26flowName%3DGeneralOAuthFlow%26as%3DS537080426%253A1763555539813285%26client_id%3D523043882330-pneqc8n3rao6rppf6b2pjhb2g4an1nv7.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=http%3A%2F%2Flocalhost%3A3000",
  //   302,
  // )
  googleAuth(@Res() res) {
    const state = uuidv4();
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      scope: "email profile",
    });
    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    );
  }

  @Get("google/callback")
  // @UseGuards(AuthGuard("google"))
  @UseGuards(GoogleOpenIdGuard)
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    // create new user with credentials from google
    const userDtoFromGoogleOauth: CreateUserDtoForGoogleOauth = {
      email: req.user.email,
      firstName: req.user.given_name,
      lastName: req.user.family_name,
      hiredAt: new Date().toDateString(),
      role: RoleEnum.DRIVER,
    };
    const user = await this.userService.createUser(
      userDtoFromGoogleOauth,
      StatusEnum.CONFIRMED,
    );

    // create accessToken and refreshToken
    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      user.id,
      user.role,
    );

    // add access token in cookies
    this.tokenService.addRefreshTokenInResponseAsCookie(response, refreshToken);

    // hash refreshToken
    const hashedRefreshToken = await this.authService.hash(refreshToken);

    // upsert refresh token
    // no await so, the token can be inserted in db before return => performance gain, but if exeption => client don't know about it
    this.tokenService.upsert(user.id, hashedRefreshToken);

    return {
      data: { accessToken },
      message: "Connexion réussie.",
    };
  }
}

// http://localhost:3000/auth/change-password?token=05c0ea12-93bb-4c44-adf0-6f0d54af33fc
