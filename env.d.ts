declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    ACCESS_JWT_SECRET: string;
    REFRESH_JWT_SECRET: string;
    PORT: number;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
  }
}
