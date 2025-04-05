import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
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
}
