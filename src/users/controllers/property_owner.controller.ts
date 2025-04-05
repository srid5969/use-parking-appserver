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
  PropertyOwnerLoginDTO,
  PropertyOwnerOtpRegistrationDTO,
  PropertyOwnerOtpRegistrationVerification,
  UpdateProfileDto,
} from '../dtos/property-owner.dtos';
import { PropertyOwnerLoginService } from '../services/property-owner/property-owner-login.service';
import { PropertyOwnerProfileService } from '../services/property-owner/property-owner-profile.service';
import { PropertyOwnerRegistrationService } from '../services/property-owner/property-owner-registration.service';

@Controller('property-owner')
@ApiTags('Property Owner')
export class PropertyOwnerController {
  constructor(
    private readonly loginService: PropertyOwnerLoginService,
    private readonly registrationService: PropertyOwnerRegistrationService,
    private readonly profileService: PropertyOwnerProfileService,
  ) {}
  @Post('login')
  async loginController(@Body() body: PropertyOwnerLoginDTO) {
    const { phone, password } = body;
    const data = await this.loginService.loginUsingPhonePassword(
      phone,
      password,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Post('registration/sent-otp')
  async PropertyOwnerRegistrationController(
    @Body() body: PropertyOwnerOtpRegistrationDTO,
  ) {
    const data =
      await this.registrationService.registerPropertyOwnerWithPhone(body);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Post('registration/verify-otp')
  async verifyPropertyOwnerRegistrationController(
    @Body() body: PropertyOwnerOtpRegistrationVerification,
  ) {
    const data = await this.registrationService.verifyPropertyOwnerWithPhone(
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
  async getAdminProfile(@GetCurrentUser() currentUser: CurrentUser) {
    if (currentUser.user_type !== UserTypeEnum.PROPERTY_OWNER)
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
    if (currentUser.user_type !== UserTypeEnum.PROPERTY_OWNER)
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
