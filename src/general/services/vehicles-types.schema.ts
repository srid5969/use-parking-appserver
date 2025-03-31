import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QueryParams } from '../../common/dtos/query-params.dto';
import { Status } from '../../common/enums';
import { VehicleType } from '../schemas/vehicles-types.schema';
import {
  CreateNewVehicleTypeDto,
  UpdateVehicleTypeDto,
} from '../dtos/vehicle-type-management.dto';

@Injectable()
export class VehicleTypeManagementService {
  constructor(
    @InjectModel(VehicleType.name)
    private readonly vehicleTypeModel: Model<VehicleType>,
  ) {}
  async getAllVehicleType(params: QueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 24;
    const sort = params.sort || 'createdAt|DESC';
    const filters = params.filters || '';
    const textSearch = params.textSearch || '';
    const skip = page * limit - limit;
    const [sortField, sortOrder] = sort.split('|');
    const filterAry = filters.split(',');
    const queryObj = {
      status: { $ne: Status.DELETED },
    };
    for (const element of filterAry) {
      const filterVal = element;
      const [search_field, search_value] = filterVal.split('|');
      queryObj[search_field] = search_value;
    }

    if (textSearch) {
      queryObj['$or'] = [];
    }

    const data = await this.vehicleTypeModel
      .find(queryObj, {
        name: 1,
        description: 1,
        status: 1,
        createdAt: 1,
      })
      .limit(limit)
      .skip(skip)
      .sort({ [sortField]: sortOrder === 'DESC' ? -1 : 1 });
    const totalCount = await this.vehicleTypeModel.countDocuments(queryObj);

    return { data, totalCount };
  }

  async getVehicleTypeById(vehicleTypeId: string) {
    const vehicleType = await this.vehicleTypeModel.findById(vehicleTypeId);
    if (!vehicleType) {
      throw new NotFoundException();
    }
    return vehicleType;
  }

  async createVehicleType(data: CreateNewVehicleTypeDto, actionBy: string) {
    const vehicleType = await this.vehicleTypeModel.create({
      ...data,
      createdBy: new Types.ObjectId(actionBy),
    });
    return vehicleType;
  }

  async updateVehicleType(
    vehicleTypeId: string,
    data: UpdateVehicleTypeDto,
    actionBy: string,
  ) {
    const vehicleType = await this.vehicleTypeModel.findByIdAndUpdate(
      vehicleTypeId,
      { ...data, updatedBy: new Types.ObjectId(actionBy) },
      {
        new: true,
      },
    );
    if (!vehicleType) {
      throw new NotFoundException();
    }
    return vehicleType;
  }

  async deleteVehicleTypeModel(vehicleTypeId: string, actionBy: string) {
    const vehicleType = await this.vehicleTypeModel.findByIdAndUpdate(
      vehicleTypeId,
      { status: Status.DELETED, deletedBy: new Types.ObjectId(actionBy) },
      { new: true },
    );
    if (!vehicleType) {
      throw new NotFoundException();
    }
    return vehicleType;
  }
}
