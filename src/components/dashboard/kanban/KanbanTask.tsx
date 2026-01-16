'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditTaskDialog } from './EditTaskDialog';
import { ViewTaskDialog } from './ViewTaskDialog';
import { deleteTask } from '@/actions/kanban';
import { MoreHorizontal, Trash2, Edit2, Eye } from 'lucide-react';
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

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: 'Low' | 'Medium' | 'High';
  columnId: string;
  order: number;
};

export function KanbanTask({ task }: { task: Task }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: showEditDialog || showDeleteAlert || showViewDialog,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    setShowDeleteAlert(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className='opacity-30 bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg border border-dashed border-zinc-300 h-[80px]'
      />
    );
  }

  const priorityColor =
    {
      Low: 'text-zinc-500',
      Medium: 'text-orange-600',
      High: 'text-red-600',
    }[task.priority] || 'text-zinc-500';

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        onClick={() => setShowViewDialog(true)}
        className='group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-sm hover:border-zinc-300 transition-all cursor-grab active:cursor-grabbing'
        {...attributes}
        {...listeners}
        data-automation-id='task-card'
      >
        <div className='flex items-center justify-between mb-1.5'>
          <span
            className={`text-[9px] font-bold uppercase tracking-wider ${priorityColor}`}
          >
            {task.priority}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className='opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600'
              >
                <MoreHorizontal className='h-3.5 w-3.5' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[140px]'>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setShowViewDialog(true);
                }}
              >
                <Eye className='mr-2 h-3.5 w-3.5' />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditDialog(true);
                }}
              >
                <Edit2 className='mr-2 h-3.5 w-3.5' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-red-600'
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteAlert(true);
                }}
              >
                <Trash2 className='mr-2 h-3.5 w-3.5' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className='font-medium text-sm text-zinc-900 dark:text-zinc-100 leading-snug'>
          {task.title}
        </h3>

        {task.description && (
          <p className='text-xs text-zinc-500 line-clamp-1 mt-1 font-normal'>
            {task.description}
          </p>
        )}
      </div>

      <ViewTaskDialog
        task={task}
        isOpen={showViewDialog}
        onOpenChange={setShowViewDialog}
      />

      <EditTaskDialog
        task={task}
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-base'>
              Delete task?
            </AlertDialogTitle>
            <AlertDialogDescription className='text-sm'>
              This will permanently remove the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
