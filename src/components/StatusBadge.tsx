interface StatusBadgeProps {
  status: 'active' | 'success' | 'failed' | 'closed';
}

const statusConfig: Record<StatusBadgeProps['status'], { label: string; className: string }> = {
  active: {
    label: '进行中',
    className: 'bg-orange-100 text-[var(--color-primary)]',
  },
  success: {
    label: '已成团',
    className: 'bg-emerald-100 text-[var(--color-accent)]',
  },
  failed: {
    label: '未成团',
    className: 'bg-red-100 text-[var(--color-danger)]',
  },
  closed: {
    label: '已关闭',
    className: 'bg-gray-100 text-gray-500',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
