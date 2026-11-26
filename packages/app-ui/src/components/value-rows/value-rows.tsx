import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { ChevronGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { Won } from '../text/figures';

export type ValueTone = 'default' | 'warning' | 'success';

export type ValueRow = {
  label: string;
  value: string;
  tone?: ValueTone;
  note?: { text: string; tone?: ValueTone };
  onPress?: () => void;
};

export type ValueRowsProps = {
  rows: readonly ValueRow[];
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  root: { gap: t.space[2] },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: t.space[4],
  },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    letterSpacing: t.typography.label.letterSpacing,
    lineHeight: t.typography.label.lineHeight,
    color: t.colors.mutedForeground,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    letterSpacing: t.typography.label.letterSpacing,
    lineHeight: t.typography.label.lineHeight,
    color: t.colors.foreground,
  },
  warning: { color: t.colors.warningText },
  success: { color: t.colors.success },
}));

export function ValueRows({ rows, style }: ValueRowsProps) {
  const t = useTheme();
  const s = useStyles();
  const tone = (value?: ValueTone) =>
    value === 'warning' ? s.warning : value === 'success' ? s.success : null;
  return (
    <View style={[s.root, style]}>
      {rows.map((row) => (
        <PressableBase
          feedback="row"
          key={row.label}
          onPress={row.onPress}
          style={s.row}
        >
          <Text
            style={[s.label, row.tone === 'warning' && s.warning]}
            maxFontSizeMultiplier={t.maxFontScale}
          >
            {row.label}
          </Text>
          <Text
            style={[s.value, tone(row.tone)]}
            maxFontSizeMultiplier={t.maxFontScale}
          >
            {row.note ? (
              <Text style={tone(row.note.tone)}>{`${row.note.text}   `}</Text>
            ) : null}
            <Won
              size={t.typography.label.fontSize}
              tracking={t.typography.label.letterSpacing}
            >
              {row.value}
            </Won>
          </Text>
          {row.onPress ? (
            <ChevronGlyph color={t.colors.ring} size={t.iconSize.sm} />
          ) : null}
        </PressableBase>
      ))}
    </View>
  );
}
