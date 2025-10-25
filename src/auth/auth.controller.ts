import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { SigninDto } from "./dto/signin.dto";
import { User } from "@prisma/client";
import { CustomException } from "src/utils/custom-exception";
import { TokenService } from "./token.service";
import {
  ResponseInterface,
  ResponseInterfaceMessage,
} from "src/utils/interfaces/response.interface";
import { type RequestWithPayloadAndRefreshInterface } from "./interfaces/payload.interface";
import { RefreshTokenGuard } from "./guard/refresh-token.guard";
import { EmailService } from "src/utils/mail/email.service";
import { EmailTokensInterface } from "./interfaces/token.interface";
import { UserSigninResponse } from "src/user/interface/user.interface";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly sendEmailService: EmailService,
  ) {}

  @Post("signin")
  async signin(
    @Body() body: SigninDto,
  ): Promise<ResponseInterface<string | UserSigninResponse>> {
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
    const { password, createdAt, updatedAt, ...userSigninResponse } = user;

    // create accessToken and refreshToken
    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      user.id,
      user.role,
    );

    // hash refreshToken
    const hashedRefreshToken = await this.authService.hash(refreshToken);

    // upsert refresh token
    // no await so, the token can be inserted in db before return => performance gain, but if exeption => client don't know about it
    this.tokenService.upsert(user.id, hashedRefreshToken);

    return {
      data: { accessToken, refreshToken, userSigninResponse },
      message: "Connexion réussie.",
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Post("refresh-token")
  async refrechToken(
    @Req() req: RequestWithPayloadAndRefreshInterface,
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
      req.refreshToken,
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

    const hahedRefreshToken = await this.authService.hash(refreshToken);

    this.tokenService.upsert(req.user.id, hahedRefreshToken);

    return {
      data: { accessToken, refreshToken },
      message: "Connexion réussis.",
    };
  }

  @Post("forgot-password")
  async sendResetPasswordEmail(
    @Body() body: { email: string },
  ): Promise<ResponseInterfaceMessage> {
    const { email } = body;
    const user = await this.userService.getUserByEmail(email);

    if (!user)
      throw new CustomException("Not found", HttpStatus.NOT_FOUND, "AC-srpe-1");

    const { urlSafeToken, hashedToken }: EmailTokensInterface =
      await this.tokenService.generateEmailToken(user.id);

    await this.tokenService.upsert(
      user.id,
      hashedToken,
      "RESET_PASSWORD",
      new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    );

    await this.sendEmailService.sendEmail(
      user.email,
      "Test SMTP Brevo NestJS via CNP Connect",
      `<h1>Bonjour ${user.firstName}</h1>
          <p>Email envoyé via Cnp-Connect 🚀</p>
          <a href="http://localhost:3000/auth/change-password?token=${urlSafeToken}">
            Cliquez ici pour réinitialiser votre mot de passe
          </a>`,
    );

    return { message: "L'Email est bien envoyé" };
  }
}
