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

  async countByGroupAndStatus(groupId: number, status: string): Promise<number> {
    return this.orderRepo.count({ where: { groupId, status } });
  }

  async countPendingOrPaid(groupId: number): Promise<number> {
    const pending = await this.countByGroupAndStatus(groupId, 'pending');
    const paid = await this.countByGroupAndStatus(groupId, 'paid');
    return pending + paid;
  }

  async create(data: Partial<Order>): Promise<Order> {
    const order = this.orderRepo.create(data);
    return this.orderRepo.save(order);
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await this.orderRepo.update(id, { status });
  }

  async findByGroupAndStatus(groupId: number, status: string): Promise<Order[]> {
    return this.orderRepo.find({ where: { groupId, status } });
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.orderRepo.find({ where: { status } });
  }

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
