'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, loginWithGoogle, loginWithGithub } from '@/actions/auth';
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

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-zinc-200 dark:border-zinc-800' />
          </div>
          <div className='relative flex justify-center text-xs font-medium uppercase tracking-widest'>
            <span className='bg-background px-3 text-muted-foreground/60'>
              Or continue with
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type='button'
          disabled={isSubmitting}
          className='relative flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-900 hover:shadow-md hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-400/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:hover:border-zinc-700'
          onClick={() => loginWithGoogle()}
        >
          {isSubmitting ? (
            <Loader2 className='h-4 w-4 animate-spin text-zinc-400' />
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className='h-5 w-5'
                  aria-hidden='true'
                  focusable='false'
                  data-prefix='fab'
                  data-icon='google'
                  role='img'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <path
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    fill='#4285F4'
                  />
                  <path
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    fill='#34A853'
                  />
                  <path
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    fill='#EA4335'
                  />
                </svg>
              </motion.div>
              <span>Continue with Google</span>
            </>
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type='button'
          disabled={isSubmitting}
          className='relative flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-900 hover:shadow-md hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-400/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:hover:border-zinc-700 mt-2'
          onClick={() => loginWithGithub()}
        >
          {isSubmitting ? (
            <Loader2 className='h-4 w-4 animate-spin text-zinc-400' />
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                    clipRule='evenodd'
                  />
                </svg>
              </motion.div>
              <span>Continue with GitHub</span>
            </>
          )}
        </motion.button>
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
