import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Column } from '../../__stories__/helpers';
import { Bubble } from './bubble';

const meta = {
  title: 'Components/Bubble',
  component: Bubble,
  args: { children: '생각했던 색감과 달라요' },
} satisfies Meta<typeof Bubble>;
export default meta;

export const Both: StoryObj<typeof meta> = {
  render: () => (
    <Column>
      <Bubble>생각했던 색감과 달라요</Bubble>
      <Bubble side="out">
        반품 접수했어요. 회수 기사님이 방문하면 상품을 전달해 주세요.
      </Bubble>
    </Column>
  ),
};
