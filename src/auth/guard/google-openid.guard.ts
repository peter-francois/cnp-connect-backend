import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CustomException } from "src/utils/custom-exception";
import axios from "axios";

@Injectable()
export class GoogleOpenIdGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { code } = request.query;
    if (!code) {
      throw new CustomException(
        "Authorization code not found",
        HttpStatus.NOT_FOUND,
        "GOID-ca-1",
      );
    }

    try {
      const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      });
      const { access_token } = tokenRes.data;

      const user = await axios.post(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {},
        { headers: { Authorization: `Bearer ${access_token}` } },
      );

      request["user"] = user.data;
    } catch {
      throw new CustomException(
        "Error when retrieving user from Google token",
        HttpStatus.NOT_FOUND,
        "GOID-ca-2",
      );
    }
    return true;
  }
}
