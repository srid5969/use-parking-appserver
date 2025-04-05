import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QueryParams } from '../../common/dtos/query-params.dto';
import { Property } from '../schemas/property.schema';
import { isMongoId } from 'class-validator';
import { AppErrorMessages } from '../../common/consts';

@Injectable()
export class AdminPropertyManagementService {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<Property>,
  ) {}

  async getPropertiesByOwnerId(params: QueryParams, owner_id: string) {
    const page = params.page || 1;
    const limit = params.limit || 24;
    const sort = params.sort || 'createdAt|DESC';
    const filters = params.filters || '';
    const textSearch = params.textSearch || '';
    const skip = page * limit - limit;
    const [sortField, sortOrder] = sort.split('|');
    const filterAry = filters.split(',');
    if (isMongoId(owner_id) === false) {
      throw new BadRequestException(AppErrorMessages.INVALID_ID);
    }
    const queryObj = {
      owner_id: new Types.ObjectId(owner_id),
    };
    for (const element of filterAry) {
      const filterVal = element;
      const [search_field, search_value] = filterVal.split('|');
      queryObj[search_field] = search_value;
    }

    if (textSearch) {
      queryObj['$or'] = [];
    }

    const data = await this.propertyModel
      .find(queryObj, {
        _id: 1,
        name: 1,
        status: 1,
        type: 1,
        description: 1,
        address: 1,
      })
      .limit(limit)
      .skip(skip)
      .sort({ [sortField]: sortOrder === 'DESC' ? -1 : 1 });
    const totalCount = await this.propertyModel.countDocuments(queryObj);

    return { data, totalCount };
  }

  async getPropertyById(propertyId: string) {
    const property = await this.propertyModel.findById(propertyId);
    if (!property) {
      throw new NotFoundException();
    }
    return property;
  }

  async getAllProperties(queryParams: QueryParams) {
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 24;
    const sort = queryParams.sort || 'createdAt|DESC';
    const filters = queryParams.filters || '';
    const textSearch = queryParams.textSearch || '';
    const skip = page * limit - limit;
    const [sortField, sortOrder] = sort.split('|');
    const filterAry = filters.split(',');
    const queryObj = {};

    for (const element of filterAry) {
      const filterVal = element;
      const [search_field, search_value] = filterVal.split('|');
      queryObj[search_field] = search_value;
    }

    if (textSearch) {
      queryObj['$or'] = [];
    }

    const data = await this.propertyModel
      .find(queryObj, {
        _id: 1,
        name: 1,
        status: 1,
        type: 1,
        description: 1,
        address: 1,
      })
      .limit(limit)
      .skip(skip)
      .sort({ [sortField]: sortOrder === 'DESC' ? -1 : 1 });
    const totalCount = await this.propertyModel.countDocuments(queryObj);

    return { data, totalCount };
  }
}
