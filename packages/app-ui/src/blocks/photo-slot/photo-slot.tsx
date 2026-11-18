import {
  ActivityIndicator,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Photo } from '../../components/photo/photo';
import { Text } from '../../components/text/text';
import { FieldLabel } from '../../internal/field-label';
import { CloseGlyph, PlusGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { RetryGlyph } from '../../internal/retry-glyph';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type SlotPhoto = {
  uri: string;
  status?: 'uploading' | 'failed';
};

export type PhotoSlotProps = {
  photo: SlotPhoto | null;
  label?: string;
  aspectRatio?: number;
  onAdd?: () => void;
  onRemove?: () => void;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
};

const COLUMNS = 3;
const RADIUS = 10;

const useStyles = makeStyles((t) => ({
  root: { gap: t.space[2] },
  row: { flexDirection: 'row', gap: t.space[2] },
  cell: { flex: 1 },
  fill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS,
  },
  dim: { backgroundColor: `${t.colors.background}B3` },
  light: { gap: t.space[1], backgroundColor: `${t.colors.background}D9` },
  failed: {
    fontSize: t.typography.caption.fontSize,
    lineHeight: t.typography.caption.lineHeight,
    color: t.colors.danger,
  },
  remove: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: t.minTouchSize,
    height: t.minTouchSize,
    alignItems: 'flex-end',
    padding: t.space[1],
  },
  removeDot: {
    width: 22,
    height: 22,
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.foreground,
  },
  add: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: t.colors.input,
  },
}));

export function PhotoSlot({
  photo,
  label,
  aspectRatio = 3 / 2,
  onAdd,
  onRemove,
  onRetry,
  style,
}: PhotoSlotProps) {
  const t = useTheme();
  const s = useStyles();
  const name = label ?? '사진';

  return (
    <View style={[s.root, style]}>
      <FieldLabel label={label} />
      <View style={s.row}>
        <View style={s.cell}>
          {photo ? (
            <View>
              <Photo
                source={{ uri: photo.uri }}
                aspectRatio={aspectRatio}
                radius={RADIUS}
                accessibilityLabel={name}
              />
              {photo.status === 'uploading' ? (
                <View style={[s.fill, s.dim]}>
                  <ActivityIndicator color={t.colors.foreground} />
                </View>
              ) : photo.status === 'failed' ? (
                <PressableBase
                  accessibilityLabel={`${name} 업로드 실패, 다시 시도`}
                  disabled={!onRetry}
                  onPress={onRetry}
                  style={[s.fill, s.light]}
                >
                  <RetryGlyph color={t.colors.danger} size={22} />
                  <Text weight="bold" style={s.failed}>
                    실패
                  </Text>
                </PressableBase>
              ) : null}
              {onRemove && photo.status !== 'uploading' ? (
                <PressableBase
                  accessibilityLabel={`${name} 삭제`}
                  onPress={onRemove}
                  style={s.remove}
                >
                  <View style={s.removeDot}>
                    <CloseGlyph color={t.colors.background} size={12} />
                  </View>
                </PressableBase>
              ) : null}
            </View>
          ) : (
            <PressableBase
              accessibilityLabel={`${name} 추가`}
              disabled={!onAdd}
              onPress={onAdd}
              style={[s.add, { aspectRatio }]}
            >
              <PlusGlyph color={t.colors.foreground} size={24} />
            </PressableBase>
          )}
        </View>
        {Array.from({ length: COLUMNS - 1 }, (_, i) => (
          <View key={i} style={s.cell} />
        ))}
      </View>
    </View>
  );
}
