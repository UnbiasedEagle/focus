'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Tag } from 'lucide-react';

interface ViewTaskDialogProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    priority: 'Low' | 'Medium' | 'High';
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewTaskDialog({
  task,
  isOpen,
  onOpenChange,
}: ViewTaskDialogProps) {
  const priorityColor =
    {
      Low: 'text-blue-600',
      Medium: 'text-orange-600',
      High: 'text-red-600',
    }[task.priority] || 'text-zinc-600';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <div className='flex items-center gap-2 mb-1'>
            <span
              className={`text-[10px] font-bold uppercase ${priorityColor}`}
            >
              {task.priority} Priority
            </span>
          </div>
          <DialogTitle className='text-lg font-bold'>{task.title}</DialogTitle>
        </DialogHeader>

        <div className='py-4'>
          {task.description ? (
            <div className='space-y-2'>
              <h4 className='text-xs font-semibold text-zinc-500 uppercase tracking-wider'>
                Description
              </h4>
              <p className='text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed'>
                {task.description}
              </p>
            </div>
          ) : (
            <p className='text-sm text-zinc-500 italic'>
              No description provided.
            </p>
          )}

          <div className='flex items-center gap-4 mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500'>
            <div className='flex items-center gap-1.5'>
              <Calendar className='h-3 w-3' />
              <span>Jan 15, 2026</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
