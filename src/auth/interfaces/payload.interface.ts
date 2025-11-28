import { RoleEnum } from "@prisma/client";
import { Request } from "express";

export interface PayloadInterface {
  id: string;
  role: RoleEnum;
}

export interface RequestWithPayloadInterface extends Request {
  user: PayloadInterface;
}

// for refresh token
export interface PayloadWithSessionIdInterface {
  id: string;
  sessionId: string;
}

export interface RequestWithPayloadSessionAndRefreshInterface extends Request {
  user: PayloadWithSessionIdInterface;
  refreshToken: string;
}
