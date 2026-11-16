import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ProgressRing } from './progress-ring';

const meta = {
  title: 'Charts/ProgressRing',
  component: ProgressRing,
  args: { value: 5 / 6, accessibilityLabel: '사이트 5 / 6' },
} satisfies Meta<typeof ProgressRing>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};
