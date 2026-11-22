import { useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
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
  onChange: (key: string, value: number) => void;
  centerLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const ORIGIN = 50;

const useStyles = makeStyles((t) => ({
  root: { gap: t.layout.sectionGap },
}));

export function AxisDialGroup({
  items,
  values,
  onChange,
  centerLabel = '중간',
  style,
}: AxisDialGroupProps) {
  const s = useStyles();
  const [selected, setSelected] = useState(items[0]?.key ?? '');
  const item = items.find((i) => i.key === selected) ?? items[0];
  if (!item) return null;
  return (
    <View style={[s.root, style]}>
      <DialStrip
        spread
        percent
        items={items.map((i) => ({
          key: i.key,
          label: i.label,
          value: values[i.key] ?? ORIGIN,
        }))}
        selected={item.key}
        onSelect={setSelected}
      />
      <AxisDial
        value={values[item.key] ?? ORIGIN}
        onChange={(next) => onChange(item.key, next)}
        startLabel={item.startLabel}
        endLabel={item.endLabel}
        centerLabel={centerLabel}
        accessibilityLabel={item.label}
      />
    </View>
  );
}
