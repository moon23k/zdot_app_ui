import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '../components/text/text';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';

export type DayBarsProps = {
  data: readonly number[];
  labels: readonly string[];
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const HEIGHT = 64;
const BAR = 18;

const useStyles = makeStyles((t) => ({
  root: { flexDirection: 'row', alignItems: 'flex-end' },
  day: { flex: 1, alignItems: 'center', gap: t.space[1] + t.space[1] / 2 },
  bar: {
    width: BAR,
    minHeight: t.space[1] - 1,
    borderTopLeftRadius: t.radius.sm,
    borderTopRightRadius: t.radius.sm,
    borderBottomLeftRadius: t.space[1] / 2,
    borderBottomRightRadius: t.space[1] / 2,
    backgroundColor: t.colors.border,
  },
  today: { backgroundColor: t.colors.primaryEdge },
}));

export function DayBars({
  data,
  labels,
  accessibilityLabel,
  style,
}: DayBarsProps) {
  const t = useTheme();
  const s = useStyles();
  const max = Math.max(1, ...data);
  const last = data.length - 1;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[s.root, style]}
    >
      {data.map((value, i) => (
        <View key={i} style={s.day}>
          <View
            style={[
              s.bar,
              { height: Math.max(t.space[1] - 1, (value / max) * HEIGHT) },
              i === last && s.today,
            ]}
          />
          <Text
            variant="caption"
            tone={i === last ? 'primary' : 'muted'}
            weight={i === last ? 'semibold' : undefined}
            allowFontScaling={false}
          >
            {labels[i] ?? ''}
          </Text>
        </View>
      ))}
    </View>
  );
}
