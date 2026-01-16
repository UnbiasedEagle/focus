'use client';

interface BoardHeaderProps {
  boardName: string;
}

export function BoardHeader({ boardName }: BoardHeaderProps) {
  return (
    <div className='flex items-center justify-between gap-4 mb-4'>
      <div>
        <p className='text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-1'>
          Kanban Board
        </p>
        <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
          {boardName}
        </h1>
      </div>
      <div className='hidden sm:flex items-center gap-4'>
        <p className='text-[10px] font-black text-zinc-400 uppercase tracking-widest'>
          Drag and drop to reorder
        </p>
      </div>
    </div>
  );
}
