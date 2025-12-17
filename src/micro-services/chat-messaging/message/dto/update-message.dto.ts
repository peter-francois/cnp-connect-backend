import { PartialType } from "@nestjs/mapped-types";
import { SendMessageDto } from "./create-message.dto";

export class UpdateMessageDto extends PartialType(SendMessageDto) {}
