import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RazorPayService } from '../common/services/payment.service';
import { Setting, SettingSchema } from '../general/schemas/settings.schema';
import { Property, PropertySchema } from '../property/schemas/property.schema';
import { UsersModule } from '../users/users.module';
import { BookingsAdminController } from './controllers/admin.controller';
import { CustomerParkingBookingController } from './controllers/customer.controller';
import { Booking, BookingSchema } from './schemas/bookings.schema';
import { BookingAdminService } from './services/admin.service';
import { CustomerBookingService } from './services/customer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Setting.name, schema: SettingSchema },
    ]),
    UsersModule,
  ],
  controllers: [CustomerParkingBookingController, BookingsAdminController],
  providers: [CustomerBookingService, RazorPayService, BookingAdminService],
})
export class BookingModule {}
