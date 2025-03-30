import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './configs';
import { UsersModule } from './users/users.module';
import { UserSessionModule } from './user-session/user-session.module';
import { GeneralModule } from './general/general.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { BookingModule } from './booking/booking.module';
import { PropertyModule } from './property/property.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `${configService.getOrThrow<string>('dbURI')}/${configService.getOrThrow<string>(
          'database',
        )}`,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    UserSessionModule,
    GeneralModule,
    NotificationsModule,
    PaymentsModule,
    BookingModule,
    PropertyModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
