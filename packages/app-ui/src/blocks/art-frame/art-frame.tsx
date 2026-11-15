import type { ReactNode } from 'react';
import { View } from 'react-native';
import { makeStyles } from '../../utils/styles';

export type ArtFrameProps = {
  aspectRatio: number;
  width?: number;
  children: ReactNode;
};

const useStyles = makeStyles((t) => ({
  root: {
    overflow: 'hidden',
    borderRadius: t.radius.xl,
    backgroundColor: t.colors.surface,
  },
}));

export function ArtFrame({ aspectRatio, width, children }: ArtFrameProps) {
  const s = useStyles();
  return (
    <View style={[s.root, { aspectRatio, width: width ?? '100%' }]}>
      {children}
    </View>
  );
}
