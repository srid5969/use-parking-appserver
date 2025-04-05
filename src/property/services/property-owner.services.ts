import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Property } from '../schemas/property.schema';
import { Model, Types } from 'mongoose';
import { CreatePropertyDto } from '../dtos/property-owners.dto';
import { omit } from 'lodash';
import { QueryParams } from '../../common/dtos/query-params.dto';

@Injectable()
export class PropertyOwnerPropertyManagementService {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<Property>,
  ) {}

  async createProperty(propertyModel: CreatePropertyDto, owner: string) {
    const createProperty = new this.propertyModel({
      ...propertyModel,
      owner_id: new Types.ObjectId(owner),
    });
    const savedProperty = await createProperty.save();

    return sanitizePropertyObject(savedProperty.toObject());
  }

  async getAllOwnersProperties(ownerId: string, params: QueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 24;
    const sort = params.sort || 'createdAt|DESC';
    const filters = params.filters || '';
    const textSearch = params.textSearch || '';
    const skip = page * limit - limit;
    const [sortField, sortOrder] = sort.split('|');
    const filterAry = filters.split(',');
    const queryObj = {
      owner_id: new Types.ObjectId(ownerId),
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
}

export function sanitizePropertyObject(property: Property) {
  const omitProperties = ['createdAt', 'updatedAt', '__v', 'owner_id'];
  const sanitizedProperty = omit(property, omitProperties);
  return sanitizedProperty as unknown as CreatePropertyDto;
}
