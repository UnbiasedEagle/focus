'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: CheckSquare, label: 'Kanban Board', href: '/dashboard/kanban' },
  { icon: Timer, label: 'Focus Timer', href: '/dashboard/pomodoro' },
  { icon: BookOpen, label: 'Daily Journal', href: '/dashboard/journal' },
  { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'relative h-screen bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-40 hidden md:flex flex-col'
      )}
    >
      {/* Brand Header */}
      <div className='h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden'>
        <Link href='/' className='flex items-center gap-3'>
          <div className='h-8 w-8 rounded-lg bg-linear-to-b from-indigo-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 border-t border-white/20'>
            <Zap className='h-5 w-5 fill-current' />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='font-bold text-lg tracking-tight text-foreground whitespace-nowrap'
              >
                Focus
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar'>
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group overflow-hidden relative',
                isActive
                  ? 'bg-linear-to-b from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 border-t border-white/10'
                  : 'text-zinc-500 hover:bg-white dark:hover:bg-zinc-900 hover:text-foreground'
              )}
            >
              <item.icon className='h-5 w-5 shrink-0' />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='font-bold text-sm tracking-tight'
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle */}
      <div className='p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2'>
        {!isCollapsed && (
          <div className='px-4 pb-2'>
            <a
              href='mailto:devsaurabhsingh@gmail.com'
              className='block group p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 transition-all hover:border-indigo-500/30'
            >
              <p className='text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] leading-none mb-1.5'>
                Developer
              </p>
              <p className='text-xs font-bold text-foreground group-hover:text-indigo-500 transition-colors'>
                Saurabh Singh
              </p>
            </a>
          </div>
        )}

        <Button
          variant='ghost'
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={cn(
            'w-full flex items-center gap-3 text-zinc-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600',
            isCollapsed ? 'justify-center px-2' : 'justify-start px-4'
          )}
        >
          <LogOut className='h-5 w-5 shrink-0' />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='font-bold uppercase tracking-tight text-xs'
            >
              Sign Out
            </motion.span>
          )}
        </Button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='w-full flex items-center justify-center p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-foreground transition-all'
        >
          {isCollapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <div className='flex items-center gap-2'>
              <ChevronLeft className='h-4 w-4' />
              <span className='text-[10px] font-bold uppercase tracking-[0.2em]'>
                Collapse
              </span>
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
