export const config = () => ({
  port: parseInt(process.env.PORT || '8080', 10),

  // #  database configurations
  dbURI: process.env.MONGODB_CONNECTION_STRING as string,
  database: process.env.DATABASE as string,

  // password pepper
  pepper: process.env.PEPPER_STRING as string,

  // auth token configurations
  accessTokenExpiry: process.env.ACCESS_TOKEN_JWT_EXPIRY,
  accessTokenSecret: process.env.ACCESS_TOKEN_JWT_SECRET,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_JWT_EXPIRY,
  refreshTokenSecret: process.env.REFRESH_TOKEN_JWT_SECRET,

  serverBaseUrl: process.env.SERVER_BASE_URL || '',
});

export type EnvironmentConfigType = ReturnType<typeof config>;
