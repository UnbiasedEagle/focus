'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BoardSchema, type BoardInput } from '@/lib/schemas';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { createBoard } from '@/actions/kanban';
import { useRouter } from 'next/navigation';

interface NewBoardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewBoardDialog({ isOpen, onOpenChange }: NewBoardDialogProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BoardInput>({
    resolver: zodResolver(BoardSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  async function onSubmit(data: BoardInput) {
    try {
      // We can't wrap the whole thing in toast.promise because we need the ID from the result
      // So we handle it manually to get the ID for routing

      // Actually we can, but let's do it manually for custom handling
      const promise = createBoard(data.name);

      toast.promise(promise, {
        loading: 'Creating board...',
        success: (newBoardId) => {
          onOpenChange(false);
          router.push(`/dashboard/kanban?boardId=${newBoardId}`);
          return 'Board created successfully';
        },
        error: 'Failed to create board',
      });
    } catch (error) {
      // Handled by toast.promise
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] rounded-2xl border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden'>
        <div className='p-6'>
          <DialogHeader className='mb-4'>
            <DialogTitle className='text-lg font-bold tracking-tight'>
              Create New Board
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Board Name</Label>
              <Input
                id='name'
                placeholder='Marketing, Product Roadmap, etc.'
                {...register('name')}
                className={
                  errors.name ? 'border-red-500 focus:border-red-500' : ''
                }
              />
              {errors.name && (
                <p className='text-xs text-red-500'>{errors.name.message}</p>
              )}
            </div>
            <div className='flex justify-end gap-3 mt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
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
                  'CREATE BOARD'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
