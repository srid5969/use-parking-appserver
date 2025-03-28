import { Injectable } from '@nestjs/common';
import { LoginAuthService } from '../login-auth.service';
import { UserTypeEnum } from '../../../common/enums';

@Injectable()
export class AdminLoginService {
  constructor(private readonly loginService: LoginAuthService) {}
  async loginUsingEmailPassword(email: string, password: string) {
    return await this.loginService.loginUsingEmailPassword(email, password, [
      UserTypeEnum.ADMIN,
      UserTypeEnum.SUPER_ADMIN,
    ]);
  }
}
