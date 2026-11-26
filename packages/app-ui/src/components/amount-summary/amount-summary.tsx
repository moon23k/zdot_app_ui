import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { RollText } from '../../internal/roll-text';
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

const UNDER = 1;

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
    letterSpacing: t.typography.body.letterSpacing,
    lineHeight: t.typography.body.lineHeight,
    fontWeight: '500',
    color: t.colors.title,
  },
  value: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.title.fontSize,
    letterSpacing: t.typography.title.letterSpacing,
    lineHeight: t.typography.title.lineHeight,
    fontWeight: '500',
    color: t.colors.title,
  },
  lines: { gap: t.space[2] },
  lineHead: { flexDirection: 'row', alignItems: 'center', gap: t.space[2] },
  link: {
    paddingBottom: UNDER,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.input,
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
    letterSpacing: t.typography.label.letterSpacing,
    lineHeight: t.typography.label.lineHeight,
    color: t.colors.mutedForeground,
  },
  lineValue: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    letterSpacing: t.typography.label.letterSpacing,
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
      <RollText style={s.value} money>
        {value}
      </RollText>
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
                    <View style={s.link}>
                      <Text
                        style={s.lineLabel}
                        maxFontSizeMultiplier={t.maxFontScale}
                      >
                        {line.link.label}
                      </Text>
                    </View>
                  </PressableBase>
                ) : null}
              </View>
              <RollText style={s.lineValue} flash money>
                {line.value}
              </RollText>
            </View>
          ))}
        </View>
      ) : null}
      {head}
    </View>
  );
}
