import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommonAuthGuard } from '../../common/auth/auth-guard';
import { CommonSuccessResponseObject } from '../../common/consts';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { QueryParams } from '../../common/dtos/query-params.dto';
import {
  AddNewAdminDTO,
  AdminLoginDTO,
  UpdateAdminDTO,
} from '../dtos/admin.dtos';
import { User } from '../schemas/users.schema';
import { AdminLoginService } from '../services/admin/admin-login.service';
import { AdminManagementService } from '../services/admin/admin-managements.service';
import { AdminProfileService } from '../services/admin/admin-profile.service';
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
    @Body() body: UpdateAdminDTO,
    @GetCurrentUser() currentUser: CurrentUser,
    @Param('id') id: string,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(
      currentUser.userId as string,
    );
    const data = await this.adminManagementService.updateAdmin(
      id,
      body as unknown as User,
      currentUser.userId as string,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  // list all admins

  @Get()
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getAllAdminsRecordController(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query() query: QueryParams,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(
      currentUser.userId as string,
    );
    const data = await this.adminManagementService.getAllAdmins(query);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }


  // get admin details by id
  @Get(':id')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getAdminById(
    @GetCurrentUser() currentUser: CurrentUser,
    @Param('id') id: string,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(
      currentUser.userId as string,
    );
    const data = await this.adminManagementService.getAdminById(id);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
