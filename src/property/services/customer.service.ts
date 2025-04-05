import { Injectable } from '@nestjs/common';
import { Property } from '../schemas/property.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sanitizePropertyObject } from './property-owner.services';
import { GetAvailableParkingNearMe } from '../dtos/customer.dto';

@Injectable()
export class CustomerParkingManagementService {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<Property>,
  ) {}

  async getNearbyAvailableParking(params: GetAvailableParkingNearMe) {
    const page = params.page || 1;
    const limit = params.limit || 24;
    const sort = params.sort || 'createdAt|DESC';
    const filters = params.filters || '';
    const textSearch = params.textSearch || '';
    const skip = page * limit - limit;
    const [sortField, sortOrder] = sort.split('|');
    const { lat, long, radius } = params;

    const filterAry = filters.split(',');
    const queryObj = {
      'address.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(long), Number(lat)], // [longitude, latitude]
          },
          $maxDistance: Number(radius), // meters
        },
      },
      status: 'available',
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
      .find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({ [sortField]: sortOrder === 'DESC' ? -1 : 1 });

    return { data };
  }
}
