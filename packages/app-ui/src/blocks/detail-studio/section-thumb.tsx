import { memo } from 'react';
import { View } from 'react-native';
import { makeStyles } from '../../utils/styles';
import { DetailCanvas } from '../detail-editor/detail-canvas';
import type { DetailDocValue } from '../detail-editor/detail-types';

export const SECTION_THUMB = { width: 104, height: 80 } as const;

export type SectionThumbProps = {
  doc: DetailDocValue;
  base?: number;
  offset?: number;
};

const useStyles = makeStyles((t) => ({
  box: {
    width: SECTION_THUMB.width,
    height: SECTION_THUMB.height,
    overflow: 'hidden',
    borderRadius: t.radius.md,
    backgroundColor: t.colors.surface,
  },
  page: { position: 'absolute', left: 0, width: SECTION_THUMB.width },
}));

function Thumb({ doc, base = 360, offset = 0 }: SectionThumbProps) {
  const s = useStyles();
  return (
    <View
      style={s.box}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View pointerEvents="none" style={[s.page, { top: -offset }]}>
        <DetailCanvas doc={doc} scale={SECTION_THUMB.width / base} />
      </View>
    </View>
  );
}

export const SectionThumb = memo(Thumb);
