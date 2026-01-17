'use client';

import { motion } from 'framer-motion';

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className='hidden lg:block lg:flex-1 relative w-full max-w-[700px] aspect-16/10 mx-auto'
    >
      {/* Background Ambience - Very Subtle */}
      <div className='absolute inset-0 bg-linear-to-tr from-indigo-50/50 to-white/0 rounded-3xl -z-10' />

      {/* Main SVG Composition */}
      <svg
        viewBox='0 0 800 500'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='w-full h-full drop-shadow-xl'
      >
        {/* --- MAC WINDOW FRAME (Clean & White) --- */}
        <g>
          <rect
            x='20'
            y='20'
            width='760'
            height='460'
            rx='12'
            className='fill-white'
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.04))' }}
          />
          <rect
            x='20'
            y='20'
            width='760'
            height='460'
            rx='12'
            className='stroke-zinc-100'
            strokeWidth='1'
          />
          {/* Traffic Lights - Muted */}
          <circle cx='46' cy='46' r='5' fill='#ff5f57' opacity='0.8' />
          <circle cx='64' cy='46' r='5' fill='#ffbd2e' opacity='0.8' />
          <circle cx='82' cy='46' r='5' fill='#28c840' opacity='0.8' />

          {/* Minimal Separator */}
          <line
            x1='120'
            y1='20'
            x2='120'
            y2='480'
            className='stroke-zinc-50'
            strokeWidth='1'
          />
        </g>

        {/* --- SIDEBAR (Minimalist) --- */}
        <g transform='translate(50, 90)'>
          <rect width='20' height='20' rx='4' className='fill-indigo-500' />

          <g transform='translate(0, 50)'>
            <rect width='40' height='6' rx='3' className='fill-zinc-200' />
            <rect
              width='30'
              height='6'
              rx='3'
              y='20'
              className='fill-zinc-100'
            />
            <rect
              width='35'
              height='6'
              rx='3'
              y='40'
              className='fill-zinc-100'
            />
            <rect
              width='25'
              height='6'
              rx='3'
              y='60'
              className='fill-zinc-100'
            />
          </g>
        </g>

        {/* --- MAIN CONTENT (Modern Grid) --- */}
        <g transform='translate(150, 80)'>
          {/* Header */}
          <text
            x='0'
            y='10'
            className='fill-zinc-500 font-sans text-lg font-bold tracking-tight'
          >
            Dashboard
          </text>
          <text x='0' y='30' className='fill-zinc-400 font-sans text-xs'>
            Overview
          </text>

          {/* Card 1: FOCUS TIMER (The Anchor) */}
          <g transform='translate(0, 50)'>
            <rect
              width='240'
              height='140'
              rx='12'
              className='fill-white stroke-zinc-100'
            />

            {/* Simple Ring */}
            <circle
              cx='50'
              cy='70'
              r='30'
              className='stroke-indigo-100'
              strokeWidth='4'
            />
            <path
              d='M 50 40 A 30 30 0 1 1 28 89'
              className='stroke-indigo-500'
              strokeWidth='4'
              strokeLinecap='round'
            />

            <g transform='translate(100, 50)'>
              <text
                x='0'
                y='10'
                className='fill-indigo-600 font-sans text-2xl font-bold tracking-tight'
              >
                25:00
              </text>
              <text
                x='0'
                y='30'
                className='fill-zinc-400 font-sans text-[10px] font-bold uppercase tracking-wider'
              >
                Focus Mode
              </text>
              <rect
                y='45'
                width='60'
                height='6'
                rx='3'
                className='fill-zinc-100'
              />
            </g>
          </g>

          {/* Card 2: TASKS (List View) */}
          <g transform='translate(260, 50)'>
            <rect
              width='300'
              height='140'
              rx='12'
              className='fill-white stroke-zinc-100'
            />

            <g transform='translate(20, 20)'>
              <text
                x='0'
                y='10'
                className='fill-zinc-400 font-sans text-[10px] font-bold uppercase tracking-wider'
              >
                Tasks
              </text>

              <g transform='translate(0, 30)'>
                <circle
                  cx='8'
                  cy='8'
                  r='8'
                  className='stroke-zinc-200'
                  strokeWidth='1.5'
                />
                <rect
                  x='25'
                  y='5'
                  width='120'
                  height='6'
                  rx='3'
                  className='fill-zinc-400'
                />
                <rect
                  x='200'
                  y='5'
                  width='40'
                  height='6'
                  rx='3'
                  className='fill-orange-100'
                />
              </g>
              <g transform='translate(0, 60)'>
                <circle cx='8' cy='8' r='8' className='fill-indigo-500' />
                <path
                  d='M5 8 l2 2 l4 -4'
                  className='stroke-white'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <rect
                  x='25'
                  y='5'
                  width='100'
                  height='6'
                  rx='3'
                  className='fill-zinc-300'
                />
                <rect
                  x='200'
                  y='5'
                  width='40'
                  height='6'
                  rx='3'
                  className='fill-emerald-100'
                />
              </g>
              <g transform='translate(0, 90)'>
                <circle
                  cx='8'
                  cy='8'
                  r='8'
                  className='stroke-zinc-200'
                  strokeWidth='1.5'
                />
                <rect
                  x='25'
                  y='5'
                  width='140'
                  height='6'
                  rx='3'
                  className='fill-zinc-400'
                />
              </g>
            </g>
          </g>

          {/* Card 3: HABITS (Clean Row) */}
          <g transform='translate(0, 210)'>
            <rect
              width='560'
              height='100'
              rx='12'
              className='fill-white stroke-zinc-100'
            />

            <g transform='translate(20, 35)'>
              {/* SVG Shapes for Habits */}
              <circle
                cx='15'
                cy='15'
                r='15'
                className='fill-emerald-500'
                opacity='0.1'
              />
              <path
                d='M10 15 l3 3 l7 -7'
                className='stroke-emerald-500'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <rect
                x='45'
                y='5'
                width='80'
                height='8'
                rx='4'
                className='fill-zinc-400'
              />
              <rect
                x='45'
                y='20'
                width='120'
                height='6'
                rx='3'
                className='fill-zinc-300'
              />

              {/* Heatmap Row */}
              <g transform='translate(350, 5)'>
                <rect
                  width='6'
                  height='20'
                  rx='3'
                  x='0'
                  className='fill-zinc-200'
                />
                <rect
                  width='6'
                  height='20'
                  rx='3'
                  x='12'
                  className='fill-emerald-400'
                />
                <rect
                  width='6'
                  height='20'
                  rx='3'
                  x='24'
                  className='fill-emerald-500'
                />
                <rect
                  width='6'
                  height='20'
                  rx='3'
                  x='36'
                  className='fill-emerald-300'
                />
                <rect
                  width='6'
                  height='20'
                  rx='3'
                  x='48'
                  className='fill-emerald-500'
                />
                <rect
                  width='6'
                  height='20'
                  rx='3'
                  x='60'
                  className='fill-emerald-400'
                />
                <rect
                  width='6'
                  height='20'
                  rx='3'
                  x='72'
                  className='fill-zinc-100'
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </motion.div>
  );
}
