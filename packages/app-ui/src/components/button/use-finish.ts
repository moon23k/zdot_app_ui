import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../internal/use-reduced-motion';

export const FINISH_HOLD = 800;

export function useFinish() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );
  const finish = useCallback(
    (next: () => void) => {
      if (reduced) {
        next();
        return;
      }
      setDone(true);
      timer.current = setTimeout(() => {
        timer.current = null;
        setDone(false);
        next();
      }, FINISH_HOLD);
    },
    [reduced]
  );
  return { done, finish };
}
