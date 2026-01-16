'use server';

import { db } from '@/server/db';
import { boards, columns } from '@/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import { auth } from '@/auth';

export async function getUserBoardsAndColumns() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const userBoards = await db.query.boards.findMany({
    where: eq(boards.userId, session.user.id),
    with: {
      columns: {
        orderBy: [asc(columns.order)],
      },
    },
  });

  return userBoards;
}
