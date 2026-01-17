import { SignupForm } from '@/components/auth/SignupForm';
import { Layout, Clock, BookOpen, Zap } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthVisualSidebar } from '@/components/auth/AuthVisualSidebar';
import { AuthMobileHeader } from '@/components/auth/AuthMobileHeader';

export default function SignupPage() {
  const signupFeatures = [
    {
      icon: Layout,
      title: 'Dynamic Boards',
      desc: 'Native-fast Kanban execution.',
    },
    {
      icon: Zap,
      title: 'Habit Mastery',
      desc: 'Visualize progress with heatmaps.',
    },
    {
      icon: Clock,
      title: 'Contextual Focus',
      desc: 'Integrated deep-work cycles.',
    },
    {
      icon: BookOpen,
      title: 'Mental Clarity',
      desc: 'Structured intention journaling.',
    },
  ];

  return (
    <AuthLayout
      mobileHeader={<AuthMobileHeader badgeText='Peak Performance' />}
      visualSidebar={
        <AuthVisualSidebar
          badgeText='Next Generation Workspace'
          title={
            <>
              Precision tools for <br />
              <span className='text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400'>
                high-output teams.
              </span>
            </>
          }
          description='Experience a focused, unified environment for your most demanding projects.'
          features={signupFeatures}
          footerText='CRAFTED FOR PEAK PERFORMANCE'
        />
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
