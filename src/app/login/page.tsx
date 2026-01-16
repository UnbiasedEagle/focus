import { LoginForm } from '@/components/auth/LoginForm';
import { Layout, Clock } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthVisualSidebar } from '@/components/auth/AuthVisualSidebar';
import { AuthMobileHeader } from '@/components/auth/AuthMobileHeader';

export default function LoginPage() {
  const loginFeatures = [
    {
      icon: Layout,
      title: 'Structured Boards',
      desc: 'Your tasks, visualized and manageable.',
    },
    {
      icon: Clock,
      title: 'Deep Work Cycles',
      desc: 'Time-box your sessions for maximum output.',
    },
  ];

  return (
    <AuthLayout
      mobileHeader={<AuthMobileHeader badgeText='Focused Execution' />}
      visualSidebar={
        <AuthVisualSidebar
          badgeText='Focused Professional Workspace'
          title={
            <>
              Reclaim your focus, <br />
              <span className='text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400'>
                execute with intent.
              </span>
            </>
          }
          description='Log in to your private workspace and continue your peak productivity cycle.'
          features={loginFeatures}
          footerText='STAY FOCUSED • EXECUTE BETTER'
        />
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
