'use server';

import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = (formData.get('name') as string) || 'User';

  if (!email || !password) {
    throw new Error('Missing email or password');
  }

  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hash(password, 10);

  await db.insert(users).values({
    email,
    password: hashedPassword,
    name,
    emailVerified: new Date(),
  });
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Missing credentials');
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          throw new Error('Invalid email or password');
        default:
          throw error;
      }
    }
    throw error;
  }
}
