import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommonAuthGuard } from '../../common/auth/auth-guard';
import { CommonSuccessResponseObject } from '../../common/consts';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { UserTypeEnum } from '../../common/enums';
import {
  CustomerLoginDTO,
  CustomerOtpRegistrationDTO,
  CustomerOtpRegistrationVerification,
  UpdateProfileDto,
} from '../dtos/customers.dtos';
import { CustomerLoginService } from '../services/customer/customer-login.service';
import { CustomerProfileService } from '../services/customer/customer-profile.service';
import { CustomerRegistrationService } from '../services/customer/customer-registration.service';

@Controller('customers')
@ApiTags('Customers')
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

  @Post('registration/sent-otp')
  async customerRegistrationController(
    @Body() body: CustomerOtpRegistrationDTO,
  ) {
    const data = await this.registrationService.registerCustomerWithPhone(body);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Post('registration/verify-otp')
  async verifyCustomerRegistrationController(
    @Body() body: CustomerOtpRegistrationVerification,
  ) {
    const data = await this.registrationService.verifyCustomerWithPhone(
      body.phone,
      body.otp,
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
  async getProfile(@GetCurrentUser() currentUser: CurrentUser) {
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

  @Put('profile')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async updateProfile(
    @GetCurrentUser() currentUser: CurrentUser,
    @Body() body: UpdateProfileDto,
  ) {
    if (currentUser.user_type !== UserTypeEnum.CUSTOMER)
      throw new ForbiddenException();
    const data = await this.profileService.updateProfileDataByUserId(
      currentUser.userId,
      body,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
