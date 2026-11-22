import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Column } from '../../__stories__/helpers';
import { FilterTabs } from './filter-tabs';

const groups = [
  { value: 'all', label: '전체' },
  { value: 'fashion', label: '패션' },
  { value: 'shoes', label: '슈즈·백·액세서리' },
  { value: 'jewelry', label: '주얼리·워치' },
  { value: 'beauty', label: '뷰티' },
  { value: 'living', label: '리빙' },
  { value: 'dessert', label: '디저트' },
] as const;
type Group = (typeof groups)[number]['value'];

function Demo() {
  const [group, setGroup] = useState<Group>('all');
  return (
    <Column>
      <FilterTabs items={groups} value={group} onValueChange={setGroup} />
    </Column>
  );
}

const meta = {
  title: 'Components/FilterTabs',
  component: Demo,
} satisfies Meta<typeof Demo>;
export default meta;

export const AllVariants: StoryObj<typeof meta> = {};
