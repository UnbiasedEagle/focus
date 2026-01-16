'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register as registerUser, login } from '@/actions/auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { SignupSchema, type SignupInput } from '@/lib/schemas';

export function SignupForm() {
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignupInput) => {
    setGlobalError(null);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);

    try {
      await registerUser(formData);
      await login(formData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong';

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
        <h1 className='text-2xl font-semibold tracking-tight'>
          Create your account
        </h1>
        <p className='text-sm text-muted-foreground'>
          Enter your details to get started with Focus
        </p>
      </div>

      <div className='grid gap-6'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label
                htmlFor='name'
                className='text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1'
              >
                Full Name
              </Label>
              <Input
                id='name'
                placeholder='John Doe'
                type='text'
                disabled={isSubmitting}
                className={`h-11 bg-background border-zinc-200 dark:border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 rounded-lg transition-all shadow-sm font-medium ${
                  errors.name ? 'border-red-500 focus:border-red-500' : ''
                }`}
                {...register('name')}
              />
              {errors.name && (
                <p className='text-xs text-red-500 font-medium ml-1'>
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label
                htmlFor='email'
                className='text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1'
              >
                Work Email
              </Label>
              <Input
                id='email'
                placeholder='name@example.com'
                type='email'
                disabled={isSubmitting}
                className={`h-11 bg-background border-zinc-200 dark:border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 rounded-lg transition-all shadow-sm font-medium ${
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
              <Label
                htmlFor='password'
                title='password'
                className='text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1'
              >
                Password
              </Label>
              <Input
                id='password'
                placeholder='••••••••'
                type='password'
                disabled={isSubmitting}
                className={`h-11 bg-background border-zinc-200 dark:border-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 rounded-lg transition-all shadow-sm font-medium ${
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
                  className='text-[13px] font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2.5 rounded-lg border border-red-100 dark:border-red-900/30'
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
                'Create Account'
              )}
            </Button>
          </div>
        </form>
      </div>

      <p className='text-center text-sm text-muted-foreground'>
        Already have an account?{' '}
        <Link
          href='/login'
          className='underline underline-offset-4 hover:text-indigo-600 transition-colors font-medium'
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
