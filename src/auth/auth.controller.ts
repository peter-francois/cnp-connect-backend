import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Req,
  UseGuards,
  Get,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { SigninDto } from "./dto/signin.dto";
import { StatusEnum, User } from "@prisma/client";
import { CustomException } from "src/utils/custom-exception";
import { TokenService } from "./token.service";
import {
  type ResponseInterface,
  ResponseInterfaceMessage,
} from "src/utils/interfaces/response.interface";
import {
  type RequestWithPayloadInterface,
  type RequestWithPayloadAndRefreshInterface,
} from "./interfaces/payload.interface";
import { RefreshTokenGuard } from "./guard/refresh-token.guard";
import { EmailService } from "src/utils/mail/email.service";
import { SafeUserResponse } from "src/user/interface/user.interface";
import { AccesTokenGuard } from "./guard/access-token.guard";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import type { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  @UseGuards(AccesTokenGuard)
  @Get("me")
  async me(
    @Req() req: RequestWithPayloadInterface,
  ): Promise<ResponseInterface<SafeUserResponse>> {
    const user = await this.userService.findOneById(req.user.id);

    if (
      user.status === StatusEnum.NOT_CONFIRMED ||
      user.status === StatusEnum.NOT_EMPLOYED
    )
      throw new CustomException(
        "Unauthorize",
        HttpStatus.UNAUTHORIZED,
        "AC-m-1",
      );
    return { data: { user }, message: "Utilisateur courant" };
  }

  @Post("signin")
  async signin(
    @Body() body: SigninDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseInterface<string | SafeUserResponse>> {
    let user: User = await this.userService.getUserByEmail(body.email);
    // compare hash
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

    //changement de isConnected
    user = await this.userService.update(user.id, { isConnected: true });

    // remove "password" | "createdAt" | "updatedAt" from user before send it to front
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

  @UseGuards(AccesTokenGuard)
  @Post("signout")
  async signout(
    @Req() req: RequestWithPayloadAndRefreshInterface,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseInterfaceMessage> {
    await this.authService.signout(req.user.id);
    this.tokenService.deleteRefreshTokenCookie(response);
    return { message: "Déconnexion réussie." };
  }
}

// http://localhost:3000/auth/change-password?token=05c0ea12-93bb-4c44-adf0-6f0d54af33fc
