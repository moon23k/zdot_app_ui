import { useState, type ComponentRef, type Ref } from 'react';
import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type AnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '../theme/theme-provider';
import { timing } from './motion';

export type PressFeedback = 'surface' | 'row' | 'small' | 'none';

export type PressableBaseProps = Omit<PressableProps, 'style'> & {
  ref?: Ref<ComponentRef<typeof Pressable>>;
  style?: StyleProp<ViewStyle>;
  animatedStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
  pressedStyle?: StyleProp<ViewStyle>;
  disabledStyle?: StyleProp<ViewStyle>;
  touchHeight?: number;
  feedback?: PressFeedback;
  onDisabledPress?: () => void;
  live?: SharedValue<number>;
  nudge?: SharedValue<number>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MIN_BASIS = 24;
const WIDTH_SHARE = 4;

export function PressableBase({
  style,
  animatedStyle,
  pressedStyle,
  disabledStyle,
  touchHeight,
  feedback,
  onDisabledPress,
  live,
  nudge,
  disabled,
  hitSlop,
  accessibilityRole = 'button',
  accessibilityState,
  onPress,
  onPressIn,
  onPressOut,
  onLayout,
  children,
  ...rest
}: PressableBaseProps) {
  const t = useTheme();
  const mode: PressFeedback =
    feedback ?? (pressedStyle !== undefined ? 'none' : 'small');
  const [pressed, setPressed] = useState(false);
  const progress = useSharedValue(0);
  const basis = useSharedValue(0);
  const shrinkTo = t.press.scale;
  const shrink = t.press.shrink;
  const layer = t.press.layer;
  const dimOpacity = t.opacity.disabled;
  const dimScale = t.press.disabled;
  const radius = StyleSheet.flatten(style)?.borderRadius;
  const moving = mode === 'small' || mode === 'surface' || !!live || !!nudge;

  const motion = useAnimatedStyle(() => {
    if (!moving) return {};
    let scale = 1;
    if (mode === 'small') scale = 1 - progress.value * (1 - shrinkTo);
    if (mode === 'surface' && basis.value > 0) {
      const target = (basis.value - shrink) / basis.value;
      scale = 1 - progress.value * (1 - target);
    }
    if (live) scale *= 1 - (1 - live.value) * (1 - dimScale);
    const transform = [{ translateX: nudge ? nudge.value : 0 }, { scale }];
    return live
      ? { transform, opacity: dimOpacity + (1 - dimOpacity) * live.value }
      : { transform };
  });
  const veil = useAnimatedStyle(() => ({ opacity: progress.value * layer }));

  const slop =
    hitSlop ??
    (touchHeight !== undefined && touchHeight < t.minTouchSize
      ? {
          top: Math.ceil((t.minTouchSize - touchHeight) / 2),
          bottom: Math.ceil((t.minTouchSize - touchHeight) / 2),
        }
      : undefined);

  const press = (into: boolean) => (event: GestureResponderEvent) => {
    if (pressedStyle !== undefined) setPressed(into);
    if (mode !== 'none' && !disabled) {
      progress.value = withTiming(into ? 1 : 0, timing(t, 'press'));
    }
    (into ? onPressIn : onPressOut)?.(event);
  };

  const measure = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    basis.value = Math.max(height, width / WIDTH_SHARE, MIN_BASIS);
    onLayout?.(event);
  };

  const overlay =
    mode === 'row' || mode === 'surface' ? (
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: t.colors.title, borderRadius: radius },
          veil,
        ]}
      />
    ) : null;

  const answer = !!disabled && !!onDisabledPress;

  return (
    <AnimatedPressable
      {...rest}
      disabled={answer ? undefined : disabled}
      hitSlop={slop}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ ...accessibilityState, disabled: !!disabled }}
      onPress={answer ? onDisabledPress : onPress}
      onPressIn={press(true)}
      onPressOut={press(false)}
      onLayout={mode === 'surface' ? measure : onLayout}
      style={[
        style,
        animatedStyle,
        motion,
        pressed && !disabled && pressedStyle,
        disabled && (disabledStyle ?? { opacity: t.opacity.disabled }),
      ]}
    >
      {(state) => (
        <>
          {typeof children === 'function' ? children(state) : children}
          {overlay}
        </>
      )}
    </AnimatedPressable>
  );
}
