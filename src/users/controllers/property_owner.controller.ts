import { Body, Controller, Post } from '@nestjs/common';
import { CommonSuccessResponseObject } from '../../common/consts';
import {
  PropertyOwnerLoginDTO,
  PropertyOwnerRegistrationDTO,
} from '../dtos/property-owner.dtos';
import { PropertyOwnerLoginService } from '../services/property-owner/property-owner-login.service';
import { PropertyOwnerRegistrationService } from '../services/property-owner/property-owner-registration.service';

@Controller('property-owner')
export class PropertyOwnerController {
  constructor(
    private readonly loginService: PropertyOwnerLoginService,
    private readonly registrationService: PropertyOwnerRegistrationService,
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
}
