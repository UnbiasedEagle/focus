'use server';

import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

import { SignupSchema, LoginSchema } from '@/lib/schemas';

export async function register(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const validated = SignupSchema.safeParse(data);
  if (!validated.success) {
    throw new Error((validated.error as any).errors[0].message);
  }

  const { email, password, name } = validated.data;

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
  const data = Object.fromEntries(formData.entries());

  const validated = LoginSchema.safeParse(data);
  if (!validated.success) {
    throw new Error((validated.error as any).errors[0].message);
  }

  const { email, password } = validated.data;

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

export async function loginWithGoogle() {
  await signIn('google', { redirectTo: '/' });
}

export async function loginWithGithub() {
  await signIn('github', { redirectTo: '/' });
}
