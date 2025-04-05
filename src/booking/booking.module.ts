import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/bookings.schema';
import { CustomerParkingBookingController } from './controllers/customer.controller';
import { CustomerBookingService } from './services/customer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [CustomerParkingBookingController],
  providers: [CustomerBookingService],
})
export class BookingModule {}
