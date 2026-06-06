import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  private queue: Array<{ phone: string; message: string; timestamp: Date }> = [];

  async sendSms(phone: string, message: string): Promise<{ success: boolean; phone: string; message: string }> {
    this.queue.push({ phone, message, timestamp: new Date() });
    console.log(`[SMS] 发送短信至 ${phone}: ${message}`);
    return Promise.resolve({ success: true, phone, message });
  }

  getQueue(): Array<{ phone: string; message: string; timestamp: Date }> {
    return this.queue;
  }

  processQueue(): void {
    console.log(`[SMS] 处理短信队列，共 ${this.queue.length} 条`);
    this.queue = [];
  }
}
