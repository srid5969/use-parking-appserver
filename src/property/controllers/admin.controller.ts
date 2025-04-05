import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommonAuthGuard } from '../../common/auth/auth-guard';
import { CommonSuccessResponseObject } from '../../common/consts';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { QueryParams } from '../../common/dtos/query-params.dto';
import { UserService } from '../../users/services/users/users-common.service';
import { AdminPropertyManagementService } from '../services/admin.service';

@Controller('admin')
@ApiTags('Admin')
export class AdminPropertiesManagementController {
  constructor(
    private readonly userService: UserService,
    private readonly propertyService: AdminPropertyManagementService,
  ) {}

  @Get('properties/:owner_id')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async addNewUserByUserType(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query() query: QueryParams,
    @Param('owner_id') ownerId: string,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(currentUser.userId);
    const data = await this.propertyService.getPropertiesByOwnerId(
      query,
      ownerId,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
