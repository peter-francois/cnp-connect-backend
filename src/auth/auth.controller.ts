import { Controller, Post, Body, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { SigninDto } from "./dto/signin.dto";
import { User } from "@prisma/client";
import { CustomException } from "src/utils/custom-exception";
import { TokenService } from "./token.service";
import { ResponseInterface } from "src/utils/interfaces/response.interface";
//import { ResponseInterface } from "src/utils/interfaces/response.interface";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post("signin")
  async signin(@Body() body: SigninDto): Promise<ResponseInterface<string>> {
    const user: User = await this.userService.getUserByEmail(body.email);
    // compare hash
    console.log(await this.authService.hash(body.password));
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

    // generate access token and refresh token
    const accessToken: string = await this.tokenService.generateJwt(user, {
      algorithm: "HS256",
      expiresIn: "15m",
      secret: process.env.ACCESS_JWT_SECRET,
    });

    const refreshToken: string = await this.tokenService.generateJwt(user, {
      algorithm: "HS256",
      expiresIn: "1d",
      secret: process.env.REFRESH_JWT_SECRET,
    });

    // hash refresh token

    const hahedRefreshToken = await this.authService.hash(refreshToken);

    // upsert refresh token
    // no await so, the token can be inserted in db before return => performance gain, but if exeption => client don't know about it

    this.tokenService.upsert(user.id, hahedRefreshToken);

    // insert refresh token hashed in DB
    return {
      data: { accessToken, refreshToken },
      message: "Connexion réussis.",
    };
  }
}
