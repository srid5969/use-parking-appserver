import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class SMSService {
  private readonly logger = new Logger(SMSService.name);
  private readonly twilioClient: Twilio;
  private readonly fromPhoneNumber: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid =
      this.configService.getOrThrow<string>('TWILIO_ACCOUNT_SID');
    const authToken =
      this.configService.getOrThrow<string>('TWILIO_AUTH_TOKEN');
    this.fromPhoneNumber = this.configService.getOrThrow<string>(
      'TWILIO_PHONE_NUMBER',
    );

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendSMS(phone: string, message: string): Promise<void> {
    try {
      const response = await this.twilioClient.messages.create({
        body: message,
        to: phone, // E.164 format
        from: this.fromPhoneNumber,
      });

      this.logger.log(
        `SMS successfully sent to ${phone} (SID: ${response.sid})`,
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error sending SMS to ${phone}: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Unknown error sending SMS to ${phone}: ${JSON.stringify(error)}`,
        );
      }
      throw new InternalServerErrorException(
        'Failed to send SMS. Please try again later.',
      );
    }
  }
}
