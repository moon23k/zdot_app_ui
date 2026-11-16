import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type AmountLine = {
  label: string;
  value: string;
  link?: { label: string; onPress: () => void };
};

export type AmountSummaryProps = {
  label: string;
  value: string;
  lines?: readonly AmountLine[];
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  root: { gap: t.space[3] },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[3],
  },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.body.fontSize,
    lineHeight: t.typography.body.lineHeight,
    fontWeight: '500',
    color: t.colors.title,
  },
  value: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.title.fontSize,
    lineHeight: t.typography.title.lineHeight,
    fontWeight: '600',
    color: t.colors.title,
  },
  lines: { gap: t.space[2] },
  lineHead: { flexDirection: 'row', alignItems: 'center', gap: t.space[2] },
  link: {
    textDecorationLine: 'underline',
    textDecorationColor: t.colors.input,
  },
  total: {
    paddingTop: t.space[3],
    borderTopWidth: 1,
    borderTopColor: t.colors.muted,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: t.space[3],
  },
  lineLabel: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    lineHeight: t.typography.label.lineHeight,
    color: t.colors.mutedForeground,
  },
  lineValue: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    lineHeight: t.typography.label.lineHeight,
    color: t.colors.foreground,
  },
}));

export function AmountSummary({
  label,
  value,
  lines = [],
  style,
}: AmountSummaryProps) {
  const t = useTheme();
  const s = useStyles();
  const head = (
    <View
      style={[s.head, lines.length > 0 && s.total]}
      accessible
      accessibilityLabel={`${label} ${value}`}
    >
      <Text style={s.label} maxFontSizeMultiplier={t.maxFontScale}>
        {label}
      </Text>
      <Text style={s.value} maxFontSizeMultiplier={t.maxFontScale}>
        {value}
      </Text>
    </View>
  );
  return (
    <View style={[s.root, style]}>
      {lines.length ? (
        <View style={s.lines}>
          {lines.map((line) => (
            <View key={line.label} style={s.line}>
              <View style={s.lineHead}>
                <Text
                  style={s.lineLabel}
                  maxFontSizeMultiplier={t.maxFontScale}
                >
                  {line.label}
                </Text>
                {line.link ? (
                  <PressableBase
                    accessibilityRole="button"
                    accessibilityLabel={line.link.label}
                    onPress={line.link.onPress}
                  >
                    <Text
                      style={[s.lineLabel, s.link]}
                      maxFontSizeMultiplier={t.maxFontScale}
                    >
                      {line.link.label}
                    </Text>
                  </PressableBase>
                ) : null}
              </View>
              <Text style={s.lineValue} maxFontSizeMultiplier={t.maxFontScale}>
                {line.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      {head}
    </View>
  );
}
