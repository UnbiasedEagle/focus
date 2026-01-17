import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/server/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { subDays, addDays, startOfDay, addHours } from 'date-fns';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('🌱 Starting seed process...');

  const email = 'saurabh@gmail.com';
  const password = 'test@123';
  const hashedPassword = await hash(password, 12);

  // 1. Cleanup existing user
  console.log('🧹 Cleaning up existing user data...');
  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  if (existingUser) {
    await db.delete(schema.users).where(eq(schema.users.id, existingUser.id));
    console.log('Deleted existing user.');
  }

  // 2. Create User
  console.log('👤 Creating user...');
  const [user] = await db
    .insert(schema.users)
    .values({
      name: 'Saurabh Singh',
      email,
      password: hashedPassword,
      image: 'https://github.com/shadcn.png', // Placeholder avatar
    })
    .returning();

  const userId = user.id;

  // 3. Create Habits
  console.log('⚡ Creating habits...');
  const habitsData = [
    {
      title: 'Deep Work Session',
      description: '2 hours of interrupted focus time.',
      frequency: 'Daily' as const,
      color: 'bg-indigo-500',
      icon: 'Zap',
      startDate: subDays(new Date(), 30),
    },
    {
      title: 'Morning Workout',
      description: 'Gym or Run.',
      frequency: 'Daily' as const,
      color: 'bg-orange-500',
      icon: 'Dumbbell', // Fallback to 'Activity' if Dumbbell not in list, but lucide has it
      startDate: subDays(new Date(), 20),
    },
    {
      title: 'Read Books',
      description: '30 pages of non-fiction.',
      frequency: 'Daily' as const,
      color: 'bg-green-500',
      icon: 'BookOpen',
      startDate: subDays(new Date(), 10),
    },
    {
      title: 'Water Intake',
      description: 'Drink 3L of water.',
      frequency: 'Daily' as const,
      color: 'bg-blue-500',
      icon: 'Droplets',
      startDate: subDays(new Date(), 5),
    },
  ];

  for (const h of habitsData) {
    const [habit] = await db
      .insert(schema.habits)
      .values({ ...h, userId })
      .returning();

    // Create logs for streaks
    // Deep Work: Good streak
    if (h.title.includes('Deep Work')) {
      const logs = [];
      for (let i = 0; i < 15; i++) {
        if (i === 2) continue; // broken streak earlier
        logs.push({
          habitId: habit.id,
          date: subDays(startOfDay(new Date()), i),
        });
      }
      if (logs.length) await db.insert(schema.habitLogs).values(logs);
    }
    // Workout: Alternating
    else if (h.title.includes('Workout')) {
      const logs = [];
      for (let i = 0; i < 10; i += 2) {
        logs.push({
          habitId: habit.id,
          date: subDays(startOfDay(new Date()), i),
        });
      }
      if (logs.length) await db.insert(schema.habitLogs).values(logs);
    }
    // Read: Perfect recent streak
    else if (h.title.includes('Read')) {
      const logs = [];
      for (let i = 0; i < 8; i++) {
        logs.push({
          habitId: habit.id,
          date: subDays(startOfDay(new Date()), i),
        });
      }
      if (logs.length) await db.insert(schema.habitLogs).values(logs);
    }
  }

  // 4. Create Kanban Board
  console.log('📋 Creating kanban board...');
  const [board] = await db
    .insert(schema.boards)
    .values({
      userId,
      name: 'Launch SaaS Product',
    })
    .returning();

  const columnsData = ['Backlog', 'To Do', 'In Progress', 'Done'];
  const columnsMap = new Map();

  for (let i = 0; i < columnsData.length; i++) {
    const [col] = await db
      .insert(schema.columns)
      .values({
        boardId: board.id,
        title: columnsData[i],
        order: i,
      })
      .returning();
    columnsMap.set(columnsData[i], col.id);
  }

  // Tasks
  const tasksData = [
    {
      title: 'Analyze Competitors',
      column: 'Backlog',
      priority: 'Low',
      description: 'Check pricing and features of top 3 competitors.',
    },
    {
      title: 'Draft Marketing Copy',
      column: 'Backlog',
      priority: 'Medium',
    },
    {
      title: 'Setup CI/CD Pipeline',
      column: 'To Do',
      priority: 'High',
      tags: ['DevOps', 'Infra'],
    },
    {
      title: 'Design Logo Doodles',
      column: 'To Do',
      priority: 'Low',
      tags: ['Design'],
    },
    {
      title: 'Implement Auth Flow',
      column: 'In Progress',
      priority: 'High',
      description: 'Using NextAuth v5 and Drizzle adapter.',
      tags: ['Backend', 'Security'],
    },
    {
      title: 'Create Landing Page',
      column: 'In Progress',
      priority: 'Medium',
      tags: ['Frontend', 'Marketing'],
    },
    {
      title: 'Initialize Repository',
      column: 'Done',
      priority: 'High',
      completedAt: subDays(new Date(), 2),
    },
    {
      title: 'Project Kickoff',
      column: 'Done',
      priority: 'Medium',
      completedAt: subDays(new Date(), 5),
    },
  ];

  let authTask = null; // Save for Pomodoro linking

  for (let i = 0; i < tasksData.length; i++) {
    const t = tasksData[i];
    const [task] = await db
      .insert(schema.tasks)
      .values({
        columnId: columnsMap.get(t.column),
        title: t.title,
        description: t.description,
        priority: t.priority as any,
        tags: t.tags || [],
        order: i,
        completedAt: t.completedAt,
      })
      .returning();

    if (t.title.includes('Auth Flow')) authTask = task;
  }

  // 5. Pomodoro Sessions
  console.log('🍅 Creating pomodoro sessions...');
  if (authTask) {
    await db.insert(schema.pomodoroSessions).values([
      {
        userId,
        taskId: authTask.id,
        duration: 25 * 60, // 25 min
        startedAt: subDays(new Date(), 0), // Today
      },
      {
        userId,
        taskId: authTask.id,
        duration: 25 * 60,
        startedAt: addHours(subDays(new Date(), 0), -1), // Today earlier
      },
      {
        userId,
        taskId: authTask.id,
        duration: 25 * 60,
        startedAt: subDays(new Date(), 1), // Yesterday
      },
    ]);
  }

  // 6. Journal Entries
  console.log('📖 Creating journal entries...');
  await db.insert(schema.journalEntries).values([
    {
      userId,
      date: startOfDay(new Date()),
      content:
        '# Productive Day\n\nReally felt in the **zone** today while working on the Auth module. The new habits feature is looking great.\n\nWins:\n- Fixed the login bug\n- Drank 3L water\n- No distractions for 2 hours\n\nMust do tomorrow: Finish the landing page hero section.',
    },
    {
      userId,
      date: subDays(startOfDay(new Date()), 1),
      content:
        'A bit slow start to the morning, but picked up pace after lunch. Need to fix my sleep schedule.',
    },
  ]);

  // 7. Schedule Events
  console.log('📅 Creating schedule events...');
  const today = startOfDay(new Date());
  await db.insert(schema.events).values([
    {
      userId,
      title: 'Team Sync',
      start: addHours(today, 10),
      end: addHours(today, 11),
      description: 'Weekly sync with design and dev team.',
    },
    {
      userId,
      title: 'Deep Work Block',
      start: addHours(today, 14),
      end: addHours(today, 16),
      description: 'No meetings, just code.',
      location: 'Home Office',
    },
    {
      userId,
      title: 'Product Demo',
      start: addHours(addDays(today, 2), 15),
      end: addHours(addDays(today, 2), 16),
      description: 'Demo to stakeholders.',
    },
  ]);

  console.log('✅ Seed completed successfully!');
  console.log('📧 Email: saurabh@gmail.com');
  console.log('🔑 Password: test@123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
