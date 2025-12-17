import { IsString } from "class-validator";

export class SendMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  senderId: string;

  @IsString()
  content: string;
}
