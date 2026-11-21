import { useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { sliderOrigin } from '../components/slider/slider';
import { makeStyles } from '../utils/styles';
import { AxisDial } from './axis-dial';
import { DialStrip } from './dial-strip';

export type AxisDialGroupItem = {
  key: string;
  label: string;
  startLabel: string;
  endLabel: string;
};

export type AxisDialGroupProps = {
  items: readonly AxisDialGroupItem[];
  values: Readonly<Record<string, number>>;
  min?: number;
  max?: number;
  onChange: (key: string, value: number) => void;
  centerLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  root: { gap: t.layout.sectionGap },
}));

export function AxisDialGroup({
  items,
  values,
  min = -2,
  max = 2,
  onChange,
  centerLabel = '중간',
  style,
}: AxisDialGroupProps) {
  const s = useStyles();
  const [selected, setSelected] = useState(items[0]?.key ?? '');
  const item = items.find((i) => i.key === selected) ?? items[0];
  if (!item) return null;
  const base = sliderOrigin(min, max);
  const value = values[item.key] ?? base;
  return (
    <View style={[s.root, style]}>
      <DialStrip
        spread
        items={items.map((i) => ({
          key: i.key,
          label: i.label,
          value: values[i.key] ?? base,
          max: Math.max(Math.abs(min), Math.abs(max)),
        }))}
        selected={item.key}
        onSelect={setSelected}
      />
      <AxisDial
        value={value}
        min={min}
        max={max}
        onChange={(next) => onChange(item.key, next)}
        valueLabel={
          value > base
            ? item.endLabel
            : value < base
              ? item.startLabel
              : centerLabel
        }
        startLabel={item.startLabel}
        endLabel={item.endLabel}
        accessibilityLabel={item.label}
      />
    </View>
  );
}
