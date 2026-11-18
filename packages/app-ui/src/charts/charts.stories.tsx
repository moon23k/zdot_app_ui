import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Column, Section } from '../__stories__/helpers';
import { DayBars } from './day-bars';

const days = ['10/17', '10/18', '10/19', '10/20', '10/21', '10/22', '10/23'];
const week = [182000, 240000, 96000, 310000, 275000, 420000, 388000];

function Demo() {
  return (
    <Column>
      <Section title="DayBars">
        <DayBars data={week} labels={days.map((d) => d.slice(3))} />
      </Section>
    </Column>
  );
}

const meta = {
  title: 'Charts/DayBars',
  component: Demo,
} satisfies Meta<typeof Demo>;
export default meta;

export const AllVariants: StoryObj<typeof meta> = {};
