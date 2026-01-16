'use client';

import {
  DndContext,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { arrayMove } from '@dnd-kit/sortable';

import { KanbanColumn } from './KanbanColumn';
import { KanbanTask } from './KanbanTask';
import { NewColumnDialog } from './NewColumnDialog';
import { reorderColumns, updateTaskOrder } from '@/actions/kanban';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

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

type BoardData = {
  id: string;
  name: string;
  columns: Column[];
};

export function KanbanBoard({
  initialData,
}: {
  initialData: BoardData | null;
}) {
  const [columns, setColumns] = useState<Column[]>(initialData?.columns || []);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [showNewColumnDialog, setShowNewColumnDialog] = useState(false);

  useEffect(() => {
    if (initialData) {
      setColumns(initialData.columns);
    }
  }, [initialData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    setColumns((prev) => {
      const activeColumnIndex = prev.findIndex((col) =>
        col.tasks.some((t) => t.id === activeId)
      );
      const overColumnIndex = prev.findIndex((col) => {
        if (isOverColumn) return col.id === overId;
        if (isOverTask) return col.tasks.some((t) => t.id === overId);
        return false;
      });

      if (activeColumnIndex === -1 || overColumnIndex === -1) return prev;

      const activeColumn = prev[activeColumnIndex];
      const overColumn = prev[overColumnIndex];

      if (activeColumnIndex === overColumnIndex) {
        return prev;
      }

      const activeTaskIndex = activeColumn.tasks.findIndex(
        (t) => t.id === activeId
      );
      const task = activeColumn.tasks[activeTaskIndex];

      const newSourceTasks = [...activeColumn.tasks];
      newSourceTasks.splice(activeTaskIndex, 1);

      const newDestTasks = [...overColumn.tasks];
      let insertIndex = newDestTasks.length;
      if (isOverTask) {
        const overTaskIndex = newDestTasks.findIndex((t) => t.id === overId);
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        insertIndex =
          overTaskIndex >= 0 ? overTaskIndex + modifier : newDestTasks.length;
      }

      newDestTasks.splice(insertIndex, 0, { ...task, columnId: overColumn.id });

      return prev.map((c, i) => {
        if (i === activeColumnIndex) return { ...c, tasks: newSourceTasks };
        if (i === overColumnIndex) return { ...c, tasks: newDestTasks };
        return c;
      });
    });
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    setActiveColumn(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (isActiveTask) {
      const activeColumn = columns.find((col) =>
        col.tasks.some((t) => t.id === activeId)
      );
      const overColumn = columns.find((col) => {
        if (isOverColumn) return col.id === overId;
        if (isOverTask) return col.tasks.some((t) => t.id === overId);
        return false;
      });

      if (!activeColumn || !overColumn) return;

      if (activeColumn.id === overColumn.id) {
        const activeIndex = activeColumn.tasks.findIndex(
          (t) => t.id === activeId
        );
        const overIndex = activeColumn.tasks.findIndex((t) => t.id === overId);

        if (activeIndex !== overIndex) {
          const newTaskIds = arrayMove(
            activeColumn.tasks,
            activeIndex,
            overIndex
          ).map((t) => t.id);
          updateTaskOrder(activeColumn.id, newTaskIds);
        }
      } else {
        const sourceTaskIds = activeColumn.tasks.map((t) => t.id);
        const destTaskIds = overColumn.tasks.map((t) => t.id);

        updateTaskOrder(activeColumn.id, sourceTaskIds);
        updateTaskOrder(overColumn.id, destTaskIds);
      }
    }

    const isActiveColumn = active.data.current?.type === 'Column';
    if (isActiveColumn) {
      const activeIndex = columns.findIndex((col) => col.id === activeId);
      const overIndex = columns.findIndex((col) => col.id === overId);

      if (activeIndex !== overIndex) {
        const newCols = arrayMove(columns, activeIndex, overIndex);
        setColumns(newCols);
        // Persist the new order
        reorderColumns(
          initialData!.id,
          newCols.map((c) => c.id)
        );
      }
    }
  }

  if (!initialData) {
    return (
      <div className='flex h-full items-center justify-center p-8'>
        <div className='text-center'>
          <h2 className='text-lg font-semibold'>No Board Found</h2>
          <p className='text-muted-foreground'>
            Get started by creating your first board.
          </p>
          <Button variant='indigo' size='sm' className='mt-4'>
            CREATE BOARD
          </Button>
        </div>
      </div>
    );
  }

  const dndContextId = useId();

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className='flex h-full gap-6 overflow-x-auto pb-4 items-start custom-scrollbar'>
        <SortableContext
          items={columns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((col) => (
            <KanbanColumn key={col.id} column={col} />
          ))}
        </SortableContext>
        {/* Add Column Button */}
        <div className='w-[300px] shrink-0'>
          <Button
            variant='outline'
            onClick={() => setShowNewColumnDialog(true)}
            className='w-full h-[100px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-indigo-500/50 text-zinc-400 hover:text-indigo-500 transition-all rounded-xl flex flex-col gap-2 shadow-none scale-100'
          >
            <Plus className='h-5 w-5' />
            <span className='text-xs uppercase font-black tracking-widest'>
              + Add Section
            </span>
          </Button>
        </div>
      </div>

      <NewColumnDialog
        boardId={initialData!.id}
        isOpen={showNewColumnDialog}
        onOpenChange={setShowNewColumnDialog}
      />

      {typeof window !== 'undefined' &&
        createPortal(
          <DragOverlay>
            {activeTask && (
              <div className='opacity-90 rotate-2 cursor-grabbing w-[300px]'>
                <KanbanTask task={activeTask} />
              </div>
            )}
            {activeColumn && (
              <div className='opacity-90 rotate-2 cursor-grabbing w-[300px]'>
                <KanbanColumn column={activeColumn} />
              </div>
            )}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
