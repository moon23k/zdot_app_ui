import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type PillTone = 'neutral' | 'warning' | 'success' | 'point';

export type PillProps = {
  children: string;
  tone?: PillTone;
  style?: StyleProp<ViewStyle>;
};

const HEIGHT = 20;
const DOT = 6;

const useStyles = makeStyles((t) => ({
  root: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    height: HEIGHT,
    paddingHorizontal: t.space[1] + t.space[1] / 2,
    borderRadius: t.radius.sm - 2,
    backgroundColor: t.colors.muted,
  },
  warning: { backgroundColor: t.colors.warningTint },
  success: { backgroundColor: t.colors.successTint },
  point: {
    gap: t.space[1],
    backgroundColor: t.colors.raised,
    boxShadow: t.shadow.liftSm,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: t.colors.primary,
  },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.caption.fontSize,
    letterSpacing: t.typography.caption.letterSpacing,
    lineHeight: t.typography.caption.lineHeight,
    fontWeight: '500',
    color: t.colors.mutedForeground,
  },
  warningLabel: { color: t.colors.warningText },
  successLabel: { color: t.colors.success },
  pointLabel: { color: t.colors.title },
}));

export function Pill({ children, tone = 'neutral', style }: PillProps) {
  const t = useTheme();
  const s = useStyles();
  const mark = tone === 'neutral' ? null : tone;
  return (
    <View style={[s.root, mark && s[mark], style]}>
      {tone === 'point' ? <View style={s.dot} /> : null}
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={t.maxFontScale}
        style={[s.label, mark && s[`${mark}Label`]]}
      >
        {children}
      </Text>
    </View>
  );
}
