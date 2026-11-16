import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type PillTone = 'neutral' | 'warning';

export type PillProps = {
  children: string;
  icon?: IconSlot;
  tone?: PillTone;
  style?: StyleProp<ViewStyle>;
};

const HEIGHT = 28;
const ICON = 14;

const useStyles = makeStyles((t) => ({
  root: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
    height: HEIGHT,
    paddingHorizontal: t.space[3] - t.space[1] / 2,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.muted,
  },
  warning: { backgroundColor: t.colors.warningTint },
  label: {
    ...t.typography.eyebrow,
    fontFamily: t.fontFamily,
    color: t.colors.foreground,
  },
  warningLabel: { color: t.colors.warningText },
}));

export function Pill({ children, icon, tone = 'neutral', style }: PillProps) {
  const t = useTheme();
  const s = useStyles();
  const warning = tone === 'warning';
  const color = warning ? t.colors.warningText : t.colors.foreground;
  return (
    <View style={[s.root, warning && s.warning, style]}>
      {icon ? renderIcon(icon, { color, size: ICON }) : null}
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={t.maxFontScale}
        style={[s.label, warning && s.warningLabel]}
      >
        {children}
      </Text>
    </View>
  );
}
