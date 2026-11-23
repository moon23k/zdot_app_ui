import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '../components/text/text';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';
import { PressableBase } from './pressable-base';

export type SampleTile<T extends string> = {
  value: T;
  name: string;
  sample: ReactNode;
};

export type SampleTilesProps<T extends string> = {
  items: readonly SampleTile<T>[];
  value: T;
  onValueChange: (value: T) => void;
};

const RING = 2;

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', gap: t.space[2] },
  tile: {
    flex: 1,
    height: t.space[16] + t.space[6],
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    borderRadius: t.radius.md,
    backgroundColor: t.colors.background,
  },
  ring: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: t.radius.md,
    borderWidth: RING,
    borderColor: t.colors.primary,
  },
  on: { color: t.colors.selectForeground },
}));

export function SampleTiles<T extends string>({
  items,
  value,
  onValueChange,
}: SampleTilesProps<T>) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.row} accessibilityRole="radiogroup">
      {items.map((item) => {
        const on = item.value === value;
        return (
          <PressableBase
            key={item.value}
            feedback="small"
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={item.name}
            onPress={() => onValueChange(item.value)}
            style={s.tile}
          >
            {item.sample}
            <Text
              variant="caption"
              tone="muted"
              weight={on ? 'semibold' : undefined}
              numberOfLines={1}
              maxFontSizeMultiplier={t.maxFontScale}
              style={on && s.on}
            >
              {item.name}
            </Text>
            {on ? <View pointerEvents="none" style={s.ring} /> : null}
          </PressableBase>
        );
      })}
    </View>
  );
}

export function useSampleStyle() {
  const t = useTheme();
  return {
    fontSize: t.typography.screenTitle.fontSize,
    lineHeight: t.typography.screenTitle.lineHeight,
    color: t.colors.title,
  };
}
