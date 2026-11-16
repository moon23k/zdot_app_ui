import {
  Image,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSwitch } from '../../internal/motion';
import { PressableBase } from '../../internal/pressable-base';
import { TAB_ICONS } from '../../internal/tab-icon-pairs';
import { useSlide } from '../../internal/use-slide';
import { useTheme } from '../../theme/theme-provider';
import type { Theme } from '../../types';
import { makeStyles } from '../../utils/styles';
import { haptic } from '../../internal/haptics';

export type FloatingTabIcon = keyof typeof TAB_ICONS;

export type FloatingTabBarItem<K extends string> = {
  key: K;
  label: string;
  icon: FloatingTabIcon;
  badge?: string;
};

export type FloatingTabBarProps<K extends string> = {
  items: readonly FloatingTabBarItem<K>[];
  value: K;
  onValueChange: (key: K) => void;
  bottomInset?: number;
  style?: StyleProp<ViewStyle>;
};

const ICON = 24;
const DOT = 6;
const DOT_INSET = 6;
const LIFT = 1.08;

export function floatingTabBarSpace(t: Theme, bottomInset = 0) {
  return bottomInset + t.space['16'] + t.space['4'] + t.space['2'];
}

const useStyles = makeStyles((t) => ({
  bar: {
    position: 'absolute',
    left: t.space['4'],
    right: t.space['4'],
    height: t.space['16'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space['1'],
    paddingHorizontal: t.space['2'],
    borderRadius: t.radius.full,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.sm,
  },
  tab: {
    flex: 1,
    height: t.controlSize.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.full,
  },
  pill: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.primaryTint,
  },
  icon: { width: ICON, height: ICON },
  dot: {
    position: 'absolute',
    top: 0,
    left: ICON - DOT_INSET,
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: t.colors.primaryEdge,
  },
}));

function Tab<K extends string>({
  item,
  selected,
  onPress,
  onLayout,
}: {
  item: FloatingTabBarItem<K>;
  selected: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const lift = useSwitch(selected, 'spring', 'spring');
  const grow = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + (LIFT - 1) * lift.value }],
  }));
  return (
    <PressableBase
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={
        item.badge ? `${item.label}, ${item.badge}` : item.label
      }
      touchHeight={t.controlSize.md}
      feedback="small"
      onPress={onPress}
      onLayout={onLayout}
      style={s.tab}
    >
      <Animated.View style={[s.icon, grow]}>
        <Image
          source={{ uri: TAB_ICONS[item.icon][selected ? 'fill' : 'line'] }}
          style={[
            s.icon,
            {
              tintColor: selected ? t.colors.primary : t.colors.mutedForeground,
            },
          ]}
        />
        {item.badge ? <View testID="tab-badge" style={s.dot} /> : null}
      </Animated.View>
    </PressableBase>
  );
}

export function FloatingTabBar<K extends string>({
  items,
  value,
  onValueChange,
  bottomInset = 0,
  style,
}: FloatingTabBarProps<K>) {
  const t = useTheme();
  const s = useStyles();
  const slide = useSlide(value);
  return (
    <View
      accessibilityRole="tablist"
      style={[s.bar, { bottom: bottomInset + t.space['4'] }, style]}
    >
      <Animated.View pointerEvents="none" style={[s.pill, slide.box]} />
      {items.map((item) => {
        const selected = item.key === value;
        return (
          <Tab
            key={item.key}
            item={item}
            selected={selected}
            onPress={() => {
              if (selected) return;
              haptic('select');
              onValueChange(item.key);
            }}
            onLayout={slide.measure(item.key)}
          />
        );
      })}
    </View>
  );
}
