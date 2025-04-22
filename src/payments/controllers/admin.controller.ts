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
import { AdminTransactionManagementService } from '../services/admin.service';

@Controller('admin/transactions')
@ApiTags('Admin')
export class PaymentsAdminController {
  constructor(
    private readonly userService: UserService,
    private readonly adminTransactionManagementService: AdminTransactionManagementService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all bookings for admin users' })
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getAllTransactions(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query() query: QueryParams,
  ) {
    await this.userService.validateIfUserIsAdmin(currentUser.userId);
    const data =
      await this.adminTransactionManagementService.getAllTransactions(query);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve payments Detail by id' })
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getPaymentDetailsParamsId(
    @GetCurrentUser() currentUser: CurrentUser,
    @Param('id') id: string,
  ) {
    await this.userService.validateIfUserIsAdmin(currentUser.userId);
    const data =
      await this.adminTransactionManagementService.getTransactionDetailById(id);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
