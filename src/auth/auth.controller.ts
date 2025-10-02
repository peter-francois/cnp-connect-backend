import { Controller, Post, Body, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { SigninDto } from "./dto/signin.dto";
import { User } from "@prisma/client";
import { CustomException } from "src/utils/custom-exception";
//import { ResponseInterface } from "src/utils/interfaces/response.interface";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post("signin") //stdfDVZS-6qdfb
  async signin(@Body() body: SigninDto): Promise<string> {
    const user: User = await this.userService.getUserByEmail(body.email);
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

    return "succes";
    // generate access token and refresh token
    // insert refresh token hashed in DB
  }
}
