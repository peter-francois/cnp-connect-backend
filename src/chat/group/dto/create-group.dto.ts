import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { MemberDto } from "./member.dto";

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsNumber()
  ownerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  @ArrayMinSize(1)
  members: MemberDto[];

  @IsString()
  @IsOptional()
  avatar?: string;
}
