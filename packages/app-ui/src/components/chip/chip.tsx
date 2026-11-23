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
import { CreditCost } from '../credit/credit';

export type ChipSize = 'sm' | 'md' | 'lg';

export type ChipProps = Omit<PressableBaseProps, 'children' | 'touchHeight'> & {
  selected?: boolean;
  check?: boolean;
  size?: ChipSize;
  leftIcon?: IconSlot;
  count?: number;
  cost?: number | null;
  children: string;
};

const HEIGHT: Record<ChipSize, number> = { sm: 32, md: 36, lg: 40 };
const DOT = 6;
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
  picked: { boxShadow: t.shadow.liftSm },
  mark: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: -t.space[1],
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: t.colors.primary,
  },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    lineHeight: t.typography.label.lineHeight,
    fontWeight: '500',
  },
  strong: { fontWeight: '600' },
  count: { fontVariant: ['tabular-nums'], fontWeight: '600' },
}));

export function Chip({
  selected = false,
  check = false,
  size = 'sm',
  leftIcon,
  count,
  cost,
  children,
  style,
  accessibilityState,
  accessibilityLabel,
  ...rest
}: ChipProps) {
  const t = useTheme();
  const s = useStyles();
  const color = selected ? t.colors.title : t.colors.mutedForeground;
  const off = t.colors.recess;
  const on = t.colors.raised;
  const ink = t.colors.mutedForeground;
  const point = t.colors.title;
  const reach = (check ? t.iconSize.sm : DOT) + t.space[1];

  const pick = useSwitch(selected, 'base');
  const mark = useSwitch(selected, 'base');
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
        (count !== undefined
          ? `${children}, ${count}건`
          : cost != null
            ? `${children}, 크레딧 ${cost}`
            : undefined)
      }
      accessibilityState={accessibilityState ?? { selected }}
      touchHeight={HEIGHT[size]}
      style={[
        s.base,
        { height: HEIGHT[size], minWidth: MIN_WIDTH[size] },
        size === 'lg' && s.lg,
        selected && s.picked,
        style,
      ]}
      animatedStyle={face}
    >
      <Animated.View style={[s.mark, open]}>
        {check ? (
          <CheckGlyph color={t.colors.primary} size={t.iconSize.sm} />
        ) : (
          <View style={s.dot} />
        )}
      </Animated.View>
      {leftIcon ? (
        <View>{renderIcon(leftIcon, { color, size: t.iconSize.sm })}</View>
      ) : null}
      <Animated.Text
        numberOfLines={1}
        maxFontSizeMultiplier={t.maxFontScale}
        style={[s.label, selected && s.strong, tone]}
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
      {cost == null ? null : <CreditCost value={cost} />}
    </PressableBase>
  );
}
