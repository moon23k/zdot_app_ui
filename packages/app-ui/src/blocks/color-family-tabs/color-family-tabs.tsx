import { View } from 'react-native';
import { Text } from '../../components/text/text';
import { haptic } from '../../internal/haptics';
import { PressableBase } from '../../internal/pressable-base';
import { makeStyles } from '../../utils/styles';

export type ColorFamily<T extends string = string> = {
  value: T;
  label: string;
  color: string;
};

export type ColorFamilyTabsProps<T extends string = string> = {
  items: readonly ColorFamily<T>[];
  value: T;
  onValueChange: (value: T) => void;
};

const SWATCH = 32;
const RING = 2;
const RING_GAP = 2;

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row' },
  cell: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: t.space[2],
  },
  swatch: {
    width: SWATCH,
    height: SWATCH,
    borderRadius: t.radius.full,
  },
  ring: {
    position: 'absolute',
    top: -(RING + RING_GAP),
    left: -(RING + RING_GAP),
    right: -(RING + RING_GAP),
    bottom: -(RING + RING_GAP),
    borderRadius: t.radius.full,
    borderWidth: RING,
    borderColor: t.colors.primary,
  },
}));

export function ColorFamilyTabs<T extends string = string>({
  items,
  value,
  onValueChange,
}: ColorFamilyTabsProps<T>) {
  const s = useStyles();
  return (
    <View accessibilityRole="tablist" style={s.row}>
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <PressableBase
            key={item.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={item.label}
            feedback="small"
            onPress={() => {
              haptic('select');
              onValueChange(item.value);
            }}
            style={s.cell}
          >
            <View style={[s.swatch, { backgroundColor: item.color }]}>
              {selected ? <View pointerEvents="none" style={s.ring} /> : null}
            </View>
            <Text
              variant="caption"
              tone={selected ? 'default' : 'muted'}
              weight={selected ? 'semibold' : undefined}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </PressableBase>
        );
      })}
    </View>
  );
}
