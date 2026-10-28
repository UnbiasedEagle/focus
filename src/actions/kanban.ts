'use server';

import { db } from '@/server/db';
import { runInTransaction } from '@/server/db/transaction';
import { boards, columns, tasks } from '@/server/db/schema';
import { eq, and, asc, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { requireUser } from '@/lib/auth-utils';

// --- Board Actions ---
export async function getBoard(boardId: string) {
  const user = await requireUser();

  // Verify ownership
  const board = await db.query.boards.findFirst({
    where: and(eq(boards.id, boardId), eq(boards.userId, user.id)),
    with: {
      columns: {
        orderBy: [asc(columns.order)], // Ensure columns are ordered
        with: {
          tasks: {
            orderBy: [asc(tasks.order)], // Ensure tasks are ordered
          },
        },
      },
    },
  });

  return board;
}

export async function getInitialBoard() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Find any board
  let board = await db.query.boards.findFirst({
    where: eq(boards.userId, session.user.id),
  });

  // If no board, create one
  if (!board) {
    const [newBoard] = await db
      .insert(boards)
      .values({
        userId: session.user.id,
        name: 'My Board',
      })
      .returning();

    // Create default columns
    await db.insert(columns).values([
      { boardId: newBoard.id, title: 'To Do', order: 0 },
      { boardId: newBoard.id, title: 'In Progress', order: 1 },
      { boardId: newBoard.id, title: 'Done', order: 2 },
    ]);

    board = newBoard;
  }

  // Now fetch full data
  return getBoard(board.id);
}

export async function getBoards() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.query.boards.findMany({
    where: eq(boards.userId, session.user.id),
    orderBy: [asc(boards.createdAt)],
  });
}

import { BoardSchema, ColumnSchema, TaskSchema } from '@/lib/schemas';

async function requireOwnedBoard(boardId: string, userId: string) {
  const board = await db.query.boards.findFirst({
    where: and(eq(boards.id, boardId), eq(boards.userId, userId)),
  });
  if (!board) throw new Error('Board not found');
  return board;
}

async function requireOwnedColumn(columnId: string, userId: string) {
  const column = await db.query.columns.findFirst({
    where: eq(columns.id, columnId),
    with: { board: true },
  });
  if (!column || column.board.userId !== userId) {
    throw new Error('Column not found');
  }
  return column;
}

async function requireOwnedTask(taskId: string, userId: string) {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    with: { column: { with: { board: true } } },
  });
  if (!task || task.column.board.userId !== userId) {
    throw new Error('Task not found');
  }
  return task;
}

export async function createBoard(name: string) {
  const user = await requireUser();

  const validated = BoardSchema.safeParse({ name });
  if (!validated.success) throw new Error(validated.error.issues[0].message);

  const [newBoard] = await db
    .insert(boards)
    .values({
      userId: user.id,
      name: validated.data.name,
    })
    .returning();

  // Create default columns
  await db.insert(columns).values([
    { boardId: newBoard.id, title: 'To Do', order: 0 },
    { boardId: newBoard.id, title: 'In Progress', order: 1 },
    { boardId: newBoard.id, title: 'Done', order: 2 },
  ]);

  revalidatePath('/dashboard/kanban');
  return newBoard.id;
}

export async function deleteBoard(boardId: string) {
  const user = await requireUser();

  const userBoards = await db.query.boards.findMany({
    where: eq(boards.userId, user.id),
  });

  if (userBoards.length <= 1) {
    throw new Error('You must have at least one board');
  }

  await db
    .delete(boards)
    .where(and(eq(boards.id, boardId), eq(boards.userId, user.id)));
  revalidatePath('/dashboard/kanban');
}

export async function updateBoard(boardId: string, name: string) {
  const user = await requireUser();

  const validated = BoardSchema.safeParse({ name });
  if (!validated.success) throw new Error(validated.error.issues[0].message);

  await db
    .update(boards)
    .set({ name: validated.data.name })
    .where(and(eq(boards.id, boardId), eq(boards.userId, user.id)));
  revalidatePath('/dashboard/kanban');
}

// --- Column Actions ---
export async function createColumn(boardId: string, title: string) {
  const user = await requireUser();
  await requireOwnedBoard(boardId, user.id);

  const validated = ColumnSchema.safeParse({ title });
  if (!validated.success) throw new Error(validated.error.issues[0].message);

  // Get current max order
  const existingColumns = await db.query.columns.findMany({
    where: eq(columns.boardId, boardId),
  });
  const maxOrder = existingColumns.reduce(
    (max, col) => Math.max(max, col.order),
    -1
  );

  await db.insert(columns).values({
    boardId,
    title: validated.data.title,
    order: maxOrder + 1,
  });

  revalidatePath(`/dashboard/kanban`);
}

export async function deleteColumn(columnId: string) {
  const user = await requireUser();
  await requireOwnedColumn(columnId, user.id);

  await db.delete(columns).where(eq(columns.id, columnId));
  revalidatePath(`/dashboard/kanban`);
}

export async function updateColumn(columnId: string, title: string) {
  const user = await requireUser();
  await requireOwnedColumn(columnId, user.id);

  const validated = ColumnSchema.safeParse({ title });
  if (!validated.success) throw new Error(validated.error.issues[0].message);

  await db
    .update(columns)
    .set({ title: validated.data.title })
    .where(eq(columns.id, columnId));

  revalidatePath(`/dashboard/kanban`);
}

export async function reorderColumns(boardId: string, columnIds: string[]) {
  const user = await requireUser();

  // Verify board ownership
  const board = await db.query.boards.findFirst({
    where: and(eq(boards.id, boardId), eq(boards.userId, user.id)),
  });
  if (!board) throw new Error('Board not found');

  await runInTransaction(async (tx) => {
    for (const [index, id] of columnIds.entries()) {
      await tx
        .update(columns)
        .set({ order: index })
        .where(and(eq(columns.id, id), eq(columns.boardId, boardId)));
    }
  });

  revalidatePath(`/dashboard/kanban`);
}

// --- Task Actions ---
export async function createTask(
  columnId: string,
  title: string,
  description?: string,
  priority: 'Low' | 'Medium' | 'High' = 'Medium'
) {
  const user = await requireUser();
  await requireOwnedColumn(columnId, user.id);

  const validated = TaskSchema.safeParse({ title, description, priority });
  if (!validated.success) throw new Error(validated.error.issues[0].message);

  // Get current max order in this column
  const existingTasks = await db.query.tasks.findMany({
    where: eq(tasks.columnId, columnId),
  });
  const maxOrder = existingTasks.reduce(
    (max, task) => Math.max(max, task.order),
    -1
  );

  await db.insert(tasks).values({
    columnId,
    title: validated.data.title,
    description: validated.data.description,
    priority: validated.data.priority,
    order: maxOrder + 1,
  });

  revalidatePath(`/dashboard/kanban`);
}

export async function updateTaskOrder(columnId: string, taskIds: string[]) {
  const user = await requireUser();
  if (taskIds.length === 0) return;

  await requireOwnedColumn(columnId, user.id);

  const uniqueTaskIds = [...new Set(taskIds)];
  const ownedTasks = await db.query.tasks.findMany({
    where: inArray(tasks.id, uniqueTaskIds),
    with: { column: { with: { board: true } } },
  });
  if (
    ownedTasks.length !== uniqueTaskIds.length ||
    ownedTasks.some((task) => task.column.board.userId !== user.id)
  ) {
    throw new Error('Task not found');
  }

  await runInTransaction(async (tx) => {
    for (const [index, id] of taskIds.entries()) {
      await tx
        .update(tasks)
        .set({ columnId, order: index })
        .where(eq(tasks.id, id));
    }
  });

  revalidatePath(`/dashboard/kanban`);
}

export async function deleteTask(taskId: string) {
  const user = await requireUser();
  await requireOwnedTask(taskId, user.id);

  await db.delete(tasks).where(eq(tasks.id, taskId));
  revalidatePath(`/dashboard/kanban`);
}

export async function updateTask(
  taskId: string,
  title: string,
  description: string,
  priority: 'Low' | 'Medium' | 'High'
) {
  const user = await requireUser();
  await requireOwnedTask(taskId, user.id);

  const validated = TaskSchema.safeParse({ title, description, priority });
  if (!validated.success) throw new Error(validated.error.issues[0].message);

  await db
    .update(tasks)
    .set({
      title: validated.data.title,
      description: validated.data.description,
      priority: validated.data.priority,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId));

  revalidatePath(`/dashboard/kanban`);
}
