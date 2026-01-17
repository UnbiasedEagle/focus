'use server';

import { db } from '@/server/db';
import { journalEntries } from '@/server/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getJournalEntryByDate(date: Date) {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Normalize date to start of day for lookup
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await db.query.journalEntries.findFirst({
    where: and(
      eq(journalEntries.userId, session.user.id),
      sql`date >= ${startOfDay} AND date <= ${endOfDay}`
    ),
  });
}

import { JournalEntrySchema } from '@/lib/schemas';
import { z } from 'zod';

export async function upsertJournalEntry(
  content: string,
  date: Date = new Date()
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const validated = JournalEntrySchema.safeParse({ content, date });
  if (!validated.success)
    throw new Error((validated.error as any).errors[0].message);

  const existing = await getJournalEntryByDate(date);

  if (existing) {
    await db
      .update(journalEntries)
      .set({ content, date: new Date() }) // Update timestamp to now or keep original? Keep original day usually.
      .where(eq(journalEntries.id, existing.id));
  } else {
    await db.insert(journalEntries).values({
      userId: session.user.id,
      content,
      date: date,
    });
  }

  revalidatePath('/dashboard/journal');
}

export async function getRecentJournalEntries(limit = 30) {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await db.query.journalEntries.findMany({
    where: eq(journalEntries.userId, session.user.id),
    limit,
    orderBy: [desc(journalEntries.date)],
  });
}
