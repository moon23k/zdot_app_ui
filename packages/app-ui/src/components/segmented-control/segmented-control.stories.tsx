import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Column, Section } from '../../__stories__/helpers';
import { SegmentedControl } from './segmented-control';

function Demo() {
  const [tab, setTab] = useState<'layout' | 'background' | 'space'>('layout');
  return (
    <Column>
      <Section title="구획">
        <SegmentedControl
          items={[
            { value: 'layout', label: '배치' },
            { value: 'background', label: '배경' },
            { value: 'space', label: '여백' },
          ]}
          value={tab}
          onValueChange={setTab}
        />
      </Section>
    </Column>
  );
}

const meta = {
  title: 'Components/SegmentedControl',
  component: Demo,
} satisfies Meta<typeof Demo>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
