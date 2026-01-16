import { getInitialBoard, getBoard, getBoards } from '@/actions/kanban';
import { KanbanBoard } from '@/components/dashboard/kanban/KanbanBoard';
import { BoardHeader } from '@/components/dashboard/kanban/BoardHeader';
import { BoardTabs } from '@/components/dashboard/kanban/BoardTabs';

export default async function KanbanPage({
  searchParams,
}: {
  searchParams: Promise<{ boardId?: string }>;
}) {
  const { boardId } = await searchParams;
  const userBoards = await getBoards();

  // Decide which board to show
  let boardData;
  if (boardId) {
    boardData = await getBoard(boardId);
  } else {
    boardData = await getInitialBoard();
  }

  if (!boardData) return null;

  return (
    <div className='h-full flex flex-col'>
      <BoardHeader boardName={boardData.name} />

      <BoardTabs
        boards={userBoards.map((b) => ({ id: b.id, name: b.name }))}
        activeBoardId={boardData.id}
      />

      {/* Board Container */}
      <div className='flex-1 min-h-0 overflow-hidden bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm'>
        <KanbanBoard initialData={boardData as any} />
      </div>
    </div>
  );
}
