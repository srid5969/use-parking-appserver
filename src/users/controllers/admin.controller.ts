import { Body, Controller, Post } from '@nestjs/common';
import { CommonSuccessResponseObject } from '../../common/consts';
import { UserTypeEnum } from '../../common/enums';
import { AdminLoginDTO } from '../dtos/admin.dtos';
import { AdminLoginService } from '../services/admin/admin-login.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly loginService: AdminLoginService) {}
  @Post('login')
  async loginController(@Body() body: AdminLoginDTO) {
    const { email, password } = body;
    const data = await this.loginService.loginUsingEmailPassword(
      email,
      password,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
