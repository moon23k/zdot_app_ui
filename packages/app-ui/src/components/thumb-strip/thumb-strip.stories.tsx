import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ThumbStrip } from './thumb-strip';

const meta = {
  title: 'Components/ThumbStrip',
  component: ThumbStrip,
  args: { images: ['', ''] },
} satisfies Meta<typeof ThumbStrip>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};
