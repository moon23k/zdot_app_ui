import {
  ActivityIndicator,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Photo } from '../../components/photo/photo';
import { Text } from '../../components/text/text';
import { FieldLabel } from '../../internal/field-label';
import { CameraGlyph, CloseGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { RetryGlyph } from '../../internal/retry-glyph';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import { moveItem } from '../../sortable/move';
import { SortableGrid, SortableHandle } from '../../sortable/sortable-grid';

export type FieldPhoto = {
  id: string;
  uri: string;
  status?: 'uploading' | 'failed';
};

export type PhotoFieldProps<T extends FieldPhoto> = {
  photos: readonly T[];
  max?: number;
  label?: string;
  onAdd?: () => void;
  onPress?: (id: string) => void;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  onPhotosChange?: (photos: T[]) => void;
  style?: StyleProp<ViewStyle>;
};

const ADD = { id: '__add', uri: '' } as const;
const COLUMNS = 3;
const MOVES = [
  { name: 'decrement', label: '앞으로 이동' },
  { name: 'increment', label: '뒤로 이동' },
];

const useStyles = makeStyles((t) => ({
  root: { gap: t.space[2] },
  fill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.md,
  },
  dim: { backgroundColor: `${t.colors.background}B3` },
  light: { gap: t.space[1], backgroundColor: `${t.colors.background}D9` },
  rep: {
    position: 'absolute',
    left: t.space[2],
    bottom: t.space[2],
    minHeight: t.space[5],
    justifyContent: 'center',
    paddingHorizontal: t.space[2],
    borderRadius: t.radius.full,
    backgroundColor: t.colors.surface,
  },
  remove: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: t.minTouchSize,
    height: t.minTouchSize,
    alignItems: 'flex-end',
    padding: t.space[2],
  },
  dot: {
    width: t.space[6],
    height: t.space[6],
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.surface,
  },
  add: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  count: { fontVariant: ['tabular-nums'] },
}));

export function PhotoField<T extends FieldPhoto>({
  photos,
  max = 10,
  label,
  onAdd,
  onPress,
  onRemove,
  onRetry,
  onPhotosChange,
  style,
}: PhotoFieldProps<T>) {
  const t = useTheme();
  const s = useStyles();
  const name = label ?? '사진';
  const many = max > 1;
  const sortable = !!onPhotosChange && photos.length > 1;
  const data: (T | typeof ADD)[] =
    onAdd && photos.length < max ? [ADD, ...photos] : [...photos];

  const move = (from: number, to: number) => {
    if (!onPhotosChange || to < 0 || to >= photos.length) return;
    onPhotosChange(moveItem(photos, from, to));
  };

  const addTile = (
    <SortableHandle mode="fixed-order">
      <PressableBase
        accessibilityLabel={
          many ? `${name} 추가, ${max}장 중 ${photos.length}장` : `${name} 추가`
        }
        onPress={onAdd}
        style={s.add}
      >
        <CameraGlyph color={t.colors.mutedForeground} size={t.iconSize.md} />
        <Text variant="caption" tone="muted" style={s.count}>
          {photos.length}/{max}
        </Text>
      </PressableBase>
    </SortableHandle>
  );

  const photoTile = (item: T) => {
    const index = photos.indexOf(item);
    const prefix = many ? `${name} ${index + 1}` : name;
    const cover = many && index === 0;
    const state =
      item.status === 'uploading'
        ? ', 업로드 중'
        : item.status === 'failed'
          ? ', 업로드 실패'
          : '';
    const body = (
      <>
        <Photo source={{ uri: item.uri }} radius={t.radius.md} />
        {cover && !item.status ? (
          <View style={s.rep}>
            <Text variant="caption" weight="medium">
              대표
            </Text>
          </View>
        ) : null}
        {item.status === 'uploading' ? (
          <View style={[s.fill, s.dim]}>
            <ActivityIndicator color={t.colors.foreground} />
          </View>
        ) : null}
      </>
    );
    const a11y = {
      accessibilityLabel: `${prefix}${cover ? ', 대표' : ''}${state}`,
      accessibilityActions: sortable ? MOVES : undefined,
      onAccessibilityAction: sortable
        ? (e: { nativeEvent: { actionName: string } }) =>
            move(
              index,
              e.nativeEvent.actionName === 'decrement' ? index - 1 : index + 1
            )
        : undefined,
    };
    const photo = onPress ? (
      <PressableBase
        {...a11y}
        disabled={item.status === 'uploading'}
        onPress={() => onPress(item.id)}
      >
        {body}
      </PressableBase>
    ) : (
      <View accessible {...a11y}>
        {body}
      </View>
    );
    return (
      <View>
        {sortable ? <SortableHandle>{photo}</SortableHandle> : photo}
        {item.status === 'failed' ? (
          <PressableBase
            accessibilityLabel={`${prefix} 업로드 실패, 다시 시도`}
            disabled={!onRetry}
            onPress={() => onRetry?.(item.id)}
            style={[s.fill, s.light]}
          >
            <RetryGlyph color={t.colors.danger} size={t.iconSize.md} />
            <Text variant="caption" weight="bold" tone="danger">
              실패
            </Text>
          </PressableBase>
        ) : null}
        {onRemove && item.status !== 'uploading' ? (
          <PressableBase
            accessibilityLabel={`${prefix} 삭제`}
            onPress={() => onRemove(item.id)}
            style={s.remove}
          >
            <View style={s.dot}>
              <CloseGlyph color={t.colors.foreground} size={t.space[3]} />
            </View>
          </PressableBase>
        ) : null}
      </View>
    );
  };

  return (
    <View style={[s.root, style]}>
      <FieldLabel label={label} />
      <SortableGrid
        data={data}
        columns={COLUMNS}
        handle
        enabled={sortable}
        keyExtractor={(item) => item.id}
        onDataChange={(next) =>
          onPhotosChange?.(next.filter((item): item is T => item !== ADD))
        }
        renderItem={({ item }) =>
          item === ADD ? addTile : photoTile(item as T)
        }
      />
    </View>
  );
}
