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
import { updateBoard } from '@/actions/kanban';

interface EditBoardDialogProps {
  board: { id: string; name: string };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBoardDialog({
  board,
  isOpen,
  onOpenChange,
}: EditBoardDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BoardInput>({
    resolver: zodResolver(BoardSchema),
    defaultValues: {
      name: board.name,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: board.name,
      });
    }
  }, [isOpen, board, reset]);

  async function onSubmit(data: BoardInput) {
    const promise = updateBoard(board.id, data.name);

    toast.promise(promise, {
      loading: 'Updating board...',
      success: () => {
        onOpenChange(false);
        return 'Board updated successfully';
      },
      error: 'Failed to update board',
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Rename Board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='edit-name'>Board Name</Label>
            <Input
              id='edit-name'
              placeholder='Enter board name...'
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
                  Updating...
                </>
              ) : (
                'SAVE CHANGES'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
