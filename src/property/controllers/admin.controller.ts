import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @Get('properties/owner/:owner_id')
  @ApiOperation({ summary: 'Get properties by owner ID' })
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

  @ApiOperation({ summary: 'Get Property or parking by ID' })
  @Get('properties/:property_id')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getPropertyById(
    @GetCurrentUser() currentUser: CurrentUser,
    @Param('property_id') propertyId: string,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(currentUser.userId);
    const data = await this.propertyService.getPropertyById(propertyId);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  // get all properties
  @Get('properties')
  @ApiOperation({ summary: 'Get all properties' })
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getAllProperties(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query() query: QueryParams,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(currentUser.userId);
    const data = await this.propertyService.getAllProperties(query);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
