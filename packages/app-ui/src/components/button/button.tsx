import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { DrawnCheck } from '../../internal/drawn-check';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { timing, useSwitch } from '../../internal/motion';
import {
  PressableBase,
  type PressableBaseProps,
} from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { CreditCost } from '../credit/credit';

import type {
  ButtonSize,
  ButtonVariant as ContractVariant,
} from '../../theme/contract';
import { haptic } from '../../internal/haptics';

export type ButtonVariant = Exclude<ContractVariant, 'outline'>;
export type { ButtonSize };

export type ButtonProps = Omit<
  PressableBaseProps,
  'children' | 'touchHeight' | 'onDisabledPress'
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  done?: boolean;
  onBlocked?: () => void;
  leftIcon?: IconSlot;
  rightIcon?: IconSlot;
  point?: boolean;
  pill?: boolean;
  cost?: number | null;
  children: ReactNode;
};

const NUDGE = [4, -4, 2, 0] as const;

const useStyles = makeStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[2],
  },
  center: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    height: t.controlSize.sm,
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.md,
  },
  md: {
    height: t.controlSize.md,
    paddingHorizontal: t.space[4],
    borderRadius: t.radius.md,
  },
  lg: {
    height: t.controlSize.lg,
    paddingHorizontal: t.space[5],
    borderRadius: t.radius.lg,
  },
  primary: { backgroundColor: t.colors.primary },
  off: { backgroundColor: t.colors.disabledSurface },
  secondary: { backgroundColor: t.colors.muted },
  bare: { paddingHorizontal: 0 },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: t.colors.danger },
  success: { backgroundColor: t.colors.success },
  pill: { borderRadius: t.radius.full },
  label: { fontFamily: t.fontFamily, fontWeight: '600' },
  quiet: { fontWeight: '500' },
  smLabel: {
    fontSize: t.typography.label.fontSize,
    lineHeight: t.typography.label.lineHeight,
  },
  mdLabel: {
    fontSize: t.typography.body.fontSize,
    lineHeight: t.typography.body.lineHeight,
  },
  lgLabel: {
    fontSize: t.typography.bodyLg.fontSize,
    lineHeight: t.typography.bodyLg.lineHeight,
  },
}));

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  done = false,
  onBlocked,
  disabled,
  leftIcon,
  rightIcon,
  point = false,
  pill = false,
  cost,
  children,
  style,
  accessibilityState,
  ...rest
}: ButtonProps) {
  const t = useTheme();
  const s = useStyles();
  const busy = loading || done;
  const off = !!disabled && !busy;
  const flat = (variant === 'primary' || variant === 'danger') && !point;
  const still = off && flat;
  const color = {
    primary: t.colors.primaryForeground,
    secondary: t.colors.title,
    ghost: t.colors.title,
    danger: t.colors.dangerForeground,
  }[variant];
  const ink = still
    ? t.colors.disabledForeground
    : point
      ? t.colors.primary
      : color;
  const icon = {
    color: ink,
    size: size === 'sm' ? t.iconSize.sm : t.iconSize.md,
  };
  const radius = pill ? t.radius.full : s[size].borderRadius;

  const [spin, setSpin] = useState(false);
  useEffect(() => {
    if (!loading) {
      setSpin(false);
      return;
    }
    const id = setTimeout(() => setSpin(true), t.motion.duration.base);
    return () => clearTimeout(id);
  }, [loading, t.motion.duration.base]);

  useEffect(() => {
    if (done) haptic('done');
  }, [done]);

  const live = useSwitch(!off, 'long', 'decelerate');
  const nudge = useSharedValue(0);
  const hide = useSwitch(spin || done, 'base');
  const finish = useSwitch(done, 'press');

  const shake = () => {
    onBlocked?.();
    nudge.value = withSequence(
      ...NUDGE.map((x) => withTiming(x, timing(t, 'short')))
    );
  };

  const content = useAnimatedStyle(() => ({
    opacity: 1 - hide.value,
    transform: [{ translateY: -t.space[1] * hide.value }],
  }));
  const fill = useAnimatedStyle(() => ({ opacity: finish.value }));

  return (
    <PressableBase
      feedback="surface"
      {...rest}
      disabled={off || busy}
      onDisabledPress={off ? shake : undefined}
      live={live}
      dim={!flat}
      nudge={nudge}
      touchHeight={t.controlSize[size]}
      accessibilityState={{ ...accessibilityState, busy: loading }}
      disabledStyle={{}}
      style={[
        s.base,
        s[size],
        s[variant],
        still && s.off,
        point && s.bare,
        pill && s.pill,
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[s.center, s.success, { borderRadius: radius }, fill]}
      />
      <Animated.View style={[s.content, content]}>
        {leftIcon ? <View>{renderIcon(leftIcon, icon)}</View> : null}
        {typeof children === 'string' ? (
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={t.maxFontScale}
            style={[
              s.label,
              s[`${size}Label`],
              (variant === 'secondary' || point) && s.quiet,
              { color: ink },
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
        {typeof children === 'string' && cost != null ? (
          <CreditCost
            value={cost}
            tone={
              off
                ? 'disabled'
                : variant === 'primary' || variant === 'danger'
                  ? 'inverse'
                  : 'muted'
            }
          />
        ) : null}
        {rightIcon ? <View>{renderIcon(rightIcon, icon)}</View> : null}
      </Animated.View>
      {spin && !done ? (
        <View pointerEvents="none" style={s.center}>
          <ActivityIndicator size="small" color={ink} />
        </View>
      ) : null}
      {done ? (
        <View pointerEvents="none" style={s.center}>
          <DrawnCheck
            on
            size={icon.size}
            color={t.colors.successForeground}
            draw="long"
          />
        </View>
      ) : null}
    </PressableBase>
  );
}
