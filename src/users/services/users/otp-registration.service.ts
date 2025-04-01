import { UserSessionManagementService } from './../../../user-session/services/user-session-management.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SMSService } from '../../../common/services/sms.service';
import { sanitizeUserData, UserService } from './users-common.service';
import { UserStatus, UserTypeEnum } from '../../../common/enums';
import { OTPService } from '../../../common/services/otp.service';
import { SMS_TEMPLATES } from '../../../common/consts/templates';
import { AppErrorMessages } from '../../../common/consts';
import { Model } from 'mongoose';
import { User } from '../../schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OTPRegistrationService {
  constructor(
    private readonly smsService: SMSService,
    private readonly userService: UserService,
    private readonly otpService: OTPService,
    private readonly userSessionManagementService: UserSessionManagementService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async sendOTPToUser(
    phone: { code: number; number: number },
    user_type: UserTypeEnum,
  ): Promise<void> {
    const number = phone.number.toString().trim();
    const code = phone.code.toString().trim();
    const phoneNumber = `+${code}${number}`;
    const otp = this.otpService.generateOTP();
    const otpExpiry = this.otpService.getExpiryTime();
    // Simulate sending OTP to user via SMS or any other method
    console.log(`Sending OTP ${otp} to phone: ${phoneNumber}`);
    await this.userService.saveOrUpdateUserWithPendingStatus({
      phone,
      user_type,
      otp,
      otp_expire_at: otpExpiry,
    });
    const message = SMS_TEMPLATES.REGISTRATION_OTP.replace('{{otp}}', otp);
    await this.smsService.sendSMS(phoneNumber, message);
  }

  async verifyOTPAndRegisterUser(
    phone: { code: number; number: number },
    otp: string,
    user_type: UserTypeEnum,
  ) {
    const user = await this.userService.findUserByPhone(phone);

    if (user.otp !== otp) {
      throw new BadRequestException(AppErrorMessages.OTP_NOT_MATCH);
    }
    if (user.otp_expire_at < new Date()) {
      throw new BadRequestException(AppErrorMessages.OTP_EXPIRED);
    }
    if (user.status !== UserStatus.PENDING) {
      throw new BadRequestException(AppErrorMessages.USER_ALREADY_REGISTERED);
    }
    await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          user_type: user_type,
          phone_verified: true,
          status: UserStatus.ACTIVE,
        },
        $unset: {
          otp: 1,
          otp_expire_at: 1,
        },
      },
      user._id,
    );
    const tokens =
      await this.userSessionManagementService.generateNewTokenUsingUserData({
        mobilePhone: user.phone.number,
        user_type: user.user_type,
        phone_code: user.phone.code,
        userId: user._id,
      });
    return { ...tokens, profile_info: sanitizeUserData(user) };
  }
}
