'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventSchema, type EventInput } from '@/lib/schemas';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createEvent, deleteEvent, updateEvent } from '@/actions/schedule';
import {
  Loader2,
  Trash2,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  X,
} from 'lucide-react';
import { type Event } from '@/actions/schedule';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  event?: Event;
  onClose: () => void;
}

export function EventDialog({
  open,
  onOpenChange,
  selectedDate,
  event,
  onClose,
}: EventDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventInput>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      time: undefined,
      allDay: false,
    },
  });

  // Reset form when event or open state changes
  useEffect(() => {
    if (open) {
      if (event) {
        reset({
          title: event.title,
          description: event.description || '',
          location: event.location || '',
          time:
            event.start && !event.allDay
              ? format(new Date(event.start), 'HH:mm')
              : 'all-day',
          allDay: event.allDay,
        });
      } else {
        reset({
          title: '',
          description: '',
          location: '',
          time: undefined,
          allDay: false,
        });
      }
    }
  }, [open, event, reset]);

  const onSubmit = async (data: EventInput) => {
    // Construct Date objects
    const startDateTime = new Date(selectedDate || new Date());
    const time = data.time;

    if (time && time !== 'all-day') {
      const [hours, minutes] = time.split(':').map(Number);
      startDateTime.setHours(hours, minutes);
    }

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 1);

    const isAllDay = !time || time === 'all-day';

    const promise = event
      ? updateEvent(event.id, {
          title: data.title,
          description: data.description,
          location: data.location,
          start: startDateTime,
          end: endDateTime,
          allDay: isAllDay,
        })
      : createEvent({
          title: data.title,
          description: data.description,
          start: startDateTime,
          end: endDateTime,
          location: data.location,
          allDay: isAllDay,
        });

    toast.promise(promise, {
      loading: event ? 'Updating event...' : 'Creating event...',
      success: () => {
        onClose();
        onOpenChange(false);
        return event
          ? 'Event updated successfully'
          : 'Event created successfully';
      },
      error: 'Failed to save event',
    });
  };

  const handleDelete = async () => {
    if (!event) return;

    // We can use a custom toast ID to allow dismissal if needed, but promise is fine
    // However, for delete confirming, usually we want a separate dialog.
    // Assuming the user already clicked "Trash" button which should ideally trigger a confirm dialog before calling this,
    // but the previous code had `confirm()` js alert. We'll stick to that or better, toast promise.

    toast.promise(deleteEvent(event.id), {
      loading: 'Deleting event...',
      success: () => {
        onClose();
        onOpenChange(false);
        return 'Event deleted successfully';
      },
      error: 'Failed to delete event',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[440px] p-0 gap-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl block overflow-hidden rounded-2xl [&>button]:hidden'>
        <div className='p-6 pb-4'>
          <div className='flex items-center justify-between mb-1'>
            <DialogTitle className='text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
              {event ? 'Edit Event' : 'New Meeting'}
            </DialogTitle>
            <div className='flex items-center gap-1 -mr-2'>
              {event && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this event? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className='bg-red-600 hover:bg-red-700 text-white border-transparent'
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => {
                  onClose();
                  onOpenChange(false);
                }}
                className='h-8 w-8 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <p className='text-xs font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2'>
            <CalendarIcon className='h-3.5 w-3.5' />
            {selectedDate ? format(selectedDate, 'EEEE, MMMM do') : 'Schedule'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='px-6 pb-6 space-y-5'>
          <div className='space-y-1.5'>
            <Label
              htmlFor='title'
              className='text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1'
            >
              Title
            </Label>
            <Input
              id='title'
              placeholder='Add a title...'
              {...register('title')}
              autoFocus
              className={cn(
                'text-base font-medium h-11 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl',
                errors.title && 'border-red-500 focus:border-red-500'
              )}
            />
            {errors.title && (
              <p className='text-xs text-red-500 ml-1'>
                {errors.title.message}
              </p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <Label
                htmlFor='time'
                className='text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1'
              >
                Start Time
              </Label>
              <Controller
                name='time'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger
                      id='time'
                      className='relative group pl-9 h-10 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-zinc-700 dark:text-zinc-300'
                    >
                      <Clock className='absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus:text-indigo-500 transition-colors' />
                      <SelectValue placeholder='Select time' />
                    </SelectTrigger>
                    <SelectContent className='h-60'>
                      <SelectItem value='all-day'>All Day</SelectItem>
                      {Array.from({ length: 96 }).map((_, i) => {
                        const date = new Date();
                        date.setHours(Math.floor(i / 4), (i % 4) * 15);
                        const value = format(date, 'HH:mm');
                        return (
                          <SelectItem key={value} value={value}>
                            {format(date, 'h:mm a')}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className='space-y-1.5'>
              <Label
                htmlFor='location'
                className='text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1'
              >
                Location
              </Label>
              <div className='relative group'>
                <MapPin className='absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors' />
                <Input
                  id='location'
                  placeholder='Zoom / Office'
                  {...register('location')}
                  className='pl-9 h-10 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium'
                />
              </div>
            </div>
          </div>

          <div className='space-y-1.5'>
            <Label
              htmlFor='description'
              className='text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1'
            >
              Description
            </Label>
            <Textarea
              id='description'
              placeholder='Add agenda or notes...'
              {...register('description')}
              className='bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 min-h-[100px] resize-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all'
            />
          </div>

          <div className='pt-2 flex justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                onClose();
                onOpenChange(false);
              }}
              className='rounded-lg h-10 font-medium px-4 border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-50'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='indigo'
              className='rounded-lg h-10 font-bold px-6 shadow-lg shadow-indigo-500/20 w-auto'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : event ? (
                'Save Changes'
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
