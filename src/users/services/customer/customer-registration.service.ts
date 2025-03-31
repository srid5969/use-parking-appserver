import { UserService } from './../users/users-common.service';
import { Injectable } from '@nestjs/common';
import { User } from '../../schemas/users.schema';
import { UserStatus, UserTypeEnum } from '../../../common/enums';

@Injectable()
export class CustomerRegistrationService {
  constructor(private readonly userService: UserService) {}

  async registerCustomer(customer: User) {
    customer.user_type = UserTypeEnum.CUSTOMER;
    customer.status = UserStatus.ACTIVE;
    const registeredCustomer = await this.userService.createUser(customer);
    
  }
}
