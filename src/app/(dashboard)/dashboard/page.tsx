import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getProductivityStats } from '@/actions/insights';
import { getInitialBoard } from '@/actions/kanban';
import {
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GlobalNewTaskDialog } from '@/components/dashboard/GlobalNewTaskDialog';
import { getHabits } from '@/actions/habits';
import { Activity } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const stats = await getProductivityStats();
  const board = await getInitialBoard();
  const habits = await getHabits();

  const totalTasks =
    board?.columns?.reduce((acc, col) => acc + (col.tasks?.length || 0), 0) ||
    0;

  return (
    <div className='space-y-8 max-w-6xl mx-auto'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-100 dark:border-zinc-800/50'>
        <div>
          <p className='text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-1'>
            Overview
          </p>
          <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
            Dashboard
          </h1>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-xs font-medium text-zinc-400 dark:text-zinc-500 mr-2'>
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <GlobalNewTaskDialog
            trigger={
              <Button variant='indigo' size='sm' className='gap-2 uppercase'>
                <Plus className='h-4 w-4 stroke-3' />
                NEW TASK
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[
          {
            title: 'Active Tasks',
            value: totalTasks,
            icon: CheckCircle2,
            color: 'text-indigo-600',
          },
          {
            title: 'Focus Hours',
            value: stats?.focusHours || '0.0',
            icon: Clock,
            color: 'text-zinc-900 dark:text-zinc-100',
          },

          {
            title: 'Sessions',
            value: stats?.totalSessions || 0,
            icon: TrendingUp,
            color: 'text-zinc-400',
          },
          {
            title: 'Active Habits',
            value: habits.length,
            icon: Activity,
            color: 'text-indigo-500',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className='p-5 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group'
          >
            <div className='flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                <p className='text-[10px] font-bold uppercase tracking-wider text-zinc-400'>
                  {stat.title}
                </p>
                <stat.icon
                  className={`h-4 w-4 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                />
              </div>
              <h3 className='text-2xl font-bold font-mono tracking-tighter'>
                {stat.value}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Kanban Board Summary (Large) */}
        <Card className='lg:col-span-8 p-6 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-indigo-500' />
              Current Board
            </h2>
            <Link
              href='/dashboard/kanban'
              className='text-[10px] font-black text-zinc-400 hover:text-indigo-600 transition-colors uppercase tracking-widest'
            >
              View Details &rarr;
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {board?.columns?.slice(0, 3).map((col) => (
              <div key={col.id} className='space-y-3'>
                <div className='flex items-center justify-between px-1 border-b border-zinc-50 dark:border-zinc-800/50 pb-2'>
                  <span className='text-[10px] font-bold text-zinc-500 uppercase tracking-widest'>
                    {col.title}
                  </span>
                  <span className='text-[10px] tabular-nums text-zinc-400 font-mono'>
                    {col.tasks?.length || 0}
                  </span>
                </div>
                <div className='space-y-2'>
                  {col.tasks?.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className='p-3 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 truncate hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors'
                    >
                      {task.title}
                    </div>
                  ))}
                  {(!col.tasks || col.tasks.length === 0) && (
                    <div className='h-10 border border-dashed border-zinc-100 dark:border-zinc-800/50 rounded-lg' />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Sidebar Widgets */}
        <div className='lg:col-span-4 space-y-6'>
          {/* Compressed Quick Focus Card */}
          <Card className='p-6 bg-zinc-950 border border-white/5 rounded-[1.5rem] shadow-2xl relative overflow-hidden group'>
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
              <div className='absolute top-[-20%] left-[-20%] w-32 h-32 bg-indigo-600/20 rounded-full blur-[60px] animate-pulse' />
            </div>

            <div className='relative z-10 flex flex-col'>
              <div className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-4 w-fit'>
                <Clock className='h-2.5 w-2.5' />
                Deep Focus
              </div>

              <h3 className='text-2xl font-black text-white tracking-tighter leading-none mb-1.5'>
                Enter the{' '}
                <span className='text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400'>
                  Flow.
                </span>
              </h3>
              <p className='text-zinc-500 text-[10px] font-medium leading-tight mb-5 max-w-[180px]'>
                Silence noise, activate your prime productivity cycle.
              </p>

              <Link href='/dashboard/pomodoro'>
                <Button variant='indigo' size='sm' className='w-full uppercase'>
                  Start Timer
                </Button>
              </Link>
            </div>
          </Card>

          {/* Compressed Daily Thought Card */}
          <Card className='p-6 bg-zinc-950 border border-white/5 rounded-[1.5rem] shadow-sm relative overflow-hidden'>
            <div className='absolute top-[-10%] right-[-10%] w-24 h-24 bg-orange-600/10 rounded-full blur-2xl' />

            <div className='relative z-10'>
              <div className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-orange-400 uppercase tracking-widest mb-4'>
                <TrendingUp className='h-2.5 w-2.5' />
                Daily Spark
              </div>

              <p className='text-base font-bold text-white tracking-tight leading-snug mb-5'>
                &ldquo;What is one thing you&rsquo;re{' '}
                <span className='text-indigo-400'>proud</span> of today?&rdquo;
              </p>

              <Link href='/dashboard/journal'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='w-full group uppercase border border-white/10'
                >
                  <span>Record Entry</span>
                  <ArrowRight className='ml-1.5 h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all' />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
