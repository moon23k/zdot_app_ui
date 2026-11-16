import { useEffect, useRef } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import Animated, {
  interpolateColor,
  type AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/theme-provider';
import { timing } from './motion';

const RISE = 8;
const FLASH = 900;

export function RollText({
  children,
  style,
  animatedStyle,
  flash = false,
}: {
  children: string | number;
  style?: StyleProp<TextStyle>;
  animatedStyle?: StyleProp<AnimatedStyle<TextStyle>>;
  flash?: boolean;
}) {
  const t = useTheme();
  const roll = useSharedValue(0);
  const glow = useSharedValue(0);
  const last = useRef(children);
  useEffect(() => {
    if (last.current !== children) {
      roll.value = withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(0, timing(t, 'long', 'decelerate'))
      );
      if (flash) {
        glow.value = withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(0, { duration: FLASH })
        );
      }
    }
    last.current = children;
  }, [children, flash, roll, glow, t]);
  const tint = t.colors.primaryTint;
  const move = useAnimatedStyle(() => ({
    opacity: 1 - roll.value,
    transform: [{ translateY: RISE * roll.value }],
    backgroundColor: interpolateColor(
      glow.value,
      [0, 1],
      ['transparent', tint]
    ),
  }));
  return (
    <Animated.Text
      maxFontSizeMultiplier={t.maxFontScale}
      style={[
        style,
        flash && { borderRadius: t.radius.sm },
        animatedStyle,
        move,
      ]}
    >
      {children}
    </Animated.Text>
  );
}
