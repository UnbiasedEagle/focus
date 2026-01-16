import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  getJournalEntryByDate,
  getRecentJournalEntries,
} from '@/actions/journal';
import { JournalEditor } from '@/components/dashboard/journal/JournalEditor';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

export default async function JournalPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const today = new Date();
  const currentEntry = await getJournalEntryByDate(today);
  const recentEntries = await getRecentJournalEntries();

  return (
    <div className='space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Daily Journal</h1>
          <p className='text-muted-foreground'>
            Reflect on your day, track your wins, and clear your mind.
          </p>
        </div>
        <div className='text-right'>
          <span className='text-sm font-medium text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg'>
            {format(today, 'EEEE, MMMM do')}
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <JournalEditor initialContent={currentEntry?.content || ''} />
        </div>

        <div className='space-y-6'>
          <h3 className='font-semibold text-lg px-1'>Recent Entries</h3>
          <div className='space-y-4'>
            {recentEntries.length <= 1 ? (
              <p className='text-sm text-muted-foreground px-1'>
                Your journal history will appear here.
              </p>
            ) : (
              recentEntries.slice(1).map((entry) => (
                <Card
                  key={entry.id}
                  className='p-4 hover:border-zinc-300 transition-colors cursor-pointer group'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-bold'>
                      {format(entry.date, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground line-clamp-3 leading-relaxed'>
                    {entry.content}
                  </p>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
