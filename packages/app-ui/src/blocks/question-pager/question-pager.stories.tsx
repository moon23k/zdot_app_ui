import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { StepScreen } from '../step-screen/step-screen';
import { QuestionPager } from './question-pager';

const options = (labels: string[]) =>
  labels.map((label) => ({ value: label, label }));

const groups = [
  {
    key: 'customer',
    label: '손님',
    questions: [
      {
        key: 'age',
        label: '주 고객 연령',
        options: options(['10~20대', '30대', '40대', '50대 이상']),
      },
      {
        key: 'target',
        label: '주 고객 대상',
        options: options(['여성', '남성', '키즈', '반려동물']),
      },
      {
        key: 'level',
        label: '고객 수준',
        options: options(['입문', '일반', '애호가', '전문가']),
      },
    ],
  },
  {
    key: 'purchase',
    label: '구매',
    questions: [
      {
        key: 'occasion',
        label: '구매 상황',
        options: options(['일상', '선물', '기념일', '취미']),
      },
      {
        key: 'cycle',
        label: '구매 주기',
        options: options(['한 번', '가끔', '자주', '정기구독']),
      },
      {
        key: 'criteria',
        label: '선택 기준',
        options: options(['가격', '품질', '디자인', '후기']),
      },
    ],
  },
  {
    key: 'price',
    label: '가격',
    questions: [
      {
        key: 'range',
        label: '가격대',
        options: options([
          '1만 원 미만',
          '1~3만 원',
          '3~10만 원',
          '10만 원 이상',
        ]),
      },
      {
        key: 'discount',
        label: '할인 운영',
        options: options(['상시 할인', '기간 할인', '쿠폰', '없음']),
      },
      {
        key: 'shipping',
        label: '배송비',
        options: options(['무료배송', '조건부 무료', '유료', '착불']),
      },
    ],
  },
  {
    key: 'sales',
    label: '판매',
    questions: [
      {
        key: 'method',
        label: '구매 방식',
        options: options(['바로 구매', '비교 후 구매', '상담 후 구매', '예약']),
      },
      {
        key: 'delivery',
        label: '수령 방식',
        options: options(['택배', '당일배송', '방문 수령', '정기배송']),
      },
      {
        key: 'channel',
        label: '판매 채널',
        options: options(['온라인', '매장', '팝업', 'SNS']),
      },
    ],
  },
];

const total = groups.reduce((n, g) => n + g.questions.length, 0);

const frame = { width: 390, height: 664 };

type Answers = Record<string, string | undefined>;

function Demo({ start, initial }: { start: string; initial: Answers }) {
  const [active, setActive] = useState(start);
  const [value, setValue] = useState<Answers>(initial);
  const count = Object.values(value).filter(Boolean).length;
  return (
    <View style={frame}>
      <StepScreen
        title="스토어를 소개해 주세요"
        total={total}
        current={count - 1}
        fill
        onBack={() => {}}
        primaryAction={{
          label: '사이트 만들기',
          onPress: () => {},
          disabled: count < total,
        }}
      >
        <QuestionPager
          groups={groups}
          value={value}
          onValueChange={(key, option) =>
            setValue((v) => ({ ...v, [key]: option }))
          }
          activeGroup={active}
          onActiveGroupChange={setActive}
        />
      </StepScreen>
    </View>
  );
}

const meta = {
  title: 'Blocks/Onboarding/QuestionPager',
  component: Demo,
  args: { start: 'customer', initial: {} },
} satisfies Meta<typeof Demo>;
export default meta;

export const Initial: StoryObj<typeof meta> = {};

export const Picking: StoryObj<typeof meta> = {
  args: {
    start: 'purchase',
    initial: {
      age: '30대',
      target: '여성',
      level: '일반',
      occasion: '선물',
      cycle: '가끔',
    },
  },
};

export const Complete: StoryObj<typeof meta> = {
  args: {
    start: 'sales',
    initial: {
      age: '30대',
      target: '여성',
      level: '일반',
      occasion: '선물',
      cycle: '가끔',
      criteria: '품질',
      range: '1~3만 원',
      discount: '쿠폰',
      shipping: '조건부 무료',
      method: '바로 구매',
      delivery: '택배',
      channel: '온라인',
    },
  },
};
