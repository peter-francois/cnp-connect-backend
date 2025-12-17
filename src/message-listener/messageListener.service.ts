import { Injectable, OnModuleInit } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ChatGateway } from "./socket-io.gateway";
import { ClientNatsBase } from "src/utils/client-nats/client-nats-base";

@Injectable()
export class MessageListenerService extends ClientNatsBase {
  constructor(private readonly chatGateway: ChatGateway) {
    super(chatGateway as any);
  }

  sendMessage(messageDto: any) {
    // const message = await this.saveMessageInDB(messageDto);
    console.log("yugvbhijnok,lm");
    // Au lieu d'envoyer sur NATS, on appelle directement Socket.IO
    this.chatGateway.sendMessage(messageDto);

    return messageDto;
  }

  // @MessagePattern("message.sent")
  // handleMessageSent(@Payload() message: any) {
  //   console.log("tewstrzgfb");
  //   this.chatGateway.sendMessage(message);
  // }

  // @MessagePattern("message.updated")
  // handleMessageUpdated(@Payload() message: any) {
  //   this.chatGateway.sendMessage({ type: "update", ...message });
  // }

  // @MessagePattern("message.deleted")
  // handleMessageDeleted(@Payload() message: any) {
  //   this.chatGateway.sendMessage({ type: "delete", ...message });
  // }
}
