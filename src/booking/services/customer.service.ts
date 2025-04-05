/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from '../schemas/bookings.schema';
import { Model, Types } from 'mongoose';
import { QueryParams } from '../../common/dtos/query-params.dto';
import { sanitizeUserData } from '../../users/services/users/users-common.service';
import { User } from '../../users/schemas/users.schema';
import { Property } from '../../property/schemas/property.schema';

@Injectable()
export class CustomerBookingService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<Booking>,
  ) {}

  async getBookingsList(params: QueryParams, customerId: string) {
    const page = params.page || 1;
    const limit = params.limit || 24;
    const sort = params.sort || 'createdAt|DESC';
    const filters = params.filters || '';
    const textSearch = params.textSearch || '';
    const skip = page * limit - limit;
    const [sortField, sortOrder] = sort.split('|');
    const filterAry = filters.split(',');
    const queryObj = {
      customer_id: new Types.ObjectId(customerId),
    };
    for (const element of filterAry) {
      const filterVal = element;
      const [search_field, search_value] = filterVal.split('|');
      queryObj[search_field] = search_value;
    }

    if (textSearch) {
      queryObj['$or'] = [];
    }

    const data = await this.bookingModel
      .find(queryObj, {
        end_time: 1,
        payment_status: 1,
        start_time: 1,
        status: 1,
        total_amount: 1,
        customer_id: 1,
        property_id: 1,
        vehicle_details: 1,
      })
      .limit(limit)
      .skip(skip)
      .sort({ [sortField]: sortOrder === 'DESC' ? -1 : 1 });
    const totalCount = await this.bookingModel.countDocuments(queryObj);

    return { data, totalCount };
  }

  async getBookingById(id: string, customerId: string) {
    const data = await this.bookingModel
      .findOne({
        _id: new Types.ObjectId(id),
        customer_id: new Types.ObjectId(customerId),
      })
      .populate([
        {
          path: 'customer_id',
          transform: (doc: User) => {
            return sanitizeUserData(doc.toObject<User>());
          },
        },
        {
          path: 'property_id',
          populate: {
            path: 'owner_id',
            transform: (doc: User) => {
              return sanitizeUserData(doc.toObject<User>());
            },
          },
        },
      ]);
    if (!data) {
      throw new NotFoundException();
    }
    const booking: any = data.toObject();
    const owner = booking.property_id.owner_id as User;
    delete booking.property_id.owner_id;
    const property = booking.property_id as User;
    const customer = booking.customer_id as User;
    delete booking.customer_id;
    delete booking.property_id;
    booking.customer = customer;
    booking.property = property;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = {
      ...booking,
      property,
      property_owner: owner,
      customer,
    };

    return result as {
      status: string;
      payment_status: string;
      _id: string;
      customer: User;
      property: Property;
      property_owner: User;
    };
  }
}
