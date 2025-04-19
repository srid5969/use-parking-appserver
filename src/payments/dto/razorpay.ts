export interface RazorpayPaymentCapturedPayloadEventDTO {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id: null;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status: null;
  captured: boolean;
  description: string;
  card_id: null;
  bank: null;
  wallet: null;
  vpa: string;
  email: string;
  contact: string;
  notes: any[];
  fee: number;
  tax: number;
  error_code: null;
  error_description: null;
  error_source: null;
  error_step: null;
  error_reason: null;
  acquirer_data: {
    rrn: string;
    upi_transaction_id: string;
  };
  created_at: number;
  reward: null;
  upi: {
    vpa: string;
  };
  base_amount: number;
}

export interface PaymentCapturedWebHookEventDTO {
  entity: 'event';
  account_id: string;
  event: 'payment.captured';
  contains: string[];
  payload: {
    payment: {
      entity: RazorpayPaymentCapturedPayloadEventDTO;
    };
  };
  created_at: number;
}
export interface RazorpayPaymentFailedPayloadEventDTO {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id: null;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status: null;
  captured: boolean;
  description: string;
  card_id: null;
  bank: null;
  wallet: null;
  vpa: string;
  email: string;
  contact: string;
  notes: any[];
  fee: null;
  tax: null;
  error_code: string;
  error_description: string;
  error_source: string;
  error_step: string;
  error_reason: string;
  acquirer_data: {
    rrn: null;
  };
  created_at: number;
  upi: {
    vpa: string;
  };
}
export interface PaymentFailedWebHookEventDTO {
  entity: 'event';
  account_id: string;
  event: 'payment.failed';
  contains: string[];
  payload: {
    payment: {
      entity: RazorpayPaymentFailedPayloadEventDTO;
    };
  };
  created_at: number;
}
