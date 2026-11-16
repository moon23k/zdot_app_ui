import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/theme-provider';
import { curve } from './motion';
import { useReducedMotion } from './use-reduced-motion';

const CYCLE = 1600;
const REACH = 0.7;
const START = 0.35;

const styles = StyleSheet.create({ ring: { position: 'absolute' } });

export function Pulse({
  size,
  spread,
  color,
}: {
  size: number;
  spread: number;
  color: string;
}) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const progress = useSharedValue(0);
  useEffect(() => {
    if (reduced) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }
    progress.value = withRepeat(
      withTiming(1, { duration: CYCLE, easing: curve(t, 'standard') }),
      -1,
      false
    );
    return () => cancelAnimation(progress);
  }, [reduced, progress, t]);
  const grow = (size + spread * 2) / size;
  const ring = useAnimatedStyle(() => ({
    opacity: reduced ? 0 : START * Math.max(0, 1 - progress.value / REACH),
    transform: [
      { scale: 1 + (grow - 1) * Math.min(1, progress.value / REACH) },
    ],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ring,
        { width: size, height: size, borderRadius: size / 2 },
        { backgroundColor: color },
        ring,
      ]}
    />
  );
}
