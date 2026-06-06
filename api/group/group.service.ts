import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity.js';
import { Order } from '../order/order.entity.js';
import { CreateGroupDto } from './dto/create-group.dto.js';
import { JoinGroupDto } from './dto/join-group.dto.js';
import { UserService } from '../user/user.service.js';
import { SmsService } from '../sms/sms.service.js';
import { PaymentService } from '../payment/payment.service.js';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly paymentService: PaymentService,
  ) {}

  async create(leaderId: number, dto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepo.create({
      leaderId,
      productName: dto.productName,
      description: dto.description,
      imageUrl: dto.imageUrl,
      price: dto.price,
      targetCount: dto.targetCount,
      stock: dto.stock,
      remainingStock: dto.stock,
      deadline: new Date(dto.deadline),
    });
    return this.groupRepo.save(group);
  }

  async findAll(status?: string): Promise<any[]> {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    const groups = await this.groupRepo.find({ where, order: { createdAt: 'DESC' } });
    const result: any[] = [];
    for (const group of groups) {
      const currentCount = await this.orderRepo.count({
        where: { groupId: group.id, status: 'pending' },
      });
      const paidCount = await this.orderRepo.count({
        where: { groupId: group.id, status: 'paid' },
      });
      result.push({
        ...group,
        currentCount: currentCount + paidCount,
      });
    }
    return result;
  }

  async findById(id: number): Promise<any> {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['orders', 'leader'],
    });
    if (!group) {
      throw new NotFoundException('团购不存在');
    }
    const currentCount = group.orders.filter(
      (o) => o.status === 'pending' || o.status === 'paid',
    ).length;
    return {
      ...group,
      currentCount,
      leaderName: (group as any).leader?.name ?? '',
    };
  }

  async findManagedGroups(leaderId: number): Promise<any[]> {
    const groups = await this.groupRepo.find({
      where: { leaderId },
      order: { createdAt: 'DESC' },
    });
    const result: any[] = [];
    for (const group of groups) {
      const currentCount = await this.orderRepo.count({
        where: { groupId: group.id, status: 'pending' },
      });
      const paidCount = await this.orderRepo.count({
        where: { groupId: group.id, status: 'paid' },
      });
      result.push({
        ...group,
        currentCount: currentCount + paidCount,
      });
    }
    return result;
  }

  async joinGroup(groupId: number, dto: JoinGroupDto): Promise<any> {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException('团购不存在');
    }
    if (group.status !== 'active') {
      throw new ConflictException('团购已结束');
    }

    const quantity = dto.quantity || 1;
    if (group.remainingStock < quantity) {
      throw new ConflictException('库存不足');
    }

    const result = await this.groupRepo
      .createQueryBuilder()
      .update(Group)
      .set({ remainingStock: () => `remainingStock - ${quantity}` })
      .where('id = :id AND remainingStock >= :quantity', { id: groupId, quantity })
      .execute();

    if (result.affected === 0) {
      throw new ConflictException('库存不足');
    }

    const user = await this.userService.findOrCreate(dto.phone, dto.name || '团员');
    const totalAmount = Number(group.price) * quantity;
    const order = this.orderRepo.create({
      groupId: group.id,
      memberId: user.id,
      memberPhone: dto.phone,
      quantity,
      totalAmount,
      status: 'pending',
    });
    await this.orderRepo.save(order);

    await this.smsService.sendSms(dto.phone, '占位通知');

    return {
      orderId: order.id,
      status: 'pending',
      message: '参团成功，已预扣库存',
    };
  }

  async getProgress(groupId: number): Promise<any> {
    const group = await this.findById(groupId);
    const currentCount = group.orders.filter(
      (o) => o.status === 'pending' || o.status === 'paid',
    ).length;
    const progressPercent = Math.round((currentCount / group.targetCount) * 100);
    const ordersWithMaskedPhone = group.orders.map((o) => ({
      ...o,
      memberPhone: this.maskPhone(o.memberPhone),
    }));
    return {
      currentCount,
      targetCount: group.targetCount,
      progressPercent,
      remainingStock: group.remainingStock,
      status: group.status,
      orders: ordersWithMaskedPhone,
    };
  }

  async closeGroup(groupId: number): Promise<any> {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ['orders'],
    });
    if (!group) {
      throw new NotFoundException('团购不存在');
    }

    const validCount = group.orders.filter(
      (o) => o.status === 'pending' || o.status === 'paid',
    ).length;

    let finalStatus: string;
    if (validCount >= group.targetCount) {
      finalStatus = 'success';
      await this.groupRepo.update(groupId, { status: 'success' });
      await this.processPayments(group);
    } else {
      finalStatus = 'failed';
      await this.groupRepo.update(groupId, { status: 'failed' });
      for (const order of group.orders) {
        if (order.status === 'pending' || order.status === 'paid') {
          await this.paymentService.refund(order.id, Number(order.totalAmount));
          await this.orderRepo.update(order.id, { status: 'refunded' });
        }
      }
    }

    return {
      success: true,
      finalStatus,
      message: finalStatus === 'success' ? '团购成功，正在处理付款' : '团购失败，已退款',
    };
  }

  async processPayments(group: Group): Promise<void> {
    const orders = await this.orderRepo.find({
      where: { groupId: group.id, status: 'pending' },
    });
    for (const order of orders) {
      const result = await this.paymentService.charge(order.id, Number(order.totalAmount));
      if (result.success) {
        await this.orderRepo.update(order.id, { status: 'paid' });
      } else {
        await this.orderRepo.update(order.id, { status: 'payment_failed' });
        await this.groupRepo.increment({ id: group.id }, 'remainingStock', order.quantity);
      }
    }
  }

  async checkAndCloseExpiredGroups(): Promise<number> {
    const groups = await this.groupRepo
      .createQueryBuilder('g')
      .where('g.status = :status AND g.deadline < :now', { status: 'active', now: new Date() })
      .getMany();

    for (const group of groups) {
      await this.closeGroup(group.id);
    }
    return groups.length;
  }

  async processPaymentFailures(): Promise<number> {
    const orders = await this.orderRepo.find({
      where: { status: 'payment_failed' },
    });
    for (const order of orders) {
      await this.groupRepo.increment({ id: order.groupId }, 'remainingStock', order.quantity);
      await this.orderRepo.update(order.id, { status: 'cancelled' });
    }
    return orders.length;
  }

  private maskPhone(phone: string): string {
    if (phone.length < 7) return phone;
    return phone.substring(0, 3) + '****' + phone.substring(7);
  }
}
