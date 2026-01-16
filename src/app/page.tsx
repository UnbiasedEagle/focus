import { auth } from '@/auth';
import { HeroSection } from '@/components/landing/HeroSection';
import { Navbar } from '@/components/layout/Navbar';
import { DemoSection } from '@/components/landing/DemoSection';
import { Footer } from '@/components/layout/Footer';

export default async function Home() {
  const session = await auth();

  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground selection:bg-indigo-500/10 selection:text-indigo-500 relative'>
      <Navbar />
      <main className='flex-1'>
        <HeroSection isLoggedIn={!!session} />
        <DemoSection />
      </main>
      <Footer />
    </div>
  );
}
