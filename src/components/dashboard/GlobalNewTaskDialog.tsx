'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskSchema, type TaskInput } from '@/lib/schemas';
import { z } from 'zod';
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
import { getUserBoardsAndColumns } from '@/actions/global';

interface GlobalNewTaskDialogProps {
  trigger?: React.ReactNode;
}

const GlobalTaskFormSchema = TaskSchema.extend({
  boardId: z.string().min(1, 'Board is required'),
  columnId: z.string().min(1, 'Section is required'),
});

type GlobalTaskFormInput = z.infer<typeof GlobalTaskFormSchema>;

type BoardData = {
  id: string;
  name: string;
  columns: { id: string; title: string }[];
};

export function GlobalNewTaskDialog({ trigger }: GlobalNewTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [boardsData, setBoardsData] = useState<BoardData[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GlobalTaskFormInput>({
    resolver: zodResolver(GlobalTaskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      boardId: '',
      columnId: '',
    },
  });

  const selectedBoardId = watch('boardId');

  useEffect(() => {
    if (open) {
      loadData();
    } else {
      // Reset form on close
      reset({
        title: '',
        description: '',
        priority: 'Medium',
        boardId: '',
        columnId: '',
      });
    }
  }, [open, reset]);

  async function loadData() {
    setDataLoading(true);
    try {
      const data = await getUserBoardsAndColumns();
      // Ensure data matches expected structure or cast if necessary coming from server action
      setBoardsData(data as unknown as BoardData[]);
      if (data.length > 0) {
        setValue('boardId', data[0].id);
        if (data[0].columns.length > 0) {
          setValue('columnId', data[0].columns[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load boards:', error);
      toast.error('Failed to load boards');
    } finally {
      setDataLoading(false);
    }
  }

  async function onSubmit(data: GlobalTaskFormInput) {
    const promise = createTask(
      data.columnId,
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

  const selectedBoard = boardsData.find((b) => b.id === selectedBoardId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='indigo' size='sm' className='gap-2'>
            <Plus className='h-4 w-4' />
            New Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        {dataLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin text-indigo-500' />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='board'>Board</Label>
                <Controller
                  name='boardId'
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        // Reset column when board changes
                        const board = boardsData.find((b) => b.id === val);
                        if (board?.columns && board.columns.length > 0) {
                          setValue('columnId', board.columns[0].id);
                        } else {
                          setValue('columnId', '');
                        }
                      }}
                    >
                      <SelectTrigger id='board'>
                        <SelectValue placeholder='Select board' />
                      </SelectTrigger>
                      <SelectContent>
                        {boardsData.map((board) => (
                          <SelectItem key={board.id} value={board.id}>
                            {board.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.boardId && (
                  <p className='text-xs text-red-500'>
                    {errors.boardId.message}
                  </p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='column'>Section</Label>
                <Controller
                  name='columnId'
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedBoardId}
                    >
                      <SelectTrigger id='column'>
                        <SelectValue placeholder='Select column' />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedBoard?.columns.map((col: any) => (
                          <SelectItem key={col.id} value={col.id}>
                            {col.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.columnId && (
                  <p className='text-xs text-red-500'>
                    {errors.columnId.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                placeholder='Task title'
                {...register('title')}
                className={
                  errors.title ? 'border-red-500 focus:border-red-500' : ''
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
              <Button variant='indigo' type='submit' disabled={isSubmitting}>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
