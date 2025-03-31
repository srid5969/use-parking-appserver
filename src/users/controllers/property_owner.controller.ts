import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommonAuthGuard } from '../../common/auth/auth-guard';
import { CommonSuccessResponseObject } from '../../common/consts';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { UserTypeEnum } from '../../common/enums';
import {
  PropertyOwnerLoginDTO,
  PropertyOwnerRegistrationDTO,
} from '../dtos/property-owner.dtos';
import { PropertyOwnerLoginService } from '../services/property-owner/property-owner-login.service';
import { PropertyOwnerProfileService } from '../services/property-owner/property-owner-profile.service';
import { PropertyOwnerRegistrationService } from '../services/property-owner/property-owner-registration.service';

@Controller('property-owner')
export class PropertyOwnerController {
  constructor(
    private readonly loginService: PropertyOwnerLoginService,
    private readonly registrationService: PropertyOwnerRegistrationService,
    private readonly profileService: PropertyOwnerProfileService,
  ) {}
  @Post('login')
  async loginController(@Body() body: PropertyOwnerLoginDTO) {
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
  async customerRegistrationController(
    @Body() body: PropertyOwnerRegistrationDTO,
  ) {
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
}
