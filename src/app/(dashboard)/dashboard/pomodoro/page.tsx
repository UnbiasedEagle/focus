import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getInitialBoard } from '@/actions/kanban';
import { getRecentSessions } from '@/actions/pomodoro';
import { PomodoroTimer } from '@/components/dashboard/pomodoro/PomodoroTimer';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export default async function PomodoroPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const board = await getInitialBoard();
  const recentSessions = await getRecentSessions();

  // Extract all tasks from all columns for the selector
  const allTasks =
    board?.columns?.flatMap((col) =>
      col.tasks.map((t) => ({ ...t, columnTitle: col.title }))
    ) || [];

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Focus Timer</h1>
        <p className='text-muted-foreground'>
          Use the Pomodoro technique to stay productive.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
        <div className='lg:col-span-3 space-y-6'>
          <PomodoroTimer tasks={allTasks} />
        </div>

        <div className='lg:col-span-2 space-y-6'>
          <Card className='p-6 focus-visible:ring-0'>
            <h3 className='font-bold text-xs uppercase tracking-widest text-zinc-500 mb-4'>
              Recent Sessions
            </h3>
            <div className='space-y-3 max-h-[250px] overflow-y-auto pr-2'>
              {recentSessions.length === 0 ? (
                <p className='text-xs text-muted-foreground'>
                  No sessions recorded yet.
                </p>
              ) : (
                recentSessions.map((s) => (
                  <div
                    key={s.id}
                    className='group flex items-center justify-between py-3 border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 -mx-2 px-2 rounded-lg transition-colors'
                  >
                    <div className='flex flex-col gap-1 min-w-0'>
                      <span className='font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate'>
                        {s.task?.title || 'General Focus Session'}
                      </span>
                      <span className='text-[10px] text-zinc-400 font-medium'>
                        {formatDistanceToNow(s.startedAt, { addSuffix: true })}
                      </span>
                    </div>
                    <div className='flex flex-col items-end gap-1 shrink-0'>
                      <span className='text-xs font-bold font-mono text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md'>
                        {Math.floor(s.duration / 60)}m
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className='p-5 bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/50'>
            <h3 className='font-bold text-xs text-indigo-900 dark:text-indigo-400 mb-1'>
              Goal: 4 Sessions
            </h3>
            <p className='text-[11px] text-indigo-700/80 dark:text-indigo-400/80 leading-relaxed'>
              Hit your target to keep your 🔥 streak alive!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
