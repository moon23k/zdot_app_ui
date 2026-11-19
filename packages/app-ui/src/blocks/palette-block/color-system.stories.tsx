import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListRow } from '../../components/list-row/list-row';
import { Phone } from '../../__stories__/phone';
import { ListSection } from '../../templates/parts';
import { Group } from '../../templates/group';
import { DetailTemplate } from '../../templates/scroll-templates';
import { BrandPaletteArt } from '../brand-palette-art/brand-palette-art';
import { ColorBandList } from '../color-band-list/color-band-list';
import { ColorFamilyTabs } from '../color-family-tabs/color-family-tabs';
import { ColorHero } from '../color-hero/color-hero';
import { StepScreen } from '../step-screen/step-screen';
import { ToneStrip } from '../tone-strip/tone-strip';
import {
  ColorDots,
  PaletteBlock,
  PaletteLegend,
  PaletteThumbs,
} from './palette-block';

const families = [
  { value: 'red', label: '빨강', color: '#B64C2F' },
  { value: 'orange', label: '주황', color: '#AF6100' },
  { value: 'yellow', label: '노랑', color: '#8F7000' },
  { value: 'green', label: '초록', color: '#52820E' },
  { value: 'teal', label: '청록', color: '#008285' },
  { value: 'blue', label: '파랑', color: '#1275C1' },
  { value: 'violet', label: '보라', color: '#815AB8' },
  { value: 'rose', label: '자주', color: '#B04774' },
  { value: 'neutral', label: '검정', color: '#221B19' },
];

const bands = [
  {
    key: '05-C01',
    color: '#717A59',
    name: '그레이 모스',
    caption: 'GREY MOSS',
  },
  { key: '05-C02', color: '#627459', name: '그레이 펀', caption: 'GREY FERN' },
  {
    key: '05-C03',
    color: '#5B6646',
    name: '앤티크 모스',
    caption: 'ANTIQUE MOSS',
  },
  {
    key: '05-C04',
    color: '#43533B',
    name: '옹브레 모스',
    caption: 'OMBRÉ MOSS',
  },
  { key: '05-C12', color: '#697D42', name: '새틴 펀', caption: 'SATIN FERN' },
  {
    key: '05-C13',
    color: '#4F7648',
    name: '알파인 모스',
    caption: 'ALPINE MOSS',
  },
  {
    key: '05-C14',
    color: '#52820E',
    name: '와일드 그래스',
    caption: 'WILD GRASS',
  },
];

const palettes = [
  {
    key: 'tonal',
    label: '톤 온 톤',
    colors: {
      main: '#9D6038',
      secondary: '#F7E0CC',
      accent: '#5B2F12',
      background: '#FBF0EA',
      text: '#1E130E',
    },
  },
  {
    key: 'analogous',
    label: '유사색',
    colors: {
      main: '#9D6038',
      secondary: '#F4F0D4',
      accent: '#974F5A',
      background: '#FCF7F1',
      text: '#1E130E',
    },
  },
  {
    key: 'complementary',
    label: '보색',
    colors: {
      main: '#9D6038',
      secondary: '#F7E0CC',
      accent: '#3E6591',
      background: '#FBF0EA',
      text: '#1E130E',
    },
  },
];

const tones = ['#F7E0CC', '#D9A988', '#9D6038', '#7A4421', '#4A2A12'];

const styles = StyleSheet.create({
  art: { padding: 16 },
});

function Pick() {
  const [family, setFamily] = useState('green');
  const [value, setValue] = useState<string | null>('05-C03');
  return (
    <Phone>
      <StepScreen
        title="메인 컬러를 골라 주세요"
        total={3}
        current={1}
        onBack={() => {}}
        primaryAction={{ label: '다음', onPress: () => {}, disabled: !value }}
      >
        <ColorFamilyTabs
          items={families}
          value={family}
          onValueChange={setFamily}
        />
        <ColorBandList items={bands} value={value} onValueChange={setValue} />
      </StepScreen>
    </Phone>
  );
}

function Detail() {
  return (
    <Phone>
      <DetailTemplate
        primaryAction={{ label: '이 컬러로 팔레트 보기', onPress: () => {} }}
      >
        <ColorHero
          color="#9D6038"
          code="YR 57"
          name="ANTIQUE AMBER"
          line="A moderate brown."
          keywords="Warm, mid, ambery"
          onBack={() => {}}
        />
        <ListSection title="톤 단계" inset>
          <ToneStrip colors={tones} />
        </ListSection>
        <ListSection title="어울리는 컬러" card>
          {palettes.map((p) => (
            <ListRow
              key={p.key}
              title={p.label}
              trailing={
                <ColorDots
                  colors={[p.colors.main, p.colors.secondary, p.colors.accent]}
                />
              }
              chevron
              onPress={() => {}}
            />
          ))}
        </ListSection>
      </DetailTemplate>
    </Phone>
  );
}

const roles = [
  { key: 'main', label: '메인' },
  { key: 'secondary', label: '보조' },
  { key: 'accent', label: '강조' },
  { key: 'background', label: '배경' },
  { key: 'text', label: '글자' },
] as const;

function Palettes() {
  const [value, setValue] = useState('tonal');
  const current = palettes.find((p) => p.key === value) ?? palettes[0]!;
  return (
    <Phone>
      <StepScreen
        title="팔레트를 골라 주세요"
        total={3}
        current={1}
        onBack={() => {}}
        primaryAction={{ label: '적용', onPress: () => {} }}
      >
        <Group>
          <PaletteBlock
            colors={current.colors}
            height={252}
            label={current.label}
          />
          <PaletteLegend
            items={roles.map((role) => ({
              key: role.key,
              label: role.label,
              color: current.colors[role.key],
            }))}
          />
        </Group>
        <PaletteThumbs
          items={palettes}
          value={value}
          onValueChange={setValue}
        />
      </StepScreen>
    </Phone>
  );
}

function Art() {
  return (
    <View style={styles.art}>
      <BrandPaletteArt
        width={328}
        label="메인 컬러"
        name="ANTIQUE AMBER"
        code="YR 57"
        primary="#9D6038"
        onPrimary="#FFFFFF"
        swatches={[
          {
            label: '배경',
            color: '#FBF0EA',
            ink: '#1E130E',
            name: 'SILK MUSK',
          },
          {
            label: '보조',
            color: '#F7E0CC',
            ink: '#1E130E',
            name: 'PALE CHAMPACA',
          },
          {
            label: '글자',
            color: '#1E130E',
            ink: '#FFFFFF',
            name: 'SMOKY INCENSE',
          },
        ]}
      />
    </View>
  );
}

const meta = {
  title: 'Blocks/Brand/ColorSystem',
  component: PaletteBlock,
  args: { colors: palettes[2]!.colors, height: 120 },
} satisfies Meta<typeof PaletteBlock>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
export const ColorPick: StoryObj<typeof meta> = { render: () => <Pick /> };
export const ColorDetail: StoryObj<typeof meta> = { render: () => <Detail /> };
export const PalettePick: StoryObj<typeof meta> = {
  render: () => <Palettes />,
};
export const Reveal: StoryObj<typeof meta> = { render: () => <Art /> };
