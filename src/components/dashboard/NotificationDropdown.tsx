'use client';

import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function NotificationDropdown() {
  const notifications = [
    {
      id: 1,
      title: 'Welcome to Focus',
      desc: 'Start by creating your first task board.',
      time: 'Just now',
      unread: true,
    },
    {
      id: 2,
      title: 'Daily Goal Achieved',
      desc: 'You completed all your planned focus sessions today!',
      time: '2 hours ago',
      unread: false,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='h-10 w-10 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-500 transition-all relative group active:scale-95'>
          <Bell className='h-5 w-5 group-hover:text-indigo-600 transition-colors' />
          <span className='absolute top-3 right-3 h-2 w-2 bg-indigo-600 rounded-full border-2 border-white dark:border-zinc-950' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-80 p-2 rounded-2xl border-white/5 bg-white dark:bg-zinc-950 shadow-2xl'
      >
        <div className='flex items-center justify-between px-3 py-2'>
          <span className='text-xs font-black uppercase tracking-widest text-zinc-400'>
            Notifications
          </span>
          <span className='text-[10px] font-bold text-indigo-500 hover:underline cursor-pointer'>
            Mark all read
          </span>
        </div>
        <DropdownMenuSeparator className='bg-zinc-100 dark:bg-zinc-900 my-1' />
        <div className='max-h-[300px] overflow-y-auto no-scrollbar'>
          {notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className='p-3 cursor-pointer rounded-xl focus:bg-zinc-50 dark:focus:bg-zinc-900 flex flex-col items-start gap-1'
            >
              <div className='flex items-center justify-between w-full'>
                <span
                  className={`text-sm font-bold ${
                    n.unread ? 'text-zinc-950 dark:text-white' : 'text-zinc-500'
                  }`}
                >
                  {n.title}
                </span>
                <span className='text-[10px] text-zinc-400 font-medium'>
                  {n.time}
                </span>
              </div>
              <p className='text-xs text-zinc-500 dark:text-zinc-400 leading-snug'>
                {n.desc}
              </p>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator className='bg-zinc-100 dark:bg-zinc-900 my-1' />
        <div className='px-1 py-1'>
          <button className='w-full py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-indigo-500 transition-colors text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl'>
            View All Activity
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
