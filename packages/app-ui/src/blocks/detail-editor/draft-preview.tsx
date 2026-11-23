import type { ReactNode } from 'react';
import { View } from 'react-native';
import { makeStyles } from '../../utils/styles';
import type { DetailPart } from './focus-context';

const EPS = 0.5;

export function draftPreviewFit(
  parts: readonly DetailPart[],
  room: number
): number {
  let end = room;
  for (const part of parts) {
    if (part.kind !== 'text') continue;
    if (part.y + part.height <= room + EPS || part.y >= room - EPS) continue;
    end = Math.min(end, part.y);
  }
  const photo = parts
    .filter((p) => p.kind === 'image' && p.y + p.height <= end + EPS)
    .pop();
  if (!photo) return end;
  const below = photo.y + photo.height;
  const words = parts.some(
    (p) => p.kind === 'text' && p.y >= below - EPS && p.y < end - EPS
  );
  return words ? end : below;
}

export type DraftPreviewProps = {
  height: number;
  width: number;
  pageHeight?: number;
  children: ReactNode;
};

const useStyles = makeStyles((t) => ({
  box: {
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: t.space[4],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.muted,
  },
  page: {
    overflow: 'hidden',
    borderTopLeftRadius: t.radius.sm,
    borderTopRightRadius: t.radius.sm,
    backgroundColor: t.colors.surface,
  },
  whole: {
    borderBottomLeftRadius: t.radius.sm,
    borderBottomRightRadius: t.radius.sm,
  },
}));

export function DraftPreview({
  height,
  width,
  pageHeight,
  children,
}: DraftPreviewProps) {
  const s = useStyles();
  const whole = pageHeight !== undefined;
  return (
    <View style={[s.box, { height }]}>
      <View
        style={[
          s.page,
          { width },
          whole && s.whole,
          whole && { height: pageHeight },
        ]}
      >
        {children}
      </View>
    </View>
  );
}
