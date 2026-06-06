import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GroupService } from '../group/group.service.js';

@Injectable()
export class TaskService {
  constructor(private readonly groupService: GroupService) {}

  @Cron('* * * * *')
  async handleCron(): Promise<void> {
    if (process.env.WORKER_MODE !== 'true') {
      return;
    }

    const expiredCount = await this.groupService.checkAndCloseExpiredGroups();
    const failedPayments = await this.groupService.processPaymentFailures();

    console.log(`[Task] 过期团购处理: ${expiredCount} 个, 支付失败处理: ${failedPayments} 个`);
  }
}
