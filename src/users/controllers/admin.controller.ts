import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommonAuthGuard } from '../../common/auth/auth-guard';
import { CommonSuccessResponseObject } from '../../common/consts';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { AdminLoginDTO } from '../dtos/admin.dtos';
import { AdminLoginService } from '../services/admin/admin-login.service';
import { AdminProfileService } from '../services/admin/admin-profile.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly loginService: AdminLoginService,
    private readonly adminProfileService: AdminProfileService,
  ) {}
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

  @Get('profile')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getAdminProfile(@GetCurrentUser() currentUser: CurrentUser) {
    const data = await this.adminProfileService.getAdminProfile(
      currentUser.userId as string,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
