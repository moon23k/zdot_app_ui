import { useRef, useState, type ComponentRef, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text } from '../components/text/text';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';
import { AxisTabs } from './axis-tabs';
import { AxisWheel, type AxisLevel } from './axis-wheel';

export type AxisLevels = Readonly<Record<string, AxisLevel>>;

export type AxisAdjustItem = {
  key: string;
  label: string;
  title: string;
  startLabel: string;
  endLabel: string;
};

export type AxisAdjustProps = {
  items: readonly AxisAdjustItem[];
  levels: AxisLevels;
  onChange: (key: string, level: AxisLevel) => void;
  renderPreview: (
    key: string | null,
    levels: AxisLevels,
    size: { width: number; height: number }
  ) => ReactNode;
  wholeLabel?: string;
  centerLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const PEEK = 38;
const LOCK = 700;
const TITLE_SIZE = 22;
const TITLE_LEADING = 30;
const TITLE_TRACKING = -0.48;

const useStyles = makeStyles((t) => ({
  root: { flex: 1, marginHorizontal: -t.layout.screenX },
  title: {
    paddingHorizontal: t.layout.screenX,
    paddingBottom: t.space[4],
    fontSize: TITLE_SIZE,
    lineHeight: TITLE_LEADING,
    letterSpacing: TITLE_TRACKING,
    fontWeight: '600',
    color: t.colors.title,
  },
  rail: { flex: 1, minHeight: 0 },
  pager: { flexGrow: 0 },
  card: {
    overflow: 'hidden',
    borderRadius: t.radius.xl,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.liftSm,
  },
  wheel: { marginTop: t.space[6] },
  tabs: { marginTop: t.space[4], marginBottom: t.space[2] },
}));

const snap = (
  Platform.OS === 'web'
    ? { scrollSnapType: 'x mandatory', scrollPaddingLeft: 20 }
    : null
) as ViewStyle | null;

const snapped = (
  Platform.OS === 'web' ? { scrollSnapAlign: 'start' } : null
) as ViewStyle | null;

export function AxisAdjust({
  items,
  levels,
  onChange,
  renderPreview,
  wholeLabel = '전체',
  centerLabel,
  style,
}: AxisAdjustProps) {
  const t = useTheme();
  const s = useStyles();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const lock = useRef(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [selected, setSelected] = useState(items[0]?.key ?? '');
  const [whole, setWhole] = useState(false);
  const [plain, setPlain] = useState(false);
  const item = items.find((i) => i.key === selected) ?? items[0];
  if (!item) return null;
  const gap = t.space[3];
  const card = Math.max(0, size.width - t.layout.screenX - gap - PEEK - 8);
  const step = card + gap;
  const pages: readonly (string | null)[] = [...items.map((i) => i.key), null];
  const neutral = Object.fromEntries(
    items.map((i) => [i.key, 0])
  ) as AxisLevels;

  const select = (key: string) => {
    const index = items.findIndex((i) => i.key === key);
    setSelected(key);
    setWhole(false);
    lock.current = Date.now() + LOCK;
    scroll.current?.scrollTo({ x: index * step, animated: true });
  };
  const follow = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!step || Date.now() < lock.current) return;
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const last =
      contentOffset.x + layoutMeasurement.width >= contentSize.width - 4;
    const index = last
      ? pages.length - 1
      : Math.min(pages.length - 1, Math.round(contentOffset.x / step));
    const key = pages[index];
    if (key === null) {
      setWhole(true);
    } else if (key !== undefined) {
      setWhole(false);
      setSelected(key);
    }
  };

  return (
    <View style={[s.root, style]}>
      <Text accessibilityRole="header" numberOfLines={1} style={s.title}>
        {item.title}
      </Text>
      <View
        style={s.rail}
        onLayout={(e: LayoutChangeEvent) => {
          const { width, height } = e.nativeEvent.layout;
          setSize({ width, height });
        }}
      >
        {card > 0 && size.height > 0 ? (
          <ScrollView
            ref={scroll}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={step}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={follow}
            contentContainerStyle={{
              gap,
              paddingHorizontal: t.layout.screenX,
            }}
            style={[s.pager, { height: size.height }, snap]}
          >
            {pages.map((key) => (
              <Pressable
                key={key ?? 'whole'}
                onLongPress={() => setPlain(true)}
                onPressOut={() => setPlain(false)}
                accessibilityLabel={
                  items.find((i) => i.key === key)?.label ?? wholeLabel
                }
                style={[
                  s.card,
                  { width: card, height: size.height - t.space[1] },
                  snapped,
                ]}
              >
                {renderPreview(key, plain ? neutral : levels, {
                  width: card,
                  height: size.height - t.space[1],
                })}
              </Pressable>
            ))}
          </ScrollView>
        ) : null}
      </View>
      <AxisWheel
        key={item.key}
        level={levels[item.key] ?? 0}
        onChange={(level) => onChange(item.key, level)}
        startLabel={item.startLabel}
        endLabel={item.endLabel}
        centerLabel={centerLabel}
        nudge={item.key === items[0]?.key}
        accessibilityLabel={item.label}
        style={s.wheel}
      />
      <AxisTabs
        items={items.map((i) => ({
          key: i.key,
          label: i.label,
          changed: (levels[i.key] ?? 0) !== 0,
        }))}
        selected={whole ? null : item.key}
        onSelect={select}
        style={s.tabs}
      />
    </View>
  );
}
