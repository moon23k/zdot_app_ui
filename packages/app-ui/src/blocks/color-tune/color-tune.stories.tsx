import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { sample } from '../../__stories__/helpers';
import { Phone } from '../../__stories__/phone';
import {
  PaletteStrips,
  type PaletteThumb,
} from '../palette-block/palette-block';
import { StepScreen } from '../step-screen/step-screen';
import { ColorTune, type ColorTuneSample } from './color-tune';
import { StoreSample } from './store-sample';
import { SwatchCard } from './swatch-card';
import { ToneSlider } from './tone-slider';

type Harmony = 'tonal' | 'analogous' | 'complementary';

const tones = [
  {
    key: '09-C03',
    color: '#B64C2F',
    code: 'RR 55',
    name: 'WILD POPPY',
    label: '와일드 포피',
  },
  {
    key: '11-C01',
    color: '#A53E35',
    code: 'RR 50',
    name: 'WILD CHERRY',
    label: '와일드 체리',
  },
  {
    key: '10-C02',
    color: '#973100',
    code: 'YR 46',
    name: 'RED LACQUER',
    label: '레드 래커',
  },
  {
    key: '12-C01',
    color: '#7C1D18',
    code: 'RR 39',
    name: 'ROYAL BURGUNDY',
    label: '로열 버건디',
  },
  {
    key: '10-C03',
    color: '#601000',
    code: 'RR 32',
    name: 'VELVET CHERRY',
    label: '벨벳 체리',
  },
];

const palettesOf = (main: string): PaletteThumb<Harmony>[] => [
  {
    key: 'tonal',
    label: '톤 온 톤',
    colors: {
      main,
      secondary: '#DFAA90',
      accent: '#973100',
      background: '#FBEEE5',
      text: '#140601',
    },
  },
  {
    key: 'analogous',
    label: '유사색',
    colors: {
      main,
      secondary: '#DCB68B',
      accent: '#513C00',
      background: '#FBEEE5',
      text: '#1C1001',
    },
  },
  {
    key: 'complementary',
    label: '보색',
    colors: {
      main,
      secondary: '#DFAA90',
      accent: '#00504D',
      background: '#FDF7ED',
      text: '#1C1001',
    },
  },
];

const store: ColorTuneSample = {
  name: '소담',
  categories: ['전체', '컵', '접시', '화병', '패브릭'],
  badge: 'NEW',
  hero: sample(1060, 900, 600),
  items: [
    { key: 'oil', name: '앰버 오일 병', price: '24,000원', source: sample(30) },
    { key: 'plant', name: '초록 화분', price: '15,000원', source: sample(26) },
    {
      key: 'apron',
      name: '리넨 앞치마',
      price: '38,000원',
      source: sample(535),
    },
    {
      key: 'vase',
      name: '무광 화병 세트',
      price: '58,000원',
      source: sample(20),
    },
  ],
};

const styles = StyleSheet.create({
  pad: { padding: 20, gap: 20, maxWidth: 390 },
  preview: { height: 386 },
});

function Tune({
  start = '10-C03',
  from = start,
}: {
  start?: string;
  from?: string;
}) {
  const [value, setValue] = useState(from);
  const [harmony, setHarmony] = useState<Harmony>('tonal');
  const main = tones.find((t) => t.key === value)!.color;
  return (
    <Phone>
      <StepScreen
        total={3}
        current={1}
        compact
        fill
        onBack={() => {}}
        primaryAction={{ label: '다음', onPress: () => {} }}
      >
        <ColorTune
          tones={tones}
          value={value}
          origin={start}
          onValueChange={setValue}
          palettes={palettesOf(main)}
          palette={harmony}
          onPaletteChange={setHarmony}
          sample={store}
        />
      </StepScreen>
    </Phone>
  );
}

function Parts() {
  const [index, setIndex] = useState(4);
  const [harmony, setHarmony] = useState<Harmony>('tonal');
  const tone = tones[index]!;
  const palettes = palettesOf(tone.color);
  return (
    <View style={styles.pad}>
      <SwatchCard
        color={tone.color}
        code={tone.code}
        name={tone.name}
        onReset={index === 4 ? undefined : () => setIndex(4)}
      />
      <ToneSlider
        colors={tones.map((t) => t.color)}
        value={index}
        origin={4}
        labels={tones.map((t) => t.label)}
        accessibilityLabel="톤"
        onValueChange={setIndex}
      />
      <StoreSample
        {...store}
        colors={palettes.find((p) => p.key === harmony)!.colors}
        style={styles.preview}
      />
      <PaletteStrips
        items={palettes}
        value={harmony}
        onValueChange={setHarmony}
      />
    </View>
  );
}

const meta = {
  title: 'Blocks/Brand/ColorTune',
  component: ColorTune,
  args: {
    tones,
    value: '10-C03',
    origin: '10-C03',
    onValueChange: () => {},
    palettes: palettesOf('#601000'),
    palette: 'tonal',
    onPaletteChange: () => {},
    sample: store,
  },
} satisfies Meta<typeof ColorTune>;
export default meta;

export const Default: StoryObj<typeof meta> = { render: () => <Tune /> };
export const Adjusted: StoryObj<typeof meta> = {
  render: () => <Tune from="10-C02" />,
};
export const Pieces: StoryObj<typeof meta> = { render: () => <Parts /> };
