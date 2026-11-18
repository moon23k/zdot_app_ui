import { useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/theme-provider';
import { timing } from './motion';

type Slot = { x: number; y: number; width: number; height: number };

export function useSlide<T>(value: T | null) {
  const t = useTheme();
  const slots = useRef(new Map<T, Slot>());
  const placed = useRef(false);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const shown = useSharedValue(0);

  const move = (animate: boolean) => {
    const slot = value === null ? undefined : slots.current.get(value);
    if (!slot) {
      shown.value = withTiming(0, timing(t, 'base'));
      return;
    }
    if (animate && placed.current) {
      const go = timing(t, 'move');
      x.value = withTiming(slot.x, go);
      y.value = withTiming(slot.y, go);
      width.value = withTiming(slot.width, go);
      height.value = withTiming(slot.height, go);
      shown.value = withTiming(1, timing(t, 'base'));
    } else {
      x.value = slot.x;
      y.value = slot.y;
      width.value = slot.width;
      height.value = slot.height;
      shown.value = 1;
    }
    placed.current = true;
  };

  const latest = useRef(move);
  latest.current = move;
  useEffect(() => {
    latest.current(true);
  }, [value]);

  const measure = (key: T) => (event: LayoutChangeEvent) => {
    const { x: left, y: top, width: w, height: h } = event.nativeEvent.layout;
    slots.current.set(key, { x: left, y: top, width: w, height: h });
    if (key === value) move(false);
  };

  const bar = useAnimatedStyle(() => ({
    width: width.value,
    opacity: shown.value,
    transform: [{ translateX: x.value }],
  }));
  const box = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    opacity: shown.value,
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return { measure, bar, box };
}
