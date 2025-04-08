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

  // SMS (Twilio) config
  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID as string,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN as string,
  twilio_phone_number: process.env.TWILIO_PHONE_NUMBER as string,

  // Email (SendGrid) config
  sendgrid_api_key: process.env.SENDGRID_API_KEY as string,
  sendgrid_sender_email: process.env.SENDGRID_SENDER_EMAIL as string,

  aws_region: process.env.AWS_REGION as string,
  aws_access_key: process.env.AWS_ACCESS_KEY_ID as string,
  aws_secret_key: process.env.AWS_SECRET_ACCESS_KEY as string,
  aws_s3_bucket: process.env.AWS_S3_BUCKET_NAME as string,

  // Razorpay config
  razorpay_key_id: process.env.RAZORPAY_KEY_ID as string,
  razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  razorpay_webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET as string,
});

export type EnvironmentConfigType = ReturnType<typeof config>;
