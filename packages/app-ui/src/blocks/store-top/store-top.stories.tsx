import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  BellGlyph,
  MessageGlyph,
  OpenGlyph,
  ReturnGlyph,
  StarGlyph,
  TruckGlyph,
} from '../../internal/glyphs';
import { StoreTop } from './store-top';

const meta = {
  title: 'Blocks/StoreTop',
  component: StoreTop,
  args: {
    name: '반품 많은 리빙샵',
    status: { label: '영업 중', live: true },
    onSwitch: () => {},
    actions: [
      { icon: OpenGlyph, label: '내 사이트', onPress: () => {} },
      { icon: BellGlyph, label: '알림', dot: true, onPress: () => {} },
    ],
    cells: [
      { key: 'ship', icon: TruckGlyph, label: '발송', count: 3, urgent: 1 },
      { key: 'claim', icon: ReturnGlyph, label: '클레임', count: 8, urgent: 6 },
      { key: 'inquiry', icon: MessageGlyph, label: '문의', count: 0 },
      { key: 'review', icon: StarGlyph, label: '후기', count: 0 },
    ],
  },
} satisfies Meta<typeof StoreTop>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};
