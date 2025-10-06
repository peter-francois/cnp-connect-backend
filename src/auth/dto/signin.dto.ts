import { IsNotEmpty, IsEmail, IsStrongPassword } from "class-validator";

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
