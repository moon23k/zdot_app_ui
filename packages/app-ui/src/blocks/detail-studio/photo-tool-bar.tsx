import { ScrollView, View } from 'react-native';
import { Button } from '../../components/button/button';
import { CreditCost } from '../../components/credit/credit';
import { Text } from '../../components/text/text';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type PhotoToolItem = {
  key: string;
  icon: IconSlot;
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  cost?: number | null;
};

export type PhotoToolBarProps = {
  items: readonly PhotoToolItem[];
  action: { label: string; onPress: () => void };
};

const useStyles = makeStyles((t) => ({
  bar: {
    height: t.space[16],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.space[1],
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  tools: { flex: 1 },
  row: { alignItems: 'center', gap: t.space[1] },
  item: {
    width: t.space[16],
    height: t.space[16],
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    borderRadius: t.radius.md,
  },
  on: { backgroundColor: t.colors.muted },
  cost: { position: 'absolute', top: t.space[1], right: 0 },
}));

export function PhotoToolBar({ items, action }: PhotoToolBarProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View accessibilityRole="toolbar" style={s.bar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.tools}
        contentContainerStyle={s.row}
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
              feedback="small"
              accessibilityLabel={item.label}
              accessibilityState={
                item.active === undefined
                  ? undefined
                  : { selected: item.active }
              }
              style={[s.item, item.active && s.on]}
            >
              {renderIcon(item.icon, { color, size: t.iconSize.md })}
              <Text variant="caption" numberOfLines={1} style={{ color }}>
                {item.label}
              </Text>
              {item.cost != null ? (
                <View pointerEvents="none" style={s.cost}>
                  <CreditCost
                    value={item.cost}
                    tone={item.disabled ? 'disabled' : 'muted'}
                  />
                </View>
              ) : null}
            </PressableBase>
          );
        })}
      </ScrollView>
      <Button variant="ghost" size="sm" onPress={action.onPress}>
        {action.label}
      </Button>
    </View>
  );
}
