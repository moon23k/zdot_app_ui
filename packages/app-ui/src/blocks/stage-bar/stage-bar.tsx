import { Fragment } from 'react';
import {
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { ChevronGlyph } from '../../internal/glyphs';
import { useSwitch } from '../../internal/motion';
import { PressableBase } from '../../internal/pressable-base';
import { RollText } from '../../internal/roll-text';
import { SteadyText } from '../../internal/steady-text';
import { useSlide } from '../../internal/use-slide';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { haptic } from '../../internal/haptics';

export type StageBarItem<T extends string> = {
  value: T;
  label: string;
  count?: number;
  flow?: boolean;
};

export type StageBarProps<T extends string> = {
  items: readonly StageBarItem<T>[];
  value: T | null;
  onValueChange: (value: T | null) => void;
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: t.layout.screenX,
    padding: t.space[1] + t.space[1] / 2,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    gap: t.space[1] / 2,
    paddingVertical: t.space[2],
    borderRadius: t.radius.md,
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.primaryTint,
  },
  count: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.title.fontSize,
    lineHeight: t.typography.title.lineHeight,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  zero: { fontWeight: '400' },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.mutedForeground,
  },
  strong: { fontWeight: '500' },
  split: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: t.space[2],
    backgroundColor: t.colors.border,
  },
}));

function Stage({
  label,
  count,
  on,
  onPress,
  onLayout,
}: {
  label: string;
  count: number;
  on: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const pick = useSwitch(on, 'base');
  const rest = count > 0 ? t.colors.title : t.colors.input;
  const idle = t.colors.mutedForeground;
  const point = t.colors.primary;
  const number = useAnimatedStyle(() => ({
    color: interpolateColor(pick.value, [0, 1], [rest, point]),
  }));
  const word = useAnimatedStyle(() => ({
    color: interpolateColor(pick.value, [0, 1], [idle, point]),
  }));
  return (
    <PressableBase
      feedback="row"
      accessibilityRole="tab"
      accessibilityState={{ selected: on }}
      accessibilityLabel={`${label} ${count}`}
      onPress={onPress}
      onLayout={onLayout}
      style={s.stage}
    >
      <RollText
        style={[s.count, count > 0 ? null : s.zero]}
        animatedStyle={number}
      >
        {count}
      </RollText>
      <SteadyText
        selected={on}
        style={s.label}
        strongStyle={s.strong}
        animatedStyle={word}
      >
        {label}
      </SteadyText>
    </PressableBase>
  );
}

export function StageBar<T extends string>({
  items,
  value,
  onValueChange,
  style,
}: StageBarProps<T>) {
  const t = useTheme();
  const s = useStyles();
  const slide = useSlide(value);
  return (
    <View style={[s.root, style]} accessibilityRole="tablist">
      <Animated.View pointerEvents="none" style={[s.panel, slide.box]} />
      {items.map((item, i) => {
        const on = item.value === value;
        const next = items[i + 1];
        return (
          <Fragment key={item.value}>
            <Stage
              label={item.label}
              count={item.count ?? 0}
              on={on}
              onPress={() => {
                haptic('select');
                onValueChange(on ? null : item.value);
              }}
              onLayout={slide.measure(item.value)}
            />
            {next ? (
              next.flow === false ? (
                <View style={s.split} />
              ) : (
                <ChevronGlyph color={t.colors.input} size={t.iconSize.sm} />
              )
            ) : null}
          </Fragment>
        );
      })}
    </View>
  );
}
