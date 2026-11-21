import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';
import { CheckGlyph } from './glyphs';

const GLYPH_SHARE = 0.6;

const useStyles = makeStyles((t) => ({
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: t.colors.background,
    backgroundColor: t.colors.primary,
  },
}));

export function CheckDisc({
  size,
  ring = 0,
  style,
}: {
  size: number;
  ring?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const s = useStyles();
  const outer = size + ring * 2;
  const box = {
    width: outer,
    height: outer,
    borderRadius: outer / 2,
    borderWidth: ring,
  };
  return (
    <View pointerEvents="none" style={[s.disc, box, style]}>
      <CheckGlyph
        color={t.colors.primaryForeground}
        size={Math.round(size * GLYPH_SHARE)}
      />
    </View>
  );
}
