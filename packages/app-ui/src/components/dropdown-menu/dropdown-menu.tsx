import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import type { Theme } from '../../types';
import { makeStyles } from '../../utils/styles';
import { Text } from '../text/text';

export type SectionAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DropdownMenuItem = {
  key: string;
  icon: IconSlot;
  label: string;
  onPress: () => void;
  tone?: 'danger';
  separated?: boolean;
};

export type DropdownMenuProps = {
  open: boolean;
  anchor: SectionAnchor | null;
  items: readonly DropdownMenuItem[];
  onOpenChange: (open: boolean) => void;
  closeLabel?: string;
};

const WIDTH = 200;

const useStyles = makeStyles((t) => ({
  menu: {
    position: 'absolute',
    width: WIDTH,
    paddingVertical: t.space[1],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.md,
  },
  item: {
    height: t.space[12],
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
    paddingHorizontal: t.space[4],
  },
  line: {
    height: 1,
    marginVertical: t.space[1],
    backgroundColor: t.colors.border,
  },
}));

function menuHeight(t: Theme, items: readonly DropdownMenuItem[]): number {
  const lines = items.filter((item, i) => i > 0 && item.separated).length;
  return (
    t.space[1] * 2 + items.length * t.space[12] + lines * (1 + t.space[1] * 2)
  );
}

export function DropdownMenu({
  open,
  anchor,
  items,
  onOpenChange,
  closeLabel = '닫기',
}: DropdownMenuProps) {
  const t = useTheme();
  const s = useStyles();
  const screen = useWindowDimensions();
  if (!open || !anchor) return null;
  const height = menuHeight(t, items);
  const below = anchor.y + anchor.height;
  const top =
    below + height > screen.height - t.space[4]
      ? Math.max(t.space[4], anchor.y - height)
      : below;
  const right = Math.max(
    t.space[2],
    screen.width - (anchor.x + anchor.width) + t.space[2]
  );
  const close = () => onOpenChange(false);
  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={close}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={close}
        accessibilityRole="button"
        accessibilityLabel={closeLabel}
      />
      <View accessibilityRole="menu" style={[s.menu, { top, right }]}>
        {items.map((item, i) => {
          const color =
            item.tone === 'danger' ? t.colors.danger : t.colors.title;
          return (
            <View key={item.key}>
              {i > 0 && item.separated ? <View style={s.line} /> : null}
              <PressableBase
                accessibilityRole="menuitem"
                accessibilityLabel={item.label}
                feedback="row"
                onPress={() => {
                  item.onPress();
                  close();
                }}
                style={s.item}
              >
                {renderIcon(item.icon, { color, size: t.iconSize.md })}
                <Text
                  numberOfLines={1}
                  tone={item.tone === 'danger' ? 'danger' : 'default'}
                  style={item.tone === 'danger' ? undefined : { color }}
                >
                  {item.label}
                </Text>
              </PressableBase>
            </View>
          );
        })}
      </View>
    </Modal>
  );
}
