import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  Image,
  PanResponder,
  Platform,
  Text as RNText,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SparklesGlyph } from '../../internal/glyphs';
import { PressableBase } from '../../internal/pressable-base';
import { useTheme } from '../../theme/theme-provider';
import { withAlpha } from '../../utils/color';
import { makeStyles } from '../../utils/styles';
import { CompareSlider } from './compare-slider';
import {
  DetailFocusContext,
  DetailPartsContext,
  type DetailFocusRect,
  type DetailPart,
} from './focus-context';
import { keepWords } from './keep-words';
import {
  DETAIL_FONT_FAMILY,
  DETAIL_STEP_COLUMNS,
  DETAIL_STEP_DOT,
  DETAIL_TABLE_LABEL,
  detailBlockSpace,
  detailLineColor,
  detailSteps,
  detailTableRows,
  detailFontSize,
  detailIsTitle,
  detailLineHeight,
  detailTracking,
  type DetailBlock,
  type DetailDocValue,
  type DetailLayer,
  type DetailSelection,
} from './detail-types';

export type DetailCanvasInput = {
  value: string;
  onChangeText: (text: string) => void;
  active: boolean;
  onFocus?: () => void;
  maxLength?: number;
  label?: string;
};

export type DetailCanvasResult = {
  text: string;
  label?: string | null;
  index: number;
  count: number;
  onIndexChange: (index: number) => void;
};

export type DetailCanvasCompare = {
  before: string;
  after: string;
  labels?: { before: string; after: string };
};

export type DetailCanvasFocus = {
  block: string;
  layer: string;
  input?: DetailCanvasInput | null;
  result?: DetailCanvasResult | null;
  compare?: DetailCanvasCompare | null;
  preview?: string | null;
};

export type DetailCanvasProps = {
  doc: DetailDocValue;
  selection?: DetailSelection;
  onSelect?: (selection: DetailSelection) => void;
  scale?: number;
  ink?: string;
  paper?: string;
  mode?: 'select' | 'edit';
  focus?: DetailCanvasFocus | null;
  onMeasure?: (parts: DetailPart[]) => void;
};

const lay = Platform.OS === 'ios' ? (text: string) => text : keepWords;

const HANDLE = 10;
const DOT = 6;
const MAX_TEXT = 2000;
const RING = 2;
const HALO = 0.9;

type PartSink = {
  root: RefObject<ComponentRef<typeof View> | null>;
  put: (key: string, part: DetailPart | null) => void;
  watch: (key: string, measure: (() => void) | null) => void;
  again: () => void;
};

const PartsContext = createContext<PartSink | null>(null);

type PartSpec = {
  key: string;
  kind: DetailPart['kind'];
  line?: number;
  blank?: boolean;
};

function useProbe(spec?: PartSpec) {
  const sink = useContext(PartsContext);
  const node = useRef<ComponentRef<typeof View>>(null);
  const latest = useRef(spec);
  latest.current = spec;
  const measure = useCallback(() => {
    const now = latest.current;
    const root = sink?.root.current;
    const self = node.current;
    if (!sink || !now || !root || !self) return;
    self.measureLayout(
      root,
      (_x, y, _w, height) =>
        sink.put(now.key, {
          key: now.key,
          kind: now.kind,
          y,
          height,
          line: now.line ?? 0,
          ...(now.blank ? { blank: true } : {}),
        }),
      () => undefined
    );
  }, [sink]);
  const key = spec?.key;
  const blank = !!spec?.blank;
  const seen = useRef(blank);
  useEffect(() => {
    if (seen.current === blank) return;
    seen.current = blank;
    measure();
  }, [blank, measure]);
  useEffect(() => {
    if (!sink || !key) return;
    sink.watch(key, measure);
    return () => {
      sink.watch(key, null);
      sink.put(key, null);
    };
  }, [sink, key, measure]);
  if (!sink || !spec) return null;
  return { ref: node, onLayout: measure };
}

type TapProps = {
  onPress?: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
  part?: PartSpec;
  children?: ReactNode;
};

function Tap({ onPress, label, style, part, children }: TapProps) {
  const probe = useProbe(part);
  if (!onPress) {
    return (
      <View
        ref={probe?.ref}
        onLayout={probe?.onLayout}
        collapsable={probe ? false : undefined}
        style={style}
      >
        {children}
      </View>
    );
  }
  return (
    <PressableBase
      ref={probe?.ref}
      onLayout={probe?.onLayout}
      onPress={onPress}
      accessibilityLabel={label}
      feedback="none"
      style={style}
    >
      {children}
    </PressableBase>
  );
}

const textPart = (
  block: DetailBlock,
  layer: DetailLayer,
  style: TextStyle,
  lines = true
): PartSpec => ({
  key: `${block.id}/${layer.id}`,
  kind: 'text',
  line: lines ? (style.lineHeight ?? 0) : 0,
});

const useStyles = makeStyles((t) => ({
  page: { overflow: 'hidden' },
  texts: { gap: t.space[2] },
  row: { flexDirection: 'row', alignItems: 'center' },
  half: { flex: 1 },
  full: { width: '100%' },
  fill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  pair: { flexDirection: 'row', gap: t.space[2] },
  card: { overflow: 'hidden', borderRadius: t.radius.lg },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: 1,
  },
  tableLast: { borderBottomWidth: 1 },
  label: { width: DETAIL_TABLE_LABEL },
  stepRow: { flexDirection: 'row' },
  step: { flex: 1, alignItems: 'center' },
  stretch: { alignSelf: 'stretch' },
  dot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: t.radius.full,
  },
  blank: { borderRadius: t.radius.sm, backgroundColor: t.colors.muted },
  blankTitle: { width: '60%' },
  blankLine: { width: '80%' },
  ring: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: t.colors.primary,
  },
  tagText: {
    fontSize: t.typography.caption.fontSize,
    fontWeight: '600',
  },
  tag: {
    position: 'absolute',
    left: t.space[1],
    top: t.space[1],
    minWidth: t.space[6],
    height: t.space[6],
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.primary,
  },
  focus: { position: 'relative' },
  focusResult: { paddingVertical: t.space[3] },
  focusRing: {
    position: 'absolute',
    top: -t.space[2],
    bottom: -t.space[2],
    left: -t.space[3],
    right: -t.space[3],
    borderWidth: RING,
    borderColor: t.colors.primary,
    borderRadius: t.radius.md,
  },
  focusFace: {
    position: 'absolute',
    top: -t.space[2],
    bottom: -t.space[2],
    left: -t.space[3],
    right: -t.space[3],
    borderRadius: t.radius.md,
    backgroundColor: t.colors.selectSurface,
  },
  focusTag: {
    position: 'absolute',
    top: -t.space[5],
    left: -t.space[1],
    height: t.space[6] + t.space[1],
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
    paddingLeft: t.space[2],
    paddingRight: t.space[3],
    borderRadius: t.radius.full,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.sm,
  },
  focusTagText: {
    fontFamily: t.fontFamily,
    fontSize: t.typography.eyebrow.fontSize,
    lineHeight: t.typography.eyebrow.lineHeight,
    fontWeight: '600',
    color: t.colors.title,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: t.space[2],
    marginTop: t.space[5],
  },
  dotMark: { width: DOT, height: DOT, borderRadius: DOT / 2 },
  field: {
    padding: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'top',
  },
  photoRing: {
    position: 'absolute',
    top: t.space[1],
    bottom: t.space[1],
    left: t.space[1],
    right: t.space[1],
    borderWidth: RING,
    borderColor: t.colors.primary,
    borderRadius: t.radius.md,
    boxShadow: `0px 0px 0px ${RING}px ${withAlpha(t.colors.surface, HALO)}`,
  },
  photoBare: {
    position: 'absolute',
    top: t.space[1],
    bottom: t.space[1],
    left: t.space[1],
    right: t.space[1],
  },
  faded: { opacity: t.opacity.disabled },
  handle: {
    position: 'absolute',
    width: HANDLE,
    height: HANDLE,
    borderRadius: HANDLE / 2,
    borderWidth: 2,
    borderColor: t.colors.primary,
    backgroundColor: t.colors.surface,
  },
}));

type FocusTarget = {
  root: RefObject<ComponentRef<typeof View> | null>;
  report: (rect: DetailFocusRect | null) => void;
};

const FocusTargetContext = createContext<FocusTarget | null>(null);

function Handles() {
  const s = useStyles();
  const edge = -HANDLE / 2;
  const target = useContext(FocusTargetContext);
  const ring = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => () => target?.report(null), [target]);
  const measure = () => {
    const root = target?.root.current;
    if (!target || !root || !ring.current) return;
    ring.current.measureLayout(
      root,
      (_x, y, _w, height) => target.report({ y, height }),
      () => undefined
    );
  };
  return (
    <>
      <View ref={ring} onLayout={measure} pointerEvents="none" style={s.ring} />
      <View style={[s.handle, { left: edge, top: edge }]} />
      <View style={[s.handle, { right: edge, top: edge }]} />
      <View style={[s.handle, { left: edge, bottom: edge }]} />
      <View style={[s.handle, { right: edge, bottom: edge }]} />
    </>
  );
}

function PhotoRing({ bare }: { bare?: boolean }) {
  const s = useStyles();
  const target = useContext(FocusTargetContext);
  const ring = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => () => target?.report(null), [target]);
  const measure = () => {
    const root = target?.root.current;
    if (!target || !root || !ring.current) return;
    ring.current.measureLayout(
      root,
      (_x, y, _w, height) => target.report({ y, height }),
      () => undefined
    );
  };
  return (
    <View
      ref={ring}
      testID={bare ? undefined : 'detail-photo-ring'}
      onLayout={measure}
      pointerEvents="none"
      style={bare ? s.photoBare : s.photoRing}
    />
  );
}

export function textStyleOf(
  layer: DetailLayer,
  scale: number,
  ink: string,
  paper?: string
): TextStyle {
  const st = layer.style ?? {};
  const size = detailFontSize(st.size) * scale;
  const color = st.color ?? ink;
  const base: TextStyle = {
    fontFamily: DETAIL_FONT_FAMILY[st.font ?? 'gothic'][st.weight ?? 'regular'],
    fontSize: size,
    lineHeight: size * detailLineHeight(st.line),
    letterSpacing: size * detailTracking(st.tracking),
    color,
    textAlign: st.align ?? 'left',
  };
  if (st.effect === 'shadow') {
    return {
      ...base,
      textShadowColor: 'rgba(0, 0, 0, 0.35)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    };
  }
  if (st.effect === 'outline') {
    return {
      ...base,
      borderWidth: 1.5,
      borderColor: color,
      paddingHorizontal: 8 * scale,
      alignSelf: alignSelfOf(st.align),
    };
  }
  if (st.effect === 'band') {
    return {
      ...base,
      color: paper ?? color,
      backgroundColor: color,
      paddingHorizontal: 8 * scale,
      alignSelf: alignSelfOf(st.align),
    };
  }
  return base;
}

function alignSelfOf(align?: 'left' | 'center' | 'right') {
  return align === 'center'
    ? 'center'
    : align === 'right'
      ? 'flex-end'
      : 'flex-start';
}

function reveal(
  block: DetailBlock,
  text: boolean,
  photo: boolean
): DetailBlock {
  const shows = (l: DetailLayer) =>
    !!l.hidden &&
    ((text && l.type === 'text' && !l.text?.trim()) ||
      (photo && l.type === 'image'));
  if (!block.layers.some(shows)) return block;
  return {
    ...block,
    layers: block.layers.map((l) => (shows(l) ? { ...l, hidden: false } : l)),
  };
}

type FocusTextProps = {
  layer: DetailLayer;
  text: TextStyle;
  input?: DetailCanvasInput | null;
  result?: DetailCanvasResult | null;
  blank: ReactNode;
  style?: StyleProp<ViewStyle>;
  part?: PartSpec;
};

function FocusText({
  layer,
  text,
  input,
  result,
  blank,
  style,
  part,
}: FocusTextProps) {
  const t = useTheme();
  const s = useStyles();
  const probe = useProbe(part);
  const target = useContext(FocusTargetContext);
  const ring = useRef<ComponentRef<typeof View>>(null);
  const field = useRef<ComponentRef<typeof TextInput>>(null);
  const [content, setContent] = useState(0);
  const editing = !!input;
  const active = !!input?.active;
  const shown = !input && result ? result : null;
  const latest = useRef(shown);
  latest.current = shown;
  const slop = t.space[2];
  const swipe = t.space[8];

  useEffect(() => () => target?.report(null), [target]);

  const laid = useRef(false);
  const wanted = useRef(active);
  wanted.current = active;

  useEffect(() => {
    if (!editing) {
      laid.current = false;
      return;
    }
    if (!laid.current) return;
    if (active) field.current?.focus();
    else field.current?.blur();
  }, [active, editing]);

  const ready = () => {
    if (laid.current) return;
    laid.current = true;
    const node = field.current;
    if (!wanted.current || !node) return;
    node.focus();
    const end = input?.value.length ?? 0;
    node.setSelection?.(end, end);
  };

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          !!latest.current &&
          latest.current.count > 1 &&
          Math.abs(g.dx) > slop &&
          Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderRelease: (_, g) => {
          const now = latest.current;
          if (!now || Math.abs(g.dx) <= swipe) return;
          if (Math.abs(g.dx) <= Math.abs(g.dy)) return;
          const next = now.index + (g.dx < 0 ? 1 : -1);
          if (next >= 0 && next < now.count) now.onIndexChange(next);
        },
      }),
    [slop, swipe]
  );

  const below = shown && shown.count >= 2 ? t.space[5] + DOT : 0;
  const reach = useRef(below);
  reach.current = below;
  const measure = useCallback(() => {
    const root = target?.root.current;
    if (!target || !root || !ring.current) return;
    ring.current.measureLayout(
      root,
      (_x, y, _w, height) =>
        target.report({ y, height: height + reach.current }),
      () => undefined
    );
  }, [target]);
  useEffect(() => {
    measure();
  }, [below, measure]);

  const line = text.lineHeight ?? 0;
  const fieldStyle: TextStyle = { ...text, alignSelf: undefined };

  const body = input ? (
    <TextInput
      ref={field}
      multiline
      scrollEnabled={false}
      value={input.value}
      onChangeText={input.onChangeText}
      onFocus={input.onFocus}
      maxLength={input.maxLength ?? MAX_TEXT}
      underlineColorAndroid="transparent"
      selectionColor={
        Platform.OS === 'android'
          ? withAlpha(t.colors.primary, 0.3)
          : t.colors.primary
      }
      selectionHandleColor={t.colors.primary}
      cursorColor={t.colors.primary}
      accessibilityLabel={input.label ?? '글'}
      onContentSizeChange={(e) => setContent(e.nativeEvent.contentSize.height)}
      onLayout={ready}
      style={[
        fieldStyle,
        s.field,
        {
          minHeight: line,
          height: content > 0 ? Math.max(line, content) : undefined,
        },
      ]}
    />
  ) : shown ? (
    <RNText lineBreakStrategyIOS="hangul-word" style={text}>
      {lay(shown.text)}
    </RNText>
  ) : layer.text?.trim() ? (
    <RNText lineBreakStrategyIOS="hangul-word" style={text}>
      {lay(layer.text)}
    </RNText>
  ) : (
    blank
  );

  return (
    <View
      ref={probe?.ref}
      onLayout={probe?.onLayout}
      collapsable={probe ? false : undefined}
      style={style}
    >
      <View
        testID="detail-focus-text"
        style={[s.focus, shown && s.focusResult]}
        {...(shown ? pan.panHandlers : null)}
      >
        {shown ? <View pointerEvents="none" style={s.focusFace} /> : null}
        {body}
        <View
          ref={ring}
          onLayout={measure}
          pointerEvents="none"
          style={s.focusRing}
        />
        {shown?.label ? (
          <View pointerEvents="none" style={s.focusTag}>
            <SparklesGlyph color={t.colors.title} size={t.iconSize.sm} />
            <RNText numberOfLines={1} style={s.focusTagText}>
              {shown.label}
            </RNText>
          </View>
        ) : null}
      </View>
      {shown && shown.count >= 2 ? (
        <View style={s.dots}>
          {Array.from({ length: shown.count }, (_, i) => (
            <PressableBase
              key={i}
              feedback="none"
              accessibilityLabel={`${i + 1}/${shown.count}`}
              accessibilityState={{ selected: i === shown.index }}
              hitSlop={{
                top: t.space[5],
                bottom: t.space[5],
                left: t.space[1],
                right: t.space[1],
              }}
              onPress={() => shown.onIndexChange(i)}
              style={[
                s.dotMark,
                {
                  backgroundColor:
                    i === shown.index ? t.colors.title : t.colors.input,
                },
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function DetailCanvas({
  doc,
  selection,
  onSelect,
  scale = 1,
  ink,
  paper,
  mode = 'select',
  focus,
  onMeasure,
}: DetailCanvasProps) {
  const t = useTheme();
  const s = useStyles();
  const report = useContext(DetailFocusContext);
  const listen = useContext(DetailPartsContext);
  const root = useRef<ComponentRef<typeof View>>(null);
  const target = useMemo(() => (report ? { root, report } : null), [report]);
  const sink = onMeasure ?? listen;
  const latest = useRef(sink);
  latest.current = sink;
  const measuring = !!sink;
  const store = useRef(new Map<string, DetailPart>());
  const watchers = useRef(new Map<string, () => void>());
  const frame = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    []
  );
  const parts = useMemo<PartSink | null>(() => {
    if (!measuring) return null;
    const flush = () => {
      frame.current = null;
      const list = [...store.current.values()].sort((a, b) => a.y - b.y);
      latest.current?.(list);
    };
    return {
      root,
      put: (key, part) => {
        const now = store.current.get(key);
        if (part) {
          if (
            now &&
            now.y === part.y &&
            now.height === part.height &&
            !!now.blank === !!part.blank
          )
            return;
          store.current.set(key, part);
        } else {
          if (!now) return;
          store.current.delete(key);
        }
        if (frame.current === null)
          frame.current = requestAnimationFrame(flush);
      },
      watch: (key, measure) => {
        if (measure) watchers.current.set(key, measure);
        else watchers.current.delete(key);
      },
      again: () => watchers.current.forEach((measure) => measure()),
    };
  }, [measuring]);
  const pad = t.space[5] * scale;
  const fg = ink ?? t.colors.foreground;
  const bandText = paper ?? t.colors.surface;
  const edit = mode === 'edit';

  const tx = (l: DetailLayer): TextStyle => {
    const style = textStyleOf(l, scale, fg, bandText);
    return edit ? { ...style, includeFontPadding: false } : style;
  };

  const picked = (block: DetailBlock, layer?: DetailLayer) =>
    !edit &&
    selection?.block === block.id &&
    (layer ? selection.layer === layer.id : !selection.layer);

  const focused = (block: DetailBlock, l: DetailLayer) =>
    edit &&
    !!focus &&
    focus.block === block.id &&
    focus.layer === l.id &&
    l.type === 'text' &&
    !l.hidden;

  const shot = (block: DetailBlock, l: DetailLayer) =>
    edit &&
    !!focus &&
    focus.block === block.id &&
    focus.layer === l.id &&
    l.type === 'image';

  const faded = useMemo(
    () =>
      edit
        ? new Set(
            doc.blocks.flatMap((b) =>
              b.layers
                .filter((l) => l.hidden && l.type === 'image')
                .map((l) => `${b.id}/${l.id}`)
            )
          )
        : null,
    [doc, edit]
  );

  const press = (next: DetailSelection) =>
    onSelect ? () => onSelect(next) : undefined;

  const image = (
    block: DetailBlock,
    layer: DetailLayer,
    flex = false,
    ratio = 1
  ) => {
    const on = shot(block, layer);
    const compare = on ? focus?.compare : null;
    if (compare) {
      return (
        <View key={layer.id} style={flex ? s.half : undefined}>
          <CompareSlider
            before={compare.before}
            after={compare.after}
            aspectRatio={ratio}
            labels={compare.labels}
            inset={t.space[1] + RING}
          />
          <PhotoRing />
        </View>
      );
    }
    const dim = !!faded?.has(`${block.id}/${layer.id}`) && s.faded;
    const preview = on ? focus?.preview : null;
    const url = preview || layer.url;
    return (
      <Tap
        key={layer.id}
        onPress={press({ block: block.id, layer: layer.id })}
        label={'사진'}
        style={flex ? s.half : undefined}
        part={{ key: `${block.id}/${layer.id}`, kind: 'image', blank: !url }}
      >
        {url ? (
          <Image
            source={{ uri: url }}
            resizeMode="cover"
            style={[s.full, { aspectRatio: ratio }, dim]}
          />
        ) : (
          <View
            style={[
              s.full,
              { aspectRatio: ratio, backgroundColor: t.colors.muted },
              dim,
            ]}
          />
        )}
        {picked(block, layer) ? <Handles /> : null}
        {on ? <PhotoRing bare={!!preview} /> : null}
      </Tap>
    );
  };

  const blankBar = (l: DetailLayer, style: TextStyle) => (
    <View
      testID="detail-blank-text"
      style={[
        s.blank,
        detailIsTitle(l.style) ? s.blankTitle : s.blankLine,
        { height: style.lineHeight, alignSelf: alignSelfOf(l.style?.align) },
      ]}
    />
  );

  const focusText = (
    block: DetailBlock,
    l: DetailLayer,
    style: TextStyle,
    wrap?: StyleProp<ViewStyle>
  ) => (
    <FocusText
      key={l.id}
      layer={l}
      text={style}
      input={focus?.input}
      result={focus?.result}
      blank={blankBar(l, style)}
      style={wrap}
      part={textPart(block, l, style, false)}
    />
  );

  const cell = (
    block: DetailBlock,
    l: DetailLayer | null,
    style?: StyleProp<ViewStyle>
  ) => {
    if (!l || l.hidden) return <View style={style} />;
    const text = tx(l);
    if (focused(block, l)) return focusText(block, l, text, style);
    const blank = !l.text?.trim();
    if (blank && !onSelect) return <View style={style} />;
    return (
      <Tap
        onPress={press({ block: block.id, layer: l.id })}
        label={blank ? '글' : (l.text ?? '')}
        style={style}
        part={textPart(block, l, text)}
      >
        {blank ? (
          blankBar(l, text)
        ) : (
          <RNText lineBreakStrategyIOS="hangul-word" style={text}>
            {lay(l.text ?? '')}
          </RNText>
        )}
        {picked(block, l) ? <Handles /> : null}
      </Tap>
    );
  };

  const table = (block: DetailBlock) => {
    const rows = detailTableRows(block, !!onSelect);
    if (!rows.length) return null;
    const first = block.layers.filter((l) => l.type === 'text')[1];
    const borderColor = detailLineColor(first?.style?.color);
    const gap = t.space[3] * scale;
    return (
      <View style={{ padding: pad }}>
        {rows.map((row, i) => (
          <View
            key={row.label?.id ?? row.value?.id ?? i}
            style={[
              s.tableRow,
              i === rows.length - 1 && s.tableLast,
              { paddingVertical: gap, borderColor },
            ]}
          >
            {cell(block, row.label, s.label)}
            {cell(block, row.value, s.half)}
          </View>
        ))}
      </View>
    );
  };

  const steps = (block: DetailBlock) => {
    const list = detailSteps(block, !!onSelect);
    if (!list.length) return null;
    const columns = Math.min(list.length, DETAIL_STEP_COLUMNS);
    const gap = t.space[2] * scale;
    const lines: (DetailLayer | null)[][] = [];
    for (let i = 0; i < list.length; i += columns) {
      const line: (DetailLayer | null)[] = list.slice(i, i + columns);
      while (line.length < columns) line.push(null);
      lines.push(line);
    }
    return (
      <View style={{ padding: pad, gap }}>
        {lines.map((line, r) => (
          <View key={r} style={[s.stepRow, { gap }]}>
            {line.map((l, c) => {
              if (!l) return <View key={`empty-${c}`} style={s.step} />;
              const text = tx(l);
              const size = text.fontSize ?? 0;
              const blank = !l.text?.trim();
              const number = textStyleOf(
                {
                  ...l,
                  style: {
                    ...l.style,
                    weight: 'bold',
                    align: 'center',
                    effect: 'none',
                  },
                },
                scale,
                fg
              );
              const dot = (
                <View
                  style={[
                    s.dot,
                    {
                      width: size * DETAIL_STEP_DOT,
                      height: size * DETAIL_STEP_DOT,
                      borderColor: detailLineColor(l.style?.color),
                    },
                  ]}
                >
                  <RNText style={[number, { lineHeight: size }]}>
                    {String(r * columns + c + 1)}
                  </RNText>
                </View>
              );
              if (focused(block, l)) {
                return (
                  <View key={l.id} style={[s.step, { gap }]}>
                    {dot}
                    {focusText(block, l, text, s.stretch)}
                  </View>
                );
              }
              return (
                <Tap
                  key={l.id}
                  onPress={press({ block: block.id, layer: l.id })}
                  label={blank ? '글' : (l.text ?? '')}
                  style={[s.step, { gap }]}
                  part={textPart(block, l, text, false)}
                >
                  {dot}
                  {blank ? (
                    blankBar(l, text)
                  ) : (
                    <RNText
                      lineBreakStrategyIOS="hangul-word"
                      style={[text, s.stretch]}
                    >
                      {lay(l.text ?? '')}
                    </RNText>
                  )}
                  {picked(block, l) ? <Handles /> : null}
                </Tap>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const texts = (block: DetailBlock, shown: DetailLayer[], under = false) => {
    const list = shown.filter(
      (l) => l.type === 'text' && (l.text || onSelect || focused(block, l))
    );
    if (!list.length) return null;
    return (
      <View
        style={[
          s.texts,
          { padding: pad },
          under && { paddingTop: pad + t.space[2] * scale },
        ]}
      >
        {list.map((l) => {
          const style = tx(l);
          if (focused(block, l)) return focusText(block, l, style);
          const blank = !!onSelect && !l.text?.trim();
          return (
            <Tap
              key={l.id}
              onPress={press({ block: block.id, layer: l.id })}
              label={blank ? '글' : (l.text ?? '')}
              part={textPart(block, l, style)}
            >
              {blank ? (
                blankBar(l, style)
              ) : (
                <RNText lineBreakStrategyIOS="hangul-word" style={style}>
                  {lay(l.text ?? '')}
                </RNText>
              )}
              {picked(block, l) ? <Handles /> : null}
            </Tap>
          );
        })}
      </View>
    );
  };

  const body = (raw: DetailBlock): ReactNode => {
    const block = reveal(raw, !!onSelect, edit);
    const shown = block.layers.filter((l) => !l.hidden);
    const images = shown.filter((l) => l.type === 'image');
    switch (block.layout) {
      case 'text':
        return texts(block, shown);
      case 'image':
        return images.map((l) => image(block, l, false, 4 / 5));
      case 'text_top':
        return (
          <>
            {texts(block, shown)}
            {images.map((l) => image(block, l, false, 4 / 5))}
          </>
        );
      case 'side':
        return (
          <View style={s.row}>
            {images.slice(0, 1).map((l) => image(block, l, true))}
            <View style={s.half}>{texts(block, shown)}</View>
          </View>
        );
      case 'two_images':
        return (
          <>
            <View style={[s.pair, { paddingHorizontal: pad, paddingTop: pad }]}>
              {images.slice(0, 2).map((l) => image(block, l, true))}
            </View>
            {texts(block, shown)}
          </>
        );
      case 'table':
        return table(block);
      case 'steps':
        return steps(block);
      case 'card':
        return (
          <View style={{ padding: pad }}>
            <View style={[s.card, { backgroundColor: t.colors.surface }]}>
              {images.slice(0, 1).map((l) => image(block, l))}
              {texts(block, shown)}
            </View>
          </View>
        );
      default:
        return (
          <>
            {images.map((l) => image(block, l, false, 4 / 5))}
            {texts(block, shown, images.length > 0)}
          </>
        );
    }
  };

  return (
    <PartsContext.Provider value={parts}>
      <FocusTargetContext.Provider value={target}>
        <View
          ref={root}
          style={[
            s.page,
            { backgroundColor: doc.background ?? paper ?? t.colors.surface },
          ]}
        >
          {doc.blocks.map((block, index) => (
            <View
              key={block.id}
              onLayout={parts?.again}
              style={{
                backgroundColor: block.background?.color ?? undefined,
                paddingTop: detailBlockSpace(block.space_top) * scale,
                paddingBottom: detailBlockSpace(block.space_bottom) * scale,
              }}
            >
              {block.background?.url ? (
                <Image
                  source={{ uri: block.background.url }}
                  resizeMode="cover"
                  style={s.fill}
                />
              ) : null}
              {onSelect && !edit ? (
                <PressableBase
                  onPress={() => onSelect({ block: block.id })}
                  accessibilityLabel="블록"
                  feedback="none"
                  style={s.fill}
                />
              ) : null}
              {body(block)}
              {picked(block) ? <Handles /> : null}
              {!edit && selection?.block === block.id ? (
                <View pointerEvents="none" style={s.tag}>
                  <RNText
                    style={[s.tagText, { color: t.colors.primaryForeground }]}
                  >
                    {String(index + 1)}
                  </RNText>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </FocusTargetContext.Provider>
    </PartsContext.Provider>
  );
}
