import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CustomerLoginDTO,
  CustomerRegistrationDTO,
} from '../dtos/customers.dtos';
import { CustomerLoginService } from '../services/customer/customer-login.service';
import { CommonSuccessResponseObject } from '../../common/consts';
import { CustomerRegistrationService } from '../services/customer/customer-registration.service';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { CommonAuthGuard } from '../../common/auth/auth-guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CustomerProfileService } from '../services/customer/customer-profile.service';
import { UserTypeEnum } from '../../common/enums';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly loginService: CustomerLoginService,
    private readonly registrationService: CustomerRegistrationService,
    private readonly profileService: CustomerProfileService,
  ) {}

  @Post('login')
  async loginController(@Body() body: CustomerLoginDTO) {
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

  @Post('register')
  async customerRegistrationController(@Body() body: CustomerRegistrationDTO) {
    const data = await this.registrationService.registerCustomer(body);
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
    if (currentUser.user_type !== UserTypeEnum.CUSTOMER)
      throw new ForbiddenException();
    const data = await this.profileService.getProfileDataByUserId(
      currentUser.userId,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
