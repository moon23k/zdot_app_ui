import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PencilGlyph, SendGlyph } from '../../internal/glyphs';
import { Button } from '../button/button';
import { ActionRow } from './action-row';

const meta = {
  title: 'Components/ActionRow',
  component: ActionRow,
  args: { children: null },
} satisfies Meta<typeof ActionRow>;
export default meta;

export const Reply: StoryObj<typeof meta> = {
  render: () => (
    <ActionRow>
      <Button variant="outline" size="sm" leftIcon={PencilGlyph}>
        고치기
      </Button>
      <Button size="sm" leftIcon={SendGlyph}>
        그대로 보내기
      </Button>
    </ActionRow>
  ),
};
