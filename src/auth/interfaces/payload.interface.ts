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

export interface RequestWithPayloadSessionInterface extends Request {
  user: PayloadWithSessionIdInterface;
}

export interface RequestWithPayloadSessionAndRefreshInterface
  extends RequestWithPayloadSessionInterface {
  refreshToken: string;
}
