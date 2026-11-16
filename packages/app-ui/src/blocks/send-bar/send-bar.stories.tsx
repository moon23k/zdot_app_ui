import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SendBar } from './send-bar';

const meta = {
  title: 'Blocks/SendBar',
  component: SendBar,
  args: {
    value: '',
    onChangeText: () => {},
    onSend: () => {},
    placeholder: '메시지를 입력해 주세요',
  },
} satisfies Meta<typeof SendBar>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};
