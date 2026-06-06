import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Users, Phone, X, Minus, Plus as PlusIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { useGroupStore } from '@/store/groupStore';
import ProgressBar from '@/components/ProgressBar';
import StatusBadge from '@/components/StatusBadge';
import CountdownTimer from '@/components/CountdownTimer';
import type { JoinGroupData } from '@/types';

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentGroup, loading, fetchGroup, joinGroup, error } = useGroupStore();
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState<JoinGroupData>({ phone: '', quantity: 1 });
  const [formErrors, setFormErrors] = useState<{ phone?: string; quantity?: string }>({});

  useEffect(() => {
    if (id) fetchGroup(Number(id));
  }, [id, fetchGroup]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const validate = () => {
    const errs: typeof formErrors = {};
    if (!/^1\d{10}$/.test(form.phone)) errs.phone = '请输入正确的11位手机号';
    if (form.quantity < 1) errs.quantity = '数量至少为1';
    if (currentGroup && form.quantity > currentGroup.remainingStock) {
      errs.quantity = `剩余库存仅${currentGroup.remainingStock}件`;
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleJoin = async () => {
    if (!validate() || !id) return;
    const ok = await joinGroup(Number(id), form);
    if (ok) {
      setToast({ type: 'success', message: '参团成功！' });
      setShowModal(false);
      fetchGroup(Number(id));
    } else {
      setToast({ type: 'error', message: error || '参团失败，请重试' });
    }
  };

  if (loading && !currentGroup) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentGroup) {
    return <div className="text-center py-20 text-gray-400">拼团不存在</div>;
  }

  const current = currentGroup.currentCount ?? 0;
  const percent = currentGroup.targetCount > 0 ? Math.round((current / currentGroup.targetCount) * 100) : 0;
  const isActive = currentGroup.status === 'active';

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white animate-slide-up ${
          toast.type === 'success' ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-danger)]'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div className="h-64 bg-gradient-warm rounded-2xl flex items-center justify-center">
        <Package size={80} className="text-white/60" />
      </div>

      <div className="mt-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-secondary)]">{currentGroup.productName}</h1>
            <p className="text-gray-500 mt-1">{currentGroup.description}</p>
          </div>
          <StatusBadge status={currentGroup.status} />
        </div>

        <p className="text-3xl font-bold text-[var(--color-primary)]">
          ¥{currentGroup.price.toFixed(2)}
        </p>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[var(--color-secondary)] font-medium">
              <Users size={18} />
              拼团进度
            </span>
            <CountdownTimer deadline={currentGroup.deadline} />
          </div>

          <ProgressBar percent={percent} showLabel />

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>已参团 {current} 人</span>
            <span>目标 {currentGroup.targetCount} 人</span>
          </div>
        </div>

        {currentGroup.orders && currentGroup.orders.length > 0 && (
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-medium text-[var(--color-secondary)] mb-3">参团成员</h3>
            <div className="space-y-2">
              {currentGroup.orders.map((order) => (
                <div key={order.id} className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} />
                  <span>{order.memberPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
                  <span className="text-gray-400">×{order.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isActive && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:static md:border-0 md:shadow-none md:mt-8 md:rounded-xl">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 bg-gradient-warm text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-shadow text-lg"
          >
            立即参团
          </button>
        </div>
      )}

      {!isActive && (
        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center text-gray-500">
          该拼团已不可加入
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div
            className="bg-white w-full md:w-auto md:min-w-[400px] rounded-t-2xl md:rounded-2xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--color-secondary)]">参与拼团</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="请输入手机号"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] ${
                    formErrors.phone ? 'border-[var(--color-danger)]' : 'border-gray-200'
                  }`}
                />
                {formErrors.phone && <p className="text-xs text-[var(--color-danger)] mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{form.quantity}</span>
                  <button
                    onClick={() => setForm({ ...form, quantity: form.quantity + 1 })}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>
                {formErrors.quantity && <p className="text-xs text-[var(--color-danger)] mt-1">{formErrors.quantity}</p>}
              </div>

              <div className="pt-2 text-right text-sm text-gray-500">
                合计：<span className="text-xl font-bold text-[var(--color-primary)]">¥{(currentGroup.price * form.quantity).toFixed(2)}</span>
              </div>

              <button
                onClick={handleJoin}
                disabled={loading}
                className="w-full py-3 bg-gradient-warm text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {loading ? '提交中...' : '确认参团'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
