import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '../../components/text/text';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type QuickAction = {
  key: string;
  icon: IconSlot;
  label: string;
  onPress: () => void;
};

export type QuickActionsProps = {
  items: readonly QuickAction[];
  grouped?: boolean;
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    gap: t.space[2],
    paddingHorizontal: t.layout.screenX,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: t.space[1],
    paddingVertical: t.space[3],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  },
  group: {
    marginTop: t.space[4],
    marginHorizontal: t.layout.screenX,
    paddingHorizontal: 0,
    paddingVertical: t.space[1],
    gap: 0,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  },
  groupItem: { gap: t.space[2], backgroundColor: 'transparent' },
}));

export function QuickActions({
  items,
  grouped = false,
  style,
}: QuickActionsProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.root, grouped && s.group, style]}>
      {items.map((item) => (
        <PressableBase
          key={item.key}
          onPress={item.onPress}
          accessibilityLabel={item.label}
          style={[s.item, grouped && s.groupItem]}
          feedback="small"
        >
          {renderIcon(item.icon, {
            color: grouped ? t.colors.primary : t.colors.foreground,
            size: t.iconSize.md,
          })}
          <Text variant="caption" numberOfLines={1}>
            {item.label}
          </Text>
        </PressableBase>
      ))}
    </View>
  );
}
