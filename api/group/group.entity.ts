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

@Entity('purchase_group')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  leaderId: number;

  @Column({ type: 'varchar', length: 100 })
  productName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column({ type: 'int' })
  targetCount: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'int' })
  remainingStock: number;

  @Column({ type: 'datetime' })
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
