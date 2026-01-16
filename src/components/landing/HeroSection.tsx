'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Layout, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroVisual } from '@/components/landing/HeroVisual';

export function HeroSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className='relative h-screen w-full overflow-hidden flex flex-col justify-center py-0'>
      <div className='container px-4 md:px-6 mx-auto h-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16'>
        {/* Left: Content */}
        <div className='lg:flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold border-indigo-200 bg-indigo-50 text-indigo-700 mb-6 uppercase tracking-wider'
          >
            <span className='flex h-1.5 w-1.5 rounded-full bg-indigo-600 mr-2 animate-pulse'></span>
            v1.0 Now Live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 lg:mb-6 leading-[1.1]'
          >
            Focus. Plan. <br className='hidden lg:block' />
            <span className='text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 shadow-indigo-500/10'>
              Execute.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='max-w-xl text-base sm:text-lg text-muted-foreground mb-6 lg:mb-8 text-balance'
          >
            The all-in-one productivity workspace. Kanban boards, Pomodoro
            timers, and Journaling — combined in one calm interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'
          >
            <Button
              asChild
              variant='indigo'
              size='lg'
              className='uppercase tracking-wide'
            >
              <Link href={isLoggedIn ? '/dashboard' : '/signup'}>
                Get Started <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </motion.div>

          {/* Mini Feature List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className='mt-8 lg:mt-12 flex gap-4 lg:gap-6 text-xs sm:text-sm font-medium text-muted-foreground'
          >
            <div className='flex items-center gap-2'>
              <Layout className='h-4 w-4 text-indigo-500' /> Boards
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-orange-500' /> Pomodoro
            </div>
            <div className='flex items-center gap-2'>
              <BookOpen className='h-4 w-4 text-green-500' /> Journal
            </div>
          </motion.div>
        </div>

        {/* Right: Abstract Visual */}
        <HeroVisual />
      </div>
    </section>
  );
}
