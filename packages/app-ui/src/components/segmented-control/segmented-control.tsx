import { View, type TextStyle } from 'react-native';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { Text } from '../text/text';

export type SegmentedControlItem<T extends string> = {
  value: T;
  label: string;
  icon?: IconSlot;
  weight?: TextStyle['fontWeight'];
};

export type SegmentedControlProps<T extends string> = {
  items: readonly SegmentedControlItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
};

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    padding: t.space[1],
    borderRadius: t.radius.md,
    backgroundColor: t.colors.muted,
  },
  item: {
    flex: 1,
    height: t.space[8],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.sm,
  },
  on: { backgroundColor: t.colors.surface, boxShadow: t.shadow.sm },
  label: {
    fontSize: t.typography.eyebrow.fontSize,
    fontFamily: t.fontFamily,
    letterSpacing: t.typography.eyebrow.letterSpacing,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.mutedForeground,
  },
  labelOn: { color: t.colors.title, fontWeight: '600' },
}));

export function SegmentedControl<T extends string>({
  items,
  value,
  onValueChange,
}: SegmentedControlProps<T>) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View accessibilityRole="tablist" style={s.root}>
      {items.map((item) => {
        const on = item.value === value;
        return (
          <PressableBase
            key={item.value}
            feedback="none"
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={item.label}
            touchHeight={t.space[8]}
            onPress={() => {
              if (!on) onValueChange(item.value);
            }}
            style={[s.item, on && s.on]}
          >
            {item.icon ? (
              renderIcon(item.icon, {
                color: on ? t.colors.title : t.colors.mutedForeground,
                size: t.iconSize.md,
              })
            ) : (
              <Text
                numberOfLines={1}
                style={[
                  s.label,
                  on && s.labelOn,
                  item.weight ? { fontWeight: item.weight } : null,
                ]}
              >
                {item.label}
              </Text>
            )}
          </PressableBase>
        );
      })}
    </View>
  );
}
