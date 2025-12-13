import { Request } from "express";

// for access token
export interface PayloadInterface {
  id: string;
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
