import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Row } from '../../__stories__/helpers';
import {
  BellGlyph,
  OpenGlyph,
  PhoneGlyph,
  SmsGlyph,
} from '../../internal/glyphs';
import { IconButton } from './icon-button';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  args: { icon: PhoneGlyph, accessibilityLabel: '전화' },
} satisfies Meta<typeof IconButton>;
export default meta;

export const Set: StoryObj<typeof meta> = {
  render: () => (
    <Row>
      <IconButton icon={PhoneGlyph} accessibilityLabel="전화" />
      <IconButton icon={SmsGlyph} accessibilityLabel="문자" />
      <IconButton icon={OpenGlyph} accessibilityLabel="사이트 열기" />
      <IconButton icon={BellGlyph} accessibilityLabel="알림" dot />
    </Row>
  ),
};
