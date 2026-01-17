'use client';

import { useState } from 'react';
import { logHabit } from '@/actions/habits';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Flame, MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteHabit } from '@/actions/habits';
import { ALL_ICONS } from '@/lib/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HabitAnalytics } from './HabitAnalytics';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { subDays, isSameDay } from 'date-fns';

interface HabitCardProps {
  habit: any;
}

export function HabitCard({ habit }: HabitCardProps) {
  const [loading, setLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Use the shared ALL_ICONS map for consistent lookup
  const iconKey = habit.icon ? habit.icon.toLowerCase() : 'zap';
  const IconComp = ALL_ICONS[iconKey] || ALL_ICONS['zap']; // Fallback to safe icon if not found

  const colorMatch = habit.color?.match(/bg-([a-z]+)-/);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      if (!habit.completed) {
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.7 },
          colors: [
            colorMatch ? `var(--${colorMatch[1]}-500)` : '#6366f1',
            '#ffffff',
          ],
          disableForReducedMotion: true,
          scalar: 0.6,
        });
      }
      await logHabit(habit.id);
      toast.success(habit.completed ? 'Check-in removed' : 'Habit checked in!');
    } catch (err) {
      toast.error('Failed to update habit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHabit(habit.id);
      toast.success('Habit deleted');
    } catch (err) {
      toast.error('Failed to delete habit');
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.002 }}
        className={cn(
          'group relative flex items-center p-3 rounded-xl border transition-all duration-200',
          'bg-white border-zinc-200 shadow-sm hover:border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700'
        )}
      >
        {/* Simple Checkbox Action */}
        <button
          type='button'
          aria-label={`Toggle completion for ${habit.title}`}
          aria-pressed={habit.completed}
          onClick={handleToggle}
          disabled={loading}
          className={cn(
            'shrink-0 h-5 w-5 rounded-md border flex items-center justify-center transition-all duration-200 ml-1 focus:outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-zinc-950',
            habit.completed
              ? cn(
                  habit.color || 'bg-indigo-500',
                  'border-transparent text-white'
                )
              : cn(
                  'bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-600',
                  'hover:border-zinc-400 dark:hover:border-zinc-500',
                  habit.color
                    ?.replace('bg-', 'hover:border-')
                    .replace('500', '400') || 'hover:border-indigo-400'
                ),
            loading && 'opacity-50 cursor-wait'
          )}
        >
          {habit.completed && <Check className='h-3.5 w-3.5 stroke-3' />}
        </button>

        {/* Content */}
        <div className='flex flex-1 items-center gap-3.5 overflow-hidden px-4'>
          {/* Icon - Minimal */}
          <div
            className={cn(
              'shrink-0 transition-colors duration-300',
              habit.completed
                ? (habit.color?.replace('bg-', 'text-') || 'text-indigo-500') +
                    ' opacity-50 grayscale'
                : habit.color?.replace('bg-', 'text-') || 'text-zinc-500'
            )}
          >
            <IconComp className='h-5 w-5 stroke-[1.5]' />
          </div>

          {/* Text details */}
          <div className='flex flex-col min-w-0 flex-1'>
            <div className='flex items-center gap-2'>
              <h3
                className={cn(
                  'text-sm font-medium truncate transition-colors text-zinc-700 dark:text-zinc-200'
                )}
              >
                {habit.title}
              </h3>

              {/* Minimal Streak - Just text */}
              {habit.streak > 0 && !habit.completed && (
                <span className='flex items-center gap-0.5 text-[10px] font-medium text-orange-500 opacity-80'>
                  <Flame className='h-2.5 w-2.5 fill-current' />
                  {habit.streak}
                </span>
              )}
            </div>
            <div className='flex items-center gap-3 mt-1'>
              <p className='text-[11px] text-zinc-400 font-medium capitalize truncate'>
                {habit.frequency}
              </p>

              {/* 7-Day Micro-Heatmap */}
              <div className='flex items-center gap-1'>
                {[6, 5, 4, 3, 2, 1, 0].map((daysAgo) => {
                  const date = subDays(new Date(), daysAgo);
                  const isCompleted = habit.logs.some((l: any) =>
                    isSameDay(new Date(l.date), date)
                  );
                  const isToday = daysAgo === 0;

                  return (
                    <div
                      key={daysAgo}
                      title={daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
                      className={cn(
                        'h-2 w-2 rounded-full transition-all duration-300',
                        isCompleted
                          ? habit.color || 'bg-indigo-500'
                          : 'bg-zinc-200 dark:bg-zinc-800',
                        isToday &&
                          !isCompleted &&
                          'ring-1 ring-zinc-300 dark:ring-zinc-600 ring-offset-1 dark:ring-offset-zinc-950'
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Controls - Always visible */}
        <div className='flex items-center'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-300'
                aria-label='Open actions menu'
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setShowAnalytics(true)}>
                {(() => {
                  const BarChartIcon = ALL_ICONS['barchart'];
                  return <BarChartIcon className='mr-2 h-4 w-4' />;
                })()}
                Analytics
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20'
                onClick={handleDelete}
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <IconComp
                className={cn(
                  'h-5 w-5',
                  habit.color?.replace('bg-', 'text-') || 'text-indigo-500'
                )}
              />
              {habit.title}
            </DialogTitle>
            <DialogDescription>
              {habit.description || 'Track your consistency over time.'}
            </DialogDescription>
          </DialogHeader>
          <HabitAnalytics habit={habit} />
        </DialogContent>
      </Dialog>
    </>
  );
}
