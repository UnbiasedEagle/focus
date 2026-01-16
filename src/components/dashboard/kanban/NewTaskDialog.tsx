'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskSchema, type TaskInput } from '@/lib/schemas';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';
import { createTask } from '@/actions/kanban';

interface NewTaskDialogProps {
  columnId: string;
  trigger?: React.ReactNode;
}

export function NewTaskDialog({ columnId, trigger }: NewTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskInput>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      reset({
        title: '',
        description: '',
        priority: 'Medium',
      });
    }
  }, [open, reset]);

  async function onSubmit(data: TaskInput) {
    const promise = createTask(
      columnId,
      data.title,
      data.description || '',
      data.priority
    );

    toast.promise(promise, {
      loading: 'Creating task...',
      success: () => {
        setOpen(false);
        return 'Task created successfully';
      },
      error: 'Failed to create task',
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant='ghost'
            size='sm'
            className='w-full justify-start text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          >
            <Plus className='h-4 w-4' />
            <span>Add Task</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              placeholder='Task title'
              {...register('title')}
              className={
                errors.title
                  ? 'border-red-500 focus:border-red-500 col-span-3'
                  : 'col-span-3'
              }
            />
            {errors.title && (
              <p className='text-xs text-red-500'>{errors.title.message}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='description'>Description (Optional)</Label>
            <Textarea
              id='description'
              placeholder='Add details...'
              className='resize-none'
              {...register('description')}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='priority'>Priority</Label>
            <Controller
              name='priority'
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select priority' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Low'>Low</SelectItem>
                    <SelectItem value='Medium'>Medium</SelectItem>
                    <SelectItem value='High'>High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className='flex justify-end gap-3 mt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
