import { Body, Controller, Post } from '@nestjs/common';
import {
  CustomerLoginDTO,
  CustomerRegistrationDTO,
} from '../dtos/customers.dtos';
import { CustomerLoginService } from '../services/customer/customer-login.service';
import { CommonSuccessResponseObject } from '../../common/consts';
import { CustomerRegistrationService } from '../services/customer/customer-registration.service';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly loginService: CustomerLoginService,
    private readonly registrationService: CustomerRegistrationService,
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
}
