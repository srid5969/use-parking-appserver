import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommonAuthGuard } from '../../common/auth/auth-guard';
import { CommonSuccessResponseObject } from '../../common/consts';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { AddNewAdminDTO, AdminLoginDTO } from '../dtos/admin.dtos';
import { AdminLoginService } from '../services/admin/admin-login.service';
import { AdminProfileService } from '../services/admin/admin-profile.service';
import { AdminManagementService } from '../services/admin/admin-managements.service';
import { UserService } from '../services/users/users-common.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly loginService: AdminLoginService,
    private readonly adminProfileService: AdminProfileService,
    private readonly adminManagementService: AdminManagementService,
    protected readonly userService: UserService,
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

  @Get('profile/:id')
  async getAdminProfileById(@GetCurrentUser() currentUser: CurrentUser) {
    const data = await this.adminProfileService.getAdminProfile(
      currentUser.userId as string,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  // create an admin
  @Post()
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async addNewUserByUserType(
    @Body() body: AddNewAdminDTO,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(
      currentUser.userId as string,
    );
    const data = await this.adminManagementService.createNewAdmin(
      body,
      currentUser.userId as string,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  // update an admin
  @Put('/profile/:id')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async updateAdminProfile(
    @Body() body: Partial<AddNewAdminDTO>,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    const data = await this.adminManagementService.getAdminById(
      currentUser.userId as string,
      body,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
