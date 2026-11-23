import { Text as RNText, type TextStyle } from 'react-native';
import { SampleTiles, useSampleStyle } from '../../internal/sample-tiles';
import { useTheme } from '../../theme/theme-provider';
import { textStyleOf } from './detail-canvas';
import { DETAIL_FONT_FAMILY, type DetailEffect } from './detail-types';

export type EffectPickerProps = {
  value: DetailEffect;
  onValueChange: (effect: DetailEffect) => void;
  sample: string;
};

const NAMES: Record<DetailEffect, string> = {
  none: '없음',
  shadow: '그림자',
  outline: '테두리',
  band: '띠',
};

const ORDER: DetailEffect[] = ['none', 'shadow', 'outline', 'band'];

const KEYS = [
  'color',
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
  'borderWidth',
  'borderColor',
  'paddingHorizontal',
  'backgroundColor',
] as const;

function effectOnly(style: TextStyle): TextStyle {
  const out: Record<string, unknown> = {};
  for (const key of KEYS) {
    if (style[key] !== undefined) out[key] = style[key];
  }
  return out as TextStyle;
}

export function EffectPicker({
  value,
  onValueChange,
  sample,
}: EffectPickerProps) {
  const t = useTheme();
  const look = useSampleStyle();
  return (
    <SampleTiles
      value={value}
      onValueChange={onValueChange}
      items={ORDER.map((effect) => ({
        value: effect,
        name: NAMES[effect],
        sample: (
          <RNText
            numberOfLines={1}
            maxFontSizeMultiplier={t.maxFontScale}
            style={[
              look,
              { fontFamily: DETAIL_FONT_FAMILY.gothic.regular },
              effectOnly(
                textStyleOf(
                  { id: 'sample', type: 'text', style: { effect } },
                  1,
                  t.colors.foreground,
                  t.colors.surface
                )
              ),
            ]}
          >
            {sample}
          </RNText>
        ),
      }))}
    />
  );
}
