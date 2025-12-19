import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import type {
  WelcomeResponseMessage,
  UserJoinedMessage,
  UserLeftMessage,
  WelcomeUserMessage,
  ClientChatMessage,
  ServerChatMessage,
  ErrorMessage,
} from "../dto/websocket-message.dto";

/**
 * Valid authentication token for WebSocket connections.
 */
const VALID_TOKEN = "SECRET_TOKEN_123";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGatewayOld
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(ChatGatewayOld.name);
  private readonly connectedUsers = new Map<string, string>();

  private userCounter = 0;

  /**
   * Lifecycle hook called after gateway initialization.
   *
   * Sets up Socket.IO middleware for authentication and logs initialization.
   *
   * @param server - The Socket.IO server instance
   */
  afterInit(server: Server): void {
    // Register authentication middleware
    server.use((socket: Socket, next) => {
      try {
        const token =
          socket.handshake.auth.token ||
          (socket.handshake.query.token as string);

        if (token !== VALID_TOKEN) {
          this.logger.warn(`Connection rejected: Invalid token "${token}"`);
          return next(new Error("Invalid authentication token"));
        }

        next();
      } catch (error) {
        this.logger.error(
          `Authentication error: ${error.message}`,
          error.stack,
        );
        next(new Error("Authentication failed"));
      }
    });

    this.logger.log(
      "WebSocket Gateway initialized with Socket.IO on port 3001",
    );
  }

  /**
   * Handle new client connections.
   *
   * Authentication is already validated by middleware. Assigns username and
   * broadcasts join notification.
   *
   * @param client - The Socket.IO client socket
   */
  handleConnection(client: Socket): void {
    try {
      // Authentication already handled by middleware

      // Generate unique username
      this.userCounter++;
      const username = `User${this.userCounter}`;
      this.connectedUsers.set(client.id, username);

      this.logger.log(`User connected: ${username} (socket: ${client.id})`);

      // Send welcome message to the new client
      const welcomeMessage: WelcomeResponseMessage = {
        type: "welcome",
        assignedUsername: username,
      };
      client.emit("welcome", welcomeMessage);

      // Broadcast user joined notification to all OTHER clients
      const joinedMessage: UserJoinedMessage = {
        type: "user_joined",
        username,
      };
      client.broadcast.emit("user_joined", joinedMessage);
    } catch (error) {
      this.logger.error(
        `Error handling connection: ${error.message}`,
        error.stack,
      );
      client.disconnect(true);
    }
  }

  /**
   * Handle client disconnections.
   *
   * Removes the user from tracking and notifies remaining clients.
   *
   * @param client - The disconnecting Socket.IO client
   */
  handleDisconnect(client: Socket): void {
    try {
      const username = this.connectedUsers.get(client.id);

      if (username) {
        this.connectedUsers.delete(client.id);
        this.logger.log(
          `User disconnected: ${username} (socket: ${client.id})`,
        );

        // Broadcast user left notification to remaining clients
        const leftMessage: UserLeftMessage = {
          type: "user_left",
          username,
        };
        this.server.emit("user_left", leftMessage);
      }
    } catch (error) {
      this.logger.error(
        `Error handling disconnect: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle welcome_user event from client.
   *
   * This is informational - the user was already welcomed during connection.
   *
   * @param data - Welcome message from client
   * @param client - The Socket.IO client sending the message
   */
  @SubscribeMessage("welcome_user")
  handleWelcomeUser(
    @MessageBody() data: WelcomeUserMessage,
    @ConnectedSocket() client: Socket,
  ): void {
    try {
      const username = this.connectedUsers.get(client.id);
      this.logger.log(`User ${username} sent welcome_user event`);
    } catch (error) {
      this.logger.error(
        `Error handling welcome_user: ${error.message}`,
        error.stack,
      );
      this.sendError(client, "Failed to process welcome message");
    }
  }

  /**
   * Handle message event from client.
   *
   * Receives a chat message, adds timestamp, and broadcasts to all connected clients.
   *
   * @param data - Chat message from client
   * @param client - The Socket.IO client sending the message
   */
  @SubscribeMessage("message")
  handleMessage(
    @MessageBody() data: ClientChatMessage,
    @ConnectedSocket() client: Socket,
  ): void {
    try {
      const username = this.connectedUsers.get(client.id);

      if (!username) {
        this.logger.warn(
          `Message received from unauthenticated socket: ${client.id}`,
        );
        this.sendError(client, "Not authenticated");
        return;
      }

      this.logger.log(`Message from ${username}: ${data.text}`);

      // Create server message with timestamp in ISO 8601 format
      const serverMessage: ServerChatMessage = {
        type: "message",
        username: data.username,
        text: data.text,
        timestamp: new Date().toISOString(),
      };

      // Broadcast to ALL clients including sender
      this.server.emit("message", serverMessage);
    } catch (error) {
      this.logger.error(
        `Error handling message: ${error.message}`,
        error.stack,
      );
      this.sendError(client, "Failed to send message");
    }
  }

  /**
   * Send an error message to a specific client.
   *
   * @param client - Target Socket.IO client
   * @param errorMsg - Error message text
   */
  private sendError(client: Socket, errorMsg: string): void {
    const errorMessage: ErrorMessage = {
      type: "error",
      message: errorMsg,
    };
    client.emit("error", errorMessage);
  }
}
