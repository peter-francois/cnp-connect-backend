import { RoleEnum } from "@prisma/client";
import { Request } from "express";

export interface PayloadInterface {
  id: string;
  role: RoleEnum;
}

export interface RequestWithPayloadInterface extends Request {
  user: PayloadInterface;
}

export interface RequestWithPayloadAndRefreshInterface
  extends RequestWithPayloadInterface {
  refreshToken: string;
}
