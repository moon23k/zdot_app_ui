import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { haptic } from '../../internal/haptics';
import { PressableBase } from '../../internal/pressable-base';
import { UndoGlyph } from '../../internal/undo-glyph';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type SwatchCardProps = {
  color: string;
  code: string;
  name: string;
  onReset?: () => void;
  resetLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const RADIUS = 22;
const FACE = 104;
const BODY = 76;
const CODE_SIZE = 13;
const CODE_LEADING = 18;
const CODE_TRACKING = 0.8;
const NAME_SIZE = 22;
const NAME_LEADING = 28;
const NAME_TRACKING = -0.3;
const LINE_GAP = 2;
const RESET = 36;
const RESET_ICON = 18;
const RESET_SLOP = (44 - RESET) / 2;

const useStyles = makeStyles((t) => ({
  card: {
    borderRadius: RADIUS,
    backgroundColor: t.colors.raised,
    boxShadow: t.shadow.lift,
  },
  clip: { borderRadius: RADIUS, overflow: 'hidden' },
  face: { height: FACE },
  body: {
    height: BODY,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
    paddingLeft: t.space[5],
    paddingRight: t.space[4],
  },
  words: { flex: 1, minWidth: 0, gap: LINE_GAP },
  code: {
    fontFamily: t.fontFamily,
    fontSize: CODE_SIZE,
    lineHeight: CODE_LEADING,
    letterSpacing: CODE_TRACKING,
    fontWeight: '600',
    color: t.colors.faint,
  },
  name: {
    fontFamily: t.fontFamily,
    fontSize: NAME_SIZE,
    lineHeight: NAME_LEADING,
    letterSpacing: NAME_TRACKING,
    fontWeight: '600',
    color: t.colors.title,
  },
  reset: {
    width: RESET,
    height: RESET,
    borderRadius: RESET / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.recess,
  },
}));

export function SwatchCard({
  color,
  code,
  name,
  onReset,
  resetLabel = '처음 색으로',
  style,
}: SwatchCardProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.card, style]}>
      <View style={s.clip}>
        <View
          testID="swatch-card-face"
          style={[s.face, { backgroundColor: color }]}
        />
        <View style={s.body}>
          <View style={s.words}>
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={t.maxFontScale}
              style={s.code}
            >
              {code}
            </Text>
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={t.maxFontScale}
              style={s.name}
            >
              {name}
            </Text>
          </View>
          {onReset ? (
            <PressableBase
              accessibilityLabel={resetLabel}
              feedback="small"
              hitSlop={RESET_SLOP}
              onPress={() => {
                haptic('select');
                onReset();
              }}
              style={s.reset}
            >
              <UndoGlyph color={t.colors.title} size={RESET_ICON} />
            </PressableBase>
          ) : null}
        </View>
      </View>
    </View>
  );
}
