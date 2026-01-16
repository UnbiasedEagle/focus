'use client';

import { useEffect, useRef } from 'react';
import { usePomodoroStore } from '@/lib/store/pomodoro';
import { completePomodoroSession } from '@/actions/pomodoro';
import { POMODORO_TIMES } from '@/lib/constants';

export function GlobalPomodoroTimer() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const {
    mode,
    timeLeft,
    isActive,
    currentSessionId,
    setTimeLeft,
    setIsActive,
    setCurrentSessionId,
    setMode,
  } = usePomodoroStore();

  const totalTime = POMODORO_TIMES[mode];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, setTimeLeft]);

  async function handleComplete() {
    setIsActive(false);

    if (mode === 'focus' && currentSessionId) {
      try {
        await completePomodoroSession(currentSessionId);
      } catch (error) {
        console.error('Failed to complete session', error);
      }
      setCurrentSessionId(null);
    }

    // Play notification sound
    const audio = new Audio(
      'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
    );
    audio.play().catch(() => {});

    // Auto switch modes
    const nextMode = mode === 'focus' ? 'short' : 'focus';
    setMode(nextMode);
  }

  return null; // This component doesn't render anything
}
