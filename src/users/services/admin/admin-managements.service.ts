import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/users.schema';
import { UserService } from '../users/users-common.service';
import { QueryParams } from './../../../common/dtos/query-params.dto';
import { UserTypeEnum } from '../../../common/enums';

@Injectable() // for only super  admin
export class AdminManagementService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly userService: UserService,
  ) {}

  // create admin
  async createNewAdmin(adminData: User) {
    const admin = await this.userService.createUser(adminData);
    return admin;
  }

  // update admin

  async updateAdmin(adminId: string, adminData: Partial<User>) {
    const updatedAdmin = await this.userService.updateUser(adminId, adminData);
    return updatedAdmin;
  }
  // delete admin
  async deleteAdmin(adminId: string) {
    const deletedAdmin = await this.userService.deleteUser(adminId);
    return deletedAdmin;
  }
  // get all admins
  async getAllAdmins(queryParams: QueryParams) {
    const admins = await this.userService.getUsersListByUserType(
      [UserTypeEnum.ADMIN],
      queryParams,
    );
    return admins;
  }
  // get admin by id
  async getAdminById(adminId: string) {
    const admin = await this.userService.getUserById(adminId);
    return admin;
  }
}
