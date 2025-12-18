import { PartialType } from "@nestjs/mapped-types";
import { CreateConversationDto } from "./create-conversation.dto";
import { Type } from "class-transformer";
import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { ParticipantDto } from "./participant.dto";

export class UpdateConversationDto extends PartialType(CreateConversationDto) {
  @IsString()
  label: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  @ArrayMinSize(1)
  participants: ParticipantDto[];
}
