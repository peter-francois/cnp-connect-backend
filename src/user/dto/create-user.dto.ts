import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { RoleEnum } from "@prisma/client";
import { Transform } from "class-transformer";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({
    minLength: 10,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  hiredAt: string;

  @IsNotEmpty()
  @IsString()
  role: RoleEnum;
}
