import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { SendMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { ChatGateway } from "src/message-listener/socket-io.gateway";

@Controller("messages")
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post()
  create(@Body() sendMessageDto: SendMessageDto) {
    this.chatGateway.sendMessage(sendMessageDto);
    return this.messageService.send(sendMessageDto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.messageService.remove(id);
  }
}
