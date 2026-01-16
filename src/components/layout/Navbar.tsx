import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';

export async function Navbar() {
  const session = await auth();

  return (
    <header className='fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50'>
      <div className='container mx-auto px-4 sm:px-6 h-14 flex items-center justify-between max-w-7xl'>
        <Link href='/' className='flex items-center gap-3 group'>
          <div className='h-8 w-8 rounded-lg bg-linear-to-b from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 border-t border-white/20 transition-all group-hover:scale-110 group-hover:shadow-indigo-500/30'>
            <Zap className='h-5 w-5 fill-current' />
          </div>
          <span className='font-bold text-lg tracking-tight text-foreground'>
            Focus
          </span>
        </Link>

        <nav className='flex items-center gap-2 sm:gap-4'>
          {session ? (
            <Button
              asChild
              variant='indigo'
              size='sm'
              className='h-9 px-5 uppercase tracking-wide'
            >
              <Link href='/dashboard'>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant='ghost'
                size='sm'
                className='hidden sm:inline-flex h-9 text-zinc-500 hover:text-foreground px-4 uppercase tracking-wide'
              >
                <Link href='/login'>Log in</Link>
              </Button>
              <Button
                asChild
                variant='indigo'
                size='sm'
                className='h-9 px-5 uppercase tracking-wide'
              >
                <Link href='/signup'>Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
