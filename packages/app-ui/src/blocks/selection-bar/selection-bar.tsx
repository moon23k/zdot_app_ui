import { useEffect, useRef, useState } from 'react';
import {
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '../../components/button/button';
import { Text } from '../../components/text/text';
import { timing } from '../../internal/motion';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type SelectionBarProps = {
  count: number;
  max?: number;
  actionLabel: string;
  onAction: () => void;
  onClear: () => void;
  clearLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const BUMP = 6;

const useStyles = makeStyles((t) => ({
  clip: { overflow: 'hidden' },
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    paddingVertical: t.space[3],
    paddingHorizontal: t.space[4],
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.md,
  },
  info: { flex: 1, gap: t.space[1] },
  count: { fontVariant: ['tabular-nums'] },
}));

export function SelectionBar({
  count,
  max,
  actionLabel,
  onAction,
  onClear,
  clearLabel = '선택 해제',
  disabled,
  style,
}: SelectionBarProps) {
  const t = useTheme();
  const s = useStyles();
  const visible = count > 0;
  const last = useRef(count);
  if (visible) last.current = count;
  const shown = visible ? count : last.current;
  const full = max !== undefined && shown >= max;

  const [height, setHeight] = useState(0);
  const rise = useSharedValue(visible ? 1 : 0);
  const bump = useSharedValue(0);
  const seen = useRef(count);

  useEffect(() => {
    rise.value = withTiming(
      visible ? 1 : 0,
      visible
        ? timing(t, 'long', 'decelerate')
        : timing(t, 'base', 'accelerate')
    );
  }, [visible, rise, t]);

  useEffect(() => {
    if (count > 0 && seen.current > 0 && count !== seen.current) {
      bump.value = withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(0, timing(t, 'long', 'spring'))
      );
    }
    seen.current = count;
  }, [count, bump, t]);

  const frame = useAnimatedStyle(() => ({ height: height * rise.value }));
  const slide = useAnimatedStyle(() => ({
    transform: [{ translateY: height * (1 - rise.value) }],
  }));
  const roll = useAnimatedStyle(() => ({
    opacity: 1 - bump.value,
    transform: [{ translateY: BUMP * bump.value }],
  }));

  const measure = (event: LayoutChangeEvent) =>
    setHeight(event.nativeEvent.layout.height);

  return (
    <Animated.View
      pointerEvents={visible ? 'box-none' : 'none'}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
      style={[s.clip, frame]}
    >
      <Animated.View
        accessibilityRole="toolbar"
        onLayout={measure}
        style={[s.root, style, slide]}
      >
        <View style={s.info} accessibilityLiveRegion="polite">
          <Animated.View style={roll}>
            <Text weight="bold" style={s.count} numberOfLines={1}>
              {shown}개 선택됨
            </Text>
          </Animated.View>
          {full ? (
            <Text variant="caption" tone="muted" numberOfLines={2}>
              최대 {max}건까지 선택할 수 있어요
            </Text>
          ) : null}
        </View>
        <Button variant="ghost" size="sm" onPress={onClear}>
          {clearLabel}
        </Button>
        <Button size="sm" onPress={onAction} disabled={disabled || count === 0}>
          {actionLabel}
        </Button>
      </Animated.View>
    </Animated.View>
  );
}
