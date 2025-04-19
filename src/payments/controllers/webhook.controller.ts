import { Body, Controller, Headers, Logger, Post } from '@nestjs/common';
import { RazorPayService } from '../../common/services/payment.service';
import { RazorpayWebHookService } from '../services/razorpay-webhook.services';

@Controller('webhook')
export class WebHookHandlerController {
  private readonly logger = new Logger(WebHookHandlerController.name);

  constructor(
    private readonly razorPayService: RazorPayService,
    private readonly razorpayWebHookService: RazorpayWebHookService,
  ) {}

  @Post('razorpay')
  async handleRazorpayWebhook(
    @Body() body: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    try {
      this.logger.log('Razorpay webhook received:', body);
      this.logger.log('Razorpay webhook signature:', signature);
      this.razorPayService.verifyWebhookSignature(body, signature);
      await this.razorpayWebHookService.handleWebhookEvent(body);
      // Handle the webhook event here
      this.logger.log('Webhook verified and handled successfully');
    } catch (error) {
      this.logger.error('Webhook verification failed:', error);
      throw error;
      // Handle the error accordingly
    }
  }
}
