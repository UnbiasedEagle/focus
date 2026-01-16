'use client';

import { usePathname, useRouter } from 'next/navigation';
import { usePomodoroStore } from '@/lib/store/pomodoro';
import { Play, Pause, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { POMODORO_TIMES } from '@/lib/constants';
import {
  startPomodoroSession,
  abandonPomodoroSession,
} from '@/actions/pomodoro';

export function GlobalTimerWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const {
    mode,
    timeLeft,
    isActive,
    selectedTaskId,
    currentSessionId,
    setIsActive,
    setCurrentSessionId,
    resetTimer,
  } = usePomodoroStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setIsMounted(true);
  }, []);

  if (!isMounted || pathname === '/dashboard/pomodoro') return null;

  const totalTime = POMODORO_TIMES[mode];
  const isStarted = timeLeft < totalTime;

  if (!isActive && !isStarted) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  async function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();

    if (!isActive) {
      // Starting - need to create session if focus mode
      if (mode === 'focus' && !currentSessionId) {
        try {
          const session = await startPomodoroSession(
            selectedTaskId === 'none' ? undefined : selectedTaskId
          );
          if (session) setCurrentSessionId(session.id);
        } catch (error) {
          console.error('Failed to start session', error);
        }
      }
      setIsActive(true);
    } else {
      // Pausing
      setIsActive(false);
    }
  }

  return (
    <div className='fixed bottom-6 right-6 z-50'>
      <div
        onClick={() => router.push('/dashboard/pomodoro')}
        className={cn(
          'group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer',
          'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
          'shadow-lg',
          'transition-all duration-200'
        )}
      >
        {/* Progress Ring */}
        <div className='relative h-12 w-12 shrink-0'>
          <svg className='absolute inset-0 -rotate-90' viewBox='0 0 48 48'>
            <circle
              cx='24'
              cy='24'
              r='20'
              fill='none'
              stroke='currentColor'
              strokeWidth='3'
              className='text-zinc-100 dark:text-zinc-800'
            />
            <circle
              cx='24'
              cy='24'
              r='20'
              fill='none'
              stroke='url(#timer-gradient)'
              strokeWidth='3'
              strokeLinecap='round'
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
              className='transition-all duration-300'
            />
            <defs>
              <linearGradient
                id='timer-gradient'
                x1='0%'
                y1='0%'
                x2='0%'
                y2='100%'
              >
                <stop offset='0%' stopColor='#6366f1' />
                <stop offset='100%' stopColor='#4f46e5' />
              </linearGradient>
            </defs>
          </svg>

          <button
            onClick={handleToggle}
            className='absolute inset-0 flex items-center justify-center rounded-full transition-colors'
          >
            {isActive ? (
              <Pause className='h-4 w-4 fill-current text-zinc-700 dark:text-zinc-300' />
            ) : (
              <Play className='h-4 w-4 fill-current text-zinc-700 dark:text-zinc-300 ml-0.5' />
            )}
          </button>
        </div>

        {/* Timer Display */}
        <div className='flex flex-col min-w-[70px]'>
          <div className='text-2xl font-bold font-mono tabular-nums leading-none tracking-tight'>
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </div>
          <div className='text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 mt-1'>
            {mode === 'focus' ? 'Focus' : mode === 'short' ? 'Short' : 'Long'}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={async (e) => {
            e.stopPropagation();
            setIsActive(false);
            // Abandon session if there's one active
            if (mode === 'focus' && currentSessionId) {
              try {
                await abandonPomodoroSession(currentSessionId);
              } catch (error) {
                console.error('Failed to abandon session', error);
              }
              setCurrentSessionId(null);
            }
            resetTimer();
          }}
          className='flex items-center justify-center h-7 w-7 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-all duration-200 -mr-1'
        >
          <X className='h-3.5 w-3.5' />
        </button>

        {/* Active indicator */}
        {isActive && (
          <div className='absolute -inset-px bg-linear-to-b from-indigo-500/20 to-indigo-600/20 rounded-xl blur -z-10 animate-pulse' />
        )}
      </div>
    </div>
  );
}
