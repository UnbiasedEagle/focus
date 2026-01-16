import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { POMODORO_TIMES } from '@/lib/constants';

type PomodoroMode = 'focus' | 'short' | 'long';

interface PomodoroState {
  mode: PomodoroMode;
  timeLeft: number;
  isActive: boolean;
  selectedTaskId: string;
  currentSessionId: string | null;

  // Actions
  setMode: (mode: PomodoroMode) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setIsActive: (active: boolean) => void;
  setSelectedTaskId: (id: string) => void;
  setCurrentSessionId: (id: string | null) => void;
  resetTimer: () => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      mode: 'focus',
      timeLeft: POMODORO_TIMES.focus,
      isActive: false,
      selectedTaskId: 'none',
      currentSessionId: null,

      setMode: (mode) =>
        set({
          mode,
          timeLeft: POMODORO_TIMES[mode],
          isActive: false,
        }),

      setTimeLeft: (input) =>
        set((state) => ({
          timeLeft: typeof input === 'function' ? input(state.timeLeft) : input,
        })),

      setIsActive: (isActive) => set({ isActive }),

      setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),

      setCurrentSessionId: (currentSessionId) => set({ currentSessionId }),

      resetTimer: () => {
        const { mode } = get();
        set({
          isActive: false,
          timeLeft: POMODORO_TIMES[mode],
        });
      },
    }),
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        mode: state.mode,
        timeLeft: state.timeLeft,
        selectedTaskId: state.selectedTaskId,
        currentSessionId: state.currentSessionId,
        isActive: state.isActive,
      }),
    }
  )
);
