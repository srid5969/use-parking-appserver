import { Body, Controller, Post } from '@nestjs/common';
import { LoginAuthService } from '../services/login-auth.service';
import { UserTypeEnum } from 'src/common/enums';
import { AdminLoginDTO } from '../dtos/admin.dtos';
import { CommonSuccessResponseObject } from 'src/common/consts';

@Controller('admin')
export class AdminController {
  constructor(private readonly loginService: LoginAuthService) {}
  @Post('login')
  async loginController(@Body() body: AdminLoginDTO) {
    const { email, password } = body;
    const data = await this.loginService.loginUsingEmailPassword(
      email,
      password,
      [UserTypeEnum.ADMIN, UserTypeEnum.SUPER_ADMIN],
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
