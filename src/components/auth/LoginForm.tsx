'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/actions/auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { LoginSchema, type LoginInput } from '@/lib/schemas';

export function LoginForm() {
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setGlobalError(null);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    try {
      await login(formData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Invalid credentials';

      if (errorMessage.includes('NEXT_REDIRECT')) {
        return;
      }

      setGlobalError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full space-y-8'
    >
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='text-sm text-muted-foreground'>
          Enter your email to sign in to your account
        </p>
      </div>

      <div className='grid gap-6'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label
                htmlFor='email'
                className='text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1'
              >
                Email
              </Label>
              <Input
                id='email'
                placeholder='name@example.com'
                type='email'
                disabled={isSubmitting}
                className={`h-11 bg-background border-zinc-200 dark:border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 rounded-lg transition-all shadow-sm ${
                  errors.email ? 'border-red-500 focus:border-red-500' : ''
                }`}
                {...register('email')}
              />
              {errors.email && (
                <p className='text-xs text-red-500 font-medium ml-1'>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center justify-between'>
                <Label
                  htmlFor='password'
                  title='password'
                  className='text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1'
                >
                  Password
                </Label>
              </div>
              <Input
                id='password'
                placeholder='••••••••'
                type='password'
                disabled={isSubmitting}
                className={`h-11 bg-background border-zinc-200 dark:border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 rounded-lg transition-all shadow-sm ${
                  errors.password ? 'border-red-500 focus:border-red-500' : ''
                }`}
                {...register('password')}
              />
              {errors.password && (
                <p className='text-xs text-red-500 font-medium ml-1'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <AnimatePresence mode='wait'>
              {globalError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='text-[13px] font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2.5 rounded-lg border border-red-100 dark:border-red-900/30'
                >
                  {globalError}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              className='mt-2 h-11 w-full font-bold'
              variant='indigo'
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                'Sign In with Email'
              )}
            </Button>
          </div>
        </form>
      </div>

      <p className='text-center text-sm text-muted-foreground'>
        Don&apos;t have an account?{' '}
        <Link
          href='/signup'
          className='underline underline-offset-4 hover:text-indigo-600 transition-colors font-medium'
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
