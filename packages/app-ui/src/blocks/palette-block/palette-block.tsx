import { View, type StyleProp, type ViewStyle } from 'react-native';
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

const AREA = { main: 62, secondary: 26, accent: 12, upper: 78, lower: 22 };
const DOT = 20;

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
