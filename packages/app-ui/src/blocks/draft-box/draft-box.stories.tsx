import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { DraftBox } from './draft-box';

const meta = {
  title: 'Blocks/DraftBox',
  component: DraftBox,
  args: {
    label: 'AI 답변 초안',
    note: '세탁 정보 확인 필요',
    text: '린넨 100%라 찬물 손세탁을 권해요.',
    sendLabel: '전송',
    onEdit: () => {},
    onSend: () => {},
  },
} satisfies Meta<typeof DraftBox>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};
