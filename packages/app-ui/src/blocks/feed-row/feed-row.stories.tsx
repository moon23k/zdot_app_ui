import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Column } from '../../__stories__/helpers';
import { CardGlyph, ClockGlyph } from '../../internal/glyphs';
import { FeedRow } from './feed-row';

const meta = {
  title: 'Blocks/FeedRow',
  component: FeedRow,
  args: { overline: '주문 · 12분 전', title: '새 주문 · 유리 화병 외 1건' },
} satisfies Meta<typeof FeedRow>;
export default meta;

export const States: StoryObj<typeof meta> = {
  render: () => (
    <Column>
      <FeedRow
        unread
        overline="클레임 · 방금"
        title="취소 요청 · 유리 화병 · 미디엄 외 1건"
        body="이도윤 · 58,000원"
        note={{
          text: '내일 18:00까지 응답',
          icon: ClockGlyph,
          tone: 'warning',
        }}
        onPress={() => {}}
      />
      <FeedRow
        overline="요금 · 11월 8일"
        title="구독 결제 완료"
        body="자사닷 구독 · 29,000원"
        icon={CardGlyph}
      />
    </Column>
  ),
};
