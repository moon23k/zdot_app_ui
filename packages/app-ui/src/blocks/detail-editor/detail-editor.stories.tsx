import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Column, Section } from '../../__stories__/helpers';
import { DetailCanvas } from './detail-canvas';
import {
  DETAIL_LAYOUTS,
  DETAIL_LIST_LAYOUTS,
  type DetailDocValue,
  type DetailEffect,
  type DetailFont,
  type DetailLayout,
} from './detail-types';
import { EffectPicker } from './effect-picker';
import { FontPicker } from './font-picker';
import { LayoutPicker } from './layout-picker';
import { CompareSlider } from './compare-slider';

const photo = 'https://picsum.photos/seed/zdot-vase/600/750';

const doc: DetailDocValue = {
  version: 2,
  blocks: [
    {
      id: 'b1',
      layout: 'image',
      layers: [{ id: 'p1', type: 'image', url: photo }],
    },
    {
      id: 'b2',
      layout: 'text',
      layers: [
        {
          id: 't1',
          type: 'text',
          text: '한 송이만 꽂아도\n달라지는 자리',
          style: { font: 'serif', size: 8, weight: 'bold', align: 'center' },
        },
      ],
    },
    {
      id: 'b3',
      layout: 'side',
      layers: [
        { id: 'p2', type: 'image', url: photo },
        {
          id: 't2',
          type: 'text',
          text: '지름 12cm · 높이 24cm',
          style: { size: 6, weight: 'bold', effect: 'band' },
        },
      ],
    },
    {
      id: 'b4',
      layout: 'table',
      layers: [
        ['크기', '지름 17cm · 높이 7.5cm'],
        ['용량', '750ml'],
        ['소재', '백자토 · 무광 유약'],
      ].flatMap(([label, value], i) => [
        {
          id: `k${i}`,
          type: 'text' as const,
          text: label,
          style: { size: 4, color: '#626262' },
        },
        { id: `v${i}`, type: 'text' as const, text: value, style: { size: 5 } },
      ]),
    },
    {
      id: 'b5',
      layout: 'steps',
      layers: ['물레 성형', '초벌 800도', '유약', ''].map((text, i) => ({
        id: `s${i}`,
        type: 'text' as const,
        text,
        style: { size: 4, align: 'center' as const },
      })),
    },
  ],
};

function Demo() {
  const [layout, setLayout] = useState<DetailLayout>('side');
  const [font, setFont] = useState<DetailFont>('serif');
  const [effect, setEffect] = useState<DetailEffect>('shadow');
  return (
    <Column>
      <Section title="캔버스">
        <DetailCanvas
          doc={doc}
          selection={{ block: 'b2', layer: 't1' }}
          onSelect={() => {}}
        />
      </Section>
      <Section title="원본과 비교">
        <CompareSlider before={photo} after={photo} />
      </Section>
      <Section title="블록 배치">
        <LayoutPicker
          value={layout}
          onValueChange={setLayout}
          items={[...DETAIL_LAYOUTS, ...DETAIL_LIST_LAYOUTS]}
        />
      </Section>
      <Section title="글꼴">
        <FontPicker value={font} onValueChange={setFont} sample="Aa 한 송이" />
      </Section>
      <Section title="효과">
        <EffectPicker
          value={effect}
          onValueChange={setEffect}
          sample="가나다"
        />
      </Section>
    </Column>
  );
}

const meta = { title: 'Blocks/DetailEditor', component: Demo } satisfies Meta<
  typeof Demo
>;
export default meta;

export const AllVariants: StoryObj<typeof meta> = {};
