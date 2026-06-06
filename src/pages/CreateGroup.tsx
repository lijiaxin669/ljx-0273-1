import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, Users, Clock, AlertCircle } from 'lucide-react';
import { useGroupStore } from '@/store/groupStore';
import type { CreateGroupData } from '@/types';

interface FormErrors {
  productName?: string;
  price?: string;
  targetCount?: string;
  stock?: string;
  deadline?: string;
}

export default function CreateGroup() {
  const navigate = useNavigate();
  const { createGroup, loading, error } = useGroupStore();
  const [form, setForm] = useState<CreateGroupData>({
    productName: '',
    description: '',
    imageUrl: '',
    price: 0,
    targetCount: 10,
    stock: 50,
    deadline: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.productName.trim()) errs.productName = '请输入商品名称';
    if (form.price <= 0) errs.price = '价格必须大于0';
    if (form.targetCount < 2) errs.targetCount = '成团人数至少2人';
    if (form.stock < 1) errs.stock = '库存至少1件';
    if (!form.deadline) errs.deadline = '请选择截止时间';
    else if (new Date(form.deadline) <= new Date()) errs.deadline = '截止时间必须晚于当前时间';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const group = await createGroup(form);
    if (group) {
      navigate('/dashboard');
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] ${
      errors[field] ? 'border-[var(--color-danger)]' : 'border-gray-200'
    }`;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--color-secondary)] mb-6">发起拼团</h1>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-[var(--color-danger)] rounded-xl text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-medium text-[var(--color-secondary)] flex items-center gap-2">
            <Package size={18} />
            商品信息
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品名称 *</label>
            <input
              type="text"
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              placeholder="例如：澳洲进口奶粉"
              className={inputClass('productName')}
            />
            {errors.productName && <p className="text-xs text-[var(--color-danger)] mt-1">{errors.productName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品描述</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="详细描述商品信息..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">图片链接</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-medium text-[var(--color-secondary)] flex items-center gap-2">
            <DollarSign size={18} />
            价格与数量
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">拼团价 (¥) *</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
              placeholder="198.00"
              className={inputClass('price')}
            />
            {errors.price && <p className="text-xs text-[var(--color-danger)] mt-1">{errors.price}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">成团人数 *</label>
              <input
                type="number"
                min="2"
                value={form.targetCount}
                onChange={(e) => setForm({ ...form, targetCount: parseInt(e.target.value) || 0 })}
                className={inputClass('targetCount')}
              />
              {errors.targetCount && <p className="text-xs text-[var(--color-danger)] mt-1">{errors.targetCount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">库存数量 *</label>
              <input
                type="number"
                min="1"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                className={inputClass('stock')}
              />
              {errors.stock && <p className="text-xs text-[var(--color-danger)] mt-1">{errors.stock}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-medium text-[var(--color-secondary)] flex items-center gap-2">
            <Clock size={18} />
            截止时间
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">拼团截止时间 *</label>
            <input
              type="datetime-local"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className={inputClass('deadline')}
            />
            {errors.deadline && <p className="text-xs text-[var(--color-danger)] mt-1">{errors.deadline}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-warm text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-shadow text-lg disabled:opacity-50"
        >
          {loading ? '提交中...' : '发起拼团'}
        </button>
      </form>
    </div>
  );
}
