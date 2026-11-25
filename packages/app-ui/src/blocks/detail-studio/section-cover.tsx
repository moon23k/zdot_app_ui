import { Image, StyleSheet, View } from 'react-native';
import { renderIcon, type IconSlot } from '../../internal/icon';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type SectionCoverProps = {
  uri?: string | null;
  icon: IconSlot;
};

const useStyles = makeStyles((t) => ({
  box: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.muted,
  },
}));

export function SectionCover({ uri, icon }: SectionCoverProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.box}>
      {uri ? (
        <Image
          source={{ uri }}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
          accessibilityIgnoresInvertColors
        />
      ) : (
        renderIcon(icon, {
          color: t.colors.mutedForeground,
          size: t.iconSize.md,
        })
      )}
    </View>
  );
}
