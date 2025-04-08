import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommonAuthGuard } from '../../common/auth/auth-guard';
import { UserTypeEnum } from '../../common/enums';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { CustomerBookingService } from '../services/customer.service';
import { QueryParams } from '../../common/dtos/query-params.dto';
import { CommonSuccessResponseObject } from '../../common/consts';
import { CreateBookingDto } from '../dto/customer.dto';

@Controller('customers')
@ApiTags('Customers')
export class CustomerParkingBookingController {
  constructor(
    private readonly customerBookingService: CustomerBookingService,
  ) {}

  @Get('bookings')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getBookingsList(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query() query: QueryParams,
  ) {
    if (currentUser.user_type !== UserTypeEnum.CUSTOMER) {
      throw new ForbiddenException();
    }
    const data = await this.customerBookingService.getBookingsList(
      query,
      currentUser.userId,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Get('bookings/:id')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getBookingById(
    @GetCurrentUser() currentUser: CurrentUser,
    @Param('id') id: string,
  ) {
    if (currentUser.user_type !== UserTypeEnum.CUSTOMER) {
      throw new ForbiddenException();
    }
    const data = await this.customerBookingService.getBookingById(
      id,
      currentUser.userId,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Post('bookings')
  @UseGuards(CommonAuthGuard)
  @ApiBearerAuth('JWT')
  async create(
    @Body() dto: CreateBookingDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    if (currentUser.user_type !== UserTypeEnum.CUSTOMER) {
      throw new ForbiddenException();
    }
    const data = await this.customerBookingService.createBooking(
      dto,
      currentUser.userId,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
