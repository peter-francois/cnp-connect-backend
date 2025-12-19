import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, Socket } from "socket.io";

const VALID_TOKEN = "SECRET_TOKEN_123";

export class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      },
    });

    server.use((socket: Socket, next) => {
      try {
        const token =
          socket.handshake.auth.token ||
          (socket.handshake.query.token as string);

        if (token !== VALID_TOKEN) {
          console.warn(`Connection rejected: Invalid token "${token}"`);
          return next(new Error("Invalid authentication token"));
        }

        next();
      } catch (error) {
        console.error(`Authentication error: ${error.message}`, error.stack);
        next(new Error("Authentication failed"));
      }
    });
    console.log("WebSocket Gateway initialized with Socket.IO on port 3001");
    return server;
  }
}
