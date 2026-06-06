import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity.js';
import { Group } from './group/group.entity.js';
import { Order } from './order/order.entity.js';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const ds = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root123',
  database: 'group_buy',
  entities: [User, Group, Order],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  charset: 'utf8mb4',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  logging: true,
});

async function test() {
  try {
    await ds.initialize();
    console.log('Connected successfully!');
    const groups = await ds.getRepository(Group).find();
    console.log('Groups:', groups.length);
    for (const g of groups) {
      console.log('  -', g.id, g.productName, g.price, typeof g.price);
    }
    await ds.destroy();
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}
test();
