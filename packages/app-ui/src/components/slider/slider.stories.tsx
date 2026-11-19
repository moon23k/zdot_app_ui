import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Column, Section } from '../../__stories__/helpers';
import { FieldGroup } from '../field-group/field-group';
import { Slider } from './slider';

const axes = [
  {
    key: 'temp',
    label: '색감',
    start: '시원한',
    end: '따뜻한',
    min: -2,
    max: 2,
  },
  {
    key: 'size',
    label: '글자 크기',
    start: '작게',
    end: '크게',
    min: 1,
    max: 10,
  },
  {
    key: 'tracking',
    label: '자간',
    start: '자간',
    end: '넓게',
    min: -5,
    max: 10,
  },
  { key: 'space', label: '위 여백', start: '위', end: '넓게', min: 0, max: 10 },
];

function Demo() {
  const [values, setValues] = useState<Record<string, number>>({
    temp: 0.7,
    size: 5.4,
    tracking: -2,
    space: 0,
  });
  return (
    <Section title="interactive">
      <Column>
        {axes.map((axis) => (
          <FieldGroup key={axis.key} label={axis.label}>
            <Slider
              value={values[axis.key] ?? axis.min}
              min={axis.min}
              max={axis.max}
              onChange={(v) => setValues({ ...values, [axis.key]: v })}
              startLabel={axis.start}
              endLabel={axis.end}
              accessibilityLabel={axis.label}
            />
          </FieldGroup>
        ))}
      </Column>
    </Section>
  );
}

const meta = {
  title: 'Components/Slider',
  component: Demo,
} satisfies Meta<typeof Demo>;
export default meta;

export const AllVariants: StoryObj<typeof meta> = {};

export const Dark: StoryObj<typeof meta> = { globals: { scheme: 'dark' } };
