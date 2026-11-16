import {
  ScrollView,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSwitch } from '../../internal/motion';
import { PressableBase } from '../../internal/pressable-base';
import { RollText } from '../../internal/roll-text';
import { SteadyText } from '../../internal/steady-text';
import { useSlide } from '../../internal/use-slide';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { haptic } from '../../internal/haptics';

export type SegmentedTabsItem<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

export type SegmentedTabsProps<T extends string> = {
  items: readonly SegmentedTabsItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

const BAR = 3;

const useStyles = makeStyles((t) => ({
  root: {
    backgroundColor: t.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  track: {
    flexDirection: 'row',
    gap: t.space[5],
    paddingHorizontal: t.layout.screenX,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: t.space[1],
    paddingVertical: t.space[3],
  },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.body.fontSize,
    lineHeight: t.typography.body.lineHeight,
    color: t.colors.mutedForeground,
  },
  count: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.mutedForeground,
    fontVariant: ['tabular-nums'],
  },
  strong: { fontWeight: '600' },
  bar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: BAR,
    borderTopLeftRadius: BAR,
    borderTopRightRadius: BAR,
    backgroundColor: t.colors.primary,
  },
}));

function Tab({
  label,
  count,
  selected,
  onPress,
  onLayout,
}: {
  label: string;
  count?: number;
  selected: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const on = useSwitch(selected, 'base');
  const idle = t.colors.mutedForeground;
  const point = t.colors.primary;
  const tone = useAnimatedStyle(() => ({
    color: interpolateColor(on.value, [0, 1], [idle, point]),
  }));
  return (
    <PressableBase
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={count === undefined ? label : `${label} ${count}`}
      feedback="row"
      onPress={onPress}
      onLayout={onLayout}
      style={s.tab}
    >
      <SteadyText
        selected={selected}
        style={s.label}
        strongStyle={s.strong}
        animatedStyle={tone}
      >
        {label}
      </SteadyText>
      {count === undefined ? null : (
        <RollText style={s.count} animatedStyle={tone}>
          {count}
        </RollText>
      )}
    </PressableBase>
  );
}

export function SegmentedTabs<T extends string>({
  items,
  value,
  onValueChange,
  style,
}: SegmentedTabsProps<T>) {
  const s = useStyles();
  const slide = useSlide(value);
  return (
    <View style={[s.root, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.track}
        accessibilityRole="tablist"
      >
        {items.map((item) => {
          const selected = item.value === value;
          return (
            <Tab
              key={item.value}
              label={item.label}
              count={item.count}
              selected={selected}
              onPress={() => {
                if (selected) return;
                haptic('select');
                onValueChange(item.value);
              }}
              onLayout={slide.measure(item.value)}
            />
          );
        })}
        <Animated.View pointerEvents="none" style={[s.bar, slide.bar]} />
      </ScrollView>
    </View>
  );
}
