import { cn } from '@/lib/utils';

interface PomodoroRingProps {
  progress: number;
  mode: 'focus' | 'short' | 'long';
  size?: number;
  strokeWidth?: number;
}

export function PomodoroRing({
  progress,
  mode,
  size = 192,
  strokeWidth = 6,
}: PomodoroRingProps) {
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className='-rotate-90 transform'
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke='currentColor'
        strokeWidth={strokeWidth}
        fill='transparent'
        className='text-zinc-100 dark:text-zinc-800'
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke='currentColor'
        strokeWidth={strokeWidth}
        fill='transparent'
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap='round'
        className={cn(
          'transition-all duration-500',
          mode === 'focus' && 'text-indigo-600',
          mode === 'short' && 'text-emerald-500',
          mode === 'long' && 'text-blue-500'
        )}
      />
    </svg>
  );
}
