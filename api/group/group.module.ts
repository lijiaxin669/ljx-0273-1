import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity.js';
import { GroupController } from './group.controller.js';
import { GroupService } from './group.service.js';
import { UserModule } from '../user/user.module.js';
import { OrderModule } from '../order/order.module.js';
import { SmsModule } from '../sms/sms.module.js';
import { PaymentModule } from '../payment/payment.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group]),
    UserModule,
    OrderModule,
    SmsModule,
    PaymentModule,
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
