import { useEffect, useRef } from 'react';
import {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/theme-provider';
import type { ThemeTokens } from '../types';

export type Curve = keyof ThemeTokens['motion']['easing'];
export type Duration = keyof ThemeTokens['motion']['duration'];

export const FILL_FROM = 0.85;

export function curve(t: ThemeTokens, name: Curve) {
  const [x1, y1, x2, y2] = t.motion.easing[name];
  return Easing.bezier(x1, y1, x2, y2);
}

export function timing(
  t: ThemeTokens,
  duration: Duration,
  name: Curve = 'standard'
) {
  return {
    duration: t.motion.duration[duration],
    easing: curve(t, name),
    reduceMotion: ReduceMotion.System,
  };
}

export function useSwitch(
  on: boolean,
  duration: Duration = 'base',
  name: Curve = 'standard'
) {
  const t = useTheme();
  const progress = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(on ? 1 : 0, timing(t, duration, name));
  }, [on, progress, t, duration, name]);
  return progress;
}

const SHAKE = [-4, 4, -2, 0] as const;

export function useShake(trigger: unknown) {
  const t = useTheme();
  const x = useSharedValue(0);
  const last = useRef(trigger);
  useEffect(() => {
    if (trigger && trigger !== last.current) {
      const step = {
        duration: t.motion.duration.long / SHAKE.length,
        easing: curve(t, 'standard'),
        reduceMotion: ReduceMotion.System,
      };
      x.value = withSequence(...SHAKE.map((v) => withTiming(v, step)));
    }
    last.current = trigger;
  }, [trigger, x, t]);
  return x;
}

export function usePop(on: boolean, from: number) {
  const t = useTheme();
  const scale = useSharedValue(1);
  const seen = useRef(on);
  useEffect(() => {
    if (on && !seen.current) {
      scale.value = withSequence(
        withTiming(from, { duration: 0 }),
        withTiming(1, timing(t, 'short'))
      );
    }
    seen.current = on;
  }, [on, from, scale, t]);
  return useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
}
