import { Injectable } from '@nestjs/common';

@Injectable()
export class SMSService {
  constructor() {}

  async sendSMS(phone: string, message: string) {
    console.log(`Sending SMS to ${phone}: ${message}`);
  }
}
