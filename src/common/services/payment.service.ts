import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { EnvironmentConfigType } from '../../configs';

@Injectable()
export class RazorPayService {
  private razorpay: Razorpay;
  private razorpayWebhookSecret: string;

  constructor(readonly configService: ConfigService<EnvironmentConfigType>) {
    this.razorpay = new Razorpay({
      key_id: configService.getOrThrow('razorpay_key_id'),
      key_secret: configService.getOrThrow('razorpay_key_secret'),
    });
    this.razorpayWebhookSecret = configService.getOrThrow(
      'razorpay_webhook_secret',
    );
  }

  async createOrder(
    amount: number,
    currency = 'INR',
    receipt: string,
    notes?: Record<string, any>,
  ) {
    try {
      const order = await this.razorpay.orders.create({
        amount: amount * 100, // Razorpay accepts amount in paise
        currency,
        receipt,
        payment_capture: true,
        notes,
      });
      return order;
    } catch (err) {
      console.error('Razorpay order creation failed:', err);
      throw new InternalServerErrorException('Failed to create Razorpay order');
    }
  }

  verifyWebhookSignature(body: any, receivedSignature: string): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', this.razorpayWebhookSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    const verified = generatedSignature === receivedSignature;
    if (!verified) {
      console.error('Razorpay webhook signature verification failed');
      throw new BadRequestException(
        'Razorpay webhook signature verification failed',
      );
    }
    return verified;
  }
}
