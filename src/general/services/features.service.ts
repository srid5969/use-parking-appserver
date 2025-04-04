import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feature } from '../schemas/features.schema';
import { Model, Types } from 'mongoose';
import { QueryParams } from '../../common/dtos/query-params.dto';
import { Status } from '../../common/enums';
import {
  AddNewFeatureDTO,
  UpdateFeatureDTO,
} from '../dtos/feature-managements.dto';

@Injectable()
export class FeatureManagementService {
  constructor(
    @InjectModel(Feature.name)
    private readonly featureModel: Model<Feature>,
  ) {}
  async getAllFeatures(params: QueryParams) {
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

    const data = await this.featureModel
      .find(queryObj, {
        name: 1,
        description: 1,
        status: 1,
        createdAt: 1,
      })
      .limit(limit)
      .skip(skip)
      .sort({ [sortField]: sortOrder === 'DESC' ? -1 : 1 });
    const totalCount = await this.featureModel.countDocuments(queryObj);

    return { data, totalCount };
  }

  async getFeatureById(featureId: string) {
    const feature = await this.featureModel.findById(featureId);
    if (!feature) {
      throw new NotFoundException();
    }
    return feature;
  }

  async createFeature(data: AddNewFeatureDTO, actionBy: string) {
    const feature = await this.featureModel.create({
      ...data,
      createdBy: new Types.ObjectId(actionBy),
    });
    return feature;
  }

  async updateFeature(
    featureId: string,
    data: UpdateFeatureDTO,
    actionBy: string,
  ) {
    const feature = await this.featureModel.findByIdAndUpdate(
      featureId,
      { ...data, updatedBy: new Types.ObjectId(actionBy) },
      {
        new: true,
      },
    );
    if (!feature) {
      throw new NotFoundException();
    }
    return feature;
  }

  async deleteFeature(featureId: string, actionBy: string) {
    const feature = await this.featureModel.findByIdAndUpdate(
      featureId,
      { status: Status.DELETED, deletedBy: new Types.ObjectId(actionBy) },
      { new: true },
    );
    if (!feature) {
      throw new NotFoundException();
    }
    return feature;
  }
}
