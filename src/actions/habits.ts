'use server';

import { auth } from '@/auth';
import { db } from '@/server/db';
import { habits, habitLogs } from '@/server/db/schema';
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { HabitSchema } from '@/lib/schemas';
import { z } from 'zod';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  isSameDay,
} from 'date-fns';

export async function createHabit(data: z.infer<typeof HabitSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const validated = HabitSchema.safeParse(data);
  if (!validated.success) {
    throw new Error('Invalid data');
  }

  const { title, description, frequency, icon, color, startDate } =
    validated.data;

  await db.insert(habits).values({
    userId: session.user.id,
    title,
    description,
    frequency,
    icon,
    color,
    startDate: startDate || new Date(),
  });

  revalidatePath('/dashboard');
}

export async function updateHabit(
  id: string,
  data: Partial<z.infer<typeof HabitSchema>>
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const validated = HabitSchema.partial().safeParse(data);
  if (!validated.success) {
    throw new Error('Invalid data');
  }

  await db
    .update(habits)
    .set({
      ...validated.data,
      updatedAt: new Date(),
    })
    .where(and(eq(habits.id, id), eq(habits.userId, session.user.id)));

  revalidatePath('/dashboard');
}

export async function deleteHabit(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await db
    .delete(habits)
    .where(and(eq(habits.id, id), eq(habits.userId, session.user.id)));

  revalidatePath('/dashboard');
}

export async function logHabit(habitId: string, date: Date = new Date()) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Verify ownership
  const habit = await db.query.habits.findFirst({
    where: and(eq(habits.id, habitId), eq(habits.userId, session.user.id)),
  });

  if (!habit) throw new Error('Habit not found');

  const logDate = startOfDay(date);

  // Check if already logged for this date
  const existingLog = await db.query.habitLogs.findFirst({
    where: and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, logDate)),
  });

  if (existingLog) {
    // Toggle off: delete the log
    await db.delete(habitLogs).where(eq(habitLogs.id, existingLog.id));
  } else {
    // Toggle on: create the log
    await db.insert(habitLogs).values({
      habitId,
      date: logDate,
    });
  }

  revalidatePath('/dashboard');
}

export async function getHabits() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, session.user.id),
    orderBy: [desc(habits.createdAt)],
    with: {
      logs: true, // We fetch logs to calculate completion and streaks client-side or server-side
    },
  });

  // Calculate generic status for "today" or current period for UI display
  // And calculate current streak
  return userHabits.map((habit) => {
    const sortedLogs = habit.logs.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    const today = startOfDay(new Date());

    // Check if completed for current period
    let completed = false;
    if (habit.frequency === 'Daily') {
      completed = sortedLogs.some((l) => isSameDay(l.date, today));
    } else if (habit.frequency === 'Weekly') {
      const start = startOfWeek(today);
      const end = endOfWeek(today);
      completed = sortedLogs.some((l) => l.date >= start && l.date <= end);
    } else if (habit.frequency === 'Monthly') {
      const start = startOfMonth(today);
      const end = endOfMonth(today);
      completed = sortedLogs.some((l) => l.date >= start && l.date <= end);
    }

    // Calculate Streak (Simple Daily Streak implementation for now)
    // For Weekly/Monthly, streak calculation is more complex, we might simplify to just "times completed" or consecutive periods
    // For now, let's implement true Daily streak, and count for others.

    let streak = 0;
    if (habit.frequency === 'Daily') {
      streak = calculateDailyStreak(sortedLogs.map((l) => l.date));
    } else {
      // For non-daily, just return total completions for now or 0
      streak = sortedLogs.length;
    }

    return {
      ...habit,
      completed,
      streak,
      logs: sortedLogs, // Return sorted logs for heatmaps
    };
  });
}

function calculateDailyStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);
  const sortedDates = dates
    .map((d) => startOfDay(d))
    .sort((a, b) => b.getTime() - a.getTime());

  // Check if the streak is alive (completed today or yesterday)
  const lastCompletion = sortedDates[0];
  if (!lastCompletion) return 0;

  if (
    !isSameDay(lastCompletion, today) &&
    !isSameDay(lastCompletion, yesterday)
  ) {
    return 0;
  }

  let streak = 1;
  let currentDate = lastCompletion;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = sortedDates[i];
    const expectedDate = subDays(currentDate, 1);

    if (isSameDay(prevDate, expectedDate)) {
      streak++;
      currentDate = prevDate;
    } else if (isSameDay(prevDate, currentDate)) {
      // Duplicate log for same day, ignore
      continue;
    } else {
      // Gap found
      break;
    }
  }

  return streak;
}
