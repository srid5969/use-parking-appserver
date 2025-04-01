import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users-common.service';

@Injectable()
export class AdminProfileService {
  constructor(private readonly userService: UserService) {}
  async getAdminProfile(userId: string) {
    const data = await this.userService.getUserById(userId);
    return data;
  }
}
