import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Section } from '../../__stories__/helpers';
import { SliderList } from './slider-list';

const axes = [
  {
    key: 'temperature',
    label: '색감',
    startLabel: '시원한',
    endLabel: '따뜻한',
  },
  { key: 'energy', label: '움직임', startLabel: '차분한', endLabel: '활기찬' },
  {
    key: 'softness',
    label: '모양',
    startLabel: '반듯한',
    endLabel: '둥근',
  },
  { key: 'era', label: '스타일', startLabel: '클래식', endLabel: '모던' },
  { key: 'intensity', label: '존재감', startLabel: '은은한', endLabel: '강한' },
];

function Demo() {
  const [values, setValues] = useState<Record<string, number>>({});
  return (
    <Section title="느낌 축">
      <SliderList
        items={axes}
        values={values}
        min={-2}
        max={2}
        onChange={(key, value) =>
          setValues((current) => ({ ...current, [key]: value }))
        }
      />
    </Section>
  );
}

const meta = {
  title: 'Blocks/Onboarding/SliderList',
  component: Demo,
} satisfies Meta<typeof Demo>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
