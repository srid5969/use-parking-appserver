import { Injectable } from '@nestjs/common';
import { UserStatus, UserTypeEnum } from '../../../common/enums';
import {
  PropertyOwnerOtpRegistrationDTO,
  PropertyOwnerRegistrationDTO,
} from '../../dtos/property-owner.dtos';
import { User } from '../../schemas/users.schema';
import { UserService } from './../users/users-common.service';
import { PropertyOwnerLoginService } from './property-owner-login.service';
import { OTPRegistrationService } from '../users/otp-registration.service';

@Injectable()
export class PropertyOwnerRegistrationService {
  constructor(
    private readonly userService: UserService,
    private readonly loginService: PropertyOwnerLoginService,
    private readonly otpRegistrationService: OTPRegistrationService,
  ) {}

  async registerPropertyOwner(propertyOwner: PropertyOwnerRegistrationDTO) {
    propertyOwner.user_type = UserTypeEnum.PROPERTY_OWNER;
    propertyOwner.status = UserStatus.ACTIVE;
    const passwordForLogin = propertyOwner.password;
    await this.userService.createUser(propertyOwner as User);
    const loginUser = await this.loginService.loginUsingEmailPassword(
      propertyOwner.email,
      passwordForLogin,
    );
    return loginUser;
  }

  async registerPropertyOwnerWithPhone(
    propertyOwner: PropertyOwnerOtpRegistrationDTO,
  ) {
    await this.otpRegistrationService.sendOTPToUser(
      propertyOwner.phone,
      UserTypeEnum.PROPERTY_OWNER,
    );
  }

  async verifyPropertyOwnerWithPhone(
    phone: { code: number; number: number },
    otp: string,
  ) {
    return await this.otpRegistrationService.verifyOTPAndRegisterUser(
      phone,
      otp,
      UserTypeEnum.PROPERTY_OWNER,
    );
  }
}
