import { Injectable } from "@nestjs/common";
import { SendMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { ClientNatsBase } from "src/utils/client-nats/client-nats-base";
import { lastValueFrom } from "rxjs";
import { Message } from "./entities/message.entity";

@Injectable()
export class MessageService extends ClientNatsBase {
  async send(sendMessageDto: SendMessageDto) {
    const responce: Message = await lastValueFrom(
      this.clientNats.send("message.send", sendMessageDto),
    );
    return responce;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const response: Message = await lastValueFrom(
      this.clientNats.send("message.update", { id, ...updateMessageDto }),
    );
    return response;
  }

  async remove(id: string) {
    const response: Message = await lastValueFrom(
      this.clientNats.send("message.deleteOne", { id }),
    );
    return response;
  }
}
