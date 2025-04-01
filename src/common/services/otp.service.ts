import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigType } from '../../configs';

@Injectable()
export class OTPService {
  constructor(private configService: ConfigService<EnvironmentConfigType>) {}

  /// Generates a random OTP of specified length
  public generateOTP(): string {
    const length = this.configService.getOrThrow<number>('otp_length') || 6;
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    console.log(`Generated OTP: ${otp}`); // For debugging purposes
    // In production, you might want to remove this line or use a logging library
    return '123456';
  }
}
