import { Easing, ReduceMotion } from 'react-native-reanimated';
import type { ThemeTokens } from '../types';

export type Curve = keyof ThemeTokens['motion']['easing'];

export function curve(t: ThemeTokens, name: Curve) {
  const [x1, y1, x2, y2] = t.motion.easing[name];
  return Easing.bezier(x1, y1, x2, y2);
}

export function timing(
  t: ThemeTokens,
  duration: keyof ThemeTokens['motion']['duration'],
  name: Curve = 'standard'
) {
  return {
    duration: t.motion.duration[duration],
    easing: curve(t, name),
    reduceMotion: ReduceMotion.System,
  };
}
