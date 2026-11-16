import type { ReactElement, ReactNode } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  type ListRenderItem,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { EmptyState } from '../components/empty-state/empty-state';
import { Skeleton } from '../components/skeleton/skeleton';
import { Text } from '../components/text/text';
import { PlusGlyph } from '../internal/glyphs';
import { renderIcon, type IconSlot } from '../internal/icon';
import { PressableBase } from '../internal/pressable-base';
import { Later, useSettled } from '../internal/settle';
import { useTheme } from '../theme/theme-provider';
import { makeStyles } from '../utils/styles';
import type { TemplateAction } from './parts';

export type ListTemplateStatus = 'ready' | 'loading' | 'error';

export type ListTemplateProps<T> = {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  status?: ListTemplateStatus;
  header?: ReactNode;
  filters?: ReactNode;
  pinned?: ReactNode;
  empty?: { title: string; action?: Pick<TemplateAction, 'label' | 'onPress'> };
  error?: { title: string; onRetry: () => void };
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  selectionBar?: ReactElement | null;
  columns?: number;
  floatingAction?: { label: string; icon?: IconSlot; onPress: () => void };
  bottomInset?: number;
};

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.background },
  filters: {
    gap: t.layout.groupGap,
    paddingTop: t.space[2],
    paddingBottom: t.space[2],
    paddingHorizontal: t.layout.screenX,
  },
  loading: {
    gap: t.space[4],
    paddingTop: t.space[2],
    paddingHorizontal: t.layout.screenX,
  },
  grow: { flexGrow: 1 },
  columns: {
    gap: t.space[3],
    paddingHorizontal: t.layout.screenX,
    paddingBottom: t.space[5],
  },
  fab: {
    position: 'absolute',
    right: t.layout.screenX,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
    height: t.controlSize.md,
    paddingHorizontal: t.space[5],
    borderRadius: t.controlSize.md / 2,
    backgroundColor: t.colors.primary,
    boxShadow: t.shadow.md,
  },
  fabText: { color: t.colors.primaryForeground },
}));

export function ListTemplate<T>({
  data,
  renderItem,
  keyExtractor,
  status = 'ready',
  header,
  filters,
  pinned,
  empty,
  error,
  refreshing = false,
  onRefresh,
  onEndReached,
  selectionBar,
  columns = 1,
  floatingAction,
  bottomInset = 0,
}: ListTemplateProps<T>) {
  const t = useTheme();
  const s = useStyles();
  const head = filters ? <View style={s.filters}>{filters}</View> : null;

  const loading = status === 'loading';
  const failed = status === 'error' && !!error;
  const rows = loading || failed ? [] : data;
  const settled = useSettled(loading);
  const cell: ListRenderItem<T> = (info) =>
    settled() ? (
      <Animated.View entering={FadeIn.duration(t.motion.duration.long)}>
        {renderItem(info)}
      </Animated.View>
    ) : (
      renderItem(info)
    );

  return (
    <View style={s.root}>
      {header}
      <FlatList
        key={columns}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? s.columns : undefined}
        data={rows}
        renderItem={cell}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          head || pinned ? (
            <>
              {head}
              {pinned}
            </>
          ) : undefined
        }
        ListEmptyComponent={
          loading ? (
            <Later>
              <View style={s.loading}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height={t.listRow.oneLine} />
                ))}
              </View>
            </Later>
          ) : failed && error ? (
            <EmptyState
              variant="error"
              title={error.title}
              action={{ label: '다시 시도', onPress: error.onRetry }}
            />
          ) : empty ? (
            <EmptyState title={empty.title} action={empty.action} />
          ) : undefined
        }
        contentContainerStyle={[
          rows.length === 0 ? s.grow : null,
          selectionBar ? null : { paddingBottom: bottomInset },
          floatingAction
            ? {
                paddingBottom: bottomInset + t.controlSize.md + t.space[4] * 2,
              }
            : null,
        ]}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        onEndReached={onEndReached}
      />
      {floatingAction ? (
        <PressableBase
          feedback="surface"
          onPress={floatingAction.onPress}
          accessibilityLabel={floatingAction.label}
          style={[s.fab, { bottom: t.space[4] + bottomInset }]}
        >
          {renderIcon(floatingAction.icon ?? PlusGlyph, {
            color: t.colors.primaryForeground,
            size: t.iconSize.md,
          })}
          <Text weight="bold" style={s.fabText}>
            {floatingAction.label}
          </Text>
        </PressableBase>
      ) : null}
      {selectionBar}
    </View>
  );
}
