import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RazorPayService } from '../common/services/payment.service';
import { Setting, SettingSchema } from '../general/schemas/settings.schema';
import { Property, PropertySchema } from '../property/schemas/property.schema';
import { CustomerParkingBookingController } from './controllers/customer.controller';
import { Booking, BookingSchema } from './schemas/bookings.schema';
import { CustomerBookingService } from './services/customer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Setting.name, schema: SettingSchema },
    ]),
  ],
  controllers: [CustomerParkingBookingController],
  providers: [CustomerBookingService, RazorPayService],
})
export class BookingModule {}
