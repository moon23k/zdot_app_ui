import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button } from '../../components/button/button';
import { CreditPill } from '../../components/credit/credit';
import { SegmentedControl } from '../../components/segmented-control/segmented-control';
import { Sheet } from '../../components/sheet/sheet';
import { Text } from '../../components/text/text';
import {
  BucketGlyph,
  CropGlyph,
  EraserGlyph,
  EyeGlyph,
  FocusGlyph,
  ImageGlyph,
  ImagesGlyph,
  LayoutGlyph,
  PaletteGlyph,
  PlusGlyph,
  ReturnGlyph,
  SparklesGlyph,
  TextSizeGlyph,
  TypeGlyph,
  WandGlyph,
} from '../../internal/glyphs';
import { demoPhotoList, sample } from '../../__stories__/helpers';
import { SectionBoard } from '../../sortable/section-board';
import {
  DETAIL_COLORS,
  DETAIL_LAYOUTS,
  type DetailFont,
  type DetailLayout,
} from '../detail-editor/detail-types';
import { makeStyles } from '../../utils/styles';
import { ColorSwatchPicker } from '../color-swatch-picker/color-swatch-picker';
import { DetailCanvas } from '../detail-editor/detail-canvas';
import type { DetailCanvasFocus } from '../detail-editor/detail-canvas';
import { AdjustTiles } from './adjust-tiles';
import { AssetGrid } from './asset-grid';
import { ConfirmRow } from './confirm-row';
import { DetailStudioTemplate } from './detail-studio-template';
import { ImagePrompt } from './image-prompt';
import { RewriteTray } from './rewrite-tray';
import { SectionEditTemplate } from './section-edit-template';
import { SectionCover } from './section-cover';
import { SectionSettings } from './section-settings';
import { StudioSheet } from './studio-sheet';
import { StudioToggle, StudioToggleList } from './studio-toggle';
import { TextFormatPanel, type TextFormatTab } from './text-format-panel';
import { SectionKindGrid } from './section-kind-grid';
import { StudioBar } from './studio-bar';
import { StudioDock } from './studio-dock';
import { DotsGlyph, MinusGlyph, RetryGlyph, WaveGlyph } from './studio-glyphs';
import { StudioSteps } from './studio-steps';
import { StudioTools } from './studio-tools';
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
  { key: 'library', icon: ImagesGlyph, label: '보관함', onPress: () => {} },
];

type StudioSectionDoc = (typeof studioSections)[number]['doc'];

function firstPhoto(doc: StudioSectionDoc) {
  for (const block of doc.blocks) {
    const photo = block.layers.find(
      (l) => l.type === 'image' && !l.hidden && l.url
    );
    if (photo) return photo.url ?? null;
  }
  return null;
}

function ListScreen() {
  const [order, setOrder] = useState(studioSections.map((x) => x.key));
  const items = order.map((key) => {
    const section = studioSections.find((x) => x.key === key)!;
    return {
      key,
      title: section.name,
      snippet: section.snippet,
      thumb: <SectionCover uri={firstPhoto(section.doc)} icon={ImageGlyph} />,
    };
  });
  return (
    <Phone>
      <DetailStudioTemplate
        bar={
          <StudioBar
            title="상세페이지"
            onClose={() => {}}
            tools={[
              {
                key: 'preview',
                icon: EyeGlyph,
                label: '미리보기',
                onPress: () => {},
              },
            ]}
            action={{ label: '저장', onPress: () => {} }}
          />
        }
        dock={<StudioDock items={dockItems} />}
      >
        <SectionBoard
          items={items}
          onPress={() => {}}
          onMore={() => {}}
          onReorder={setOrder}
        />
      </DetailStudioTemplate>
    </Phone>
  );
}

function MakingScreen() {
  const items = studioSections.map((section, i) => ({
    key: section.key,
    title: section.name,
    pending: true,
    thumb:
      i === 0 ? (
        <SectionCover uri={firstPhoto(section.doc)} icon={ImageGlyph} />
      ) : null,
  }));
  return (
    <Phone>
      <DetailStudioTemplate
        bar={
          <>
            <StudioBar title="상세페이지" onClose={() => {}} />
            <StudioSteps
              steps={[
                { key: 'writing', label: '글 쓰기' },
                { key: 'composing', label: '구획 만들기' },
              ]}
              current="composing"
            />
          </>
        }
      >
        <SectionBoard
          items={items}
          onPress={() => {}}
          onMore={() => {}}
          onReorder={() => {}}
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

const scale = 390 / 360;
const intro = studioSections[0]!;
const scene = studioSections[2]!;

function editTools(section?: boolean) {
  return [
    {
      key: 'section',
      icon: LayoutGlyph,
      label: '구획',
      onPress: () => {},
      active: section,
    },
    { key: 'undo', icon: ReturnGlyph, label: '실행 취소', onPress: () => {} },
    { key: 'redo', icon: ReturnGlyph, label: '다시 실행', mirror: true },
  ];
}

function EditScreen({
  title,
  doc,
  focus,
  section,
  accessory,
  panel,
  sheet,
  confirm,
}: {
  title: string;
  doc: typeof intro.doc;
  focus?: DetailCanvasFocus | null;
  section?: boolean;
  accessory?: ReactNode;
  panel?: ReactNode;
  sheet?: ReactNode;
  confirm?: boolean;
}) {
  return (
    <Phone>
      <SectionEditTemplate
        bar={
          <StudioBar
            title={title}
            leading="back"
            tone="surface"
            onClose={() => {}}
            tools={editTools(section)}
            confirm={confirm ? { label: '완료', onPress: () => {} } : undefined}
          />
        }
        accessory={accessory}
        panel={panel}
        sheet={sheet}
      >
        <DetailCanvas
          doc={doc}
          mode="edit"
          scale={scale}
          onSelect={() => {}}
          focus={focus}
        />
      </SectionEditTemplate>
    </Phone>
  );
}

function keyboardBar(open?: 'font' | 'size' | 'color' | 'more') {
  return (
    <StudioTools
      items={[
        {
          key: 'ai',
          icon: SparklesGlyph,
          label: 'AI 글',
          accent: true,
          onPress: () => {},
        },
        {
          key: 'font',
          icon: TypeGlyph,
          label: '글꼴',
          onPress: () => {},
          active: open === 'font',
        },
        {
          key: 'size',
          icon: TextSizeGlyph,
          label: '크기',
          onPress: () => {},
          active: open === 'size',
        },
        {
          key: 'color',
          icon: PaletteGlyph,
          label: '색',
          onPress: () => {},
          active: open === 'color',
        },
        {
          key: 'more',
          icon: DotsGlyph,
          label: '더보기',
          onPress: () => {},
          active: open === 'more',
        },
      ]}
    />
  );
}

function SectionEditScreen() {
  const body = intro.doc.blocks[0]!.layers.find((l) => l.id === 't1')!;
  const [text, setText] = useState(body.text ?? '');
  return (
    <EditScreen
      title={intro.name}
      doc={intro.doc}
      focus={{
        block: 'b1',
        layer: 't1',
        input: { value: text, onChangeText: setText, active: false },
      }}
      accessory={keyboardBar()}
      confirm
    />
  );
}

function FormatScreen() {
  const [tab, setTab] = useState<TextFormatTab>('font');
  const [font, setFont] = useState<DetailFont>('serif');
  const body = intro.doc.blocks[0]!.layers.find((l) => l.id === 't1')!;
  return (
    <EditScreen
      title={intro.name}
      doc={intro.doc}
      focus={{
        block: 'b1',
        layer: 't1',
        input: {
          value: body.text ?? '',
          onChangeText: () => {},
          active: false,
        },
      }}
      accessory={keyboardBar('font')}
      confirm
      panel={
        <TextFormatPanel
          value={{ ...body.style, font }}
          onChange={(patch) => patch.font && setFont(patch.font)}
          tab={tab}
          onTabChange={setTab}
          tabs={['font']}
        />
      }
    />
  );
}

function RewriteScreen() {
  const [index, setIndex] = useState(1);
  const texts = [
    intro.doc.blocks[0]!.layers.find((l) => l.id === 't1')!.text ?? '',
    '무광 유약 면기. 국수 한 그릇, 덮밥 한 그릇에 꼭 맞습니다.',
  ];
  return (
    <EditScreen
      title={intro.name}
      doc={intro.doc}
      focus={{
        block: 'b1',
        layer: 't1',
        result: {
          text: texts[index]!,
          label: index ? '더 짧게' : null,
          index,
          count: texts.length,
          onIndexChange: setIndex,
        },
      }}
      sheet={
        <StudioSheet
          open
          ai
          title="AI 글"
          onClose={() => {}}
          end={<CreditPill balance={127} />}
        >
          <RewriteTray
            cost={1}
            items={[
              { value: 'short', label: '더 짧게', icon: MinusGlyph },
              { value: 'long', label: '더 자세히', icon: PlusGlyph },
              { value: 'soft', label: '부드럽게', icon: WaveGlyph },
              { value: 'again', label: '다시 쓰기', icon: RetryGlyph },
            ]}
            onPick={() => {}}
          />
          <ConfirmRow
            secondary={{ label: '다시', cost: 1, onPress: () => {} }}
            primary={{ label: '적용', onPress: () => {} }}
          />
        </StudioSheet>
      }
    />
  );
}

function SettingsScreen() {
  const [layout, setLayout] = useState<DetailLayout>('text_top');
  const [space, setSpace] = useState({ top: 3, bottom: 3 });
  const [background, setBackground] = useState('#FFFFFF');
  return (
    <EditScreen
      title={scene.name}
      doc={scene.doc}
      section
      sheet={
        <StudioSheet open title="구획" onClose={() => {}}>
          <SectionSettings
            layout={layout}
            layouts={DETAIL_LAYOUTS}
            onLayoutChange={setLayout}
            background={background}
            onBackgroundChange={setBackground}
            space={space}
            onSpaceChange={setSpace}
          />
        </StudioSheet>
      }
    />
  );
}

const scenePhoto = scene.doc.blocks[0]!.layers.find((l) => l.type === 'image')!;
const sceneFocus = { block: 'b1', layer: scenePhoto.id };

const photoTools = [
  { key: 'library', icon: ImagesGlyph, label: '바꾸기', onPress: () => {} },
  { key: 'ai', icon: SparklesGlyph, label: 'AI 이미지', onPress: () => {} },
  { key: 'adjust', icon: WandGlyph, label: '보정', onPress: () => {} },
  { key: 'crop', icon: CropGlyph, label: '자르기', onPress: () => {} },
  { key: 'more', icon: DotsGlyph, label: '더보기', onPress: () => {} },
];

const adjustTiles = [
  { value: 'remove_background', icon: EraserGlyph, label: '배경 지우기' },
  { value: 'replace_background', icon: BucketGlyph, label: '배경 바꾸기' },
  { value: 'enhance', icon: FocusGlyph, label: '밝게' },
] as const;

function PhotoToolsScreen() {
  return (
    <EditScreen
      title={scene.name}
      doc={scene.doc}
      focus={sceneFocus}
      accessory={<StudioTools items={photoTools} />}
      confirm
    />
  );
}

function AdjustScreen() {
  return (
    <EditScreen
      title={scene.name}
      doc={scene.doc}
      focus={sceneFocus}
      sheet={
        <StudioSheet
          open
          title="보정"
          onClose={() => {}}
          end={<CreditPill balance={127} />}
        >
          <AdjustTiles items={adjustTiles} cost={1} onPick={() => {}} />
        </StudioSheet>
      }
    />
  );
}

function CompareScreen() {
  const url = scenePhoto.url ?? '';
  return (
    <EditScreen
      title={scene.name}
      doc={scene.doc}
      focus={{
        ...sceneFocus,
        compare: {
          before: url,
          after: url,
          labels: { before: '전', after: '후' },
        },
      }}
      sheet={
        <StudioSheet
          open
          title="밝게"
          onClose={() => {}}
          end={<CreditPill balance={126} />}
        >
          <ConfirmRow
            secondary={{ label: '다시', cost: 1, onPress: () => {} }}
            primary={{ label: '적용', onPress: () => {} }}
          />
        </StudioSheet>
      }
    />
  );
}

const libraryTabs = [
  { value: 'all', label: '전체' },
  { value: 'upload', label: '올린 사진' },
  { value: 'made', label: '만든 이미지' },
] as const;

const libraryItems = [
  ...demoPhotoList.slice(0, 4).map((id) => ({
    key: `made-${id}`,
    uri: sample(id, 360, 360).uri,
    made: true,
  })),
  ...[...demoPhotoList, ...demoPhotoList].map((id, i) => ({
    key: `up-${i}`,
    uri: sample(id, 360, 360).uri,
  })),
];

function LibraryScreen() {
  const [tab, setTab] = useState<(typeof libraryTabs)[number]['value']>('all');
  const [pick, setPick] = useState<string | null>(libraryItems[1]!.key);
  return (
    <>
      <EditScreen title={scene.name} doc={scene.doc} />
      <Sheet
        open
        compact
        tall
        title="보관함"
        action={{ icon: SparklesGlyph, label: 'AI 이미지', onPress: () => {} }}
        onOpenChange={() => {}}
      >
        <SegmentedControl
          items={libraryTabs}
          value={tab}
          onValueChange={setTab}
        />
        <AssetGrid
          items={libraryItems}
          value={pick}
          onValueChange={setPick}
          onAdd={() => {}}
        />
        <Button pill disabled={!pick} onPress={() => {}}>
          넣기
        </Button>
      </Sheet>
    </>
  );
}

const scenes = ['나무 식탁', '리넨 천', '창가 햇빛', '흰 배경'];
const sceneAsk = '나무 식탁 위, 아침 햇빛';
const madeItems = demoPhotoList.slice(0, 4).map((id) => ({
  key: `gen-${id}`,
  uri: sample(id, 240, 320).uri,
}));

function AiImageScreen() {
  const [ask, setAsk] = useState(sceneAsk);
  return (
    <EditScreen
      title={scene.name}
      doc={scene.doc}
      focus={sceneFocus}
      sheet={
        <StudioSheet
          open
          ai
          title="AI 이미지"
          onClose={() => {}}
          end={<CreditPill balance={126} />}
        >
          <ImagePrompt
            source={scenePhoto.url ?? null}
            value={ask}
            onChangeText={setAsk}
            suggestions={scenes}
          />
          <ConfirmRow
            primary={{ label: '만들기', cost: 1, onPress: () => {} }}
          />
        </StudioSheet>
      }
    />
  );
}

function AiImagePickScreen() {
  const [pick, setPick] = useState<string | null>(madeItems[2]!.key);
  const preview = madeItems.find((item) => item.key === pick)?.uri ?? null;
  return (
    <EditScreen
      title={scene.name}
      doc={scene.doc}
      focus={{ ...sceneFocus, preview }}
      sheet={
        <StudioSheet
          open
          ai
          title="AI 이미지"
          onClose={() => {}}
          end={<CreditPill balance={125} />}
        >
          <ImagePrompt
            source={scenePhoto.url ?? null}
            value={sceneAsk}
            onEdit={() => {}}
          />
          <AssetGrid
            variant="row"
            items={madeItems}
            value={pick}
            onValueChange={setPick}
          />
          <ConfirmRow
            secondary={{ label: '다시', cost: 1, onPress: () => {} }}
            primary={{ label: '넣기', disabled: !pick, onPress: () => {} }}
          />
        </StudioSheet>
      }
    />
  );
}

const polishRows = [
  { key: 'enhance', label: '사진 밝게' },
  { key: 'unify', label: '배경 통일' },
  { key: 'shorten', label: '글 줄이기' },
  { key: 'price', label: '가격 강조' },
] as const;

function PolishScreen() {
  const [flags, setFlags] = useState<Record<string, boolean>>({
    enhance: true,
    unify: true,
    shorten: false,
    price: true,
  });
  const [color, setColor] = useState(DETAIL_COLORS[1]!.value);
  return (
    <>
      <ListScreen />
      <Sheet
        open
        compact
        ai
        title="한 번에 다듬기"
        end={<CreditPill balance={125} />}
        onOpenChange={() => {}}
      >
        <StudioToggleList>
          {polishRows.map((row) => (
            <StudioToggle
              key={row.key}
              label={row.label}
              value={!!flags[row.key]}
              onValueChange={(on) =>
                setFlags((now) => ({ ...now, [row.key]: on }))
              }
            >
              {row.key === 'unify' && flags.unify ? (
                <ColorSwatchPicker
                  variant="row"
                  colors={DETAIL_COLORS}
                  value={color}
                  onValueChange={setColor}
                />
              ) : null}
            </StudioToggle>
          ))}
        </StudioToggleList>
        <Button pill cost={1} onPress={() => {}}>
          적용
        </Button>
      </Sheet>
    </>
  );
}

const meta = {
  title: 'Blocks/Detail/Studio',
  component: ListScreen,
} satisfies Meta<typeof ListScreen>;
export default meta;

export const List: StoryObj<typeof meta> = {};
export const Making: StoryObj<typeof meta> = {
  render: () => <MakingScreen />,
};
export const AddSection: StoryObj<typeof meta> = {
  render: () => <AddScreen />,
};
export const Preview: StoryObj<typeof meta> = {
  render: () => <PreviewScreen />,
};
export const SectionEdit: StoryObj<typeof meta> = {
  render: () => <SectionEditScreen />,
};
export const Format: StoryObj<typeof meta> = {
  render: () => <FormatScreen />,
};
export const Rewrite: StoryObj<typeof meta> = {
  render: () => <RewriteScreen />,
};
export const Settings: StoryObj<typeof meta> = {
  render: () => <SettingsScreen />,
};
export const PhotoTools: StoryObj<typeof meta> = {
  render: () => <PhotoToolsScreen />,
};
export const Adjust: StoryObj<typeof meta> = {
  render: () => <AdjustScreen />,
};
export const Compare: StoryObj<typeof meta> = {
  render: () => <CompareScreen />,
};
export const Library: StoryObj<typeof meta> = {
  render: () => <LibraryScreen />,
};
export const AiImage: StoryObj<typeof meta> = {
  render: () => <AiImageScreen />,
};
export const AiImagePick: StoryObj<typeof meta> = {
  render: () => <AiImagePickScreen />,
};
export const Polish: StoryObj<typeof meta> = {
  render: () => <PolishScreen />,
};
