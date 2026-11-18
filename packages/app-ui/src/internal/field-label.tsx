import { Text, View } from 'react-native';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[2],
  },
  label: {
    flexShrink: 1,
    fontFamily: t.fontFamily,
    fontSize: t.typography.body.fontSize,
    lineHeight: t.typography.body.lineHeight,
    fontWeight: '500',
    color: t.colors.foreground,
  },
  error: { color: t.colors.danger },
  count: {
    marginLeft: 'auto',
    fontFamily: t.fontFamily,
    fontSize: t.typography.caption.fontSize,
    lineHeight: t.typography.caption.lineHeight,
    color: t.colors.mutedForeground,
    fontVariant: ['tabular-nums'],
  },
}));

export function FieldLabel({
  label,
  count,
  error = false,
}: {
  label?: string;
  count?: string;
  error?: boolean;
}) {
  const t = useTheme();
  const s = useStyles();
  if (!label && !count) return null;
  return (
    <View style={s.row}>
      {label ? (
        <Text
          maxFontSizeMultiplier={t.maxFontScale}
          style={[s.label, error && s.error]}
        >
          {label}
        </Text>
      ) : null}
      {count ? (
        <Text maxFontSizeMultiplier={t.maxFontScale} style={s.count}>
          {count}
        </Text>
      ) : null}
    </View>
  );
}
