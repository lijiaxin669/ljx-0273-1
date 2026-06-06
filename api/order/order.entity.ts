import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Group } from '../group/group.entity.js';
import { User } from '../user/user.entity.js';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  groupId: number;

  @Column({ type: 'int' })
  memberId: number;

  @Column({ type: 'varchar', length: 20 })
  memberPhone: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'payment_failed', 'refunded', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Group, (group) => group.orders)
  group: Group;

  @ManyToOne(() => User)
  member: User;
}
