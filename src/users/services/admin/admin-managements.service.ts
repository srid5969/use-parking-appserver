import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../schemas/users.schema';
import { UserService } from '../users/users-common.service';
import { QueryParams } from './../../../common/dtos/query-params.dto';
import { UserStatus, UserTypeEnum } from '../../../common/enums';
import { AddNewAdminDTO } from '../../dtos/admin.dtos';

@Injectable() // for only super  admin
export class AdminManagementService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly userService: UserService,
  ) {}

  // create admin
  async createNewAdmin(adminData: AddNewAdminDTO, creator: string) {
    const admin = new this.userModel(adminData);
    admin.user_type = UserTypeEnum.ADMIN;
    admin.createdBy =
      typeof creator === 'string' ? new Types.ObjectId(creator) : creator;
    admin.status = UserStatus.ACTIVE;
    const createdAdmin = this.userService.createUser(admin);
    return createdAdmin;
  }

  // update admin

  async updateAdmin(
    adminId: string,
    adminData: Partial<User>,
    actionBy: string,
  ) {
    const updatedAdmin = await this.userService.updateUser(
      adminId,
      adminData,
      typeof actionBy === 'string' ? new Types.ObjectId(actionBy) : actionBy,
    );
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

  async getAllPropertyOwners(queryParams: QueryParams) {
    const propertyOwners = await this.userService.getUsersListByUserType(
      [UserTypeEnum.PROPERTY_OWNER],
      queryParams,
    );
    return propertyOwners;
  }

  async getAllCustomers(queryParams: QueryParams) {
    const customers = await this.userService.getUsersListByUserType(
      [UserTypeEnum.CUSTOMER],
      queryParams,
    );
    return customers;
  }
  // get admin by id
  async getAdminById(adminId: string) {
    const admin = await this.userService.getUserById(adminId);
    return admin;
  }
}
