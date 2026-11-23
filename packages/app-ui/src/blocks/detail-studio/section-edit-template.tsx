import {
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
} from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { useTheme } from '../../theme/theme-provider';
import { makeStyles } from '../../utils/styles';
import {
  DetailFocusContext,
  DetailPartsContext,
  type DetailFocusRect,
  type DetailPart,
} from '../detail-editor/focus-context';

export type SectionEditTemplateProps = {
  bar: ReactNode;
  children: ReactNode;
  accessory?: ReactNode;
  panel?: ReactNode;
  sheet?: ReactNode;
  bottomInset?: number;
};

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.surface },
  scroll: { flex: 1 },
  accessory: { backgroundColor: t.colors.surface },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
}));

const EPS = 0.5;

function lineStop(part: DetailPart, at: number): boolean {
  if (part.line <= 0) return false;
  const steps = (at - part.y) / part.line;
  const k = Math.round(steps);
  return (
    k >= 1 &&
    part.y + k * part.line < part.y + part.height - EPS &&
    Math.abs(steps - k) * part.line < EPS
  );
}

export function sheetEdge(
  edge: number,
  parts: readonly DetailPart[],
  gap: number,
  reach?: { min: number; max: number }
): number {
  const texts = parts.filter((p) => p.kind === 'text' && p.height > 0);
  const cuts = (at: number) =>
    texts.some(
      (p) =>
        at > p.y - gap + EPS &&
        at < p.y + p.height + gap - EPS &&
        !lineStop(p, at)
    );
  if (!cuts(edge)) return edge;
  const stops = texts.flatMap((p) => {
    const list = [p.y - gap, p.y + p.height + gap];
    if (p.line > 0) {
      for (let at = p.y + p.line; at < p.y + p.height - EPS; at += p.line) {
        list.push(at);
      }
    }
    return list;
  });
  let best = edge;
  let far = Infinity;
  for (const at of stops) {
    if (cuts(at)) continue;
    if (reach && (at < reach.min - EPS || at > reach.max + EPS)) continue;
    const away = Math.abs(at - edge);
    if (away < far) {
      far = away;
      best = at;
    }
  }
  return best;
}

export function typingOffset(
  box: { top: number; bottom: number },
  viewport: number,
  gap: number,
  margin: number
): number {
  const next =
    box.bottom - box.top + gap + margin > viewport
      ? box.top - margin
      : box.bottom + gap - viewport;
  return Math.max(0, next);
}

function useKeyboardShown() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setShown(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setShown(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return shown;
}

export function SectionEditTemplate({
  bar,
  children,
  accessory,
  panel,
  sheet,
  bottomInset = 0,
}: SectionEditTemplateProps) {
  const t = useTheme();
  const s = useStyles();
  const keyboard = useKeyboardShown();
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const offset = useRef(0);
  const pageTop = useRef(0);
  const [content, setContent] = useState(0);
  const [height, setHeight] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const fresh = useRef(true);
  const [parts, setParts] = useState<DetailPart[]>([]);
  const listen = useRef((list: DetailPart[]) => setParts(list)).current;
  const [sheetHeight, setSheetHeight] = useState(0);
  const [focus, setFocus] = useState<DetailFocusRect | null>(null);
  const report = useRef((rect: DetailFocusRect | null) =>
    setFocus((now) =>
      now === rect ||
      (now && rect && now.y === rect.y && now.height === rect.height)
        ? now
        : rect
    )
  ).current;
  const margin = t.space[4];
  const gap = t.space[1];
  const viewport = height - sheetHeight;
  const pinned = keyboard || !!panel;

  useEffect(() => {
    if (!focus || viewport <= 0) return;
    const now = offset.current;
    const box = {
      top: pageTop.current + focus.y,
      bottom: pageTop.current + focus.y + focus.height,
    };
    if (pinned) {
      const most = Math.max(0, content - height);
      const next = Math.min(most, typingOffset(box, viewport, gap, margin));
      if (Math.abs(next - now) > EPS) {
        scroller.current?.scrollTo({ y: next, animated: true });
      }
      return;
    }
    const top = box.top - margin;
    const end = box.bottom + margin;
    const next =
      end - top > viewport || top < now
        ? top
        : end > now + viewport
          ? end - viewport
          : now;
    if (next !== now) {
      scroller.current?.scrollTo({ y: Math.max(0, next), animated: true });
    }
  }, [focus, viewport, margin, gap, pinned, content, height]);

  useEffect(() => {
    if (sheetHeight <= 0) {
      fresh.current = true;
      return;
    }
    if (focus || keyboard || viewport <= 0) return;
    if (!parts.length) return;
    const now = offset.current;
    const page = pageTop.current;
    const most = Math.max(0, content - height);
    const bottom = page + pageHeight;
    const base = fresh.current && bottom > viewport ? bottom - viewport : now;
    fresh.current = false;
    const edge =
      sheetEdge(base + viewport - page, parts, margin / 2, {
        min: viewport - page,
        max: most + viewport - page,
      }) + page;
    const next = Math.min(most, Math.max(0, edge - viewport));
    if (Math.abs(next - now) > EPS) {
      scroller.current?.scrollTo({ y: next, animated: true });
    }
  }, [
    focus,
    keyboard,
    sheetHeight,
    viewport,
    parts,
    margin,
    height,
    content,
    pageHeight,
  ]);

  const docked = !!accessory || !!panel;
  const below = !panel && !keyboard ? bottomInset : 0;

  return (
    <KeyboardAvoidingView behavior="padding" style={s.root}>
      {bar}
      <ScrollView
        ref={scroller}
        style={s.scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: sheetHeight + (docked ? 0 : bottomInset),
        }}
        scrollEventThrottle={16}
        onScroll={(e) => {
          offset.current = e.nativeEvent.contentOffset.y;
        }}
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(_w, h) => setContent(h)}
      >
        <DetailPartsContext.Provider value={listen}>
          <DetailFocusContext.Provider value={report}>
            <View
              onLayout={(e) => {
                pageTop.current = e.nativeEvent.layout.y;
                setPageHeight(e.nativeEvent.layout.height);
              }}
            >
              {children}
            </View>
          </DetailFocusContext.Provider>
        </DetailPartsContext.Provider>
      </ScrollView>
      {accessory ? (
        <View style={[s.accessory, { paddingBottom: below }]}>{accessory}</View>
      ) : null}
      {panel}
      <View pointerEvents="box-none" style={s.sheet}>
        <View
          pointerEvents="box-none"
          onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
        >
          {sheet}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
