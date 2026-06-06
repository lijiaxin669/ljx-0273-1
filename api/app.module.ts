import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { UserModule } from './user/user.module.js';
import { GroupModule } from './group/group.module.js';
import { OrderModule } from './order/order.module.js';
import { SmsModule } from './sms/sms.module.js';
import { PaymentModule } from './payment/payment.module.js';
import { TaskModule } from './task/task.module.js';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    GroupModule,
    OrderModule,
    SmsModule,
    PaymentModule,
    TaskModule,
  ],
})
export class AppModule {}
