'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EventDialog } from './EventDialog';
import { type Event } from '@/actions/schedule';

export function ScheduleCalendar({ events }: { events: Event[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function handlePrevMonth() {
    setCurrentDate(subMonths(currentDate, 1));
  }

  function handleNextMonth() {
    setCurrentDate(addMonths(currentDate, 1));
  }

  function handleDateClick(day: Date) {
    setSelectedDate(day);
    setSelectedEvent(undefined);
    setIsDialogOpen(true);
  }

  function handleEventClick(e: React.MouseEvent, event: Event) {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(event.start);
    setIsDialogOpen(true);
  }

  // Filter events for the current view to avoid heavy processing (though filtering per day is fast enough)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h2 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className='flex items-center bg-white dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800 shadow-sm'>
            <Button
              variant='ghost'
              size='icon'
              onClick={handlePrevMonth}
              className='h-7 w-7'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setCurrentDate(new Date())}
              className='h-7 text-xs font-semibold px-2'
            >
              Today
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleNextMonth}
              className='h-7 w-7'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
        <Button
          variant='indigo'
          onClick={() => {
            setSelectedDate(new Date());
            setSelectedEvent(undefined);
            setIsDialogOpen(true);
          }}
        >
          <Plus className='h-4 w-4 mr-2' />
          New Event
        </Button>
      </div>

      <div className='border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg overflow-hidden'>
        {/* Week Day Headers */}
        <div className='grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50'>
          {weekDays.map((day) => (
            <div
              key={day}
              className='py-2 text-center text-[9px] font-bold text-zinc-500 uppercase tracking-widest'
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid - Modern Compact */}
        <div className='grid grid-cols-7 auto-rows-fr'>
          {calendarDays.map((day, dayIdx) => {
            const dayEvents = events.filter((e) =>
              isSameDay(new Date(e.start), day)
            );
            const isSelectedMonth = isSameMonth(day, monthStart);
            const isCurrentDay = isToday(day);

            // Calculate borders manually to avoid double borders
            const isLastRow =
              Math.floor(dayIdx / 7) ===
              Math.floor((calendarDays.length - 1) / 7);
            const isLastCol = (dayIdx + 1) % 7 === 0;

            return (
              <div
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                className={cn(
                  'min-h-[80px] p-1 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer flex flex-col gap-0.5 group relative outline-none',
                  !isLastCol && 'border-r border-zinc-100 dark:border-zinc-800',
                  !isLastRow && 'border-b border-zinc-100 dark:border-zinc-800',
                  !isSelectedMonth &&
                    'bg-zinc-50/30 dark:bg-zinc-950/30 opacity-60'
                )}
              >
                <div className='flex items-center justify-between px-1 pt-0.5 mb-1'>
                  <span
                    className={cn(
                      'text-[10px] font-medium transition-colors',
                      !isSelectedMonth && 'text-zinc-400',
                      isSelectedMonth && 'text-zinc-700 dark:text-zinc-300',
                      isCurrentDay && 'text-indigo-600 font-bold'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  {isCurrentDay && (
                    <div className='h-1.5 w-1.5 rounded-full bg-indigo-600' />
                  )}
                </div>

                {/* Events List - Compact Text Lines */}
                <div className='flex-1 flex flex-col gap-0.5 overflow-hidden'>
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(e, event)}
                      className='px-1 py-0.5 rounded-[2px] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group/event flex items-center gap-1.5'
                    >
                      <div
                        className={cn(
                          'h-1 w-1 rounded-full shrink-0',
                          event.allDay ? 'bg-indigo-400' : 'bg-emerald-400'
                        )}
                      />
                      <span className='text-[9px] font-medium text-zinc-700 dark:text-zinc-300 truncate leading-tight'>
                        {event.title}
                      </span>
                      {!event.allDay && (
                        <span className='hidden group-hover/event:inline text-[8px] text-zinc-400 ml-auto tabular-nums'>
                          {format(new Date(event.start), 'H:mm')}
                        </span>
                      )}
                    </div>
                  ))}
                  {/* Create slot placeholder on hover */}
                  <div className='flex-1 group-hover:block hidden min-h-4' />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDate={selectedDate}
        event={selectedEvent}
        onClose={() => {
          setSelectedEvent(undefined);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
