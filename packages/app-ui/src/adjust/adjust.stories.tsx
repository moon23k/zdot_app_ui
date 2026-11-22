import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Phone } from '../__stories__/phone';
import { useTheme } from '../theme/theme-provider';
import { StepScreen } from '../blocks/step-screen/step-screen';
import { AdjustTemplate } from './adjust-template';
import { AxisDial } from './axis-dial';
import { AxisDialGroup } from './axis-dial-group';
import { BrandFeelArt } from './brand-feel-art';
import { ColorAdjustNote } from './color-adjust-note';
import { ColorTrack } from './color-track';
import { AxisRing, DialStrip } from './dial-strip';
import { FontControls } from './font-controls';
import { hslToHex } from './hsl';
import { ScrubRuler } from './scrub-ruler';

const axes = [
  { key: 'temperature', label: '색감', neg: '시원한', pos: '따뜻한' },
  { key: 'energy', label: '움직임', neg: '차분한', pos: '활기찬' },
  { key: 'softness', label: '모양', neg: '반듯한', pos: '둥근' },
  { key: 'era', label: '스타일', neg: '클래식', pos: '모던' },
  { key: 'intensity', label: '존재감', neg: '은은한', pos: '강한' },
];

const sets = [
  { value: 'gothic', label: '고딕' },
  { value: 'serif', label: '명조' },
  { value: 'round', label: '둥근' },
  { value: 'hand', label: '손글씨' },
];

const levels = [
  { key: 'title', label: '제목', bold: true, italic: false },
  { key: 'subtitle', label: '소제목', bold: true, italic: false },
  { key: 'body', label: '본문', bold: false, italic: true },
];

const styles = StyleSheet.create({ fill: { flex: 1 } });

function Preview({ color }: { color: string }) {
  const t = useTheme();
  return (
    <View
      style={{
        ...styles.fill,
        margin: t.space[6],
        borderRadius: t.radius.lg,
        backgroundColor: color,
      }}
    />
  );
}

function Demo() {
  const [values, setValues] = useState<Record<string, number>>({
    temperature: -1,
    softness: 1,
  });
  const [sel, setSel] = useState('temperature');
  const [hue, setHue] = useState(50);
  const [sat, setSat] = useState(90);
  const color = hslToHex(hue, sat, 45);
  const axis = axes.find((a) => a.key === sel);
  return (
    <Phone>
      <AdjustTemplate
        preview={<Preview color={color} />}
        label={axis ? `${axis.label} ${values[sel] ?? 0}` : '대표 색'}
        onCompareChange={() => {}}
        primaryAction={{ label: '사이트에 반영', onPress: () => {} }}
        controls={
          <>
            <DialStrip
              items={[
                ...axes.map((a) => ({
                  key: a.key,
                  label: a.label,
                  value: values[a.key] ?? 0,
                })),
                { key: 'accent', label: '대표 색', color },
              ]}
              selected={sel}
              onSelect={setSel}
            />
            {axis ? (
              <ScrubRuler
                value={values[sel] ?? 0}
                onChange={(v) => setValues({ ...values, [sel]: v })}
                startLabel={axis.neg}
                endLabel={axis.pos}
                accessibilityLabel={`${axis.neg} ${axis.pos}`}
              />
            ) : (
              <>
                <ColorTrack
                  kind="hue"
                  hue={hue}
                  saturation={sat}
                  onChange={setHue}
                  label="색상"
                />
                <ColorTrack
                  kind="saturation"
                  hue={hue}
                  saturation={sat}
                  onChange={setSat}
                  label="채도"
                />
                <ColorAdjustNote
                  original={color}
                  applied={hslToHex(hue, sat, 33)}
                  title="명도 자동 조정"
                  detail="바탕 대비 3.2:1"
                />
              </>
            )}
          </>
        }
      />
    </Phone>
  );
}

const meta = { title: 'Templates/10 조정', component: Demo } satisfies Meta<
  typeof Demo
>;
export default meta;

export const Variants: StoryObj<typeof meta> = {};

function FontDemo() {
  const [set, setSet] = useState('gothic');
  const [rows, setRows] = useState(levels);
  return (
    <FontControls
      sets={sets}
      selected={set}
      onSelect={setSet}
      levels={rows}
      italicAvailable={set !== 'hand'}
      onToggle={(key, style) =>
        setRows(
          rows.map((row) =>
            row.key === key ? { ...row, [style]: !row[style] } : row
          )
        )
      }
    />
  );
}

export const Font: StoryObj<typeof meta> = {
  render: () => <FontDemo />,
};

export const BrandFeel: StoryObj = {
  render: () => (
    <View style={feel.stack}>
      <View style={feel.rings}>
        <AxisRing value={2} on />
        <AxisRing value={-1} />
        <AxisRing value={0} />
      </View>
      <BrandFeelArt
        width={328}
        axes={axes.map((a, i) => ({
          key: a.key,
          label: a.label,
          value: [1, -1, 2, 0, -1][i] ?? 0,
        }))}
        strong={['temperature', 'softness']}
        sample={{
          primary: '#0E7490',
          onPrimary: '#FFFFFF',
          surface: '#FAF7F3',
          surfaceAlt: '#F6F1EA',
          border: '#C3DCE3',
          radius: 22,
          buttonRadius: 999,
          photoRatio: 1,
          button: '객실 보기',
        }}
        captions={['모서리 22', '사진 1:1', '둥근 버튼']}
      />
    </View>
  ),
};

const feel = StyleSheet.create({
  stack: { gap: 16 },
  rings: { flexDirection: 'row', gap: 12 },
});

function DialDemo() {
  const [values, setValues] = useState<Record<string, number>>({
    temperature: 86,
    energy: 68,
    softness: 32,
    era: 70,
    intensity: 74,
  });
  return (
    <View style={dial.frame}>
      <StepScreen
        total={3}
        current={1}
        onBack={() => {}}
        title="가게 분위기를 맞춰 볼까요?"
        primaryAction={{ label: '다음', onPress: () => {} }}
      >
        <AxisDialGroup
          items={axes.map((a) => ({
            key: a.key,
            label: a.label,
            startLabel: a.neg,
            endLabel: a.pos,
          }))}
          values={values}
          onChange={(key, v) => setValues({ ...values, [key]: v })}
        />
      </StepScreen>
    </View>
  );
}

export const Dial: StoryObj = {
  render: () => <DialDemo />,
};

function DialSingleDemo() {
  const [value, setValue] = useState(74);
  return (
    <AxisDial
      value={value}
      onChange={setValue}
      startLabel="은은한"
      endLabel="강한"
      accessibilityLabel="존재감"
    />
  );
}

export const DialSingle: StoryObj = {
  render: () => <DialSingleDemo />,
};

const dial = StyleSheet.create({
  frame: { height: 760, maxWidth: 390 },
});
