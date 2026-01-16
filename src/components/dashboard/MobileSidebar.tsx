'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Zap, Menu, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { sidebarItems } from './Sidebar';

export function MobileSidebar() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden mr-2'>
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-[300px] p-0 gap-0'>
        <SheetHeader className='h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800 text-left justify-start flex-row space-y-0'>
          <Link href='/' className='flex items-center gap-3'>
            <div className='h-8 w-8 rounded-lg bg-linear-to-b from-indigo-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 border-t border-white/20'>
              <Zap className='h-5 w-5 fill-current' />
            </div>
            <SheetTitle className='font-bold text-lg tracking-tight text-foreground'>
              Focus
            </SheetTitle>
          </Link>
        </SheetHeader>

        <div className='flex flex-col h-[calc(100vh-64px)]'>
          <nav className='flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar'>
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group font-medium text-sm',
                      isActive
                        ? 'bg-linear-to-b from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 border-t border-white/10'
                        : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground'
                    )}
                  >
                    <item.icon className='h-5 w-5 shrink-0' />
                    {item.label}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          <div className='px-4 pb-4'>
            <a
              href='mailto:devsaurabhsingh@gmail.com'
              className='block group p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 transition-all hover:border-indigo-500/30'
            >
              <p className='text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1.5 whitespace-nowrap'>
                Developed & Maintained
              </p>
              <p className='text-xs font-bold text-foreground group-hover:text-indigo-500 transition-colors'>
                Saurabh Singh
              </p>
            </a>
          </div>

          <div className='p-4 border-t border-zinc-200 dark:border-zinc-800'>
            <Button
              variant='ghost'
              onClick={() => signOut({ callbackUrl: '/login' })}
              className='w-full flex items-center justify-start gap-3 px-3 py-2 text-zinc-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600'
            >
              <LogOut className='h-5 w-5 shrink-0' />
              <span className='font-bold uppercase tracking-tight text-xs'>
                Sign Out
              </span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
