import { UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AccesTokenGuard } from "src/auth/guard/access-token.guard";

@UseGuards(AccesTokenGuard)
@WebSocketGateway()
export class ChatGatewayV2 implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private readonly connectedUsers = new Map<string, string>();

  private userCounter = 0;

  handleConnection(client: Socket): void {
    try {
      this.userCounter++;
      const username = `User${this.userCounter}`;
      this.connectedUsers.set(client.id, username);

      console.log(`User connected: ${username} (socket: ${client.id})`);

      // Send welcome message to the new client
      const welcomeMessage: any = {
        username,
      };
      client.emit("welcome", welcomeMessage);

      // Broadcast user joined notification to all OTHER clients
      const joinedMessage: any = {
        type: "user_joined",
        username,
      };
      client.broadcast.emit("user_joined", joinedMessage);
    } catch (error) {
      console.error(`Error handling connection: ${error.message}`, error.stack);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    try {
      const username = this.connectedUsers.get(client.id);

      if (username) {
        this.connectedUsers.delete(client.id);
        console.log(`User disconnected: ${username} (socket: ${client.id})`);

        // Broadcast user left notification to remaining clients
        const leftMessage: any = {
          type: "user_left",
          username,
        };
        this.server.emit("user_left", leftMessage);
      }
    } catch (error) {
      console.error(`Error handling disconnect: ${error.message}`, error.stack);
    }
  }
}
