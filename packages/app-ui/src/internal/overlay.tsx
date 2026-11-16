import { createContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/theme-provider';
import { useReducedMotion } from './use-reduced-motion';

export const useNativeDriver = Platform.OS !== 'web';

export const OverlayShown = createContext<boolean | null>(null);

export function useOverlayTransition(open: boolean) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) setMounted(true);
    setShown(false);
    const [x1, y1, x2, y2] =
      t.motion.easing[open ? 'decelerate' : 'accelerate'];
    const animation = Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: reduced ? 0 : t.motion.duration[open ? 'long' : 'base'],
      easing: Easing.bezier(x1, y1, x2, y2),
      useNativeDriver,
    });
    animation.start(({ finished }) => {
      if (finished && !open) setMounted(false);
      if (finished && open) setShown(true);
    });
    return () => animation.stop();
  }, [open, progress, reduced, t]);

  return { mounted, progress, shown };
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
});

export function Backdrop({
  progress,
  onPress,
  label,
}: {
  progress: Animated.Value;
  onPress: () => void;
  label: string;
}) {
  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: progress }]}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      />
    </Animated.View>
  );
}
