import { Injectable } from '@nestjs/common';
import { LoginAuthService } from '../login-auth.service';
import { UserTypeEnum } from '../../../common/enums';
import { PhoneDto } from '../../dtos/users.dto';

@Injectable()
export class CustomerLoginService {
  constructor(private readonly loginService: LoginAuthService) {}
  async loginUsingEmailPassword(email: string, password: string) {
    return await this.loginService.loginUsingEmailPassword(email, password, [
      UserTypeEnum.CUSTOMER,
    ]);
  }

  async loginUsingPhonePassword(phone: PhoneDto, password: string) {
    return await this.loginService.loginUsingPhonePassword(phone, password, [
      UserTypeEnum.CUSTOMER,
    ]);
  }
}
