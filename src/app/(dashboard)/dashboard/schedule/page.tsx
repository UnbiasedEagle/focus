import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getEvents } from '@/actions/schedule';
import { ScheduleCalendar } from '@/components/dashboard/schedule/ScheduleCalendar';
import { subYears, addYears } from 'date-fns';

export default async function SchedulePage() {
  const session = await auth();
  if (!session) redirect('/login');

  // Fetch massive range so user can navigate freely without server roundtrips for now
  // In a real app at scale, use URL params for pagination.
  const start = subYears(new Date(), 1);
  const end = addYears(new Date(), 2);

  const events = await getEvents(start, end);

  return (
    <div className='space-y-4 h-full'>
      {/* Removed Header here because Calendar has its own header */}
      <ScheduleCalendar events={events} />
    </div>
  );
}
