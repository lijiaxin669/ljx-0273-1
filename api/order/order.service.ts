import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity.js';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async findByPhone(phone: string): Promise<any[]> {
    const orders = await this.orderRepo.find({
      where: { memberPhone: phone },
      relations: ['group'],
      order: { createdAt: 'DESC' },
    });
    return orders.map((order) => ({
      ...order,
      productName: (order as any).group?.productName ?? null,
    }));
  }

  async findById(id: number): Promise<any> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['group'],
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    return {
      ...order,
      productName: (order as any).group?.productName ?? null,
    };
  }
}
