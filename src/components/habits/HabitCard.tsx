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
import * as Icons from 'lucide-react';
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

  const IconComp =
    (Icons as any)[habit.icon ? habit.icon.toLowerCase() : 'zap'] ||
    (Icons as any)[
      habit.icon
        ? habit.icon.charAt(0).toUpperCase() + habit.icon.slice(1)
        : 'Zap'
    ] ||
    Icons.Zap;

  const colorMatch = habit.color?.match(/bg-([a-z]+)-/);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      if (!habit.completed) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: [
            colorMatch ? `var(--${colorMatch[1]}-500)` : '#6366f1',
            '#ffffff',
          ],
          disableForReducedMotion: true,
          scalar: 0.8,
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{
          scale: 1.005,
          backgroundColor: 'rgba(var(--foreground-rgb), 0.02)',
        }}
        className={cn(
          'group relative flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all duration-200',
          habit.completed
            ? 'opacity-60 bg-zinc-50/50 dark:bg-zinc-900/20'
            : 'bg-white dark:bg-zinc-950/20'
        )}
      >
        {/* Left: Icon & Info */}
        <div className='flex items-center gap-4 min-w-0'>
          {/* Checkbox-style Action */}
          <button
            onClick={handleToggle}
            disabled={loading}
            className={cn(
              'flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-white dark:ring-offset-zinc-950',
              habit.completed
                ? 'bg-green-500 border-green-500 text-white'
                : cn(
                    'border-zinc-300 dark:border-zinc-600 hover:border-indigo-400 dark:hover:border-indigo-500',
                    loading && 'opacity-50 cursor-wait'
                  )
            )}
          >
            {habit.completed && <Check className='h-3.5 w-3.5 stroke-[3]' />}
          </button>

          {/* Icon & Details */}
          <div className='flex flex-col min-w-0'>
            <div className='flex items-center gap-2'>
              <h3
                className={cn(
                  'font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate transition-colors',
                  habit.completed &&
                    'text-zinc-500 line-through decoration-zinc-300 dark:decoration-zinc-700'
                )}
              >
                {habit.title}
              </h3>
              <div
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  habit.color || 'bg-indigo-500'
                )}
              />
            </div>

            <div className='flex items-center gap-2 text-xs text-zinc-500'>
              <span className='capitalize'>{habit.frequency}</span>
              {habit.streak > 0 && (
                <>
                  <span>•</span>
                  <span className='flex items-center gap-0.5 text-orange-500 font-medium'>
                    <Flame className='h-3 w-3 fill-current' />
                    {habit.streak}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Heatmap & Options */}
        <div className='flex items-center gap-4'>
          {/* Mini Heatmap (Discrete) */}
          <div className='hidden md:flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity duration-300'>
            {[4, 3, 2, 1, 0].map((daysAgo) => {
              const date = subDays(new Date(), daysAgo);
              const isCompleted = habit.logs.some((l: any) =>
                isSameDay(new Date(l.date), date)
              );
              const isToday = daysAgo === 0;
              return (
                <div
                  key={daysAgo}
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-all',
                    isCompleted
                      ? habit.color || 'bg-indigo-500'
                      : 'bg-zinc-200 dark:bg-zinc-800',
                    isToday &&
                      !isCompleted &&
                      'ring-1 ring-zinc-300 dark:ring-zinc-600'
                  )}
                />
              );
            })}
          </div>

          {/* Menu Trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all hover:text-zinc-600 dark:hover:text-zinc-300'
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setShowAnalytics(true)}>
                <Icons.BarChart2 className='mr-2 h-4 w-4' />
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
