'use client';

import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className='relative border-t border-border/40 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-xl'>
      <div className='absolute bottom-0 h-px w-full bg-linear-to-r from-transparent via-indigo-500/20 to-transparent' />

      <div className='container mx-auto px-4 py-12 relative max-w-7xl'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='flex flex-col items-center md:items-start gap-3'>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-indigo-500 animate-pulse' />
              <span className='text-xs font-semibold tracking-widest uppercase text-indigo-500/80'>
                Available for opportunities
              </span>
            </div>

            <h3 className='text-2xl font-bold tracking-tight text-foreground'>
              Developed & Maintained by{' '}
              <span className='text-indigo-500'>Saurabh Singh</span>
            </h3>

            <p className='text-muted-foreground max-w-md text-center md:text-left text-sm leading-relaxed'>
              Crafting premium digital experiences with a focus on performance,
              usability, and clean code. Feel free to reach out for
              collaborations.
            </p>
          </div>

          <div className='flex flex-col items-center md:items-end gap-6'>
            <motion.a
              whileHover={{ y: -2 }}
              href='mailto:devsaurabhsingh@gmail.com'
              className='group flex items-center gap-4 px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-border/50 shadow-xs hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-500/30 transition-all'
            >
              <div className='h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300'>
                <Mail className='h-6 w-6' />
              </div>
              <div className='flex flex-col'>
                <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]'>
                  Get in touch
                </span>
                <span className='text-sm font-semibold text-foreground group-hover:text-indigo-500 transition-colors'>
                  devsaurabhsingh@gmail.com
                </span>
              </div>
            </motion.a>

            <div className='flex items-center gap-4'>
              <div className='h-px w-8 bg-border/60' />
              <p className='text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest'>
                © {new Date().getFullYear()} Focus
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
