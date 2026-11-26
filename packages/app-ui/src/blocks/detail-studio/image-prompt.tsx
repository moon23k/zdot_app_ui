import { Image, Text, TextInput, View } from 'react-native';
import { PencilGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { ActionChips } from './action-chips';

export type ImagePromptProps = {
  source: string | null;
  value: string;
  onChangeText?: (text: string) => void;
  suggestions?: readonly string[];
  onEdit?: () => void;
  editDisabled?: boolean;
  maxLength?: number;
  label?: string;
  editLabel?: string;
};

const useStyles = makeStyles((t) => ({
  row: {
    height: t.space[16],
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
    paddingLeft: t.space[5],
  },
  ask: { paddingRight: t.space[4] },
  read: { paddingRight: t.space[2] },
  source: {
    width: t.controlSize.sm,
    height: t.controlSize.sm,
    overflow: 'hidden',
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.muted,
  },
  photo: { width: '100%', height: '100%' },
  input: {
    flex: 1,
    height: t.controlSize.sm,
    paddingHorizontal: t.space[3],
    paddingVertical: 0,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.background,
    fontFamily: t.fontFamily,
    fontSize: t.typography.body.fontSize,
    letterSpacing: t.typography.body.letterSpacing,
    color: t.colors.title,
  },
  text: {
    ...t.typography.body,
    flex: 1,
    fontFamily: t.fontFamily,
    color: t.colors.title,
  },
  edit: {
    width: t.minTouchSize,
    height: t.minTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.full,
  },
  chips: { paddingTop: t.space[1] },
  track: { paddingHorizontal: t.space[5] },
}));

export function ImagePrompt({
  source,
  value,
  onChangeText,
  suggestions,
  onEdit,
  editDisabled,
  maxLength = 200,
  label = '요청',
  editLabel = '수정',
}: ImagePromptProps) {
  const t = useTheme();
  const s = useStyles();
  const asking = !!onChangeText;
  const thumb = (
    <View style={s.source}>
      {source ? (
        <Image source={{ uri: source }} resizeMode="cover" style={s.photo} />
      ) : null}
    </View>
  );

  if (!asking) {
    return (
      <View style={[s.row, s.read]}>
        {thumb}
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={t.maxFontScale}
          style={s.text}
        >
          {value}
        </Text>
        <PressableBase
          onPress={onEdit}
          disabled={editDisabled || !onEdit}
          disabledStyle={{}}
          accessibilityLabel={editLabel}
          style={s.edit}
        >
          <PencilGlyph
            color={
              editDisabled
                ? t.colors.disabledForeground
                : t.colors.mutedForeground
            }
            size={t.iconSize.md}
          />
        </PressableBase>
      </View>
    );
  }

  return (
    <View>
      <View style={[s.row, s.ask]}>
        {thumb}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          accessibilityLabel={label}
          returnKeyType="done"
          maxFontSizeMultiplier={t.maxFontScale}
          style={s.input}
        />
      </View>
      {suggestions?.length ? (
        <View style={s.chips}>
          <ActionChips
            items={suggestions.map((word) => ({ value: word, label: word }))}
            onPick={onChangeText}
            inset={s.track}
          />
        </View>
      ) : null}
    </View>
  );
}
