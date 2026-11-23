import { View } from 'react-native';
import { Text } from '../../components/text/text';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import type { Theme } from '../../types';
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

const TOOL = { width: 72, height: 56 } as const;
const LABEL = 11;
const LABEL_LINE = 15;

function dockBottom(t: Theme, bottomInset = 0) {
  return Math.max(bottomInset, t.space[4]);
}

export function studioDockSpace(t: Theme, bottomInset?: number): number {
  return dockBottom(t, bottomInset) + TOOL.height + t.space[1] * 2 + t.space[4];
}

const useStyles = makeStyles((t) => ({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dock: {
    flexDirection: 'row',
    gap: t.space[2],
    paddingVertical: t.space[1],
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.md * 2,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.lift,
  },
  tool: {
    width: TOOL.width,
    height: TOOL.height,
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    borderRadius: t.radius.md,
  },
  label: { color: t.colors.title, fontSize: LABEL, lineHeight: LABEL_LINE },
}));

export function StudioDock({ items, bottomInset }: StudioDockProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View
      pointerEvents="box-none"
      style={[s.wrap, { bottom: dockBottom(t, bottomInset) }]}
    >
      <View accessibilityRole="toolbar" style={s.dock}>
        {items.map((item) => (
          <PressableBase
            key={item.key}
            onPress={item.onPress}
            disabled={item.disabled}
            accessibilityLabel={item.label}
            feedback="small"
            style={s.tool}
          >
            {renderIcon(item.icon, {
              color: t.colors.title,
              size: t.space[6],
            })}
            <Text variant="caption" numberOfLines={1} style={s.label}>
              {item.label}
            </Text>
          </PressableBase>
        ))}
      </View>
    </View>
  );
}
