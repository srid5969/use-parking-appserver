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

  otp_length: parseInt(process.env.OTP_LENGTH || '6', 10),
  otp_expiry_time: parseInt(process.env.OTP_EXPIRY || '5', 10), // in minutes
});

export type EnvironmentConfigType = ReturnType<typeof config>;
