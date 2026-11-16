import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Photo } from '../../components/photo/photo';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type FeedRowNote = { text: string; icon?: IconSlot; tone?: 'warning' };

export type FeedRowProps = {
  overline: string;
  title: string;
  titleLines?: 1 | 2;
  body?: string;
  note?: FeedRowNote;
  image?: string | null;
  icon?: IconSlot;
  unread?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const LEAD = 56;
const DOT = 8;
const NOTE_ICON = 14;

const useStyles = makeStyles((t) => ({
  root: {
    flexDirection: 'row',
    gap: t.space[3],
    paddingHorizontal: t.layout.screenX,
    paddingVertical: t.space[3] + t.space[1] / 2,
    backgroundColor: t.colors.surface,
  },
  read: { backgroundColor: 'transparent' },
  lead: {
    width: LEAD,
    height: LEAD,
    borderRadius: t.radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.muted,
  },
  dim: { opacity: 0.55 },
  body: { flex: 1, minWidth: 0 },
  head: { flexDirection: 'row', alignItems: 'center', gap: t.space[2] },
  overline: {
    ...t.typography.caption,
    fontFamily: t.fontFamily,
    color: t.colors.mutedForeground,
    flex: 1,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: t.colors.primaryEdge,
  },
  title: {
    ...t.typography.body,
    fontFamily: t.fontFamily,
    fontWeight: '500',
    color: t.colors.title,
    marginTop: t.space[1] / 2,
  },
  titleRead: { fontWeight: '400', color: t.colors.foreground },
  text: {
    ...t.typography.label,
    fontFamily: t.fontFamily,
    color: t.colors.mutedForeground,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
    marginTop: t.space[1] / 2,
  },
  noteText: {
    ...t.typography.eyebrow,
    fontFamily: t.fontFamily,
    color: t.colors.mutedForeground,
  },
  warning: { color: t.colors.warningText },
}));

export function FeedRow({
  overline,
  title,
  titleLines = 2,
  body,
  note,
  image,
  icon,
  unread = false,
  onPress,
  style,
}: FeedRowProps) {
  const t = useTheme();
  const s = useStyles();
  const warn = note?.tone === 'warning';
  const content = (
    <>
      <View style={[s.lead, !unread && s.dim]}>
        {image ? (
          <Photo
            source={{ uri: image }}
            seed={title}
            radius={t.radius.md}
            style={{ width: LEAD }}
          />
        ) : icon ? (
          renderIcon(icon, {
            color: t.colors.mutedForeground,
            size: t.iconSize.md,
          })
        ) : null}
      </View>
      <View style={s.body}>
        <View style={s.head}>
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={t.maxFontScale}
            style={s.overline}
          >
            {overline}
          </Text>
          {unread ? <View style={s.dot} /> : null}
        </View>
        <Text
          numberOfLines={titleLines}
          maxFontSizeMultiplier={t.maxFontScale}
          style={[s.title, !unread && s.titleRead]}
        >
          {title}
        </Text>
        {body ? (
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={t.maxFontScale}
            style={s.text}
          >
            {body}
          </Text>
        ) : null}
        {note ? (
          <View style={s.note}>
            {note.icon
              ? renderIcon(note.icon, {
                  color: warn ? t.colors.warningText : t.colors.mutedForeground,
                  size: NOTE_ICON,
                })
              : null}
            <Text
              maxFontSizeMultiplier={t.maxFontScale}
              style={[s.noteText, warn && s.warning]}
            >
              {note.text}
            </Text>
          </View>
        ) : null}
      </View>
    </>
  );
  if (!onPress) {
    return <View style={[s.root, !unread && s.read, style]}>{content}</View>;
  }
  return (
    <PressableBase
      accessibilityRole="button"
      onPress={onPress}
      feedback="row"
      style={[s.root, !unread && s.read, style]}
    >
      {content}
    </PressableBase>
  );
}
