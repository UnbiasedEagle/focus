import { getHabits } from '@/actions/habits';
import { HabitCard } from './HabitCard';
import { CreateHabitDialog } from './CreateHabitDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export async function HabitList() {
  const habits = await getHabits();

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-bold tracking-tight'>Habits</h2>
        <CreateHabitDialog>
          <Button
            variant='ghost'
            size='sm'
            className='gap-2 text-zinc-500 hover:text-indigo-600'
          >
            <Plus className='h-4 w-4' />
            Add Habit
          </Button>
        </CreateHabitDialog>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
        {habits.length === 0 && (
          <div className='col-span-full py-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl'>
            <h3 className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
              No habits yet
            </h3>
            <p className='text-xs text-zinc-500 mt-1 mb-4'>
              Start tracking your daily goals.
            </p>
            <CreateHabitDialog />
          </div>
        )}
      </div>
    </div>
  );
}
