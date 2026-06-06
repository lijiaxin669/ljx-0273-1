import { useNavigate } from 'react-router-dom';
import { Users, Package } from 'lucide-react';
import type { Group } from '@/types';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import CountdownTimer from './CountdownTimer';

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate();
  const current = group.currentCount ?? 0;
  const percent = group.targetCount > 0 ? Math.round((current / group.targetCount) * 100) : 0;

  return (
    <div
      onClick={() => navigate(`/group/${group.id}`)}
      className="border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer overflow-hidden bg-white animate-fade-in"
    >
      <div className="h-40 bg-gradient-warm flex items-center justify-center relative">
        <Package size={48} className="text-white/70" />
        <div className="absolute top-3 right-3">
          <StatusBadge status={group.status} />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg text-[var(--color-secondary)] truncate">
          {group.productName}
        </h3>

        <p className="text-[var(--color-primary)] font-bold text-xl">
          ¥{group.price.toFixed(2)}
        </p>

        <ProgressBar percent={percent} />

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-gray-600">
            <Users size={14} />
            {current}/{group.targetCount}人
          </span>
          {group.remainingStock > 0 && (
            <span className="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] px-2 py-0.5 rounded-full text-xs font-medium">
              余{group.remainingStock}件
            </span>
          )}
        </div>

        <CountdownTimer deadline={group.deadline} />
      </div>
    </div>
  );
}
