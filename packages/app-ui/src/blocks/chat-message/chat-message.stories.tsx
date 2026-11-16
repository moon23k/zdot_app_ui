import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ChatMessage } from './chat-message';

const meta = {
  title: 'Blocks/ChatMessage',
  component: ChatMessage,
  args: { who: '김민지 · 01:53', body: '이 매트 세탁기에 돌려도 되나요?' },
} satisfies Meta<typeof ChatMessage>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};
