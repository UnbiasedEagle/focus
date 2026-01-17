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
import { startOfDay } from 'date-fns';

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

  return {
    completedTasks: completedTasksCount,
    focusHours: (totalFocusSeconds / 3600).toFixed(1),

    totalSessions: totalFocusSessions.length,
  };
}
