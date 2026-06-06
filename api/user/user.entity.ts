import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['leader', 'member'], default: 'member' })
  role: 'leader' | 'member';

  @CreateDateColumn()
  createdAt: Date;
}
