import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payments.schema';
import { RazorpayWebHookService } from './services/razorpay-webhook.services';
import { WebHookHandlerController } from './controllers/webhook.controller';
import { RazorPayService } from '../common/services/payment.service';
import { AdminTransactionManagementService } from './services/admin.service';
import { PaymentsAdminController } from './controllers/admin.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    UsersModule,
  ],
  providers: [
    RazorpayWebHookService,
    RazorPayService,
    AdminTransactionManagementService,
    PaymentsAdminController,
  ],
  controllers: [WebHookHandlerController, PaymentsAdminController],
})
export class PaymentsModule {}
