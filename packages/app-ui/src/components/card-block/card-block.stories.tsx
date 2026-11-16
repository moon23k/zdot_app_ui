import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text } from '../text/text';
import { CardBlock } from './card-block';

const meta = {
  title: 'Components/CardBlock',
  component: CardBlock,
  args: { children: <Text>김지은 · 단순 변심</Text> },
} satisfies Meta<typeof CardBlock>;
export default meta;

export const Playground: StoryObj<typeof meta> = {};
