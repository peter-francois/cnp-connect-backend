import { RoleEnum } from "@prisma/client";

export class CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  hiredAt: Date;
  avatarUrl?: string;
  role: RoleEnum;
}
