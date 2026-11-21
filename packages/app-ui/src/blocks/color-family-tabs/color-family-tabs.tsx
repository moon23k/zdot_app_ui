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
const HALO = 4;

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
  halo: {
    position: 'absolute',
    top: -HALO,
    left: -HALO,
    right: -HALO,
    bottom: -HALO,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.raised,
    boxShadow: t.shadow.liftSm,
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
            <View>
              {selected ? <View pointerEvents="none" style={s.halo} /> : null}
              <View style={[s.swatch, { backgroundColor: item.color }]} />
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
