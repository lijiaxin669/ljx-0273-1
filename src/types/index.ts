export interface Group {
  id: number;
  leaderId: number;
  productName: string;
  description: string;
  imageUrl: string;
  price: number;
  targetCount: number;
  stock: number;
  remainingStock: number;
  deadline: string;
  status: 'active' | 'success' | 'failed' | 'closed';
  createdAt: string;
  updatedAt: string;
  currentCount?: number;
  orders?: Order[];
  leader?: { id: number; name: string };
}

export interface Order {
  id: number;
  groupId: number;
  memberId: number;
  memberPhone: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'payment_failed' | 'refunded' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  group?: Group;
  productName?: string;
}

export interface CreateGroupData {
  productName: string;
  description: string;
  imageUrl: string;
  price: number;
  targetCount: number;
  stock: number;
  deadline: string;
}

export interface JoinGroupData {
  phone: string;
  quantity: number;
}
