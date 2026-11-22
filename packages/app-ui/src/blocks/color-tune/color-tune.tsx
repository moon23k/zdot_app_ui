import { useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { mixHex } from '../../utils/color';
import { makeStyles } from '../../utils/styles';
import {
  PaletteStrips,
  type PaletteThumb,
} from '../palette-block/palette-block';
import { StoreSample, type StoreSampleProps } from './store-sample';
import { SwatchCard } from './swatch-card';
import { ToneSlider } from './tone-slider';

export type ColorTuneTone = {
  key: string;
  color: string;
  code: string;
  name: string;
  label?: string;
};

export type ColorTuneSample = Omit<StoreSampleProps, 'colors' | 'style'>;

export type ColorTuneProps<P extends string = string> = {
  tones: readonly ColorTuneTone[];
  value: string;
  origin: string;
  onValueChange: (key: string) => void;
  palettes: readonly PaletteThumb<P>[];
  palette: P;
  onPaletteChange: (key: P) => void;
  sample: ColorTuneSample;
  resetLabel?: string;
  toneLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const SLIDER_TOP = 6;
const SLIDER_BOTTOM = 12;

const useStyles = makeStyles((t) => ({
  root: { flex: 1 },
  slider: { marginTop: SLIDER_TOP },
  preview: { flex: 1, marginTop: SLIDER_BOTTOM },
  alone: { flex: 1, marginTop: t.space[5] },
  strips: { marginTop: t.space[4] },
}));

function blend(tones: readonly ColorTuneTone[], at: number): string {
  const low = Math.floor(at);
  const high = Math.min(tones.length - 1, low + 1);
  return mixHex(tones[low]!.color, tones[high]!.color, at - low);
}

export function ColorTune<P extends string = string>({
  tones,
  value,
  origin,
  onValueChange,
  palettes,
  palette,
  onPaletteChange,
  sample,
  resetLabel = '처음 색으로',
  toneLabel = '톤',
  style,
}: ColorTuneProps<P>) {
  const s = useStyles();
  const [scrub, setScrub] = useState<number | null>(null);
  const index = Math.max(
    0,
    tones.findIndex((tone) => tone.key === value)
  );
  const start = tones.findIndex((tone) => tone.key === origin);
  const tone = tones[index];
  const current = palettes.find((p) => p.key === palette) ?? palettes[0];
  const slider = tones.length > 1;
  if (!tone) return <View style={[s.root, style]} />;
  return (
    <View style={[s.root, style]}>
      <SwatchCard
        color={scrub === null || !slider ? tone.color : blend(tones, scrub)}
        code={tone.code}
        name={tone.name}
        resetLabel={resetLabel}
        onReset={
          start >= 0 && start !== index
            ? () => onValueChange(tones[start]!.key)
            : undefined
        }
      />
      {slider ? (
        <ToneSlider
          colors={tones.map((t) => t.color)}
          value={index}
          origin={start >= 0 ? start : undefined}
          labels={tones.map((t) => t.label ?? t.name)}
          accessibilityLabel={toneLabel}
          onValueChange={(i) => onValueChange(tones[i]!.key)}
          onScrub={setScrub}
          style={s.slider}
        />
      ) : null}
      {current ? (
        <StoreSample
          {...sample}
          colors={current.colors}
          style={slider ? s.preview : s.alone}
        />
      ) : (
        <View style={s.preview} />
      )}
      <PaletteStrips
        items={palettes}
        value={current?.key ?? palette}
        onValueChange={onPaletteChange}
        style={s.strips}
      />
    </View>
  );
}
