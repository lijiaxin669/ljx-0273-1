import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity.js';
import { Order } from '../order/order.entity.js';

@Entity('group')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  leaderId: number;

  @Column()
  productName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  targetCount: number;

  @Column()
  stock: number;

  @Column()
  remainingStock: number;

  @Column()
  deadline: Date;

  @Column({ type: 'enum', enum: ['active', 'success', 'failed', 'closed'], default: 'active' })
  status: 'active' | 'success' | 'failed' | 'closed';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  leader: User;

  @OneToMany(() => Order, (order) => order.group)
  orders: Order[];
}
