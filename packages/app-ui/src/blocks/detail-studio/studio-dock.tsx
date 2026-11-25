import { View } from 'react-native';
import { Text } from '../../components/text/text';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type StudioDockItem = {
  key: string;
  icon: IconSlot;
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export type StudioDockProps = {
  items: readonly StudioDockItem[];
  bottomInset?: number;
};

const useStyles = makeStyles((t) => ({
  dock: {
    flexDirection: 'row',
    paddingTop: t.space[1],
    paddingHorizontal: t.space[2],
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  tool: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    paddingVertical: t.space[2],
    borderRadius: t.radius.md,
  },
}));

export function StudioDock({ items, bottomInset = 0 }: StudioDockProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View
      accessibilityRole="toolbar"
      style={[s.dock, { paddingBottom: Math.max(bottomInset, t.space[2]) }]}
    >
      {items.map((item) => {
        const color = item.disabled
          ? t.colors.disabledForeground
          : t.colors.title;
        return (
          <PressableBase
            key={item.key}
            onPress={item.onPress}
            disabled={item.disabled}
            disabledStyle={{}}
            accessibilityLabel={item.label}
            feedback="small"
            style={s.tool}
          >
            {renderIcon(item.icon, { color, size: t.space[6] })}
            <Text variant="caption" numberOfLines={1} style={{ color }}>
              {item.label}
            </Text>
          </PressableBase>
        );
      })}
    </View>
  );
}
