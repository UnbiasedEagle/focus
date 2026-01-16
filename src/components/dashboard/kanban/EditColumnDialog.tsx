'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnSchema, type ColumnInput } from '@/lib/schemas';
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
import { updateColumn } from '@/actions/kanban';

interface EditColumnDialogProps {
  column: {
    id: string;
    title: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditColumnDialog({
  column,
  isOpen,
  onOpenChange,
}: EditColumnDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ColumnInput>({
    resolver: zodResolver(ColumnSchema),
    defaultValues: {
      title: column.title,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: column.title,
      });
    }
  }, [isOpen, column, reset]);

  async function onSubmit(data: ColumnInput) {
    const promise = updateColumn(column.id, data.title);

    toast.promise(promise, {
      loading: 'Updating section...',
      success: () => {
        onOpenChange(false);
        return 'Section updated successfully';
      },
      error: 'Failed to update section',
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='title'>Section Title</Label>
            <Input
              id='title'
              placeholder='Section title'
              {...register('title')}
              className={
                errors.title ? 'border-red-500 focus:border-red-500' : ''
              }
            />
            {errors.title && (
              <p className='text-xs text-red-500'>{errors.title.message}</p>
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
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
