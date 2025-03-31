import { Injectable } from '@nestjs/common';
import { UserStatus, UserTypeEnum } from '../../../common/enums';
import { PropertyOwnerRegistrationDTO } from '../../dtos/property-owner.dtos';
import { User } from '../../schemas/users.schema';
import { UserService } from './../users/users-common.service';
import { PropertyOwnerLoginService } from './property-owner-login.service';

@Injectable()
export class PropertyOwnerRegistrationService {
  constructor(
    private readonly userService: UserService,
    private readonly loginService: PropertyOwnerLoginService,
  ) {}

  async registerCustomer(customer: PropertyOwnerRegistrationDTO) {
    customer.user_type = UserTypeEnum.PROPERTY_OWNER;
    customer.status = UserStatus.ACTIVE;
    await this.userService.createUser(customer as User);
    const loginUser = await this.loginService.loginUsingEmailPassword(
      customer.email,
      customer.password,
    );
    return loginUser;
  }
}
