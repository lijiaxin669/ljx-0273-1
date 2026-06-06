import { useState, useEffect, useRef } from 'react';
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
  const deadlineMs = new Date(deadline).getTime();
  const [remaining, setRemaining] = useState(() => getRemaining(new Date(deadlineMs)));
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const targetDate = new Date(deadlineMs);
    setRemaining(getRemaining(targetDate));

    timerRef.current = window.setInterval(() => {
      const newRemaining = getRemaining(targetDate);
      setRemaining(newRemaining);
      if (newRemaining === null && timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [deadlineMs]);

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
