import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RazorPayService } from '../../common/services/payment.service';
import {
  PaymentCapturedWebHookEventDTO,
  PaymentFailedWebHookEventDTO,
  RazorpayPaymentCapturedPayloadEventDTO,
  RazorpayPaymentFailedPayloadEventDTO,
} from '../dto/razorpay';
import { Payment } from '../schemas/payments.schema';

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment: {
      entity: any;
    };
    order: {
      entity: any;
    };
  };
}

@Injectable()
export class RazorpayWebHookService {
  private readonly logger = new Logger(RazorpayWebHookService.name);

  constructor(
    private readonly razorPayService: RazorPayService,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
  ) {}

  async handleWebhookEvent(
    event:
      | PaymentCapturedWebHookEventDTO
      | PaymentFailedWebHookEventDTO
      | RazorpayWebhookEvent,
  ): Promise<void> {
    try {
      this.logger.log(`Razorpay Webhook event received: ${event.event}`);

      switch (event.event) {
        case 'payment.captured':
          await this.handlePaymentCaptured(event.payload.payment.entity);
          break;

        case 'payment.failed':
          await this.handlePaymentFailed(event.payload.payment.entity);
          break;

        default:
          this.logger.warn(`Unhandled webhook event type: ${event.event}`);
      }
    } catch (error) {
      this.logger.error('Error handling webhook event', error);
    }
  }

  private async handlePaymentCaptured(
    paymentData: RazorpayPaymentCapturedPayloadEventDTO,
  ): Promise<void> {
    const {
      id: payment_id,
      order_id,
      amount,
      currency,
      email,
      contact,
      method,
      captured,
      created_at,
      notes,
    } = paymentData;

    const payment = await this.paymentModel.findOneAndUpdate(
      { order_id },
      {
        $set: {
          status: 'successful',
          payment_id,
          payment_method: method,
          email,
          contact,
          currency,
          amount: amount / 100, // convert from paise
          captured_at: new Date(created_at * 1000),
          notes,
        },
      },
      { new: true, upsert: true },
    );

    this.logger.log(`Payment captured and saved: ${payment._id.toString()}`);
  }

  private async handlePaymentFailed(
    paymentData: RazorpayPaymentFailedPayloadEventDTO,
  ): Promise<void> {
    const {
      id: payment_id,
      order_id,
      amount,
      currency,
      email,
      contact,
      method,
      error_description,
      created_at,
      notes,
    } = paymentData;

    const payment = await this.paymentModel.findOneAndUpdate(
      { order_id },
      {
        $set: {
          status: 'failed',
          payment_id,
          payment_method: method,
          email,
          contact,
          currency,
          amount: amount / 100,
          failure_reason: error_description,
          captured_at: new Date(created_at * 1000),
          notes,
        },
      },
      { new: true, upsert: true },
    );

    this.logger.warn(`Payment failed and saved: ${payment._id.toString()}`);
  }
}
