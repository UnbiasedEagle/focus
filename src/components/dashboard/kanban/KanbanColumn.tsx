import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { EditColumnDialog } from './EditColumnDialog';
import { deleteColumn } from '@/actions/kanban';
import { MoreHorizontal, Plus, Edit2, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanTask } from './KanbanTask';
import { NewTaskDialog } from './NewTaskDialog';

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: 'Low' | 'Medium' | 'High';
  columnId: string;
  order: number;
};

type Column = {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
};

export function KanbanColumn({ column }: { column: Column }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: showEditDialog || showDeleteAlert,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const tasksIds = useMemo(() => {
    return column.tasks.map((task) => task.id);
  }, [column.tasks]);

  const handleDelete = async () => {
    await deleteColumn(column.id);
    setShowDeleteAlert(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className='w-[300px] shrink-0 opacity-30 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border-2 border-dashed border-indigo-500 h-[500px]'
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='w-[300px] shrink-0 flex flex-col h-full max-h-full'
    >
      {/* Column Header */}
      <div
        {...attributes}
        {...listeners}
        className='flex items-center justify-between p-3 mb-2 cursor-grab active:cursor-grabbing group'
      >
        <div className='flex items-center gap-2'>
          <span className='font-bold text-sm text-foreground'>
            {column.title}
          </span>
          <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-1.5 text-[10px] font-medium text-muted-foreground'>
            {column.tasks.length}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              className='opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-muted-foreground transition-all'
            >
              <MoreHorizontal className='h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[160px]'>
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              <Edit2 className='mr-2 h-4 w-4' />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-red-600 focus:text-red-600'
              onClick={() => setShowDeleteAlert(true)}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete Section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task List container */}
      <div className='flex-1 overflow-y-auto min-h-[100px] bg-zinc-50/50 dark:bg-zinc-900/20 rounded-2xl p-2 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors custom-scrollbar'>
        <div className='flex flex-col gap-2'>
          <SortableContext items={tasksIds}>
            {column.tasks.map((task) => (
              <KanbanTask key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>

        <div className='mt-2 text-left'>
          <NewTaskDialog columnId={column.id} />
        </div>
      </div>

      <EditColumnDialog
        column={column}
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the &quot;{column.title}&quot;
              section and{' '}
              <span className='font-bold text-red-500'>
                {column.tasks.length} tasks
              </span>{' '}
              inside it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
