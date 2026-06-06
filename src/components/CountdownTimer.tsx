import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  deadline: string | Date;
}

function getRemaining(deadline: Date) {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

export default function CountdownTimer({ deadline }: CountdownTimerProps) {
  const deadlineDate = new Date(deadline);
  const [remaining, setRemaining] = useState(getRemaining(deadlineDate));

  useEffect(() => {
    setRemaining(getRemaining(deadlineDate));
    const timer = setInterval(() => {
      setRemaining(getRemaining(deadlineDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadlineDate]);

  if (!remaining) {
    return (
      <span className="inline-flex items-center gap-1 text-sm text-gray-400">
        <Clock size={14} />
        已截止
      </span>
    );
  }

  const parts: string[] = [];
  if (remaining.days > 0) parts.push(`${remaining.days}d`);
  if (remaining.hours > 0 || remaining.days > 0) parts.push(`${remaining.hours}h`);
  parts.push(`${remaining.minutes}m`);
  parts.push(`${remaining.seconds}s`);

  return (
    <span className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] font-medium">
      <Clock size={14} />
      {parts.join(' ')}
    </span>
  );
}
