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
import { BookingAdminService } from '../services/admin.service';

@Controller('admin/bookings')
@ApiTags('Admin')
export class BookingsAdminController {
  constructor(
    private readonly userService: UserService,
    private readonly adminBookingService: BookingAdminService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all bookings for admin users' })
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getAllBookings(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query() query: QueryParams,
  ) {
    await this.userService.validateIfUserIsAdmin(currentUser.userId);
    const data = await this.adminBookingService.getAllBookings(query);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve bookings Detail by id' })
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getBookingDetailsParamsId(
    @GetCurrentUser() currentUser: CurrentUser,
    @Param('id') id: string,
  ) {
    await this.userService.validateIfUserIsAdmin(currentUser.userId);
    const data = await this.adminBookingService.getBookingById(id);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
