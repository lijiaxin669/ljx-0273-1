import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service.js';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@Query('phone') phone: string) {
    if (!phone) {
      return [];
    }
    return this.orderService.findByPhone(phone);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findById(Number(id));
  }
}
