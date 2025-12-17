import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Injectable } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  afterInit() {
    console.log("🔥 Socket.IO initialized");
  }

  sendMessage(message: any) {
    this.server.emit("message", message);
  }
}
