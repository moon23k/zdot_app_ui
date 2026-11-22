import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { demoPhotoIds, sample, Section } from '../../__stories__/helpers';
import { TileGrid } from './tile-grid';

const items = [
  {
    value: 'womens',
    label: '여성 패션',
    caption: '패션',
    uri: sample(demoPhotoIds.clothes).uri,
  },
  {
    value: 'bakery',
    label: '베이커리',
    caption: '디저트',
    source: sample(demoPhotoIds.cafe),
  },
  {
    value: 'roastery',
    label: '스페셜티 로스터리',
    caption: '카페',
    uri: sample(demoPhotoIds.latte).uri,
  },
  {
    value: 'living',
    label: '홈데코 셀렉트숍',
    caption: '리빙',
    uri: sample(demoPhotoIds.mug).uri,
  },
  { value: 'flower', label: '플라워 숍', caption: '플랜트' },
];

function Demo() {
  const [value, setValue] = useState<string | null>('bakery');
  return (
    <Section title="2열 · 하나 선택">
      <TileGrid items={items} value={value} onValueChange={setValue} />
    </Section>
  );
}

const meta = { title: 'Components/TileGrid', component: Demo } satisfies Meta<
  typeof Demo
>;
export default meta;

export const Variants: StoryObj<typeof meta> = {};
