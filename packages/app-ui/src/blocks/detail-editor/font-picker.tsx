import { Text as RNText, View } from 'react-native';
import { Text } from '../../components/text/text';
import { PressableBase } from '../../internal/pressable-base';
import { SampleTiles, useSampleStyle } from '../../internal/sample-tiles';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { DETAIL_FONT_FAMILY, type DetailFont } from './detail-types';

export type FontPickerProps = {
  value: DetailFont;
  onValueChange: (font: DetailFont) => void;
  sample: string;
  variant?: 'list' | 'tiles';
};

const NAMES: Record<DetailFont, string> = {
  gothic: '고딕',
  serif: '명조',
  display: '굵은 제목',
  hand: '손글씨',
};

const ORDER: DetailFont[] = ['gothic', 'serif', 'display', 'hand'];

const useStyles = makeStyles((t) => ({
  list: { gap: t.space[1] },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: t.controlSize.sm,
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.md,
  },
  on: { backgroundColor: t.colors.recess },
  sample: { flexShrink: 1 },
}));

function FontTiles({
  value,
  onValueChange,
  sample,
}: Omit<FontPickerProps, 'variant'>) {
  const t = useTheme();
  const look = useSampleStyle();
  return (
    <SampleTiles
      value={value}
      onValueChange={onValueChange}
      items={ORDER.map((font) => ({
        value: font,
        name: NAMES[font],
        sample: (
          <RNText
            numberOfLines={1}
            maxFontSizeMultiplier={t.maxFontScale}
            style={[look, { fontFamily: DETAIL_FONT_FAMILY[font].regular }]}
          >
            {sample}
          </RNText>
        ),
      }))}
    />
  );
}

export function FontPicker({
  value,
  onValueChange,
  sample,
  variant = 'list',
}: FontPickerProps) {
  const t = useTheme();
  const s = useStyles();
  if (variant === 'tiles') {
    return (
      <FontTiles value={value} onValueChange={onValueChange} sample={sample} />
    );
  }
  return (
    <View style={s.list} accessibilityRole="radiogroup">
      {ORDER.map((font) => {
        const on = font === value;
        return (
          <PressableBase
            feedback="row"
            key={font}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={NAMES[font]}
            onPress={() => onValueChange(font)}
            style={[s.row, on && s.on]}
          >
            <RNText
              numberOfLines={1}
              maxFontSizeMultiplier={t.maxFontScale}
              style={[
                s.sample,
                {
                  fontFamily: DETAIL_FONT_FAMILY[font].regular,
                  fontSize: t.typography.bodyLg.fontSize,
                  color: t.colors.foreground,
                },
              ]}
            >
              {sample}
            </RNText>
            <Text variant="caption" tone="muted">
              {NAMES[font]}
            </Text>
          </PressableBase>
        );
      })}
    </View>
  );
}
