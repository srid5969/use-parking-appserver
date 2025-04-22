import { Injectable } from '@nestjs/common';
import { Booking } from '../schemas/bookings.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryParams } from '../../common/dtos/query-params.dto';

@Injectable()
export class BookingAdminService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<Booking>,
  ) {}

  async getAllBookings(params: QueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 24;
    const sort = params.sort || '_id|DESC';
    const filters = params.filters || '';
    const textSearch = params.textSearch || '';
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

  async getBookingById(id: string) {
    const data = await this.bookingModel.findById(id).exec();
    return data;
  }
}
