import { useEffect, useRef, useState, type ReactNode } from 'react';

export const SKELETON_AFTER = 1000;
const FRESH = 500;

export function Later({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), SKELETON_AFTER);
    return () => clearTimeout(id);
  }, []);
  return ready ? children : null;
}

export function useSettled(loading: boolean) {
  const was = useRef(loading);
  const at = useRef(0);
  if (was.current && !loading) at.current = Date.now();
  was.current = loading;
  return () => at.current > 0 && Date.now() - at.current < FRESH;
}
