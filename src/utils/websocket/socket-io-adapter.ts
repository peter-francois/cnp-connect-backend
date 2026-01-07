import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, Socket } from "socket.io";
import { parse } from "cookie";
import { JwtService } from "@nestjs/jwt";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { TokenInCookieInterface } from "src/auth/interfaces/token.interface";
import { CustomException } from "../custom-exception";

export class SocketIoAdapter extends IoAdapter {
  constructor(private readonly app: INestApplication) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      },
    });

    server.use((socket: Socket, next) => {
      void (async () => {
        try {
          const cookies = parse(
            socket.request.headers.cookie ?? "",
          ) as Partial<TokenInCookieInterface>;
          const token: string | undefined =
            cookies.webSocketToken ?? cookies.webSocketToken;

          if (!token) {
            return next(
              new CustomException(
                "WebSocket unauthorized",
                HttpStatus.UNAUTHORIZED,
                "SIA-cis-1",
              ),
            );
          }

          const { id } = await jwtService.verifyAsync(token, {
            secret: process.env.WEBSOCKET_JWT_SECRET,
          });

          socket.data.userId = id;
          next();
        } catch {
          next(
            new CustomException(
              "WebSocket unauthorized",
              HttpStatus.UNAUTHORIZED,
              "SIA-cis-2",
            ),
          );
        }
      })();
    });

    return server;
  }
}
