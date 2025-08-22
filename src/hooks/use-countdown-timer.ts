import { useState, useEffect, useReducer, useMemo } from 'react';
import { calculateTimeRemaining, type TimeLeft } from '@/utils/utliFn';

type TimerState = {
  timeLeft: TimeLeft;
  isExpired: boolean;
};

type TimerAction = { type: 'TICK'; timeLeft: TimeLeft } | { type: 'EXPIRE' };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'TICK':
      return {
        timeLeft: action.timeLeft,
        isExpired: false,
      };
    case 'EXPIRE':
      return {
        timeLeft: { hours: 0, minutes: 0, seconds: 0 },
        isExpired: true,
      };
    default:
      return state;
  }
}

type UseCountdownTimerOptions = {
  duration?: number; // 분 단위 (기본값: 480분 = 8시간)
  persistKey?: string; // localStorage 키 (옵션)
  onExpire?: () => void; // 만료 시 콜백
};

type UseCountdownTimerReturn = {
  timeLeft: TimeLeft;
  isExpired: boolean;
  reset: () => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
};

export function useCountdownTimer(
  options: UseCountdownTimerOptions = {}
): UseCountdownTimerReturn {
  const {
    duration = 480, // 8시간 기본값
    persistKey,
    onExpire,
  } = options;

  const endTime = useMemo(() => {
    if (persistKey) {
      const stored = localStorage.getItem(persistKey);
      if (stored) {
        const storedEndTime = new Date(stored);
        // 저장된 시간이 아직 유효한지 확인
        if (storedEndTime.getTime() > Date.now()) {
          return storedEndTime;
        }
      }
    }

    const now = new Date();
    const newEndTime = new Date(now.getTime() + duration * 60 * 1000);

    if (persistKey) {
      localStorage.setItem(persistKey, newEndTime.toISOString());
    }

    return newEndTime;
  }, [duration, persistKey]);

  const [timerState, dispatch] = useReducer(timerReducer, {
    timeLeft: {
      hours: Math.floor(duration / 60),
      minutes: duration % 60,
      seconds: 0,
    },
    isExpired: false,
  });

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const updateTimer = () => {
      const remaining = calculateTimeRemaining(endTime);

      if (remaining) {
        dispatch({ type: 'TICK', timeLeft: remaining });
      } else {
        dispatch({ type: 'EXPIRE' });
        onExpire?.(); // 만료 콜백 실행

        // localStorage 정리
        if (persistKey) {
          localStorage.removeItem(persistKey);
        }
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [endTime, isPaused, onExpire, persistKey]);

  // 타이머 리셋
  const reset = () => {
    const now = new Date();
    const newEndTime = new Date(now.getTime() + duration * 60 * 1000);

    if (persistKey) {
      localStorage.setItem(persistKey, newEndTime.toISOString());
    }

    window.location.reload();
  };

  const pause = () => setIsPaused(true);

  const resume = () => setIsPaused(false);

  return {
    timeLeft: timerState.timeLeft,
    isExpired: timerState.isExpired,
    reset,
    pause,
    resume,
    isPaused,
  };
}
