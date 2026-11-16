import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ReviewCard } from './review-card';

const meta = {
  title: 'Blocks/ReviewCard',
  component: ReviewCard,
  args: {
    rating: 2,
    author: '김민지 · 11월 8일',
    body: '포장이 엉망이라 실망했어요.',
    product: { name: '원목 트레이 · 라지' },
    status: { label: '미답변', tone: 'warning' },
  },
} satisfies Meta<typeof ReviewCard>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};
