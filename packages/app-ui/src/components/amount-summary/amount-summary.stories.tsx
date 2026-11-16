import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { AmountSummary } from './amount-summary';

const meta = {
  title: 'Components/AmountSummary',
  component: AmountSummary,
  args: {
    label: '환불 예정',
    value: '12,000원',
    lines: [
      { label: '상품 금액', value: '18,000원' },
      { label: '반품 배송비', value: '−6,000원' },
    ],
  },
} satisfies Meta<typeof AmountSummary>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};
