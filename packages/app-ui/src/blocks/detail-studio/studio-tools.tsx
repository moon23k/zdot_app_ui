import { useRef, type ComponentRef } from 'react';
import { View } from 'react-native';
import { CreditCost } from '../../components/credit/credit';
import type { SectionAnchor } from '../../components/dropdown-menu/dropdown-menu';
import { Text } from '../../components/text/text';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type StudioToolItem = {
  key: string;
  icon: IconSlot;
  label: string;
  onPress: (anchor?: SectionAnchor) => void;
  menu?: boolean;
  active?: boolean;
  accent?: boolean;
  disabled?: boolean;
  cost?: number | null;
};

export type StudioToolsProps = {
  items: readonly StudioToolItem[];
  docked?: boolean;
};

const useStyles = makeStyles((t) => ({
  bar: {
    paddingVertical: t.space[2],
    paddingHorizontal: t.space[2],
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  row: { flexDirection: 'row', gap: t.space[1] },
  inset: { paddingHorizontal: t.space[2] },
  cell: { flex: 1 },
  item: {
    alignItems: 'center',
    gap: t.space[1],
    paddingVertical: t.space[1],
  },
  circle: {
    width: t.minTouchSize,
    height: t.minTouchSize,
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.background,
  },
  on: { backgroundColor: t.colors.primaryTint },
  cost: { position: 'absolute', top: 0, right: 0 },
}));

export function StudioTools({ items, docked = true }: StudioToolsProps) {
  const t = useTheme();
  const s = useStyles();
  const cells = useRef<Record<string, ComponentRef<typeof View> | null>>({});
  const press = (item: StudioToolItem) => {
    const cell = item.menu ? cells.current[item.key] : null;
    if (!cell) {
      item.onPress();
      return;
    }
    cell.measureInWindow((x, y, width, height) =>
      item.onPress({ x, y, width, height })
    );
  };
  return (
    <View accessibilityRole="toolbar" style={[s.row, docked ? s.bar : s.inset]}>
      {items.map((item) => {
        const hot = !item.disabled && (item.active || item.accent);
        const color = item.disabled
          ? t.colors.disabledForeground
          : hot
            ? t.colors.selectForeground
            : t.colors.title;
        return (
          <View
            key={item.key}
            ref={(node) => {
              cells.current[item.key] = node;
            }}
            collapsable={false}
            style={s.cell}
          >
            <PressableBase
              onPress={() => press(item)}
              disabled={item.disabled}
              disabledStyle={{}}
              feedback="small"
              accessibilityLabel={item.label}
              accessibilityState={
                item.active === undefined
                  ? undefined
                  : { selected: item.active }
              }
              style={s.item}
            >
              <View style={[s.circle, hot && s.on]}>
                {renderIcon(item.icon, { color, size: t.iconSize.md })}
              </View>
              <Text
                variant="caption"
                numberOfLines={1}
                weight={hot ? 'semibold' : undefined}
                style={{ color }}
              >
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
          </View>
        );
      })}
    </View>
  );
}
