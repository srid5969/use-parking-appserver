import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonAuthGuard } from '../../common/auth/auth-guard';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { PropertyOwnerPropertyManagementService } from '../services/property-owner.services';
import { UserTypeEnum } from '../../common/enums';
import { CommonSuccessResponseObject } from '../../common/consts';
import { CreatePropertyDto } from '../dtos/property-owners.dto';
import { QueryParams } from '../../common/dtos/query-params.dto';

@Controller('property-owner')
@ApiTags('Property Owner')
export class OwnersParkingManagementController {
  constructor(
    private readonly propertyOwnerPropertyManagementService: PropertyOwnerPropertyManagementService,
  ) {}

  @Post('parking')
  @ApiOperation({ summary: 'Create New Parking Property' })
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async createNewParkingProperty(
    @GetCurrentUser() currentUser: CurrentUser,
    @Body() body: CreatePropertyDto,
  ) {
    if (currentUser.user_type !== UserTypeEnum.PROPERTY_OWNER)
      throw new ForbiddenException();
    const data =
      await this.propertyOwnerPropertyManagementService.createProperty(
        body,
        currentUser.userId,
      );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Get('parking')
  @ApiOperation({ summary: 'Get All Parking Properties' })
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getAllParkingProperties(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query() query: QueryParams,
  ) {
    if (currentUser.user_type !== UserTypeEnum.PROPERTY_OWNER)
      throw new ForbiddenException();
    const data =
      await this.propertyOwnerPropertyManagementService.getAllOwnersProperties(
        currentUser.userId,
        query,
      );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
