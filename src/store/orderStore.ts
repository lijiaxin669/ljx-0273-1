import { create } from 'zustand';
import type { Order } from '@/types';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: (phone: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async (phone: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone)}`);
      if (!res.ok) throw new Error('获取订单失败');
      const orders: Order[] = await res.json();
      set({ orders, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : '网络错误' });
    }
  },
}));
