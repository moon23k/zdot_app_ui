import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Row } from '../../__stories__/helpers';
import { Pill } from './pill';

const meta = {
  title: 'Components/Pill',
  component: Pill,
  args: { children: 'D-3 발송' },
} satisfies Meta<typeof Pill>;
export default meta;

export const Deadlines: StoryObj<typeof meta> = {
  render: () => (
    <Row>
      <Pill tone="warning">오늘 18:00까지</Pill>
      <Pill>D-3 발송</Pill>
      <Pill>단순 변심</Pill>
    </Row>
  ),
};
