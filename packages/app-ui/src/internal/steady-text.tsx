import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '../theme/theme-provider';

export type SteadyTextProps = {
  children: string;
  selected: boolean;
  style: StyleProp<TextStyle>;
  strongStyle: StyleProp<TextStyle>;
  animatedStyle?: StyleProp<AnimatedStyle<TextStyle>>;
};

const styles = StyleSheet.create({
  ghost: { opacity: 0 },
  over: { position: 'absolute', left: 0, right: 0, textAlign: 'center' },
});

export function SteadyText({
  children,
  selected,
  style,
  strongStyle,
  animatedStyle,
}: SteadyTextProps) {
  const t = useTheme();
  return (
    <View>
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={t.maxFontScale}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[style, strongStyle, styles.ghost]}
      >
        {children}
      </Text>
      <Animated.Text
        numberOfLines={1}
        maxFontSizeMultiplier={t.maxFontScale}
        style={[style, styles.over, selected && strongStyle, animatedStyle]}
      >
        {children}
      </Animated.Text>
    </View>
  );
}
