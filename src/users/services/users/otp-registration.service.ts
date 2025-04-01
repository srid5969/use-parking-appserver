import { Injectable } from '@nestjs/common';
import { SMSService } from '../../../common/services/sms.service';
import { UserService } from './users-common.service';
import { UserTypeEnum } from '../../../common/enums';
import { OTPService } from '../../../common/services/otp.service';
import { SMS_TEMPLATES } from '../../../common/consts/templates';

@Injectable()
export class OTPRegistrationService {
  constructor(
    private readonly smsService: SMSService,
    private readonly userService: UserService,
    private readonly otpService: OTPService,
  ) {}

  async sendOTPToUser(
    phone: { code: number; number: number },
    user_type: UserTypeEnum,
  ): Promise<void> {
    const number = phone.number.toString().trim();
    const code = phone.code.toString().trim();
    const phoneNumber = `+${code}${number}`;
    const otp = this.otpService.generateOTP();
    // Simulate sending OTP to user via SMS or any other method
    console.log(`Sending OTP ${otp} to phone: +${phoneNumber}`);
    await this.userService.saveOrUpdateUserWithPendingStatus({
      phone,
      user_type,
    });
    const message = SMS_TEMPLATES.REGISTRATION_OTP.replace('{{otp}}', otp);
    await this.smsService.sendSMS(phoneNumber, message);
  }
}
