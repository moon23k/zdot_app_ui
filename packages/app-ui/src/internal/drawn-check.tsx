import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/theme-provider';
import { CheckGlyph } from './glyphs';
import { timing, type Duration } from './motion';

export type DrawnCheckProps = {
  on: boolean;
  size: number;
  color: string;
  draw?: Duration;
  after?: Duration;
};

const styles = StyleSheet.create({
  clip: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
});

export function DrawnCheck({
  on,
  size,
  color,
  draw = 'base',
  after = 'short',
}: DrawnCheckProps) {
  const t = useTheme();
  const progress = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    progress.value = on
      ? withDelay(t.motion.duration[after], withTiming(1, timing(t, draw)))
      : withTiming(0, timing(t, 'short'));
  }, [on, progress, t, draw, after]);
  const clip = useAnimatedStyle(() => ({ width: size * progress.value }));
  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={[styles.clip, { height: size }, clip]}>
        <CheckGlyph color={color} size={size} />
      </Animated.View>
    </View>
  );
}
