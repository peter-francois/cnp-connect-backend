import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ParticipantDto } from "./participant.dto";

export class CreateConversationDto {
  @IsString()
  @IsOptional()
  groupId: string;

  @IsString()
  label: string;

  @IsString()
  creatorId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  @ArrayMinSize(1)
  participants: ParticipantDto[];
}
