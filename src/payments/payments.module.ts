import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payments.schema';
import { RazorpayWebHookService } from './services/razorpay-webhook.services';
import { WebHookHandlerController } from './controllers/webhook.controller';
import { RazorPayService } from '../common/services/payment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  providers: [RazorpayWebHookService, RazorPayService],
  controllers: [WebHookHandlerController],
})
export class PaymentsModule {}
