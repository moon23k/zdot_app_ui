import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  type DimensionValue,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useReducedMotion } from '../../internal/use-reduced-motion';
import { useTheme } from '../../theme/theme-provider';

export type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

const SHIMMER = 1500;

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  band: { position: 'absolute', top: 0, bottom: 0, left: 0 },
});

export function Skeleton({
  width = '100%',
  height = 16,
  radius,
  style,
}: SkeletonProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [span, setSpan] = useState(0);
  const sweep = useSharedValue(0);

  useEffect(() => {
    if (reduced || span === 0) {
      cancelAnimation(sweep);
      return;
    }
    sweep.value = 0;
    sweep.value = withRepeat(
      withTiming(1, { duration: SHIMMER, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(sweep);
  }, [reduced, span, sweep]);

  const band = useAnimatedStyle(() => ({
    transform: [{ translateX: -span + span * 2 * sweep.value }],
  }));

  const measure = (event: LayoutChangeEvent) =>
    setSpan(event.nativeEvent.layout.width);

  const light = t.colors.surface;

  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      onLayout={measure}
      style={[
        styles.clip,
        {
          width,
          height,
          borderRadius: radius ?? t.radius.sm,
          backgroundColor: t.colors.muted,
        },
        style,
      ]}
    >
      {reduced || span === 0 ? null : (
        <Animated.View
          style={[
            styles.band,
            {
              width: span,
              experimental_backgroundImage: `linear-gradient(90deg, transparent, ${light}, transparent)`,
            },
            band,
          ]}
        />
      )}
    </View>
  );
}
