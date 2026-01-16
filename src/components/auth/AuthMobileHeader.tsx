import Link from 'next/link';
import { Zap } from 'lucide-react';

interface AuthMobileHeaderProps {
  badgeText: string;
}

export function AuthMobileHeader({ badgeText }: AuthMobileHeaderProps) {
  return (
    <div className='lg:hidden mb-10 flex flex-col items-center gap-4'>
      <Link href='/' className='flex items-center gap-2 group'>
        <div className='h-12 w-12 rounded-2xl bg-linear-to-b from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 border-t border-white/20'>
          <Zap className='h-7 w-7 fill-current' />
        </div>
      </Link>
      <div className='text-center space-y-1'>
        <span className='text-xl font-bold tracking-tight text-foreground block'>
          Focus
        </span>
        <span className='text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase py-1 px-3 border border-border rounded-full bg-muted/30'>
          {badgeText}
        </span>
      </div>
    </div>
  );
}
