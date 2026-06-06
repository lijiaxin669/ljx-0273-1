interface ProgressBarProps {
  percent: number;
  showLabel?: boolean;
}

export default function ProgressBar({ percent, showLabel = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full">
      <div className="w-full rounded-full bg-gray-200 h-3 overflow-hidden">
        <div
          className="h-3 rounded-full bg-gradient-warm transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1 text-right">{clamped}%</p>
      )}
    </div>
  );
}
