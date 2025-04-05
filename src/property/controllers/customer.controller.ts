import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonAuthGuard } from '../../common/auth/auth-guard';
import { CommonSuccessResponseObject } from '../../common/consts';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { CreatePropertyDto } from '../dtos/property-owners.dto';
import { CustomerParkingManagementService } from './../services/customer.service';
import { GetAvailableParkingNearMe } from '../dtos/customer.dto';

@Controller('customers')
@ApiTags('Customers')
export class CustomerParkingController {
  constructor(
    private readonly customerParkingManagementService: CustomerParkingManagementService,
  ) {}

  @Get('available-parking')
  @ApiOperation({ summary: 'Get Available Parking Nearby' })
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getAvailableParkingNearby(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query() query: GetAvailableParkingNearMe,
  ) {
    const data =
      await this.customerParkingManagementService.getNearbyAvailableParking(
        query,
      );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
