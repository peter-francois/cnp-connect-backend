declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    ACCESS_JWT_SECRET: string;
    REFRESH_JWT_SECRET: string;
    PORT: number;
    FRONTEND_URL: string;
  }
}
