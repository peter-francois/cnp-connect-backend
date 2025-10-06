import { RoleEnum } from "@prisma/client";

export interface PayloadInterface {
  id: string;
  role: RoleEnum;
}
