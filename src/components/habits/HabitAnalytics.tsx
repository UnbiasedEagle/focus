'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  subDays,
  eachDayOfInterval,
  format,
  isSameDay,
  startOfDay,
  endOfDay,
} from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HabitAnalyticsProps {
  habit: any; // Using any for now, ideally type shared from schema/actions
}

export function HabitAnalytics({ habit }: HabitAnalyticsProps) {
  // Generate last 100 days
  const today = startOfDay(new Date());
  const startDate = subDays(today, 90); // ~3 months

  const days = eachDayOfInterval({
    start: startDate,
    end: today,
  });

  // Calculate stats
  const totalCompletions = habit.logs.length;
  const currentStreak = habit.streak;

  // Function to check if a day has a log
  const getLogStatus = (day: Date) => {
    return habit.logs.some((log: any) => isSameDay(new Date(log.date), day));
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 gap-4'>
        <Card className='p-4 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800'>
          <div className='text-xs text-zinc-500 font-medium uppercase tracking-wider'>
            Current Streak
          </div>
          <div className='text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-100'>
            {currentStreak}{' '}
            <span className='text-sm font-normal text-zinc-400'>days</span>
          </div>
        </Card>
        <Card className='p-4 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800'>
          <div className='text-xs text-zinc-500 font-medium uppercase tracking-wider'>
            Total Entries
          </div>
          <div className='text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-100'>
            {totalCompletions}
          </div>
        </Card>
      </div>

      <div>
        <h4 className='text-sm font-medium mb-3 text-zinc-500 uppercase tracking-widest'>
          History
        </h4>
        <div className='flex flex-wrap gap-1'>
          <TooltipProvider>
            {days.map((day) => {
              const isCompleted = getLogStatus(day);
              return (
                <Tooltip key={day.toISOString()}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'w-3 h-3 rounded-[2px] transition-colors',
                        isCompleted
                          ? habit.color?.replace('bg-', 'bg-') ||
                              'bg-indigo-500'
                          : 'bg-zinc-100 dark:bg-zinc-800'
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs font-medium'>
                      {format(day, 'MMM do, yyyy')}:{' '}
                      {isCompleted ? 'Completed' : 'Missed'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
