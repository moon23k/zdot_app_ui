import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Slider, sliderOrigin } from '../../components/slider/slider';
import { Text } from '../../components/text/text';
import { makeStyles } from '../../utils/styles';

export type SliderListItem = {
  key: string;
  label: string;
  startLabel: string;
  endLabel: string;
};

export type SliderListProps = {
  items: readonly SliderListItem[];
  values: Readonly<Record<string, number>>;
  min?: number;
  max?: number;
  onChange: (key: string, value: number) => void;
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  list: { gap: t.space[4] },
  row: { gap: t.space[1] },
  head: { flexDirection: 'row', alignItems: 'center', gap: t.space[2] },
  start: { flex: 1 },
  end: { flex: 1, textAlign: 'right' },
  lean: { color: t.colors.foreground },
}));

export function SliderList({
  items,
  values,
  min = 0,
  max = 1,
  onChange,
  style,
}: SliderListProps) {
  const s = useStyles();
  const base = sliderOrigin(min, max);
  return (
    <View style={[s.list, style]}>
      {items.map((item) => {
        const value = values[item.key] ?? min;
        const toStart = value < base;
        const toEnd = value > base;
        return (
          <View key={item.key} style={s.row}>
            <View style={s.head}>
              <Text
                variant="label"
                tone="muted"
                weight={toStart ? 'semibold' : undefined}
                numberOfLines={1}
                style={[s.start, toStart && s.lean]}
              >
                {item.startLabel}
              </Text>
              <Text weight="semibold" numberOfLines={1}>
                {item.label}
              </Text>
              <Text
                variant="label"
                tone="muted"
                weight={toEnd ? 'semibold' : undefined}
                numberOfLines={1}
                style={[s.end, toEnd && s.lean]}
              >
                {item.endLabel}
              </Text>
            </View>
            <Slider
              value={value}
              min={min}
              max={max}
              onChange={(next) => onChange(item.key, next)}
              accessibilityLabel={item.label}
            />
          </View>
        );
      })}
    </View>
  );
}
