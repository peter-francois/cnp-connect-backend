import { PartialType } from "@nestjs/mapped-types";
import { CreateGroupDto } from "./create-group.dto";
import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { MemberDto } from "./member.dto";

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  @ArrayMinSize(1)
  members: MemberDto[];

  @IsString()
  avatar?: string;
}
