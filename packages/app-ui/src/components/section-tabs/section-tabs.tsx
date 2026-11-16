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
import { SteadyText } from '../../internal/steady-text';
import { useSlide } from '../../internal/use-slide';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type SectionTabsItem<T extends string> = {
  value: T;
  label: string;
  dot?: boolean;
};

export type SectionTabsProps<T extends string> = {
  items: readonly SectionTabsItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
};

const DOT = 6;
const LINE = 2;

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    paddingHorizontal: t.space[2],
    backgroundColor: t.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  tab: {
    flex: 1,
    height: t.minTouchSize,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
  },
  loose: { flex: 0, paddingHorizontal: t.space[3] },
  bare: { paddingHorizontal: 0, backgroundColor: 'transparent' },
  label: {
    ...t.typography.body,
    fontFamily: t.fontFamily,
    color: t.colors.mutedForeground,
  },
  strong: { fontWeight: '600' },
  line: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: LINE,
    backgroundColor: t.colors.foreground,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.danger,
  },
}));

function Tab({
  label,
  dot,
  selected,
  loose,
  onPress,
  onLayout,
}: {
  label: string;
  dot?: boolean;
  selected: boolean;
  loose: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const on = useSwitch(selected, 'base');
  const idle = t.colors.mutedForeground;
  const ink = t.colors.title;
  const tone = useAnimatedStyle(() => ({
    color: interpolateColor(on.value, [0, 1], [idle, ink]),
  }));
  return (
    <PressableBase
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={dot ? `${label}, 확인 필요` : label}
      feedback="row"
      onPress={onPress}
      onLayout={onLayout}
      style={[s.tab, loose && s.loose]}
    >
      <SteadyText
        selected={selected}
        style={s.label}
        strongStyle={s.strong}
        animatedStyle={tone}
      >
        {label}
      </SteadyText>
      {dot ? <View style={s.dot} /> : null}
    </PressableBase>
  );
}

export function SectionTabs<T extends string>({
  items,
  value,
  onValueChange,
  scrollable = false,
  style,
}: SectionTabsProps<T>) {
  const s = useStyles();
  const slide = useSlide(value);
  const tabs = items.map((item) => (
    <Tab
      key={item.value}
      label={item.label}
      dot={item.dot}
      selected={item.value === value}
      loose={scrollable}
      onPress={() => onValueChange(item.value)}
      onLayout={slide.measure(item.value)}
    />
  ));
  const line = (
    <Animated.View pointerEvents="none" style={[s.line, slide.bar]} />
  );
  if (scrollable) {
    return (
      <View style={[s.row, s.bare, style]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          accessibilityRole="tablist"
        >
          {tabs}
          {line}
        </ScrollView>
      </View>
    );
  }
  return (
    <View accessibilityRole="tablist" style={[s.row, style]}>
      {tabs}
      {line}
    </View>
  );
}
