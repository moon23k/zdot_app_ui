import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme/theme-provider';

export type ProgressRingProps = {
  value: number;
  size?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const STROKE = 4;

export function ProgressRing({
  value,
  size = 40,
  accessibilityLabel,
  style,
}: ProgressRingProps) {
  const t = useTheme();
  const r = (size - STROKE) / 2;
  const full = 2 * Math.PI * r;
  const part = Math.min(1, Math.max(0, value)) * full;
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={[{ width: size, height: size }, style]}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={t.colors.muted}
          strokeWidth={STROKE}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={t.colors.primary}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${part} ${full}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}
