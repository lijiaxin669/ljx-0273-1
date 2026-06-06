import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  async charge(orderId: number, amount: number): Promise<{ success: boolean; orderId: number }> {
    const success = Math.random() < 0.9;
    console.log(`[Payment] 扣款 orderId=${orderId} amount=${amount} success=${success}`);
    return Promise.resolve({ success, orderId });
  }

  async refund(orderId: number, amount: number): Promise<{ success: boolean; orderId: number }> {
    console.log(`[Payment] 退款 orderId=${orderId} amount=${amount}`);
    return Promise.resolve({ success: true, orderId });
  }
}
