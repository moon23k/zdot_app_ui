import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { studioSections } from '../blocks/detail-studio/__stories__/studio-fixture';
import { SectionCover } from '../blocks/detail-studio/section-cover';
import { ImageGlyph } from '../internal/glyphs';
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
      thumb: (
        <SectionCover
          uri={
            section.doc.blocks
              .flatMap((b) => b.layers)
              .find((l) => l.type === 'image' && l.url)?.url ?? null
          }
          icon={ImageGlyph}
        />
      ),
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

function Waiting() {
  const s = useStyles();
  return (
    <GestureHandlerRootView style={s.root}>
      <SectionBoard
        items={studioSections.map((section) => ({
          key: section.key,
          title: section.name,
          thumb: null,
          pending: true,
        }))}
        onPress={() => {}}
        onMore={() => {}}
        onReorder={() => {}}
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

export const Pending: StoryObj<typeof meta> = { render: () => <Waiting /> };
