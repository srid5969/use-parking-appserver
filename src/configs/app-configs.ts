export const config = () => ({
  port: parseInt(process.env.PORT || '8080', 10),

  // #  database configurations
  dbURI: process.env.MONGODB_CONNECTION_STRING as string,
  database: process.env.DATABASE,

  // password pepper
  pepper: process.env.PEPPER_STRING,

  // auth token configurations
  jwtExpiry: process.env.JWT_EXPIRY,
  JwtSecret: process.env.JWT_SECRET,
  refreshJwtSecret: process.env.REFRESH_JWT_SECRET,
  refreshTokenExpiry: process.env.REFRESH_JWT_EXPIRY,
  AdminBaseUrl: process.env.ADMIN_BASE_URL || 'http://localhost:3000',
});


export type EnvironmentConfigType = ReturnType<typeof config>;
