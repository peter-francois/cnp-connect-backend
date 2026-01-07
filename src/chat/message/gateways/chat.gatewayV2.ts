import { UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AccesTokenGuard } from "src/auth/guard/access-token.guard";
import { UserService } from "src/user/user.service";

interface Message {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  timestamp?: string;
}
@WebSocketGateway()
export class ChatGatewayV2 implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private userService: UserService) {}

  @WebSocketServer()
  private server: Server;
  private readonly connectedUsers = new Map<string, string>();

  private userCounter = 0;

  @UseGuards(AccesTokenGuard)
  async handleConnection(client: Socket): Promise<void> {
    try {
      this.userCounter++;
      const user = await this.userService.findOneSafeById(client.data.userId);
      const username = `${user.lastName} ${user.firstName}`;
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

  @SubscribeMessage("message")
  handleMessage(
    @MessageBody() data: Message,
    @ConnectedSocket() client: Socket,
  ): void {
    try {
      const username = this.connectedUsers.get(client.id);
      if (!username) {
        console.warn(
          `Message received from unauthenticated socket: ${client.id}`,
        );
        // this.sendError(client, "Not authenticated");
        return;
      }

      console.log(`Message from ${username}: ${data.content}`);

      // Create server message with timestamp in ISO 8601 format
      const serverMessage: Message = {
        id: data.id,
        conversationId: data.conversationId,
        content: data.content,
        senderId: data.senderId,
        timestamp: data.timestamp,
      };

      // Broadcast to ALL clients including sender
      this.server.emit("message", serverMessage);
    } catch (error) {
      console.error(`Error handling message: ${error.message}`, error.stack);
      // this.sendError(client, "Failed to send message");
    }
  }
}
