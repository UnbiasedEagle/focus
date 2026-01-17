import { HabitList } from '@/components/habits/HabitList';
import { Card } from '@/components/ui/card';

export default function HabitsPage() {
  return (
    <div className='space-y-8 max-w-6xl mx-auto'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
          Habits
        </h1>
        <p className='text-zinc-500'>
          Build consistency with daily, weekly, and monthly habits.
        </p>
      </div>

      <HabitList />
    </div>
  );
}
