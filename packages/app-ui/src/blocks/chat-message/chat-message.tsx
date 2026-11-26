import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Bubble } from '../../components/bubble/bubble';
import { ThumbStrip } from '../../components/thumb-strip/thumb-strip';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type ChatMessageProps = {
  who: string;
  body: string;
  mine?: boolean;
  point?: boolean;
  photos?: readonly string[];
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  root: { gap: t.space[1] },
  mine: { alignItems: 'flex-end' },
  theirs: { alignItems: 'flex-start' },
  who: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.caption.fontSize,
    letterSpacing: t.typography.caption.letterSpacing,
    lineHeight: t.typography.caption.lineHeight,
    color: t.colors.mutedForeground,
  },
  point: { color: t.colors.primary, fontWeight: '600' },
  bubble: { maxWidth: '84%' },
}));

export function ChatMessage({
  who,
  body,
  mine = false,
  point = false,
  photos = [],
  style,
}: ChatMessageProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.root, mine ? s.mine : s.theirs, style]}>
      <Text
        style={[s.who, point && s.point]}
        maxFontSizeMultiplier={t.maxFontScale}
      >
        {who}
      </Text>
      <View style={s.bubble}>
        <Bubble side={mine ? 'out' : 'in'}>{body}</Bubble>
      </View>
      {photos.length ? <ThumbStrip images={photos} /> : null}
    </View>
  );
}
