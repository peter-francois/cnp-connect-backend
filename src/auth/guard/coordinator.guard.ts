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

// @dev on a plus besoin de verifié le token car on est déja forcément passé par l'acces guard
@Injectable()
export class CoordinatorGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithPayloadInterface = context
      .switchToHttp()
      .getRequest();

    const user = await this.userService.findOneById(request.user.id);
    if (user.role === RoleEnum.DRIVER) {
      throw new CustomException(
        "You do not have permission to access this resource",
        HttpStatus.FORBIDDEN,
        "CG-ca-3",
      );
    }
    return true;
  }
}
