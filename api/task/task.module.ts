import { Module } from '@nestjs/common';
import { GroupModule } from '../group/group.module.js';
import { OrderModule } from '../order/order.module.js';
import { TaskService } from './task.service.js';

@Module({
  imports: [GroupModule, OrderModule],
  providers: [TaskService],
})
export class TaskModule {}
