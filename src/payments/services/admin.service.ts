import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from '../schemas/payments.schema';
import { Model } from 'mongoose';
import { QueryParams } from '../../common/dtos/query-params.dto';

@Injectable()
export class AdminTransactionManagementService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
  ) {}

  async getAllTransactions(params: QueryParams) {
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

    const data = await this.paymentModel
      .find(queryObj, {
        captured_at: 1,
        amount: 1,
        booking_id: 1,
        notes: 1,
        status: 1,
        payment_method: 1,
        payment_id: 1,
        contact: 1,
        failure_reason: 1,
        order_id: 1,
      })
      .limit(limit)
      .skip(skip)
      .sort({ [sortField]: sortOrder === 'DESC' ? -1 : 1 });
    const totalCount = await this.paymentModel.countDocuments(queryObj);

    return { data, totalCount };
  }

  async getTransactionDetailById(id: string) {
    const data = await this.paymentModel.findById(id);
    return data;
  }
}
