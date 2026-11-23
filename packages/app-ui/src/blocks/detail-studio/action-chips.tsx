import { ScrollView, Text as RNText, type ViewStyle } from 'react-native';
import { haptic } from '../../internal/haptics';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type ActionChipsProps<T extends string> = {
  items: readonly { value: T; label: string }[];
  onPick: (value: T) => void;
  disabled?: boolean;
  inset?: ViewStyle;
};

const useStyles = makeStyles((t) => ({
  scroll: { flexGrow: 0 },
  track: { flexDirection: 'row', alignItems: 'center', gap: t.space[2] },
  chip: {
    height: t.space[8] + t.space[1],
    justifyContent: 'center',
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  label: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    fontWeight: t.typography.body.fontWeight,
  },
}));

export function ActionChips<T extends string>({
  items,
  onPick,
  disabled,
  inset,
}: ActionChipsProps<T>) {
  const t = useTheme();
  const s = useStyles();
  const color = disabled ? t.colors.disabledForeground : t.colors.title;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={s.scroll}
      contentContainerStyle={[s.track, inset]}
    >
      {items.map((item) => (
        <PressableBase
          key={item.value}
          onPress={() => {
            haptic('select');
            onPick(item.value);
          }}
          disabled={disabled}
          disabledStyle={{}}
          feedback="small"
          accessibilityRole="button"
          accessibilityLabel={item.label}
          touchHeight={t.space[8] + t.space[1]}
          style={s.chip}
        >
          <RNText
            numberOfLines={1}
            maxFontSizeMultiplier={t.maxFontScale}
            style={[s.label, { color }]}
          >
            {item.label}
          </RNText>
        </PressableBase>
      ))}
    </ScrollView>
  );
}
