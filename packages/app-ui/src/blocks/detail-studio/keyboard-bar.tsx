import { View } from 'react-native';
import { Button } from '../../components/button/button';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type KeyboardBarItem = {
  key: string;
  icon: IconSlot;
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
};

export type KeyboardBarProps = {
  items: readonly KeyboardBarItem[];
  action: { label: string; onPress: () => void };
};

const useStyles = makeStyles((t) => ({
  bar: {
    height: t.minTouchSize,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.space[1],
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
    backgroundColor: t.colors.background,
  },
  item: {
    width: t.minTouchSize,
    height: t.minTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.md,
  },
  on: { backgroundColor: t.colors.muted },
  end: { marginLeft: 'auto' },
}));

export function KeyboardBar({ items, action }: KeyboardBarProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View accessibilityRole="toolbar" style={s.bar}>
      {items.map((item) => (
        <PressableBase
          key={item.key}
          onPress={item.onPress}
          disabled={item.disabled}
          disabledStyle={{}}
          accessibilityLabel={item.label}
          accessibilityState={
            item.active === undefined ? undefined : { selected: item.active }
          }
          style={[s.item, item.active && s.on]}
        >
          {renderIcon(item.icon, {
            color: item.disabled ? t.colors.input : t.colors.title,
            size: t.space[6],
          })}
        </PressableBase>
      ))}
      <View style={s.end}>
        <Button variant="ghost" size="md" onPress={action.onPress}>
          {action.label}
        </Button>
      </View>
    </View>
  );
}
