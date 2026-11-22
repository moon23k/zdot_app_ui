import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type BubbleSide = 'in' | 'out';

export type BubbleProps = {
  children: string;
  side?: BubbleSide;
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  root: {
    paddingHorizontal: t.space[3],
    paddingVertical: t.space[2] + t.space[1] / 2,
    borderRadius: t.radius.lg,
  },
  in: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: t.space[1],
    backgroundColor: t.colors.recess,
  },
  out: {
    alignSelf: 'stretch',
    borderTopRightRadius: t.space[1],
    backgroundColor: t.colors.raised,
    boxShadow: t.shadow.liftSm,
  },
  label: {
    ...t.typography.body,
    fontFamily: t.fontFamily,
    color: t.colors.foreground,
  },
}));

export function Bubble({ children, side = 'in', style }: BubbleProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.root, s[side], style]}>
      <Text maxFontSizeMultiplier={t.maxFontScale} style={s.label}>
        {children}
      </Text>
    </View>
  );
}
