import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListRow } from '../../components/list-row/list-row';
import { SectionTabs } from '../../components/section-tabs/section-tabs';
import { Text } from '../../components/text/text';
import { Phone } from '../../__stories__/phone';
import { ListSection } from '../../templates/parts';
import { ResultTemplate } from '../../templates/result-template';
import { DetailTemplate } from '../../templates/scroll-templates';
import { BrandPaletteArt } from '../brand-palette-art/brand-palette-art';
import { ColorChipGrid } from '../color-chip-grid/color-chip-grid';
import { ColorHero } from '../color-hero/color-hero';
import { StepScreen } from '../step-screen/step-screen';
import { ToneStrip } from '../tone-strip/tone-strip';
import { ColorDots, PaletteBlock } from './palette-block';

const chips = [
  { key: '05-C06', color: '#9D6038', name: 'ANTIQUE AMBER', code: 'YR 57' },
  { key: '08-C10', color: '#003C5D', name: 'VELVET INK', code: 'BB 34' },
  { key: '05-C12', color: '#5B7537', name: 'SATIN FERN', code: 'GY 56' },
  { key: '05-C16', color: '#974F5A', name: 'SATIN ROSE', code: 'RP 52' },
  { key: '01-D2', color: '#3A2C26', name: 'DARK UMBER', code: 'NT 31' },
  { key: '07-C07', color: '#1B827F', name: 'FRESH CYPRESS', code: 'BG 55' },
];

const tabs = ['전체', '01', '02', '03', '04', '05', '06', '07', '08'].map(
  (label) => ({ value: label, label })
);

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
  body: { gap: 20, paddingHorizontal: 16, paddingTop: 20 },
  text: { gap: 4 },
  block: { gap: 8 },
  art: { padding: 16 },
});

function Pick() {
  const [tab, setTab] = useState('전체');
  const [value, setValue] = useState<string | null>('05-C06');
  return (
    <Phone>
      <StepScreen
        title="메인 컬러를 골라 주세요"
        total={3}
        current={1}
        onBack={() => {}}
        primaryAction={{ label: '다음', onPress: () => {}, disabled: !value }}
      >
        <SectionTabs
          scrollable
          items={tabs}
          value={tab}
          onValueChange={setTab}
        />
        <ColorChipGrid items={chips} value={value} onValueChange={setValue} />
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
          onBack={() => {}}
        />
        <View style={styles.body}>
          <View style={styles.text}>
            <Text variant="bodyLg">A moderate brown.</Text>
            <Text variant="label" tone="muted">
              Warm, mid, ambery
            </Text>
          </View>
          <View style={styles.block}>
            <Text variant="label" tone="muted">
              톤 단계
            </Text>
            <ToneStrip colors={tones} />
          </View>
        </View>
        <ListSection title="어울리는 컬러" boxed>
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

function Palettes() {
  const [index, setIndex] = useState(0);
  return (
    <Phone>
      <ResultTemplate
        title="팔레트를 골라 주세요"
        index={index}
        onIndexChange={setIndex}
        previews={palettes.map((p) => ({
          key: p.key,
          label: p.label,
          render: () => <PaletteBlock colors={p.colors} label={p.label} />,
        }))}
        primaryAction={{ label: '이 팔레트로 정하기', onPress: () => {} }}
        secondaryAction={{ label: '팔레트 상세', onPress: () => {} }}
      />
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
