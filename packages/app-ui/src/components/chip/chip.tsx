import { View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { CheckGlyph } from '../../internal/glyphs';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { useSwitch } from '../../internal/motion';
import {
  PressableBase,
  type PressableBaseProps,
} from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type ChipSize = 'sm' | 'md' | 'lg';

export type ChipProps = Omit<PressableBaseProps, 'children' | 'touchHeight'> & {
  selected?: boolean;
  check?: boolean;
  size?: ChipSize;
  leftIcon?: IconSlot;
  count?: number;
  children: string;
};

const HEIGHT: Record<ChipSize, number> = { sm: 32, md: 36, lg: 40 };
const MIN_WIDTH: Record<ChipSize, number> = { sm: 44, md: 48, lg: 52 };

const useStyles = makeStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    gap: t.space[1],
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.full,
  },
  lg: { paddingHorizontal: t.space[4] },
  mark: {
    flexDirection: 'row',
    overflow: 'hidden',
    marginRight: -t.space[1],
  },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    lineHeight: t.typography.label.lineHeight,
    fontWeight: '500',
  },
  count: { fontVariant: ['tabular-nums'], fontWeight: '600' },
}));

export function Chip({
  selected = false,
  check = false,
  size = 'sm',
  leftIcon,
  count,
  children,
  style,
  accessibilityState,
  accessibilityLabel,
  ...rest
}: ChipProps) {
  const t = useTheme();
  const s = useStyles();
  const color = selected ? t.colors.primary : t.colors.foreground;
  const off = t.colors.muted;
  const on = t.colors.primaryTint;
  const ink = t.colors.foreground;
  const point = t.colors.primary;
  const reach = t.iconSize.sm + t.space[1];

  const pick = useSwitch(selected, 'base');
  const mark = useSwitch(selected && check, 'base');
  const face = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(pick.value, [0, 1], [off, on]),
  }));
  const tone = useAnimatedStyle(() => ({
    color: interpolateColor(pick.value, [0, 1], [ink, point]),
  }));
  const open = useAnimatedStyle(() => ({
    width: reach * mark.value,
    opacity: mark.value,
  }));

  return (
    <PressableBase
      {...rest}
      accessibilityLabel={
        accessibilityLabel ??
        (count === undefined ? undefined : `${children}, ${count}건`)
      }
      accessibilityState={{ ...accessibilityState, selected }}
      touchHeight={HEIGHT[size]}
      style={[
        s.base,
        { height: HEIGHT[size], minWidth: MIN_WIDTH[size] },
        size === 'lg' && s.lg,
        style,
      ]}
      animatedStyle={face}
    >
      {check ? (
        <Animated.View style={[s.mark, open]}>
          <CheckGlyph color={point} size={t.iconSize.sm} />
        </Animated.View>
      ) : null}
      {leftIcon ? (
        <View>{renderIcon(leftIcon, { color, size: t.iconSize.sm })}</View>
      ) : null}
      <Animated.Text
        numberOfLines={1}
        maxFontSizeMultiplier={t.maxFontScale}
        style={[s.label, tone]}
      >
        {children}
      </Animated.Text>
      {count === undefined ? null : (
        <Animated.Text
          numberOfLines={1}
          maxFontSizeMultiplier={t.maxFontScale}
          style={[s.label, s.count, tone]}
        >
          {count}
        </Animated.Text>
      )}
    </PressableBase>
  );
}
