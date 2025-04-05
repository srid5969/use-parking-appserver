import { Injectable } from '@nestjs/common';
import { LoginAuthService } from '../login-auth.service';
import { UserTypeEnum } from '../../../common/enums';

@Injectable()
export class CustomerLoginService {
  constructor(private readonly loginService: LoginAuthService) {}
  async loginUsingEmailPassword(email: string, password: string) {
    return await this.loginService.loginUsingEmailPassword(email, password, [
      UserTypeEnum.CUSTOMER,
    ]);
  }

  async loginUsingPhonePassword(
    phone: { number: number; code: number },
    password: string,
  ) {
    return await this.loginService.loginUsingPhonePassword(phone, password, [
      UserTypeEnum.CUSTOMER,
    ]);
  }
}
