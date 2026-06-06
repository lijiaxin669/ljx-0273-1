import { useState } from 'react';
import { Search, ClipboardList, Package } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import type { Order } from '@/types';

const orderStatusConfig: Record<Order['status'], { label: string; className: string }> = {
  pending: { label: '待成团', className: 'bg-yellow-100 text-yellow-700' },
  paid: { label: '已付款', className: 'bg-emerald-100 text-[var(--color-accent)]' },
  payment_failed: { label: '扣款失败', className: 'bg-red-100 text-[var(--color-danger)]' },
  refunded: { label: '已退款', className: 'bg-blue-100 text-blue-600' },
  cancelled: { label: '已取消', className: 'bg-gray-100 text-gray-500' },
};

export default function Orders() {
  const { orders, loading, fetchOrders } = useOrderStore();
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    fetchOrders(phone.trim());
    setSearched(true);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 flex items-center gap-2">
        <ClipboardList size={24} />
        我的订单
      </h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="输入手机号查询订单"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-gradient-warm text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center gap-1.5"
        >
          <Search size={16} />
          查询
        </button>
      </form>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && searched && orders.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Package size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg">未找到订单</p>
          <p className="text-sm mt-1">请确认手机号是否正确</p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {orders.map((order) => {
              const statusCfg = orderStatusConfig[order.status];
              return (
                <div key={order.id} className="relative animate-slide-up">
                  <div className="absolute -left-5 top-4 w-4 h-4 rounded-full bg-[var(--color-primary)] border-2 border-white shadow-sm" />

                  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-[var(--color-secondary)]">
                        {order.productName || `拼团 #${order.groupId}`}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-500">
                      <p>数量：{order.quantity} 件</p>
                      <p className="text-[var(--color-primary)] font-bold text-base">
                        合计：¥{order.totalAmount.toFixed(2)}
                      </p>
                      {order.group?.deadline && (
                        <p>截止时间：{formatDate(order.group.deadline)}</p>
                      )}
                      <p>下单时间：{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
