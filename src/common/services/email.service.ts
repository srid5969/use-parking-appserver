import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { EnvironmentConfigType } from '../../configs';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly senderEmail: string;

  constructor(
    private readonly configService: ConfigService<EnvironmentConfigType>,
  ) {
    const apiKey = this.configService.getOrThrow<string>('sendgrid_api_key');
    this.senderEmail = this.configService.getOrThrow<string>(
      'sendgrid_sender_email',
    );

    sgMail.setApiKey(apiKey);
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const msg = {
      to,
      from: this.senderEmail,
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Email sent to ${to} with subject: "${subject}"`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Error sending email to ${to}: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Unknown error sending email to ${to}: ${JSON.stringify(error)}`,
        );
      }

      throw new InternalServerErrorException(
        'Failed to send email. Please try again later.',
      );
    }
  }
}
