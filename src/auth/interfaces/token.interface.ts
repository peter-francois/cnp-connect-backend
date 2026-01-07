export interface TokensInterface extends TokenInCookieInterface {
  accessToken: string;
}
export interface TokenInCookieInterface {
  refreshToken: string;
  webSocketToken: string;
}
