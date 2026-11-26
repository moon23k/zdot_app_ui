import { Text as RNText, View } from 'react-native';
import { GemGlyph } from '../../internal/glyphs';
import { useTheme } from '../../theme/theme-provider';
import { withAlpha } from '../../utils/color';
import { makeStyles } from '../../utils/styles';

export type CreditCostProps = {
  value: number;
  tone?: 'muted' | 'inverse' | 'disabled';
};

export type CreditPillProps = {
  balance: number;
  accessibilityLabel?: string;
};

const INVERSE = 0.78;
const GROUP = /\B(?=(\d{3})+(?!\d))/g;

export function creditText(value: number): string {
  return String(value).replace(GROUP, ',');
}

const useStyles = makeStyles((t) => ({
  cost: { flexDirection: 'row', alignItems: 'center', gap: t.space[1] },
  value: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    letterSpacing: t.typography.eyebrow.letterSpacing,
    lineHeight: t.typography.eyebrow.lineHeight,
    fontWeight: '500',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: t.space[6] + t.space[1],
    paddingLeft: t.space[2],
    paddingRight: t.space[3],
    marginRight: t.space[1],
    borderRadius: t.radius.full,
    backgroundColor: t.colors.muted,
  },
}));

export function CreditCost({ value, tone = 'muted' }: CreditCostProps) {
  const t = useTheme();
  const s = useStyles();
  const color =
    tone === 'inverse'
      ? withAlpha(t.colors.primaryForeground, INVERSE)
      : tone === 'disabled'
        ? t.colors.disabledForeground
        : t.colors.mutedForeground;
  return (
    <View style={s.cost}>
      <GemGlyph color={color} size={t.space[3]} />
      <RNText
        maxFontSizeMultiplier={t.maxFontScale}
        style={[s.value, { color }]}
      >
        {creditText(value)}
      </RNText>
    </View>
  );
}

export function CreditPill({ balance, accessibilityLabel }: CreditPillProps) {
  const s = useStyles();
  return (
    <View
      accessible
      accessibilityLabel={
        accessibilityLabel ?? `크레딧 잔액 ${creditText(balance)}`
      }
      style={s.pill}
    >
      <CreditCost value={balance} />
    </View>
  );
}
