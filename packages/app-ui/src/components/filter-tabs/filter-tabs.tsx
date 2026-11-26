import { useState } from 'react';
import {
  ScrollView,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { haptic } from '../../internal/haptics';
import { useSwitch } from '../../internal/motion';
import { PressableBase } from '../../internal/pressable-base';
import { SteadyText } from '../../internal/steady-text';
import { useSlide } from '../../internal/use-slide';
import { useTheme } from '../../theme/theme-provider';
import { withAlpha } from '../../utils/color';
import { gradientStyle, makeStyles } from '../../utils/styles';

export type FilterTabsItem<T extends string> = {
  value: T;
  label: string;
};

export type FilterTabsProps<T extends string> = {
  items: readonly FilterTabsItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  bleed?: boolean;
  style?: StyleProp<ViewStyle>;
};

const ROW = 44;
const GAP = 22;
const LINE = 2;
const HAIR = 0.5;
const HAIR_ALPHA = 0.6;
const FADE = 72;
const SOLID = 8;

const useStyles = makeStyles((t) => ({
  root: { height: ROW },
  bleed: { marginHorizontal: -t.layout.screenX },
  track: { gap: GAP },
  padded: { paddingHorizontal: t.layout.screenX },
  tab: { height: ROW, justifyContent: 'center' },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    letterSpacing: t.typography.label.letterSpacing,
    lineHeight: t.typography.label.lineHeight,
    fontWeight: '500',
    color: t.colors.faint,
  },
  strong: { fontWeight: '600' },
  line: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: LINE,
    backgroundColor: t.colors.primary,
  },
  hair: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HAIR,
    opacity: HAIR_ALPHA,
    backgroundColor: t.colors.input,
  },
  fade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: HAIR,
    width: FADE,
  },
}));

function Tab({
  label,
  selected,
  onPress,
  onLayout,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const on = useSwitch(selected, 'base');
  const idle = t.colors.faint;
  const ink = t.colors.title;
  const tone = useAnimatedStyle(() => ({
    color: interpolateColor(on.value, [0, 1], [idle, ink]),
  }));
  return (
    <PressableBase
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
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
    </PressableBase>
  );
}

export function FilterTabs<T extends string>({
  items,
  value,
  onValueChange,
  bleed = false,
  style,
}: FilterTabsProps<T>) {
  const t = useTheme();
  const s = useStyles();
  const slide = useSlide(value);
  const [view, setView] = useState({ x: 0, width: 0, content: 0 });
  const more = view.content - view.x - view.width > 1;
  const scrolled = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    setView((v) => (v.x === x ? v : { ...v, x }));
  };
  const bg = t.colors.background;
  return (
    <View style={[s.root, bleed && s.bleed, style]}>
      <View pointerEvents="none" style={s.hair} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="tablist"
        contentContainerStyle={[s.track, bleed && s.padded]}
        scrollEventThrottle={16}
        onScroll={scrolled}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          setView((v) => (v.width === width ? v : { ...v, width }));
        }}
        onContentSizeChange={(content) =>
          setView((v) => (v.content === content ? v : { ...v, content }))
        }
      >
        {items.map((item) => {
          const selected = item.value === value;
          return (
            <Tab
              key={item.value}
              label={item.label}
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
        <Animated.View pointerEvents="none" style={[s.line, slide.bar]} />
      </ScrollView>
      {more ? (
        <View
          pointerEvents="none"
          style={[
            s.fade,
            gradientStyle(
              `linear-gradient(270deg, ${bg} ${(SOLID / FADE) * 100}%, ${withAlpha(bg, 0)})`
            ),
          ]}
        />
      ) : null}
    </View>
  );
}
