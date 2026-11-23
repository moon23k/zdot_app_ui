import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { studioSections } from '../blocks/detail-studio/__stories__/studio-fixture';
import { SectionThumb } from '../blocks/detail-studio/section-thumb';
import { makeStyles } from '../utils/styles';
import { SectionBoard } from './section-board';

const useStyles = makeStyles((t) => ({
  root: {
    width: 390,
    height: 760,
    paddingTop: t.space[4],
    backgroundColor: t.colors.background,
  },
}));

function Demo() {
  const s = useStyles();
  const [order, setOrder] = useState(studioSections.map((x) => x.key));
  const items = order.map((key) => {
    const section = studioSections.find((x) => x.key === key)!;
    return {
      key,
      title: section.name,
      snippet: section.snippet,
      hidden: section.hidden,
      thumb: <SectionThumb doc={section.doc} />,
    };
  });
  return (
    <GestureHandlerRootView style={s.root}>
      <SectionBoard
        items={items}
        onPress={() => {}}
        onMore={() => {}}
        onReorder={setOrder}
      />
    </GestureHandlerRootView>
  );
}

const meta = {
  title: 'Sortable/SectionBoard',
  component: Demo,
} satisfies Meta<typeof Demo>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
