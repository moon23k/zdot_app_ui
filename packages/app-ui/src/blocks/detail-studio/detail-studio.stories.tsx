import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from '../../components/text/text';
import { EyeGlyph, PlusGlyph, WandGlyph } from '../../internal/glyphs';
import { SectionBoard } from '../../sortable/section-board';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { DetailCanvas } from '../detail-editor/detail-canvas';
import { DetailStudioTemplate } from './detail-studio-template';
import { SectionKindGrid } from './section-kind-grid';
import { SectionThumb } from './section-thumb';
import { StudioBar } from './studio-bar';
import { StudioDock, studioDockSpace } from './studio-dock';
import {
  studioKinds,
  studioPage,
  studioSections,
} from './__stories__/studio-fixture';

const useStyles = makeStyles((t) => ({
  phone: {
    width: 390,
    height: 760,
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.background,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 560,
    paddingTop: t.space[4],
    paddingHorizontal: t.space[4],
    borderTopLeftRadius: t.radius.xl,
    borderTopRightRadius: t.radius.xl,
    backgroundColor: t.colors.surface,
  },
  head: { ...t.typography.title, color: t.colors.title },
}));

function Phone({ children }: { children: ReactNode }) {
  const s = useStyles();
  return (
    <GestureHandlerRootView style={s.phone}>{children}</GestureHandlerRootView>
  );
}

const dockItems = [
  { key: 'add', icon: PlusGlyph, label: '추가', onPress: () => {} },
  { key: 'polish', icon: WandGlyph, label: '다듬기', onPress: () => {} },
  { key: 'preview', icon: EyeGlyph, label: '미리보기', onPress: () => {} },
];

function ListScreen() {
  const t = useTheme();
  const [order, setOrder] = useState(studioSections.map((x) => x.key));
  const items = order.map((key) => {
    const section = studioSections.find((x) => x.key === key)!;
    return {
      key,
      title: section.name,
      snippet: section.snippet,
      thumb: <SectionThumb doc={section.doc} />,
    };
  });
  return (
    <Phone>
      <DetailStudioTemplate
        bar={
          <StudioBar
            title="상세페이지"
            onClose={() => {}}
            action={{ label: '완료', onPress: () => {} }}
          />
        }
        dock={<StudioDock items={dockItems} />}
      >
        <SectionBoard
          items={items}
          onPress={() => {}}
          onMore={() => {}}
          onReorder={setOrder}
          bottomSpace={studioDockSpace(t)}
        />
      </DetailStudioTemplate>
    </Phone>
  );
}

function AddScreen() {
  const s = useStyles();
  return (
    <Phone>
      <View style={s.sheet}>
        <Text style={s.head}>구획 추가</Text>
        <SectionKindGrid items={studioKinds} onPick={() => {}} />
      </View>
    </Phone>
  );
}

function PreviewScreen() {
  return (
    <Phone>
      <DetailStudioTemplate
        tone="surface"
        scroll
        bar={<StudioBar title="미리보기" tone="surface" onClose={() => {}} />}
      >
        <DetailCanvas doc={studioPage} scale={390 / 360} />
      </DetailStudioTemplate>
    </Phone>
  );
}

const meta = {
  title: 'Blocks/Detail/Studio',
  component: ListScreen,
} satisfies Meta<typeof ListScreen>;
export default meta;

export const List: StoryObj<typeof meta> = {};
export const AddSection: StoryObj<typeof meta> = {
  render: () => <AddScreen />,
};
export const Preview: StoryObj<typeof meta> = {
  render: () => <PreviewScreen />,
};
