import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '../theme/theme-provider';
import { CheckGlyph } from './glyphs';
import { useSwitch } from './motion';

const FROM = 0.4;

export function PopCheck({ on, size }: { on: boolean; size: number }) {
  const t = useTheme();
  const grow = useSwitch(on, 'spring', 'spring');
  const pop = useAnimatedStyle(() => ({
    opacity: Math.min(1, grow.value * 2),
    transform: [{ scale: FROM + (1 - FROM) * grow.value }],
  }));
  return (
    <Animated.View
      accessibilityElementsHidden={!on}
      importantForAccessibility={on ? 'auto' : 'no-hide-descendants'}
      style={pop}
    >
      <CheckGlyph color={t.colors.success} size={size} />
    </Animated.View>
  );
}
