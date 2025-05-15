declare namespace NodeJS {
  interface ProcessEnv {
    // 应用配置
    PORT: string;
    NODE_ENV: 'development' | 'production' | 'test';
    APP_NAME: string;

    // 数据库配置
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;

    // JWT配置
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN_SECONDS: string;

    // Redis配置
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
  }
}
