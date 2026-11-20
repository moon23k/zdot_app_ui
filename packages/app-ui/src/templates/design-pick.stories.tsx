import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Phone, SitePreview } from '../__stories__/phone';
import { ChipGroup } from '../components/chip-group/chip-group';
import { PaletteGlyph, TypeGlyph } from '../internal/glyphs';
import { useTheme } from '../theme/theme-provider';
import { DesignPickTemplate } from './design-pick-template';

type Draft = 'a' | 'b' | 'c';
type Tool = 'color' | 'font';
type Font = 'gothic' | 'serif' | 'round' | 'hand';

const options = [
  { value: 'a', label: '1안' },
  { value: 'b', label: '2안' },
  { value: 'c', label: '3안' },
] as const;

const headlines: Record<Draft, string> = {
  a: '좋아서 고른 물건, 매일 쓰기 편하게',
  b: '취향이 담긴 살림을 한 곳에',
  c: '하나씩 직접 써 보고 들여옵니다',
};

function Screen({ tools, tray }: { tools?: boolean; tray?: boolean }) {
  const t = useTheme();
  const [value, setValue] = useState<Draft>('b');
  const [open, setOpen] = useState<Tool | null>(tray ? 'font' : null);
  const [font, setFont] = useState<Font | null>('gothic');
  const icon = { color: t.colors.foreground, size: t.iconSize.md };
  const toggle = (key: Tool) => setOpen((now) => (now === key ? null : key));
  return (
    <Phone>
      <DesignPickTemplate<Draft>
        options={options}
        value={value}
        onValueChange={setValue}
        onBack={() => {}}
        preview={
          <ScrollView>
            <SitePreview
              name="하루 리빙"
              headline={headlines[value]}
              tagline="리빙 · 인테리어 소품"
              sections={3}
            />
          </ScrollView>
        }
        primaryAction={{ label: '이 디자인으로 만들기', onPress: () => {} }}
        tools={
          tools
            ? [
                {
                  key: 'color',
                  label: '색',
                  icon: <PaletteGlyph {...icon} />,
                  selected: open === 'color',
                  onPress: () => toggle('color'),
                },
                {
                  key: 'font',
                  label: '글꼴',
                  icon: <TypeGlyph {...icon} />,
                  selected: open === 'font',
                  onPress: () => toggle('font'),
                },
              ]
            : undefined
        }
        tray={
          tray && open === 'font' ? (
            <ChipGroup<Font>
              even
              items={[
                { value: 'gothic', label: '고딕' },
                { value: 'serif', label: '명조' },
                { value: 'round', label: '둥근' },
                { value: 'hand', label: '손글씨' },
              ]}
              value={font}
              onValueChange={setFont}
            />
          ) : undefined
        }
      />
    </Phone>
  );
}

const meta = {
  title: 'Templates/DesignPickTemplate',
  component: Screen,
} satisfies Meta<typeof Screen>;
export default meta;

export const PrimaryOnly: StoryObj<typeof meta> = {};

export const WithTools: StoryObj<typeof meta> = { args: { tools: true } };

export const WithTray: StoryObj<typeof meta> = {
  args: { tools: true, tray: true },
};
