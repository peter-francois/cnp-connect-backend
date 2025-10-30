import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsNumber()
  owner_id: number;

  @IsString()
  members: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
