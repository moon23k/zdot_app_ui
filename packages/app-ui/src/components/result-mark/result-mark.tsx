import { View, type StyleProp, type ViewStyle } from 'react-native';
import { CheckGlyph } from '../../internal/glyphs';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { Text } from '../text/text';

export type ResultMarkProps = {
  kind: 'done' | 'error';
  style?: StyleProp<ViewStyle>;
};

const SIZE = 48;

const useStyles = makeStyles((t) => ({
  root: {
    width: SIZE,
    height: SIZE,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.recess,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export function ResultMark({ kind, style }: ResultMarkProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[s.root, style]}
    >
      {kind === 'done' ? (
        <CheckGlyph color={t.colors.primary} size={t.iconSize.md} />
      ) : (
        <Text variant="title" weight="semibold">
          !
        </Text>
      )}
    </View>
  );
}
