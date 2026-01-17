import { Sidebar, DashboardHeader } from '@/components/dashboard';
import { motion } from 'framer-motion';
import { GlobalTimerWidget } from '@/components/dashboard/pomodoro/GlobalTimerWidget';
import { GlobalPomodoroTimer } from '@/components/dashboard/pomodoro/GlobalPomodoroTimer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen bg-zinc-50/50 dark:bg-zinc-950 overflow-hidden'>
      <Sidebar />
      <div className='flex-1 flex flex-col relative overflow-hidden min-w-0'>
        <DashboardHeader />
        <main className='flex-1 overflow-hidden p-4 sm:p-6'>
          <div className='max-w-7xl mx-auto h-full overflow-y-auto no-scrollbar'>
            {children}
          </div>
        </main>
        <GlobalPomodoroTimer />
        <GlobalTimerWidget />
      </div>
    </div>
  );
}
