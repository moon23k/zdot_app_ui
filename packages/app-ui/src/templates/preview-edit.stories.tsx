import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Phone } from '../__stories__/phone';
import {
  ColumnsArt,
  LevelsArt,
  RatioArt,
  SampleArt,
  SlashArt,
  FooterArt,
  PlacementArt,
  PlacementThumb,
  type PlacementSpot,
} from '../blocks/choice-art';
import { ChipGroup } from '../components/chip-group/chip-group';
import { ListRow } from '../components/list-row/list-row';
import { Text } from '../components/text/text';
import type { IconRenderProps } from '../internal/icon';
import {
  ColumnsGlyph,
  CropGlyph,
  SortGlyph,
  SparklesGlyph,
  StarGlyph,
  TagGlyph,
  CloseGlyph,
  OverlayGlyph,
  PositionGlyph,
  ResizeGlyph,
} from '../internal/glyphs';
import { useTheme } from '../theme/theme-provider';
import {
  PreviewEditTemplate,
  type PreviewDevice,
  type PreviewEditChoice,
} from './preview-edit-template';

type Tool = 'columns' | 'ratio' | 'items' | 'sort';
type Item = 'discount' | 'regular' | 'soldout';

const tools = [
  { key: 'columns', label: '한 줄 개수', icon: ColumnsGlyph },
  { key: 'ratio', label: '사진 비율', icon: CropGlyph },
  { key: 'items', label: '표시 항목', icon: TagGlyph },
  { key: 'sort', label: '정렬', icon: SortGlyph },
] as const;

const counts: Record<PreviewDevice, readonly number[]> = {
  web: [3, 4, 5],
  mobile: [1, 2, 3],
};

const ratios = [
  { key: '1:1', w: 1, h: 1 },
  { key: '4:5', w: 4, h: 5 },
  { key: '3:4', w: 3, h: 4 },
] as const;

const items: readonly {
  key: Item;
  label: string;
  text?: string;
  strike?: boolean;
}[] = [
  { key: 'discount', label: '할인율', text: '20%' },
  { key: 'regular', label: '정가', text: '10,000', strike: true },
  { key: 'soldout', label: '품절 표시' },
];

const sorts = [
  { key: 'recent', label: '신상품순', art: SparklesGlyph },
  { key: 'popular', label: '인기순', art: StarGlyph },
  {
    key: 'low',
    label: '낮은 가격순',
    art: ({ color }: IconRenderProps) => (
      <LevelsArt levels={[1, 2, 3]} color={color} />
    ),
  },
  {
    key: 'high',
    label: '높은 가격순',
    art: ({ color }: IconRenderProps) => (
      <LevelsArt levels={[3, 2, 1]} color={color} />
    ),
  },
] as const;

function Grid({ columns, ratio }: { columns: number; ratio: number }) {
  const t = useTheme();
  return (
    <ScrollView
      contentContainerStyle={{ padding: t.space[4], gap: t.space[4] }}
    >
      <Text variant="title">전체 상품</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.space[2] }}>
        {Array.from({ length: 6 }, (_, i) => (
          <View
            key={i}
            style={{
              width: `${100 / columns - 4}%`,
              aspectRatio: ratio,
              borderRadius: t.radius.sm,
              backgroundColor: t.colors.recess,
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const popupTools = [
  { key: 'position', label: '위치', icon: PositionGlyph },
  { key: 'size', label: '크기', icon: ResizeGlyph },
  { key: 'overlay', label: '덮개', icon: OverlayGlyph },
  { key: 'close', label: '닫기 문구', icon: CloseGlyph },
] as const;

const spots: readonly { key: PlacementSpot; label: string }[] = [
  { key: 'center', label: '가운데' },
  { key: 'corner', label: '아래' },
  { key: 'band', label: '아래 띠' },
];

function PopupScreen() {
  const [device, setDevice] = useState<PreviewDevice>('web');
  const [tool, setTool] = useState<string>('position');
  const [spot, setSpot] = useState<PlacementSpot>('corner');
  const [scale, setScale] = useState(1);
  const [dim, setDim] = useState(false);
  const [text, setText] = useState(true);
  const sized = spot !== 'band';
  const choices: PreviewEditChoice[] =
    tool === 'position'
      ? spots.map((item) => ({
          key: item.key,
          label: item.label,
          art: ({ color }) => <PlacementArt spot={item.key} color={color} />,
          selected: spot === item.key,
          onPress: () => setSpot(item.key),
        }))
      : tool === 'size'
        ? [
            { key: 'sm', label: '작게', value: 0.8 },
            { key: 'md', label: '보통', value: 1 },
            { key: 'lg', label: '크게', value: 1.2 },
          ].map((item) => ({
            key: item.key,
            label: item.label,
            art: ({ color }) => (
              <PlacementArt spot={spot} scale={item.value} color={color} />
            ),
            selected: scale === item.value,
            onPress: () => setScale(item.value),
          }))
        : tool === 'overlay'
          ? [true, false].map((on) => ({
              key: String(on),
              label: on ? '켬' : '끔',
              art: ({ color }) => (
                <PlacementArt spot={spot} dim={on} color={color} />
              ),
              selected: dim === on,
              onPress: () => setDim(on),
            }))
          : [true, false].map((on) => ({
              key: String(on),
              label: on ? '오늘 하루 열지 않기' : '닫기만',
              art: ({ color }) => <FooterArt text={on} color={color} />,
              selected: text === on,
              onPress: () => setText(on),
            }));
  return (
    <Phone>
      <PreviewEditTemplate
        title="팝업"
        saveAction={{ label: '저장', onPress: () => {} }}
        onBack={() => {}}
        device={device}
        onDeviceChange={setDevice}
        onCompareChange={() => {}}
        choices={choices}
        tools={popupTools.map((item) => ({
          ...item,
          disabled: item.key === 'size' && !sized,
        }))}
        tool={tool}
        onToolChange={setTool}
      >
        <ListRow
          title="모양"
          description="가운데 · 덮개 있음 · 보통"
          leading={<PlacementThumb spot={spot} />}
          chevron
          onPress={() => {}}
        />
      </PreviewEditTemplate>
    </Phone>
  );
}

function Screen({
  start = 'columns',
  chips,
  popup,
}: {
  start?: Tool;
  chips?: boolean;
  popup?: boolean;
}) {
  if (popup) return <PopupScreen />;
  return <ShelfScreen start={start} chips={chips} />;
}

function ShelfScreen({ start, chips }: { start: Tool; chips?: boolean }) {
  const [device, setDevice] = useState<PreviewDevice>('web');
  const [tool, setTool] = useState<string>(start);
  const [cols, setCols] = useState<Record<PreviewDevice, number>>({
    web: 4,
    mobile: 2,
  });
  const [ratio, setRatio] = useState<string>('4:5');
  const [shown, setShown] = useState<Item[]>(['discount', 'soldout']);
  const [sort, setSort] = useState<string>('recent');
  const [comparing, setComparing] = useState(false);
  const view = comparing ? { web: 4, mobile: 2 } : cols;
  const pickedRatio = ratios.find((r) => r.key === ratio) ?? ratios[0];
  const toggle = (key: Item) =>
    setShown((now) =>
      now.includes(key) ? now.filter((k) => k !== key) : [...now, key]
    );
  const choices: PreviewEditChoice[] =
    tool === 'columns'
      ? counts[device].map((n) => ({
          key: String(n),
          label: `${n}개`,
          art: ({ color }) => <ColumnsArt count={n} color={color} />,
          selected: cols[device] === n,
          onPress: () => setCols({ ...cols, [device]: n }),
        }))
      : tool === 'ratio'
        ? ratios.map((r) => ({
            key: r.key,
            label: r.key,
            art: ({ color }) => (
              <RatioArt width={r.w} height={r.h} color={color} />
            ),
            selected: ratio === r.key,
            onPress: () => setRatio(r.key),
          }))
        : tool === 'items'
          ? items.map((item) => ({
              key: item.key,
              label: item.label,
              art: ({ color }) =>
                item.text ? (
                  <SampleArt
                    text={item.text}
                    strike={item.strike}
                    color={color}
                  />
                ) : (
                  <SlashArt color={color} />
                ),
              selected: shown.includes(item.key),
              onPress: () => toggle(item.key),
            }))
          : sorts.map((item) => ({
              key: item.key,
              label: item.label,
              art: item.art,
              selected: sort === item.key,
              onPress: () => setSort(item.key),
            }));
  return (
    <Phone>
      <PreviewEditTemplate
        title="상품 진열"
        saveAction={{ label: '저장', onPress: () => {} }}
        onBack={() => {}}
        device={device}
        onDeviceChange={setDevice}
        deviceNotes={{ web: `${cols.web}개`, mobile: `${cols.mobile}개` }}
        onCompareChange={setComparing}
        choices={choices}
        tray={
          chips ? (
            <ChipGroup
              items={[
                { value: 'door', label: '문 앞에 놓아 주세요' },
                { value: 'guard', label: '경비실에 맡겨 주세요' },
                { value: 'call', label: '배송 전 연락 주세요' },
              ]}
              value="door"
              onValueChange={() => {}}
            />
          ) : undefined
        }
        tools={tools}
        tool={tool}
        onToolChange={setTool}
      >
        <Grid columns={view[device]} ratio={pickedRatio.w / pickedRatio.h} />
      </PreviewEditTemplate>
    </Phone>
  );
}

const meta = {
  title: 'Templates/PreviewEditTemplate',
  component: Screen,
} satisfies Meta<typeof Screen>;
export default meta;

export const Columns: StoryObj<typeof meta> = {};

export const Ratio: StoryObj<typeof meta> = { args: { start: 'ratio' } };

export const Toggles: StoryObj<typeof meta> = { args: { start: 'items' } };

export const Sort: StoryObj<typeof meta> = { args: { start: 'sort' } };

export const Tray: StoryObj<typeof meta> = {
  args: { start: 'sort', chips: true },
};

export const Popup: StoryObj<typeof meta> = { args: { popup: true } };
