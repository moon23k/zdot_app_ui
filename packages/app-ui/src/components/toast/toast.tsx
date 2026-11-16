import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  Text,
  View,
} from 'react-native';
import { CheckGlyph } from '../../internal/glyphs';
import { useNativeDriver } from '../../internal/overlay';
import { PressableBase } from '../../internal/pressable-base';
import { useReducedMotion } from '../../internal/use-reduced-motion';
import type { Tone } from '../../theme/contract';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';

export type ToastTone = Extract<Tone, 'neutral' | 'success' | 'danger'>;

export type ToastOptions = {
  message: string;
  tone?: ToastTone;
  duration?: number;
  action?: ToastAction;
};

export type ToastAction = { label: string; onPress: () => void };

type Current = {
  id: number;
  message: string;
  tone: ToastTone;
  action?: ToastAction;
};

function createToastStore() {
  let current: Current | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let seq = 0;
  let hosts: string[] = [];
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  const hide = () => {
    clearTimeout(timer);
    current = null;
    emit();
  };

  return {
    bottomInset: 0,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getCurrent: () => current,
    getTopHost: () => hosts[hosts.length - 1],
    addHost(id: string) {
      hosts = [...hosts, id];
      emit();
      return () => {
        hosts = hosts.filter((h) => h !== id);
        emit();
      };
    },
    show({ message, tone = 'neutral', duration, action }: ToastOptions) {
      clearTimeout(timer);
      current = { id: ++seq, message, tone, action };
      timer = setTimeout(hide, duration ?? (action ? 4000 : 2500));
      emit();
      if (Platform.OS === 'ios')
        AccessibilityInfo.announceForAccessibility(message);
    },
    hide,
  };
}

type ToastStore = ReturnType<typeof createToastStore>;

const TOAST_FROM = 0.9;

const StoreContext = createContext<ToastStore | null>(null);

export type ToastProviderProps = {
  bottomInset?: number;
  children: ReactNode;
};

export function ToastProvider({
  bottomInset = 0,
  children,
}: ToastProviderProps) {
  const [store] = useState(createToastStore);
  store.bottomInset = bottomInset;
  useEffect(() => () => store.hide(), [store]);
  return (
    <StoreContext.Provider value={store}>
      {children}
      <ToastHost />
    </StoreContext.Provider>
  );
}

export function useToast(): { show: (options: ToastOptions) => void } {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useToast must be used inside <ToastProvider>.');
  return store;
}

const useStyles = makeStyles((t) => ({
  layer: {
    position: 'absolute',
    left: t.space[4],
    right: t.space[4],
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 480,
    minHeight: t.controlSize.md,
    paddingHorizontal: t.space[4],
    paddingVertical: t.space[3],
    borderRadius: t.radius.md,
    boxShadow: t.shadow.md,
  },
  withAction: {
    alignSelf: 'stretch',
    paddingVertical: 0,
    paddingRight: t.space[2],
  },
  message: { ...t.typography.body, flexShrink: 1, fontFamily: t.fontFamily },
  messageFill: { flex: 1, fontSize: t.typography.label.fontSize },
  action: { paddingHorizontal: t.space[3], justifyContent: 'center' },
  mark: { marginRight: t.space[2] },
  actionLabel: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.label.fontSize,
    lineHeight: t.typography.label.lineHeight,
    fontWeight: '600',
  },
}));

export function ToastHost() {
  const store = useContext(StoreContext);
  return store ? <ToastHostInner store={store} /> : null;
}

function ToastHostInner({ store }: { store: ToastStore }) {
  const t = useTheme();
  const s = useStyles();
  const id = useId();
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(0)).current;
  const current = useSyncExternalStore(store.subscribe, store.getCurrent);
  const isTop = useSyncExternalStore(
    store.subscribe,
    () => store.getTopHost() === id
  );

  useEffect(() => store.addHost(id), [store, id]);

  const [shown, setShown] = useState<Current | null>(current);
  if (current && current !== shown) setShown(current);

  useEffect(() => {
    const into = !!current;
    if (reduced) {
      opacity.setValue(into ? 1 : 0);
      if (!into) setShown(null);
      return;
    }
    if (into) opacity.setValue(0);
    const [x1, y1, x2, y2] =
      t.motion.easing[into ? 'decelerate' : 'accelerate'];
    const animation = Animated.timing(opacity, {
      toValue: into ? 1 : 0,
      duration: t.motion.duration[into ? 'base' : 'short'],
      easing: Easing.bezier(x1, y1, x2, y2),
      useNativeDriver,
    });
    animation.start(({ finished }) => {
      if (finished && !into) setShown(null);
    });
    return () => animation.stop();
  }, [current, opacity, reduced, t]);

  const view = current ?? shown;
  if (!view || !isTop) return null;

  const [bg, fg] = {
    neutral: [t.colors.foreground, t.colors.background],
    success: [t.colors.success, t.colors.successForeground],
    danger: [t.colors.danger, t.colors.dangerForeground],
  }[view.tone];
  const actionColor =
    view.tone !== 'neutral' ? fg : t.scheme === 'light' ? '#93c5fd' : '#1d4ed8';

  return (
    <View
      pointerEvents="box-none"
      style={[s.layer, { bottom: t.space[4] + store.bottomInset }]}
    >
      <Animated.View
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={[
          s.toast,
          !!view.action && s.withAction,
          {
            backgroundColor: bg,
            opacity,
            transform: [
              {
                scale: opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [TOAST_FROM, 1],
                }),
              },
            ],
          },
        ]}
      >
        {view.tone === 'success' ? (
          <View style={s.mark}>
            <CheckGlyph
              color={fg ?? t.colors.successForeground}
              size={t.iconSize.sm}
            />
          </View>
        ) : null}
        <Text
          maxFontSizeMultiplier={t.maxFontScale}
          style={[s.message, !!view.action && s.messageFill, { color: fg }]}
        >
          {view.message}
        </Text>
        {view.action ? (
          <PressableBase
            accessibilityRole="button"
            accessibilityLabel={view.action.label}
            touchHeight={44}
            style={s.action}
            onPress={() => {
              view.action?.onPress();
              store.hide();
            }}
          >
            <Text
              maxFontSizeMultiplier={t.maxFontScale}
              style={[s.actionLabel, { color: actionColor }]}
            >
              {view.action.label}
            </Text>
          </PressableBase>
        ) : null}
      </Animated.View>
    </View>
  );
}
