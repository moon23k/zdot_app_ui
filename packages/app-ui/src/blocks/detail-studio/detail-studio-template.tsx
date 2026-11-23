import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type DetailStudioTemplateProps = {
  bar: ReactNode;
  children: ReactNode;
  dock?: ReactNode;
  tone?: 'background' | 'surface';
  scroll?: boolean;
};

const useStyles = makeStyles(() => ({
  root: { flex: 1 },
  body: { flex: 1 },
}));

export function DetailStudioTemplate({
  bar,
  children,
  dock,
  tone = 'background',
  scroll,
}: DetailStudioTemplateProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View
      style={[
        s.root,
        {
          backgroundColor:
            tone === 'surface' ? t.colors.surface : t.colors.background,
        },
      ]}
    >
      {bar}
      {scroll ? (
        <ScrollView style={s.body}>{children}</ScrollView>
      ) : (
        <View style={s.body}>{children}</View>
      )}
      {dock ? (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          {dock}
        </View>
      ) : null}
    </View>
  );
}
