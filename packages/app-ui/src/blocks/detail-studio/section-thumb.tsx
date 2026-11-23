import { memo, useCallback, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { DetailCanvas } from '../detail-editor/detail-canvas';
import type { DetailDocValue } from '../detail-editor/detail-types';
import type { DetailPart } from '../detail-editor/focus-context';

export const SECTION_THUMB = { width: 104, height: 80 } as const;

export type SectionThumbProps = {
  doc: DetailDocValue;
  base?: number;
  offset?: number;
};

export type SectionThumbFrame = { top: number; height: number };

const EPS = 0.01;

const useStyles = makeStyles((t) => ({
  box: {
    width: SECTION_THUMB.width,
    height: SECTION_THUMB.height,
    overflow: 'hidden',
    borderRadius: t.radius.md,
    backgroundColor: t.colors.surface,
  },
  clip: { width: SECTION_THUMB.width, overflow: 'hidden' },
  wait: { opacity: 0 },
  page: { position: 'absolute', left: 0, width: SECTION_THUMB.width },
}));

export function sectionThumbFrame(
  parts: readonly DetailPart[],
  height: number,
  pad: number
): SectionThumbFrame {
  const first = parts[0];
  if (!first) return { top: 0, height };
  const top =
    first.kind === 'image'
      ? first.y + Math.max(0, (first.height - height) / 2)
      : Math.max(0, first.y - pad);
  const bottom = top + height;
  let end = height;
  for (const part of parts) {
    if (part.kind !== 'text') continue;
    const start = part.y;
    const finish = part.y + part.height;
    if (finish <= bottom + EPS || start >= bottom - EPS) continue;
    let cut = start;
    if (part.line > 0) {
      const fit = Math.floor((bottom - start) / part.line + EPS);
      if (fit >= 1) cut = start + fit * part.line;
    }
    end = Math.min(end, cut - top);
  }
  return { top, height: Math.max(0, end) };
}

function Thumb({ doc, base = 360, offset }: SectionThumbProps) {
  const t = useTheme();
  const s = useStyles();
  const scale = SECTION_THUMB.width / base;
  const pad = t.space[5] * scale;
  const auto = offset === undefined;
  const [frame, setFrame] = useState<SectionThumbFrame | null>(null);
  const measure = useCallback(
    (parts: DetailPart[]) => {
      const next = sectionThumbFrame(parts, SECTION_THUMB.height, pad);
      setFrame((now) =>
        now && now.top === next.top && now.height === next.height ? now : next
      );
    },
    [pad]
  );
  const shown: SectionThumbFrame | null = auto
    ? frame
    : { top: offset, height: SECTION_THUMB.height };
  const ground =
    doc.blocks[0]?.background?.color ?? doc.background ?? t.colors.surface;
  return (
    <View
      style={[s.box, { backgroundColor: ground }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View
        style={[
          s.clip,
          { height: shown?.height ?? SECTION_THUMB.height },
          !shown && s.wait,
        ]}
      >
        <View
          pointerEvents="none"
          style={[s.page, { top: -(shown?.top ?? 0) }]}
        >
          <DetailCanvas
            doc={doc}
            scale={scale}
            onMeasure={auto ? measure : undefined}
          />
        </View>
      </View>
    </View>
  );
}

export const SectionThumb = memo(Thumb);
