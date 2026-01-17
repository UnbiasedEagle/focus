'use server';

import { db } from '@/server/db';
import { boards, columns, tasks } from '@/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { requireUser } from '@/lib/auth-utils';

// --- Board Actions ---
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

export async function createBoard(name: string) {
  const user = await requireUser();

  const validated = BoardSchema.safeParse({ name });
  if (!validated.success)
    throw new Error((validated.error as any).errors[0].message);

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
  if (!validated.success)
    throw new Error((validated.error as any).errors[0].message);

  await db
    .update(boards)
    .set({ name: validated.data.name })
    .where(and(eq(boards.id, boardId), eq(boards.userId, user.id)));
  revalidatePath('/dashboard/kanban');
}

// --- Column Actions ---
export async function createColumn(boardId: string, title: string) {
  await requireUser();

  const validated = ColumnSchema.safeParse({ title });
  if (!validated.success)
    throw new Error((validated.error as any).errors[0].message);

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
  await requireUser();

  await db.delete(columns).where(eq(columns.id, columnId));
  revalidatePath(`/dashboard/kanban`);
}

export async function updateColumn(columnId: string, title: string) {
  await requireUser();

  const validated = ColumnSchema.safeParse({ title });
  if (!validated.success)
    throw new Error((validated.error as any).errors[0].message);

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

  // Perform bulk update of orders
  await Promise.all(
    columnIds.map((id, index) =>
      db.update(columns).set({ order: index }).where(eq(columns.id, id))
    )
  );

  revalidatePath(`/dashboard/kanban`);
}

// --- Task Actions ---
export async function createTask(
  columnId: string,
  title: string,
  description?: string,
  priority: 'Low' | 'Medium' | 'High' = 'Medium'
) {
  await requireUser();

  const validated = TaskSchema.safeParse({ title, description, priority });
  if (!validated.success)
    throw new Error((validated.error as any).errors[0].message);

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
  await requireUser();

  // Perform bulk update of orders
  await Promise.all(
    taskIds.map((id, index) =>
      db.update(tasks).set({ columnId, order: index }).where(eq(tasks.id, id))
    )
  );

  revalidatePath(`/dashboard/kanban`);
}

export async function deleteTask(taskId: string) {
  await requireUser();

  await db.delete(tasks).where(eq(tasks.id, taskId));
  revalidatePath(`/dashboard/kanban`);
}

export async function updateTask(
  taskId: string,
  title: string,
  description: string,
  priority: 'Low' | 'Medium' | 'High'
) {
  await requireUser();

  const validated = TaskSchema.safeParse({ title, description, priority });
  if (!validated.success)
    throw new Error((validated.error as any).errors[0].message);

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
