import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Injectable } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
@Injectable()
export abstract class ChatGateway {
  @WebSocketServer()
  server: Server;

  sendMessage(message: any) {
    this.server.emit("message", message);
  }
}
