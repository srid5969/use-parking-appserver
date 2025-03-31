import { UserService } from './../users/users-common.service';
import { Injectable } from '@nestjs/common';
import { User } from '../../schemas/users.schema';
import { UserStatus, UserTypeEnum } from '../../../common/enums';
import { CustomerLoginService } from './customer-login.service';
import { CustomerRegistrationDTO } from '../../dtos/customers.dtos';

@Injectable()
export class CustomerRegistrationService {
  constructor(
    private readonly userService: UserService,
    private readonly loginService: CustomerLoginService,
  ) {}

  async registerCustomer(customer: CustomerRegistrationDTO) {
    customer.user_type = UserTypeEnum.CUSTOMER;
    customer.status = UserStatus.ACTIVE;
    const passwordForLogin = customer.password;
    await this.userService.createUser(customer as User);
    const loginUser = await this.loginService.loginUsingEmailPassword(
      customer.email,
      passwordForLogin,
    );
    return loginUser;
  }
}
