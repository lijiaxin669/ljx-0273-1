import { useEffect, useState } from 'react';
import { LayoutDashboard, ChevronDown, ChevronUp, Phone, StopCircle } from 'lucide-react';
import { useGroupStore } from '@/store/groupStore';
import ProgressBar from '@/components/ProgressBar';
import StatusBadge from '@/components/StatusBadge';
import CountdownTimer from '@/components/CountdownTimer';
import type { Group, Order } from '@/types';

export default function Dashboard() {
  const { groups, loading, fetchManagedGroups } = useGroupStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [participants, setParticipants] = useState<Order[]>([]);
  const [closing, setClosing] = useState<number | null>(null);

  useEffect(() => {
    fetchManagedGroups();
  }, [fetchManagedGroups]);

  const handleExpand = async (group: Group) => {
    if (expandedId === group.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(group.id);
    try {
      const res = await fetch(`/api/groups/${group.id}/progress`);
      if (res.ok) {
        const data = await res.json();
        setParticipants(data.orders ?? []);
      }
    } catch {
      setParticipants([]);
    }
  };

  const handleClose = async (id: number) => {
    setClosing(id);
    try {
      const res = await fetch(`/api/groups/${id}/close`, { method: 'PATCH' });
      if (res.ok) {
        fetchManagedGroups();
      }
    } catch {
      // ignore
    }
    setClosing(null);
  };

  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.status === 'active').length;
  const successGroups = groups.filter((g) => g.status === 'success').length;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-secondary)] mb-6 flex items-center gap-2">
        <LayoutDashboard size={24} />
        团长后台
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: '总拼团数', value: totalGroups, color: 'var(--color-secondary)' },
          { label: '进行中', value: activeGroups, color: 'var(--color-primary)' },
          { label: '已成团', value: successGroups, color: 'var(--color-accent)' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-bold" style={{ color: item.color }}>{item.value}</p>
            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && groups.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">暂无管理的拼团</p>
          <p className="text-sm mt-2">快去发起一个拼团吧！</p>
        </div>
      )}

      <div className="space-y-4">
        {groups.map((group) => {
          const current = group.currentCount ?? 0;
          const percent = group.targetCount > 0 ? Math.round((current / group.targetCount) * 100) : 0;
          const isExpanded = expandedId === group.id;

          return (
            <div key={group.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-[var(--color-secondary)]">{group.productName}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">¥{group.price.toFixed(2)}</p>
                  </div>
                  <StatusBadge status={group.status} />
                </div>

                <ProgressBar percent={percent} showLabel />

                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>{current}/{group.targetCount}人</span>
                  <CountdownTimer deadline={group.deadline} />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleExpand(group)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/20 transition-colors"
                  >
                    查看进度
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {group.status === 'active' && (
                    <button
                      onClick={() => handleClose(group.id)}
                      disabled={closing === group.id}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 text-[var(--color-danger)] hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <StopCircle size={14} />
                      {closing === group.id ? '处理中...' : '手动截止'}
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 p-5 bg-gray-50/50 animate-fade-in">
                  <h4 className="text-sm font-medium text-[var(--color-secondary)] mb-3">参团成员</h4>
                  {participants.length === 0 ? (
                    <p className="text-sm text-gray-400">暂无参团成员</p>
                  ) : (
                    <div className="space-y-2">
                      {participants.map((order) => (
                        <div key={order.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2">
                          <span className="flex items-center gap-2 text-gray-600">
                            <Phone size={14} />
                            {order.memberPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">×{order.quantity}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              order.status === 'paid'
                                ? 'bg-emerald-100 text-[var(--color-accent)]'
                                : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {order.status === 'paid' ? '已付款' : order.status === 'pending' ? '待成团' : order.status === 'payment_failed' ? '扣款失败' : order.status === 'refunded' ? '已退款' : '已取消'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
