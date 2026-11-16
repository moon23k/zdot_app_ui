import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { FactList } from './fact-list';

const meta = {
  title: 'Components/FactList',
  component: FactList,
  args: {
    items: [
      { label: '받은 지 7일 이내', met: true },
      { label: '반품 가능한 상품', met: true },
      { label: '상품 사진', met: false },
    ],
  },
} satisfies Meta<typeof FactList>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};
