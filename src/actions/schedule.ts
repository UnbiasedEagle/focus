'use server';

import { db } from '@/server/db';
import { events } from '@/server/db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth'; // Keep auth for safe check in getEvents or just use requireUser
import { requireUser } from '@/lib/auth-utils';

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export async function getEvents(start: Date, end: Date) {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await db.query.events.findMany({
    where: and(
      eq(events.userId, session.user.id),
      gte(events.start, start),
      lte(events.end, end)
    ),
    orderBy: [desc(events.start)],
  });
}

import { EventSchema } from '@/lib/schemas';
import { z } from 'zod';

export async function createEvent(data: z.infer<typeof EventSchema>) {
  const user = await requireUser();

  const validated = EventSchema.safeParse(data);
  if (!validated.success)
    throw new Error((validated.error as any).errors[0].message);

  const [newEvent] = await db
    .insert(events)
    .values({
      ...validated.data,
      userId: user.id,
      start: validated.data.start, // Explicitly map to ensure types align if schema was loose
      end: validated.data.end,
    })
    .returning();

  revalidatePath('/dashboard/schedule');
  return newEvent;
}

export async function updateEvent(
  id: string,
  data: Partial<z.infer<typeof EventSchema>>
) {
  const user = await requireUser();

  const validated = EventSchema.partial().safeParse(data);
  if (!validated.success)
    throw new Error((validated.error as any).errors[0].message);

  const [updatedEvent] = await db
    .update(events)
    .set({
      ...validated.data,
      updatedAt: new Date(),
    })
    .where(and(eq(events.id, id), eq(events.userId, user.id)))
    .returning();

  revalidatePath('/dashboard/schedule');
  return updatedEvent;
}

export async function deleteEvent(id: string) {
  const user = await requireUser();

  await db
    .delete(events)
    .where(and(eq(events.id, id), eq(events.userId, user.id)));
  revalidatePath('/dashboard/schedule');
}
