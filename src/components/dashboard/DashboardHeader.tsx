'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalNewTaskDialog } from './GlobalNewTaskDialog';
import { NotificationDropdown } from './NotificationDropdown';
import { MobileSidebar } from './MobileSidebar';

export function DashboardHeader() {
  return (
    <header className='h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30'>
      {/* Mobile Menu Trigger (Visible only on mobile) */}
      <MobileSidebar />

      <div className='flex items-center gap-4 flex-1'></div>

      <div className='flex items-center gap-2 sm:gap-3'>
        <GlobalNewTaskDialog
          trigger={
            <Button
              variant='indigo'
              size='sm'
              className='hidden sm:flex gap-2 uppercase'
            >
              <Plus className='h-4 w-4 stroke-3' />
              NEW TASK
            </Button>
          }
        />
      </div>
    </header>
  );
}
