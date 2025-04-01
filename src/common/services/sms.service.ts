import { Injectable } from '@nestjs/common';

@Injectable()
export class SMSService {
  constructor() {}

  sendSMS(phone: string, message: string) {
    // Implement your SMS sending logic here
    console.log(`Sending SMS to ${phone}: ${message}`);
  }
}
