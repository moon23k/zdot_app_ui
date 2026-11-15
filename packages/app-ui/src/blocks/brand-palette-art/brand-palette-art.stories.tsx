import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { StyleSheet, View } from 'react-native';
import { ArtFrame } from '../art-frame/art-frame';
import { MockupStrip } from '../mockup-strip/mockup-strip';
import { TokenSample } from '../token-sample/token-sample';
import { BrandPaletteArt } from './brand-palette-art';

const meta = {
  title: 'Blocks/Brand/BrandPaletteArt',
  component: BrandPaletteArt,
  args: {
    width: 328,
    label: '대표 색',
    name: '청록',
    primary: '#0E7490',
    onPrimary: '#FFFFFF',
    swatches: [
      { label: '바탕', color: '#FAF7F3', ink: '#1C1A17' },
      { label: '옅은 대표', color: '#F1F7F8', ink: '#1C1A17' },
      { label: '글자', color: '#1C1A17', ink: '#FFFFFF' },
    ],
  },
} satisfies Meta<typeof BrandPaletteArt>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <View style={styles.row}>
      <TokenSample kind="surface" color="#FAF7F3" />
      <TokenSample kind="button" color="#0E7490" radius={999} />
      <TokenSample kind="button" color="#047857" radius={2} />
      <TokenSample kind="spacing" gap={7} />
      <TokenSample kind="spacing" gap={3} />
      <TokenSample kind="ratio" color="#F6F1EA" ratio={1} />
      <TokenSample kind="ratio" color="#F6F1EA" ratio={16 / 9} />
      <TokenSample kind="emphasis" color="#F1F7F8" />
    </View>
  ),
};

export const Frame: StoryObj<typeof meta> = {
  render: () => (
    <View style={styles.frame}>
      <ArtFrame aspectRatio={328 / 400}>
        <View style={styles.fill} />
      </ArtFrame>
    </View>
  ),
};

export const Strip: StoryObj<typeof meta> = {
  render: () => (
    <MockupStrip
      items={['명함', '쇼핑백', '택배 상자', '감사 카드', '휴대폰'].map(
        (label, i) => ({
          key: String(i),
          label,
          uri: '',
        })
      )}
      onPress={() => {}}
    />
  ),
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  frame: { width: 328 },
  fill: { flex: 1, backgroundColor: '#F6F1EA' },
});
