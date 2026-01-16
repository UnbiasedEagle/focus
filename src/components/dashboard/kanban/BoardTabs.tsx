'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { NewBoardDialog } from './NewBoardDialog';
import { EditBoardDialog } from './EditBoardDialog';
import { deleteBoard } from '@/actions/kanban';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Board {
  id: string;
  name: string;
}

interface BoardTabsProps {
  boards: Board[];
  activeBoardId: string;
}

export function BoardTabs({ boards, activeBoardId }: BoardTabsProps) {
  const router = useRouter();
  const [showNewBoardDialog, setShowNewBoardDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState<Board | null>(null);

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  async function handleDelete() {
    if (!activeBoard) return;

    // Safety check again
    if (boards.length <= 1) {
      toast.error('You must have at least one board');
      return;
    }

    toast.promise(deleteBoard(activeBoard.id), {
      loading: 'Deleting board...',
      success: () => {
        router.push('/dashboard/kanban');
        setShowDeleteDialog(false);
        return 'Board deleted successfully';
      },
      error: (err: Error) => err.message || 'Failed to delete board',
    });
  }

  return (
    <div className='flex items-center gap-2 mb-6'>
      <div className='inline-flex h-10 items-center rounded-lg bg-zinc-100 dark:bg-zinc-800/50 p-1 text-zinc-500'>
        {boards.map((board) => {
          const isActive = board.id === activeBoardId;
          return (
            <button
              key={board.id}
              onClick={() =>
                router.push(`/dashboard/kanban?boardId=${board.id}`)
              }
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2',
                isActive
                  ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-sm'
                  : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50'
              )}
            >
              {board.name}
            </button>
          );
        })}
        <button
          onClick={() => setShowNewBoardDialog(true)}
          className='inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:bg-zinc-200/50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50'
        >
          <Plus className='h-4 w-4' />
        </button>
      </div>

      {/* Settings Dropdown for Active Board */}
      {activeBoard && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='h-10 w-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors'>
              <MoreHorizontal className='h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuItem
              onClick={() => {
                setBoardToEdit(activeBoard);
                setShowEditDialog(true);
              }}
            >
              <Edit2 className='mr-2 h-4 w-4' />
              <span>Rename Board</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (boards.length <= 1) {
                  toast.error('You must have at least one board');
                  return;
                }
                setShowDeleteDialog(true);
              }}
              className='text-red-600 focus:text-red-600'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              <span>Delete Board</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <NewBoardDialog
        isOpen={showNewBoardDialog}
        onOpenChange={setShowNewBoardDialog}
      />

      {boardToEdit && (
        <EditBoardDialog
          board={boardToEdit}
          isOpen={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Board</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{activeBoard?.name}&quot;?
              This action cannot be undone. All tasks in this board will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700 text-white border-transparent'
            >
              Delete Board
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
