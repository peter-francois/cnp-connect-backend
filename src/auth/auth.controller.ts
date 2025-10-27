import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Req,
  UseGuards,
  Param,
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
import type { ChangePasswordInterface } from "./interfaces/changePassword.interface";
import { AccesTokenGuard } from "./guard/access-token.guard";
import CryptoJS from "crypto-js";

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

  // a89686e9-19c9-480c-bb20-de3d36a55468
  // U2FsdGVkX19n7dzZRXpPMGn2bTnwy9q8BG49vu2Yshwn8o7\gqCP\afYAo8dtffVtWx5ynNF2HBMrcS7Ulq0Bw==
  // @Post("changePassword/:token")
  @Post("changePassword/:token")
  async changePassword(
    @Body() body: ChangePasswordInterface,
    @Param(":token") token: string,
  ): Promise<ResponseInterfaceMessage> {
    console.log("🚀 ~ auth.controller.ts:122 ~ changePassword ~ token:", token);
    // get userId with token
    // const userId = CryptoJS.AES.decrypt(token, "secret-test");
    // console.log(
    //   "🚀 ~ auth.controller.ts:124 ~ changePassword ~ userId:",
    //   userId,
    // );
    // compare crypted token and none crypted token
    // chek if token from url match hashed token from db

    // decrypt -> userId
    // getRefreshToken -> userId+ type RESETPASSWORD
    // COMPARE hashedtoken with token
    const { password, confirmPassword } = body;
    // tokenEncrypt=azyteevudcbino,kzv
    // tokenDecrypt = UUID (userId)
    // http://localhost:3000/auth/change-password?token=
    // http://localhost:3000/auth/change-password?uuid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NThkMjkzLTQ3NjMtNGI4NS1hZTY2LTJhMGY4ZTM2YzdkZCIsInJvbGUiOiJEUklWRVIiLCJpYXQiOjE3NjEwMDE5ODYsImV4cCI6MTc2MTAwMjg4Nn0.qxmdW95SjjLbbk8R8ACgDMGzIFVCozn3lksrpST8dFo
    if (password !== confirmPassword)
      throw new CustomException(
        "BadRequest",
        HttpStatus.BAD_REQUEST,
        "As-cp-1",
      );

    // check if not same password

    await this.authService.changePassword(body);

    return {
      message: "Mot de passe modifié avec succés.",
    };
  }
}
