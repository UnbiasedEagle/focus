import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  visualSidebar: ReactNode;
  mobileHeader: ReactNode;
}

export function AuthLayout({
  children,
  visualSidebar,
  mobileHeader,
}: AuthLayoutProps) {
  return (
    <div className='flex min-h-screen bg-background selection:bg-indigo-500/10 selection:text-indigo-500 relative overflow-hidden'>
      {/* Dynamic Background for Mobile (Behind everything) */}
      <div className='lg:hidden absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]' />
        <div className='absolute bottom-[-5%] left-[-10%] w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[80px]' />
      </div>

      {/* Desktop Visual Sidebar */}
      {visualSidebar}

      {/* Form Area */}
      <div className='flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10 overflow-hidden'>
        <div className='w-full max-w-[400px]'>
          {/* Mobile Header Branding */}
          {mobileHeader}

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
