import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { RequestWithPayloadInterface } from "../interfaces/payload.interface";
import { CustomException } from "src/utils/custom-exception";
import { UserService } from "src/user/user.service";
import { RoleEnum } from "@prisma/client";

@Injectable()
export class SupervisorGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithPayloadInterface = context
      .switchToHttp()
      .getRequest();

    const user = await this.userService.findOneById(request.user.id);
    if (user.role !== RoleEnum.SUPERVISOR) {
      throw new CustomException(
        "You do not have permission to access this resource",
        HttpStatus.FORBIDDEN,
        "CG-ca-3",
      );
    }
    return true;
  }
}
