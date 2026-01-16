'use server';

import { db } from '@/server/db';
import { pomodoroSessions } from '@/server/db/schema';
import { eq, and, desc, isNotNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function startPomodoroSession(taskId?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const [newSession] = await db
    .insert(pomodoroSessions)
    .values({
      userId: session.user.id,
      taskId: taskId || null,
      duration: 0, // Will be updated on completion
      startedAt: new Date(),
    })
    .returning();

  return newSession;
}

export async function completePomodoroSession(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Fetch the session to get the start time
  const [existingSession] = await db
    .select()
    .from(pomodoroSessions)
    .where(
      and(
        eq(pomodoroSessions.id, sessionId),
        eq(pomodoroSessions.userId, session.user.id)
      )
    )
    .limit(1);

  if (!existingSession) {
    throw new Error('Session not found');
  }

  // Calculate actual duration from start time to now
  const now = new Date();
  const durationInSeconds = Math.floor(
    (now.getTime() - existingSession.startedAt.getTime()) / 1000
  );

  await db
    .update(pomodoroSessions)
    .set({
      duration: durationInSeconds,
      completedAt: now,
    })
    .where(
      and(
        eq(pomodoroSessions.id, sessionId),
        eq(pomodoroSessions.userId, session.user.id)
      )
    );

  revalidatePath('/dashboard');
}

export async function abandonPomodoroSession(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Fetch the session to get the start time
  const [existingSession] = await db
    .select()
    .from(pomodoroSessions)
    .where(
      and(
        eq(pomodoroSessions.id, sessionId),
        eq(pomodoroSessions.userId, session.user.id)
      )
    )
    .limit(1);

  if (!existingSession) {
    return; // Session doesn't exist, nothing to abandon
  }

  // Calculate partial duration from start time to now
  const now = new Date();
  const durationInSeconds = Math.floor(
    (now.getTime() - existingSession.startedAt.getTime()) / 1000
  );

  // Only update if there was meaningful progress (at least 1 minute)
  if (durationInSeconds >= 60) {
    await db
      .update(pomodoroSessions)
      .set({
        duration: durationInSeconds,
        completedAt: now,
      })
      .where(
        and(
          eq(pomodoroSessions.id, sessionId),
          eq(pomodoroSessions.userId, session.user.id)
        )
      );
  } else {
    // Delete sessions shorter than 1 minute
    await db
      .delete(pomodoroSessions)
      .where(
        and(
          eq(pomodoroSessions.id, sessionId),
          eq(pomodoroSessions.userId, session.user.id)
        )
      );
  }

  revalidatePath('/dashboard');
}

export async function getRecentSessions(limit = 10) {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await db.query.pomodoroSessions.findMany({
    where: and(
      eq(pomodoroSessions.userId, session.user.id),
      isNotNull(pomodoroSessions.completedAt)
    ),
    limit,
    orderBy: [desc(pomodoroSessions.startedAt)],
    with: {
      task: true,
    },
  });
}
