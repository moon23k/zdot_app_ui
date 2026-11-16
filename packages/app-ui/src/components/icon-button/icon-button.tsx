import { View, type StyleProp, type ViewStyle } from 'react-native';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type IconButtonProps = {
  icon: IconSlot;
  accessibilityLabel: string;
  onPress?: () => void;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SIZE = 40;
const DOT = 8;

const useStyles = makeStyles((t) => ({
  root: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.muted,
  },
  pressed: { backgroundColor: t.colors.border },
  dot: {
    position: 'absolute',
    top: t.space[2],
    right: t.space[2],
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2,
    borderColor: t.colors.muted,
    backgroundColor: t.colors.primaryEdge,
  },
}));

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  dot,
  style,
}: IconButtonProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <PressableBase
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      touchHeight={SIZE}
      onPress={onPress}
      pressedStyle={s.pressed}
      style={[s.root, style]}
    >
      {renderIcon(icon, {
        color: t.colors.mutedForeground,
        size: t.iconSize.md,
      })}
      {dot ? <View style={s.dot} /> : null}
    </PressableBase>
  );
}
