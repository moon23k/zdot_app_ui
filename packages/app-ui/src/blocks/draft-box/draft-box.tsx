import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../../components/button/button';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type DraftBoxProps = {
  label: string;
  note?: string;
  text: string;
  editLabel?: string;
  sendLabel: string;
  onEdit: () => void;
  onSend: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  root: {
    gap: t.space[2],
    paddingHorizontal: t.space[4],
    paddingVertical: t.space[3] + t.space[1] / 2,
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.line,
    backgroundColor: t.colors.surface,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1] + t.space[1] / 2,
  },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    letterSpacing: t.typography.eyebrow.letterSpacing,
    lineHeight: t.typography.eyebrow.lineHeight,
    fontWeight: '600',
    color: t.colors.primary,
  },
  note: {
    flexShrink: 1,
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    letterSpacing: t.typography.eyebrow.letterSpacing,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.mutedForeground,
  },
  text: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.body.fontSize,
    letterSpacing: t.typography.body.letterSpacing,
    lineHeight: t.typography.body.lineHeight,
    color: t.colors.title,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: t.space[2],
    marginTop: t.space[1],
  },
}));

export function DraftBox({
  label,
  note,
  text,
  editLabel = '수정',
  sendLabel,
  onEdit,
  onSend,
  loading,
  style,
}: DraftBoxProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.root, style]}>
      <View style={s.head}>
        <Text style={s.label} maxFontSizeMultiplier={t.maxFontScale}>
          {label}
        </Text>
        {note ? (
          <Text
            style={s.note}
            numberOfLines={1}
            maxFontSizeMultiplier={t.maxFontScale}
          >
            {`· ${note}`}
          </Text>
        ) : null}
      </View>
      <Text style={s.text} maxFontSizeMultiplier={t.maxFontScale}>
        {text}
      </Text>
      <View style={s.actions}>
        <Button variant="secondary" size="sm" onPress={onEdit}>
          {editLabel}
        </Button>
        <Button size="sm" loading={loading} onPress={onSend}>
          {sendLabel}
        </Button>
      </View>
    </View>
  );
}
