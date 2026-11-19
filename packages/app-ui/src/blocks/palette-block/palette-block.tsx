import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '../../components/text/text';
import { haptic } from '../../internal/haptics';
import { PressableBase } from '../../internal/pressable-base';
import { makeStyles } from '../../utils/styles';

export type PaletteColors = {
  main: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type PaletteBlockProps = {
  colors: PaletteColors;
  height?: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export type ColorDotsProps = { colors: readonly string[] };

export type PaletteLegendItem = { key: string; label: string; color: string };

export type PaletteLegendProps = { items: readonly PaletteLegendItem[] };

export type PaletteThumb<T extends string = string> = {
  key: T;
  label: string;
  colors: PaletteColors;
};

export type PaletteThumbsProps<T extends string = string> = {
  items: readonly PaletteThumb<T>[];
  value: T;
  onValueChange: (key: T) => void;
  height?: number;
};

const AREA = { main: 62, secondary: 26, accent: 12, upper: 78, lower: 22 };
const DOT = 20;
const LEGEND_DOT = 12;
const THUMB = 64;
const RING = 2;
const RING_GAP = 3;

const useStyles = makeStyles((t) => ({
  root: {
    overflow: 'hidden',
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  fill: { flex: 1 },
  upper: { flex: AREA.upper, flexDirection: 'row' },
  lower: { flex: AREA.lower, flexDirection: 'row' },
  main: { flex: AREA.main },
  secondary: { flex: AREA.secondary },
  accent: { flex: AREA.accent },
  background: { flex: AREA.main + AREA.secondary },
  dots: { flexDirection: 'row', gap: t.space[1] },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: t.radius.full,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: t.space[4],
    rowGap: t.space[1],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
  },
  legendDot: {
    width: LEGEND_DOT,
    height: LEGEND_DOT,
    borderRadius: t.radius.full,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  thumbs: { flexDirection: 'row', gap: t.space[3] },
  thumb: { flex: 1, minWidth: 0, gap: t.space[3] },
  ring: {
    position: 'absolute',
    top: -(RING + RING_GAP),
    left: -(RING + RING_GAP),
    right: -(RING + RING_GAP),
    bottom: -(RING + RING_GAP),
    borderRadius: t.radius.lg + RING + RING_GAP,
    borderWidth: RING,
    borderColor: t.colors.primary,
  },
  thumbLabel: { textAlign: 'center' },
}));

export function PaletteBlock({
  colors,
  height,
  label = '팔레트',
  style,
}: PaletteBlockProps) {
  const s = useStyles();
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={label}
      style={[s.root, height === undefined ? s.fill : { height }, style]}
    >
      <View style={s.upper}>
        <View style={[s.main, { backgroundColor: colors.main }]} />
        <View style={[s.secondary, { backgroundColor: colors.secondary }]} />
        <View style={[s.accent, { backgroundColor: colors.accent }]} />
      </View>
      <View style={s.lower}>
        <View style={[s.background, { backgroundColor: colors.background }]} />
        <View style={[s.accent, { backgroundColor: colors.text }]} />
      </View>
    </View>
  );
}

export function ColorDots({ colors }: ColorDotsProps) {
  const s = useStyles();
  return (
    <View style={s.dots}>
      {colors.map((color, i) => (
        <View
          key={`${i}-${color}`}
          style={[s.dot, { backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

export function PaletteLegend({ items }: PaletteLegendProps) {
  const s = useStyles();
  return (
    <View style={s.legend}>
      {items.map((item) => (
        <View key={item.key} style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: item.color }]} />
          <Text variant="label" tone="muted">
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function PaletteThumbs<T extends string = string>({
  items,
  value,
  onValueChange,
  height = THUMB,
}: PaletteThumbsProps<T>) {
  const s = useStyles();
  return (
    <View accessibilityRole="radiogroup" style={s.thumbs}>
      {items.map((item) => {
        const selected = item.key === value;
        return (
          <PressableBase
            key={item.key}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={item.label}
            feedback="small"
            onPress={() => {
              haptic('select');
              onValueChange(item.key);
            }}
            style={s.thumb}
          >
            <View>
              <PaletteBlock
                colors={item.colors}
                height={height}
                label={item.label}
              />
              {selected ? <View pointerEvents="none" style={s.ring} /> : null}
            </View>
            <Text
              variant="label"
              tone={selected ? 'default' : 'muted'}
              weight={selected ? 'semibold' : undefined}
              numberOfLines={1}
              style={s.thumbLabel}
            >
              {item.label}
            </Text>
          </PressableBase>
        );
      })}
    </View>
  );
}
