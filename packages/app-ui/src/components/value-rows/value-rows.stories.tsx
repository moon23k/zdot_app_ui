import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ValueRows } from './value-rows';

const meta = {
  title: 'Components/ValueRows',
  component: ValueRows,
  args: {
    rows: [
      { label: '요청자', value: '김민지' },
      { label: '사유', value: '단순 변심' },
      {
        label: '계약금 20%',
        value: '90,000원',
        note: { text: '결제 완료', tone: 'success' },
      },
      { label: '12월 8일부터', value: '33,000원', tone: 'warning' },
    ],
  },
} satisfies Meta<typeof ValueRows>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};
