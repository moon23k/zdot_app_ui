import { View } from 'react-native';
import { SegmentedControl } from '../../components/segmented-control/segmented-control';
import { Slider } from '../../components/slider/slider';
import { makeStyles } from '../../utils/styles';
import {
  ColorSwatchPicker,
  type ColorSwatch,
} from '../color-swatch-picker/color-swatch-picker';
import {
  DETAIL_COLORS,
  detailBlockSpace,
  type DetailLayout,
} from '../detail-editor/detail-types';
import { LayoutPicker } from '../detail-editor/layout-picker';

export type SectionSettingsTab = 'layout' | 'background' | 'space';

export type SectionSettingsProps = {
  tab: SectionSettingsTab;
  onTabChange: (tab: SectionSettingsTab) => void;
  layout: DetailLayout | null;
  layouts: readonly DetailLayout[];
  onLayoutChange: (layout: DetailLayout) => void;
  background: string;
  onBackgroundChange: (color: string) => void;
  space: { top: number; bottom: number };
  onSpaceChange: (
    patch: Partial<{ top: number; bottom: number }>,
    group: string
  ) => void;
  onSlidingStart?: () => void;
  colors?: readonly ColorSwatch[];
};

const TABS: { value: SectionSettingsTab; label: string }[] = [
  { value: 'layout', label: '배치' },
  { value: 'background', label: '배경' },
  { value: 'space', label: '여백' },
];

const useStyles = makeStyles((t) => ({
  tabs: { paddingHorizontal: t.space[4] },
  body: { paddingTop: t.space[3] },
  inset: { paddingHorizontal: t.space[4] },
  space: { paddingHorizontal: t.space[5] },
}));

const px = (value: number) => String(Math.round(detailBlockSpace(value)));

export function SectionSettings({
  tab,
  onTabChange,
  layout,
  layouts,
  onLayoutChange,
  background,
  onBackgroundChange,
  space,
  onSpaceChange,
  onSlidingStart,
  colors,
}: SectionSettingsProps) {
  const s = useStyles();
  return (
    <View>
      <View style={s.tabs}>
        <SegmentedControl
          items={TABS}
          value={tab}
          onValueChange={onTabChange}
        />
      </View>
      <View style={s.body}>
        {tab === 'layout' ? (
          <LayoutPicker
            variant="soft"
            value={layout}
            items={layouts}
            onValueChange={onLayoutChange}
          />
        ) : tab === 'background' ? (
          <View style={s.inset}>
            <ColorSwatchPicker
              colors={colors ?? DETAIL_COLORS}
              value={background}
              onValueChange={onBackgroundChange}
            />
          </View>
        ) : (
          <View style={s.space}>
            <Slider
              size="sm"
              value={space.top}
              min={0}
              max={10}
              onChange={(top) => onSpaceChange({ top }, 'space_top')}
              onSlidingStart={onSlidingStart}
              startLabel="위"
              endLabel={px(space.top)}
              accessibilityLabel="위 여백"
            />
            <Slider
              size="sm"
              value={space.bottom}
              min={0}
              max={10}
              onChange={(bottom) => onSpaceChange({ bottom }, 'space_bottom')}
              onSlidingStart={onSlidingStart}
              startLabel="아래"
              endLabel={px(space.bottom)}
              accessibilityLabel="아래 여백"
            />
          </View>
        )}
      </View>
    </View>
  );
}
