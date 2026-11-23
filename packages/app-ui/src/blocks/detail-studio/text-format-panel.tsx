import { Text as RNText, View } from 'react-native';
import { SegmentedControl } from '../../components/segmented-control/segmented-control';
import { Slider } from '../../components/slider/slider';
import {
  AlignGlyph,
  AlignLeftGlyph,
  AlignRightGlyph,
} from '../../internal/glyphs';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import {
  ColorSwatchPicker,
  type ColorSwatch,
} from '../color-swatch-picker/color-swatch-picker';
import { EffectPicker } from '../detail-editor/effect-picker';
import { FontPicker } from '../detail-editor/font-picker';
import {
  DETAIL_COLORS,
  type DetailTextStyle,
  type DetailWeight,
} from '../detail-editor/detail-types';

export type TextFormatTab =
  'font' | 'size' | 'spacing' | 'color' | 'align' | 'effect';

export type TextFormatPanelProps = {
  value: DetailTextStyle;
  onChange: (patch: Partial<DetailTextStyle>, group?: string) => void;
  onSlidingStart?: () => void;
  tab: TextFormatTab;
  onTabChange: (tab: TextFormatTab) => void;
  sample?: string;
  colors?: readonly ColorSwatch[];
  bottomInset?: number;
};

const FORMAT_PANEL = 180;

const TABS: { value: TextFormatTab; label: string }[] = [
  { value: 'font', label: '글꼴' },
  { value: 'size', label: '크기' },
  { value: 'spacing', label: '간격' },
  { value: 'color', label: '색' },
  { value: 'align', label: '정렬' },
  { value: 'effect', label: '효과' },
];

const WEIGHTS: { value: DetailWeight; label: string }[] = [
  { value: 'regular', label: '보통' },
  { value: 'bold', label: '굵게' },
  { value: 'heavy', label: '아주 굵게' },
];

const ALIGNS = [
  { value: 'left', label: '왼쪽', icon: AlignLeftGlyph },
  { value: 'center', label: '가운데', icon: AlignGlyph },
  { value: 'right', label: '오른쪽', icon: AlignRightGlyph },
] as const;

const useStyles = makeStyles((t) => ({
  panel: { paddingTop: t.space[3], backgroundColor: t.colors.surface },
  tabs: { paddingHorizontal: t.space[4] },
  body: {
    paddingTop: t.space[3],
    paddingHorizontal: t.space[4],
    gap: t.space[3],
  },
  small: {
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    color: t.colors.mutedForeground,
  },
  swatches: { paddingTop: t.space[4], paddingHorizontal: t.space[1] },
  large: {
    fontSize: t.typography.display.fontSize,
    lineHeight: t.typography.display.lineHeight,
    color: t.colors.title,
  },
}));

const round = (value: number) => String(Math.round(value));

export function TextFormatPanel({
  value,
  onChange,
  onSlidingStart,
  tab,
  onTabChange,
  sample = '가나다',
  colors,
  bottomInset = 0,
}: TextFormatPanelProps) {
  const t = useTheme();
  const s = useStyles();
  const size = value.size ?? 5;
  const line = value.line ?? 5;
  const tracking = value.tracking ?? 0;

  const body = () => {
    switch (tab) {
      case 'font':
        return (
          <FontPicker
            variant="tiles"
            value={value.font ?? 'gothic'}
            onValueChange={(font) => onChange({ font })}
            sample={sample}
          />
        );
      case 'size':
        return (
          <>
            <Slider
              value={size}
              min={1}
              max={10}
              onChange={(v) => onChange({ size: v }, 'size')}
              onSlidingStart={onSlidingStart}
              start={
                <RNText maxFontSizeMultiplier={t.maxFontScale} style={s.small}>
                  가
                </RNText>
              }
              end={
                <RNText maxFontSizeMultiplier={t.maxFontScale} style={s.large}>
                  가
                </RNText>
              }
              accessibilityLabel="글자 크기"
            />
            <SegmentedControl
              items={WEIGHTS}
              value={value.weight ?? 'regular'}
              onValueChange={(weight) => onChange({ weight })}
            />
          </>
        );
      case 'spacing':
        return (
          <>
            <Slider
              value={line}
              min={1}
              max={10}
              onChange={(v) => onChange({ line: v }, 'line')}
              onSlidingStart={onSlidingStart}
              startLabel="줄"
              endLabel={round(line)}
              accessibilityLabel="줄 간격"
            />
            <Slider
              value={tracking}
              min={-5}
              max={10}
              onChange={(v) => onChange({ tracking: v }, 'tracking')}
              onSlidingStart={onSlidingStart}
              startLabel="자간"
              endLabel={round(tracking)}
              accessibilityLabel="자간"
            />
          </>
        );
      case 'color':
        return (
          <ColorSwatchPicker
            variant="row"
            style={s.swatches}
            colors={colors ?? DETAIL_COLORS}
            value={value.color ?? DETAIL_COLORS[0]!.value}
            onValueChange={(color) => onChange({ color })}
          />
        );
      case 'align':
        return (
          <SegmentedControl
            items={ALIGNS}
            value={value.align ?? 'left'}
            onValueChange={(align) => onChange({ align })}
          />
        );
      default:
        return (
          <EffectPicker
            value={value.effect ?? 'none'}
            onValueChange={(effect) => onChange({ effect })}
            sample={sample}
          />
        );
    }
  };

  return (
    <View style={[s.panel, { height: FORMAT_PANEL + bottomInset }]}>
      <View style={s.tabs}>
        <SegmentedControl
          items={TABS}
          value={tab}
          onValueChange={onTabChange}
        />
      </View>
      <View style={s.body}>{body()}</View>
    </View>
  );
}
