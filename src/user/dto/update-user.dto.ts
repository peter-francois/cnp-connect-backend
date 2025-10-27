import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { StatusEnum } from "@prisma/client";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  status?: StatusEnum;

  @IsOptional()
  @IsBoolean()
  isConnected?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  avatarUrl?: string;
}
