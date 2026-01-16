'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';
import {
  startPomodoroSession,
  abandonPomodoroSession,
} from '@/actions/pomodoro';
import { POMODORO_TIMES, POMODORO_LABELS } from '@/lib/constants';
import { PomodoroRing } from './PomodoroRing';
import { usePomodoroStore } from '@/lib/store/pomodoro';

type Task = {
  id: string;
  title: string;
  columnTitle: string;
};

export function PomodoroTimer({ tasks }: { tasks: Task[] }) {
  const {
    mode,
    timeLeft,
    isActive,
    selectedTaskId,
    currentSessionId,
    setMode,
    setIsActive,
    setSelectedTaskId,
    setCurrentSessionId,
    resetTimer,
  } = usePomodoroStore();

  const totalTime = POMODORO_TIMES[mode];

  async function toggleTimer() {
    if (!isActive) {
      // Starting
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

  // handleComplete logic moved to GlobalTimerWidget

  async function handleReset() {
    // If there's an active session, abandon it (save partial progress)
    if (mode === 'focus' && currentSessionId) {
      try {
        await abandonPomodoroSession(currentSessionId);
      } catch (error) {
        console.error('Failed to abandon session', error);
      }
      setCurrentSessionId(null);
    }
    resetTimer();
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <Card className='p-6 flex flex-col items-center justify-center space-y-6'>
      {/* Mode Selector */}
      <div className='flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl space-x-1'>
        {(
          Object.keys(POMODORO_LABELS) as Array<keyof typeof POMODORO_LABELS>
        ).map((m) => (
          <Button
            key={m}
            variant={mode === m ? 'secondary' : 'ghost'}
            size='sm'
            onClick={() => setMode(m)}
            className={cn(
              'px-4 h-8 text-[10px] uppercase tracking-widest',
              mode === m
                ? 'bg-white dark:bg-zinc-700 shadow-sm text-foreground'
                : 'text-zinc-500'
            )}
          >
            {m === 'focus' ? 'Focus' : m === 'short' ? 'Short' : 'Long'}
          </Button>
        ))}
      </div>

      {/* Timer Display */}
      <div className='relative flex items-center justify-center'>
        <PomodoroRing progress={progress} mode={mode} />

        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-5xl font-bold font-mono tracking-tighter'>
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </span>
          <span className='text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.2em] font-bold'>
            {mode === 'focus' ? 'Focus' : 'Break'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className='flex items-center gap-6'>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full h-10 w-10 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          onClick={handleReset}
        >
          <RotateCcw className='h-5 w-5' />
        </Button>
        <Button
          size='lg'
          variant={mode === 'focus' ? 'indigo' : 'default'}
          onClick={toggleTimer}
          className={cn(
            'rounded-full h-18 w-18 shadow-2xl scale-100 hover:scale-105 active:scale-95 transition-all duration-300',
            mode === 'focus' && 'shadow-indigo-500/40',
            mode === 'short' &&
              'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/40 border-none',
            mode === 'long' &&
              'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/40 border-none'
          )}
        >
          {isActive ? (
            <Pause className='h-8 w-8 fill-current' />
          ) : (
            <Play className='h-8 w-8 fill-current ml-1' />
          )}
        </Button>
        <div className='w-10 h-10 flex items-center justify-center opacity-0 pointer-events-none'>
          {/* Spacer to balance layout */}
        </div>
      </div>

      {/* Task Link */}
      {mode === 'focus' && (
        <div className='w-full max-w-[320px] pt-4'>
          <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
            <SelectTrigger className='w-full h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 px-3'>
              <div className='flex items-center gap-2 text-muted-foreground shrink-0'>
                <Target className='h-3.5 w-3.5' />
                <span className='uppercase tracking-wider text-[10px] font-bold'>
                  Target:
                </span>
              </div>
              <span className='truncate flex-1 text-left'>
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent className='max-w-[320px]'>
              <SelectItem value='none' className='text-xs font-medium'>
                General Focus (No Task)
              </SelectItem>
              {tasks.map((t) => (
                <SelectItem
                  key={t.id}
                  value={t.id}
                  className='text-xs truncate block'
                >
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </Card>
  );
}
