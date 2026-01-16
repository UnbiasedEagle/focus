'use server';

import { db } from '@/server/db';
import {
  pomodoroSessions,
  journalEntries,
  tasks,
  boards,
} from '@/server/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { auth } from '@/auth';
import { startOfDay, subDays, isSameDay } from 'date-fns';

export async function getProductivityStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  // 1. Get total tasks completed (assuming we use a board-based check)
  const userBoard = await db.query.boards.findFirst({
    where: eq(boards.userId, userId),
    with: {
      columns: {
        with: {
          tasks: true,
        },
      },
    },
  });

  const allTasks = userBoard?.columns.flatMap((c) => c.tasks) || [];
  const completedTasksCount = allTasks.filter(
    (t) => t.columnId === 'done' || t.completedAt !== null
  ).length;

  // 2. Get total focus time (Pomodoros)
  const totalFocusSessions = await db.query.pomodoroSessions.findMany({
    where: eq(pomodoroSessions.userId, userId),
  });
  const totalFocusSeconds = totalFocusSessions.reduce(
    (acc, s) => acc + (s.duration || 0),
    0
  );

  // 3. Calculate Streak
  // We need all activity dates
  const pDates = totalFocusSessions.map((s) =>
    startOfDay(new Date(s.startedAt))
  );
  const jEntries = await db.query.journalEntries.findMany({
    where: eq(journalEntries.userId, userId),
  });
  const jDates = jEntries.map((e) => startOfDay(new Date(e.date)));

  // Combine and de-duplicate dates
  const allActivityDates = [
    ...new Set([...pDates, ...jDates].map((d) => d.getTime())),
  ]
    .map((t) => new Date(t))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  if (allActivityDates.length > 0) {
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);

    // If most recent is today or yesterday, we can have a streak
    let checkDate = isSameDay(allActivityDates[0], today)
      ? today
      : isSameDay(allActivityDates[0], yesterday)
      ? yesterday
      : null;

    if (checkDate) {
      for (let i = 0; i < allActivityDates.length; i++) {
        const activityDate = allActivityDates[i];
        if (isSameDay(activityDate, checkDate)) {
          streak++;
          checkDate = subDays(checkDate, 1);
        } else if (activityDate > checkDate) {
          // Skip if we find a date in the future (shouldn't happen with sorted list, but safe)
          continue;
        } else {
          // Found a gap
          break;
        }
      }
    }
  }

  return {
    completedTasks: completedTasksCount,
    focusHours: (totalFocusSeconds / 3600).toFixed(1),
    streak,
    totalSessions: totalFocusSessions.length,
  };
}
