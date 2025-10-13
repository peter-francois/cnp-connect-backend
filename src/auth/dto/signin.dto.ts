import { IsNotEmpty, IsEmail } from "class-validator";

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
