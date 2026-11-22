import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { Tone } from '../../theme/contract';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type StatusBadgeTone = Exclude<Tone, 'primary'> | 'point';

export type StatusBadgeProps = {
  tone?: StatusBadgeTone;
  children: string;
  style?: StyleProp<ViewStyle>;
};

const DOT = 6;

const useStyles = makeStyles((t) => ({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: t.space[2],
    paddingVertical: t.space[1],
    borderRadius: t.radius.full,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
    boxShadow: t.shadow.liftSm,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: t.colors.primary,
  },
  label: {
    ...t.typography.caption,
    fontFamily: t.fontFamily,
    fontWeight: '600',
  },
}));

export function StatusBadge({
  tone = 'neutral',
  children,
  style,
}: StatusBadgeProps) {
  const t = useTheme();
  const s = useStyles();
  const [bg, fg] = {
    neutral: [t.colors.muted, t.colors.mutedForeground],
    point: [t.colors.raised, t.colors.title],
    info: [t.colors.info, t.colors.infoForeground],
    success: [t.colors.success, t.colors.successForeground],
    warning: [t.colors.warning, t.colors.warningForeground],
    danger: [t.colors.danger, t.colors.dangerForeground],
  }[tone];
  return (
    <View
      style={[
        s.base,
        tone === 'point' && s.point,
        { backgroundColor: bg },
        style,
      ]}
    >
      {tone === 'point' ? <View style={s.dot} /> : null}
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={t.maxFontScale}
        style={[s.label, { color: fg }]}
      >
        {children}
      </Text>
    </View>
  );
}
