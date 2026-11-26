import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { isFigureText } from '../components/text/figures';
import { Text } from '../components/text/text';
import { PressableBase } from '../internal/pressable-base';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';

export type DialItem = {
  key: string;
  label: string;
  value?: number;
  max?: number;
  color?: string;
  text?: string;
};

export type DialStripProps = {
  items: readonly DialItem[];
  selected: string;
  onSelect: (key: string) => void;
  spread?: boolean;
  percent?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SIZE = 48;
const STROKE = 3;

const useStyles = makeStyles((t) => ({
  row: { gap: t.space[3], paddingHorizontal: t.layout.screenX },
  spread: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  item: { alignItems: 'center', gap: t.space[1] },
  ring: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZE / 2,
  },
  lifted: { boxShadow: t.shadow.liftSm },
  value: { position: 'absolute' },
  figure: { fontWeight: '500' },
}));

const ORIGIN = 50;

const signed = (v: number) => (v > 0 ? `+${v}` : String(v));

const shownOf = (item: DialItem, percent: boolean) =>
  percent ? String(Math.round(item.value ?? ORIGIN)) : signed(item.value ?? 0);

function Ring({
  item,
  on,
  percent = false,
}: {
  item: DialItem;
  on: boolean;
  percent?: boolean;
}) {
  const t = useTheme();
  const s = useStyles();
  const r = (SIZE - STROKE) / 2;
  const c = 2 * Math.PI * r;
  if (item.color) {
    return (
      <View style={[s.ring, on && s.lifted]}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={r}
            fill={item.color}
            stroke={on ? t.colors.raised : t.colors.border}
            strokeWidth={STROKE}
          />
        </Svg>
      </View>
    );
  }
  const v = percent ? (item.value ?? ORIGIN) - ORIGIN : (item.value ?? 0);
  const frac = Math.min(1, Math.abs(v) / (item.max ?? (percent ? ORIGIN : 2)));
  const shown = item.text ?? shownOf(item, percent);
  return (
    <View style={[s.ring, on && s.lifted]}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={r}
          fill={on ? t.colors.raised : t.colors.recess}
          stroke={t.colors.line}
          strokeWidth={STROKE}
        />
        {frac > 0 ? (
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={r}
            fill="none"
            stroke={on ? t.colors.arc : t.colors.arcMuted}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${c * frac} ${c}`}
            transform={`${v < 0 ? `translate(${SIZE},0) scale(-1,1) ` : ''}rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        ) : null}
      </Svg>
      <Text
        variant="caption"
        weight={on ? 'semibold' : 'medium'}
        tone={on ? 'default' : 'muted'}
        style={[s.value, on && isFigureText(shown) && s.figure]}
      >
        {shown}
      </Text>
    </View>
  );
}

export type AxisRingProps = { value: number; max?: number; on?: boolean };

export function AxisRing({ value, max, on = false }: AxisRingProps) {
  return <Ring item={{ key: 'axis', label: '', value, max }} on={on} />;
}

export function DialStrip({
  items,
  selected,
  onSelect,
  spread = false,
  percent = false,
  style,
}: DialStripProps) {
  const s = useStyles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[s.row, spread && s.spread]}
      style={style}
    >
      {items.map((item) => {
        const on = item.key === selected;
        return (
          <PressableBase
            key={item.key}
            onPress={() => onSelect(item.key)}
            accessibilityRole="button"
            accessibilityLabel={
              item.color || item.text
                ? item.label
                : `${item.label} ${shownOf(item, percent)}`
            }
            accessibilityState={{ selected: on }}
            style={s.item}
          >
            <Ring item={item} on={on} percent={percent} />
            <Text
              variant="caption"
              weight={on ? 'semibold' : 'regular'}
              tone={on ? 'default' : 'muted'}
            >
              {item.label}
            </Text>
          </PressableBase>
        );
      })}
    </ScrollView>
  );
}
