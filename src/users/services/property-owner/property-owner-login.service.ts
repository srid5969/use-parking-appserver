import { Injectable } from '@nestjs/common';
import { UserTypeEnum } from '../../../common/enums';
import { PhoneDto } from '../../dtos/users.dto';
import { LoginAuthService } from '../login-auth.service';

@Injectable()
export class PropertyOwnerLoginService {
  constructor(private readonly loginService: LoginAuthService) {}
  async loginUsingEmailPassword(email: string, password: string) {
    return await this.loginService.loginUsingEmailPassword(email, password, [
      UserTypeEnum.PROPERTY_OWNER,
    ]);
  }
  async loginUsingPhonePassword(phone: PhoneDto, password: string) {
    return await this.loginService.loginUsingPhonePassword(phone, password, [
      UserTypeEnum.PROPERTY_OWNER,
    ]);
  }
}
