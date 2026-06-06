import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from '../user/user.entity.js';
import { Group } from '../group/group.entity.js';
import { Order } from '../order/order.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql' as const,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'root123',
        database: process.env.DB_DATABASE || 'group_buy',
        entities: [User, Group, Order],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        charset: 'utf8mb4',
        extra: {
          charset: 'utf8mb4_unicode_ci',
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
