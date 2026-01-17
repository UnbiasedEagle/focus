'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  LayoutDashboard,
  Kanban,
  Timer,
  BookText,
  Calendar,
  ExternalLink,
  Zap,
} from 'lucide-react';

const demos = [
  {
    title: 'Unified Dashboard',
    description:
      "A bird's-eye view of your productivity. Track your daily focus, upcoming events, and top priorities in one place.",
    image: '/landing/images/dashboard-main.png',
    icon: LayoutDashboard,
    color: 'blue',
    delay: 0.1,
  },
  {
    title: 'Visual Kanban',
    description:
      'Manage projects with ease. Drag and drop tasks across customizable columns to keep your workflow moving.',
    image: '/landing/images/kanban-board.png',
    icon: Kanban,
    color: 'purple',
    delay: 0.2,
  },
  {
    title: 'Habit Tracker',
    description:
      'Build consistency with streaks and heatmaps. Visualize your progress and make success a daily routine.',
    image: '/landing/images/habit-tracker.png',
    icon: Zap,
    color: 'indigo',
    delay: 0.25,
  },
  {
    title: 'Deep Work Timer',
    description:
      'Master your time using the Pomodoro technique. Integrated with your tasks to track exactly where your time goes.',
    image: '/landing/images/pomodoro-timer.png',
    icon: Timer,
    color: 'orange',
    delay: 0.3,
  },
  {
    title: 'Mindful Journal',
    description:
      'Clear your mind and track your thoughts. A calm space for daily reflection and long-term memory.',
    image: '/landing/images/journal-entries.png',
    icon: BookText,
    color: 'emerald',
    delay: 0.4,
  },
  {
    title: 'Smart Schedule',
    description:
      'Never miss a beat. Plan your days and weeks with a clean, integrated calendar designed for clarity.',
    image: '/landing/images/calendar-schedule.png',
    icon: Calendar,
    color: 'rose',
    delay: 0.5,
  },
];

const colorVariants = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'group-hover:border-blue-500/20',
    shadow: 'group-hover:shadow-blue-500/10',
    accent: 'bg-blue-500',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-500',
    border: 'group-hover:border-purple-500/20',
    shadow: 'group-hover:shadow-purple-500/10',
    accent: 'bg-purple-500',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    border: 'group-hover:border-orange-500/20',
    shadow: 'group-hover:shadow-orange-500/10',
    accent: 'bg-orange-500',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'group-hover:border-emerald-500/20',
    shadow: 'group-hover:shadow-emerald-500/10',
    accent: 'bg-emerald-500',
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-500',
    border: 'group-hover:border-rose-500/20',
    shadow: 'group-hover:shadow-rose-500/10',
    accent: 'bg-rose-500',
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-500',
    border: 'group-hover:border-indigo-500/20',
    shadow: 'group-hover:shadow-indigo-500/10',
    accent: 'bg-indigo-500',
  },
};

export function DemoSection() {
  return (
    <section className='py-24 bg-background' id='demo'>
      <div className='container px-4 mx-auto'>
        <div className='max-w-3xl mb-16'>
          <h2 className='text-3xl font-bold tracking-tight mb-4'>
            Experience Focus
          </h2>
          <p className='text-lg text-muted-foreground leading-relaxed'>
            A streamlined approach to productivity. No clutter, just the tools
            you need to stay in the zone.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
          {demos.map((demo) => (
            <div
              key={demo.title}
              className='group flex flex-col h-full rounded-lg border bg-card/50 overflow-hidden transition-colors hover:bg-card hover:border-border/80'
            >
              <div className='aspect-video relative overflow-hidden bg-muted/30 border-b'>
                <Image
                  src={demo.image}
                  alt={demo.title}
                  fill
                  className='object-cover'
                  priority={false}
                />
              </div>

              <div className='p-6 flex flex-col flex-1'>
                <div className='flex items-center gap-2.5 mb-3'>
                  <demo.icon className='w-4 h-4 text-primary' />
                  <h3 className='font-semibold text-lg tracking-tight'>
                    {demo.title}
                  </h3>
                </div>

                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {demo.description}
                </p>
              </div>
            </div>
          ))}

          <div className='relative group flex flex-col h-full rounded-xl border border-dashed border-muted-foreground/20 p-8 items-center justify-center text-center bg-muted/5 transition-all hover:bg-muted/10 hover:border-muted-foreground/30'>
            {/* Subtle technical background effect */}
            <div
              className='absolute inset-0 opacity-[0.02] pointer-events-none'
              style={{
                backgroundImage:
                  'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '12px 12px',
              }}
            />

            <div className='relative z-10'>
              <div className='mb-4 inline-flex items-center justify-center'>
                <div className='w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors duration-500'>
                  <LayoutDashboard className='w-5 h-5' />
                </div>
              </div>

              <h3 className='font-bold text-base mb-2 tracking-tight'>
                Continuous Updates
              </h3>

              <p className='text-sm text-muted-foreground max-w-[220px] leading-relaxed mx-auto'>
                We are constantly adding new tools to help you stay in the zone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
