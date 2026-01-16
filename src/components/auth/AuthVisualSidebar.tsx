import Link from 'next/link';
import { Zap, Sparkles, LucideIcon } from 'lucide-react';

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface AuthVisualSidebarProps {
  badgeText: string;
  title: React.ReactNode;
  description: string;
  features: FeatureItem[];
  footerText: string;
}

export function AuthVisualSidebar({
  badgeText,
  title,
  description,
  features,
  footerText,
}: AuthVisualSidebarProps) {
  return (
    <div className='hidden lg:flex w-[45%] relative overflow-hidden bg-zinc-950 flex-col p-12 justify-between border-r border-white/5'>
      {/* Animated Background blobs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse' />
        <div className='absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] transition-all' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]' />
      </div>

      {/* Logo */}
      <Link
        href='/'
        className='relative z-10 flex items-center gap-2 group w-fit'
      >
        <div className='h-9 w-9 rounded-lg bg-linear-to-b from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 border-t border-white/20 group-hover:scale-105 transition-transform duration-300'>
          <Zap className='h-5 w-5 fill-current' />
        </div>
        <span className='text-lg font-bold tracking-tight text-white antialiased'>
          Focus
        </span>
      </Link>

      {/* Hero content */}
      <div className='relative z-10'>
        <div className='mb-12'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6'>
            <Sparkles className='h-3 w-3' />
            {badgeText}
          </div>
          <h1 className='text-5xl font-extrabold text-white tracking-tighter leading-[1.05] text-balance mb-6'>
            {title}
          </h1>
          <p className='text-zinc-400 text-lg font-medium max-w-sm leading-relaxed antialiased'>
            {description}
          </p>
        </div>

        {/* Features List */}
        <div className='space-y-4'>
          {features.map((item, i) => (
            <div
              key={i}
              className='flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-default'
            >
              <div className='h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform'>
                <item.icon className='h-5 w-5 text-indigo-400' />
              </div>
              <div>
                <h3 className='text-white text-sm font-bold tracking-tight'>
                  {item.title}
                </h3>
                <p className='text-zinc-500 text-xs font-medium'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer text */}
      <div className='relative z-10 flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase'>
        <div className='h-px w-6 bg-zinc-800' />
        {footerText}
      </div>
    </div>
  );
}
