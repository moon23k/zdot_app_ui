import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Pill } from '../../components/pill/pill';
import { ClockGlyph, ScanGlyph } from '../../internal/glyphs';
import { OrderBlock, SwipeAction } from './order-block';

const meta = {
  title: 'Blocks/OrderBlock',
  component: OrderBlock,
  args: {
    title: '원목 트레이 외 1건',
    meta: '박서연 · 2개',
    amount: '71,000원',
    image: null,
    badge: (
      <Pill icon={ClockGlyph} tone="warning">
        오늘까지 발송
      </Pill>
    ),
    action: { label: '송장 입력', icon: ScanGlyph, onPress: () => {} },
    onPress: () => {},
  },
} satisfies Meta<typeof OrderBlock>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};

export const Selecting: StoryObj<typeof meta> = { args: { selected: true } };

export const Swiped: StoryObj<typeof meta> = {
  render: () => <SwipeAction label="발송 처리" />,
};
