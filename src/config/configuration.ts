const configuration = {
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    access: {
      secret: process.env.JWT_ACCESS_SECRET || 'access',
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '60s',
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      expiresInSeconds: process.env.JWT_REFRESH_EXPIRES_IN_SECONDS,
    },
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'nest-demo',
  },
  session: {
    secret: 'my-session-secret',
    maxAge: 1000 * 20, // 20 seconds
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
};

export default () => configuration;
