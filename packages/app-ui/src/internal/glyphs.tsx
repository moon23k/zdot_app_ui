import { Image, StyleSheet, View } from 'react-native';
import { BELL } from './bell';
import {
  ADD_PRODUCT,
  ALIGN,
  ALIGN_LEFT,
  ALIGN_RIGHT,
  BUCKET,
  CARD,
  CHART,
  CHECKLIST,
  CLOCK,
  COPY,
  CROP,
  ERASER,
  EYE,
  EYE_OFF,
  FILE,
  GLOBE,
  IMAGES,
  KEYBOARD,
  LAYOUT,
  LINK,
  NOTE,
  OPEN,
  PALETTE,
  PENCIL,
  PHONE,
  PICTURE,
  RECEIVED,
  RETURN,
  SEARCH,
  SEND,
  SHARE,
  SLIDERS,
  SMS,
  SPARKLES,
  STAR,
  MORE,
  STAR_FILL,
  STORE,
  TEXT_SIZE,
  TRASH,
  TRUCK,
  TYPE,
  USERS,
  WALLET,
  WAND,
} from './line-icons';
import { CAMERA, MENU, MESSAGE, PERSON, RECEIPT } from './tab-icons';
import type { IconRenderProps } from './icon';
import { useTheme } from '../theme/theme-provider';

export function ScanGlyph({ color, size }: IconRenderProps) {
  const stroke = Math.max(1.5, size / 12);
  const arm = size * 0.3;
  const corner = (v: 'top' | 'bottom', h: 'left' | 'right') => ({
    position: 'absolute' as const,
    width: arm,
    height: arm,
    borderColor: color,
    [v]: 0,
    [h]: 0,
    [v === 'top' ? 'borderTopWidth' : 'borderBottomWidth']: stroke,
    [h === 'left' ? 'borderLeftWidth' : 'borderRightWidth']: stroke,
  });
  return (
    <View style={{ width: size, height: size }}>
      <View style={corner('top', 'left')} />
      <View style={corner('top', 'right')} />
      <View style={corner('bottom', 'left')} />
      <View style={corner('bottom', 'right')} />
      <View
        style={[
          styles.scanLine,
          {
            left: size * 0.12,
            right: size * 0.12,
            top: (size - stroke) / 2,
            height: stroke,
            borderRadius: stroke,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

export function CloseGlyph({ color, size }: IconRenderProps) {
  const stroke = Math.max(1.5, size / 10);
  const bar = {
    position: 'absolute' as const,
    width: size * 0.8,
    height: stroke,
    borderRadius: stroke,
    backgroundColor: color,
    top: (size - stroke) / 2,
    left: size * 0.1,
  };
  return (
    <View style={{ width: size, height: size }}>
      <View style={[bar, { transform: [{ rotate: '45deg' }] }]} />
      <View style={[bar, { transform: [{ rotate: '-45deg' }] }]} />
    </View>
  );
}

export function CheckGlyph({ color, size }: IconRenderProps) {
  const stroke = Math.max(2, size / 7);
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.32,
          height: size * 0.6,
          marginTop: -size * 0.12,
          borderRightWidth: stroke,
          borderBottomWidth: stroke,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scanLine: { position: 'absolute' },
  center: { alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute' },
});

export function ChevronGlyph({ color, size }: IconRenderProps) {
  const stroke = Math.max(1.5, size / 10);
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.42,
          height: size * 0.42,
          marginLeft: -size * 0.16,
          borderTopWidth: stroke,
          borderRightWidth: stroke,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

export function AlertGlyph({
  color,
  size,
  filled = false,
  onColor,
}: IconRenderProps & { filled?: boolean; onColor?: string }) {
  const t = useTheme();
  const stroke = Math.max(1.5, size / (filled ? 10 : 16));
  const mark = filled ? (onColor ?? t.colors.surface) : color;
  const ring = filled ? 0 : stroke;
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ring,
          borderColor: color,
          backgroundColor: filled ? color : undefined,
        },
      ]}
    >
      <View
        style={{
          width: stroke,
          height: size * 0.28,
          borderRadius: stroke,
          backgroundColor: mark,
        }}
      />
      <View
        style={{
          width: stroke * 1.4,
          height: stroke * 1.4,
          marginTop: size * 0.08,
          borderRadius: stroke,
          backgroundColor: mark,
        }}
      />
    </View>
  );
}

export function PlusGlyph({ color, size }: IconRenderProps) {
  const stroke = Math.max(1.5, size / 16);
  const bar = {
    position: 'absolute' as const,
    backgroundColor: color,
    borderRadius: stroke,
  };
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[bar, { width: size * 0.6, height: stroke }]} />
      <View style={[bar, { width: stroke, height: size * 0.6 }]} />
    </View>
  );
}

export function GripGlyph({ color, size }: IconRenderProps) {
  const dot = size * 0.155;
  const dots = [5, 12, 19].flatMap((y) =>
    [9, 15].map((x) => ({
      key: `${x}-${y}`,
      left: (x / 24) * size - dot / 2,
      top: (y / 24) * size - dot / 2,
    }))
  );
  return (
    <View style={{ width: size, height: size }}>
      {dots.map((d) => (
        <View
          key={d.key}
          style={[
            styles.dot,
            {
              left: d.left,
              top: d.top,
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: color,
            },
          ]}
        />
      ))}
    </View>
  );
}

export function GemGlyph({ color, size }: IconRenderProps) {
  const side = size * 0.72;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: side,
          height: side,
          borderRadius: size * 0.12,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

function imageGlyph(uri: string) {
  return function Glyph({ color, size }: IconRenderProps) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, tintColor: color }}
      />
    );
  };
}

export const BellGlyph = imageGlyph(BELL);
export const SearchGlyph = imageGlyph(SEARCH);
export const ReceiptGlyph = imageGlyph(RECEIPT);
export const MessageGlyph = imageGlyph(MESSAGE);
export const MenuGlyph = imageGlyph(MENU);
export const PersonGlyph = imageGlyph(PERSON);
export const CameraGlyph = imageGlyph(CAMERA);
export const TruckGlyph = imageGlyph(TRUCK);
export const ReturnGlyph = imageGlyph(RETURN);
export const StarGlyph = imageGlyph(STAR);
export const StarFillGlyph = imageGlyph(STAR_FILL);
export const MoreGlyph = imageGlyph(MORE);
export const ImageGlyph = imageGlyph(PICTURE);
export const GlobeGlyph = imageGlyph(GLOBE);
export const PaletteGlyph = imageGlyph(PALETTE);
export const ChartGlyph = imageGlyph(CHART);
export const CardGlyph = imageGlyph(CARD);
export const ClockGlyph = imageGlyph(CLOCK);
export const SparklesGlyph = imageGlyph(SPARKLES);
export const StoreGlyph = imageGlyph(STORE);
export const FileGlyph = imageGlyph(FILE);
export const WalletGlyph = imageGlyph(WALLET);
export const LinkGlyph = imageGlyph(LINK);
export const UsersGlyph = imageGlyph(USERS);
export const PhoneGlyph = imageGlyph(PHONE);
export const EyeGlyph = imageGlyph(EYE);
export const ShareGlyph = imageGlyph(SHARE);
export const PencilGlyph = imageGlyph(PENCIL);
export const TypeGlyph = imageGlyph(TYPE);
export const TextSizeGlyph = imageGlyph(TEXT_SIZE);
export const AlignGlyph = imageGlyph(ALIGN);
export const CopyGlyph = imageGlyph(COPY);
export const SmsGlyph = imageGlyph(SMS);
export const NoteGlyph = imageGlyph(NOTE);
export const SendGlyph = imageGlyph(SEND);
export const ReceivedGlyph = imageGlyph(RECEIVED);
export const ChecklistGlyph = imageGlyph(CHECKLIST);
export const AddProductGlyph = imageGlyph(ADD_PRODUCT);
export const OpenGlyph = imageGlyph(OPEN);
export const EyeOffGlyph = imageGlyph(EYE_OFF);
export const TrashGlyph = imageGlyph(TRASH);
export const WandGlyph = imageGlyph(WAND);
export const ImagesGlyph = imageGlyph(IMAGES);
export const KeyboardGlyph = imageGlyph(KEYBOARD);
export const LayoutGlyph = imageGlyph(LAYOUT);
export const AlignLeftGlyph = imageGlyph(ALIGN_LEFT);
export const AlignRightGlyph = imageGlyph(ALIGN_RIGHT);
export const SlidersGlyph = imageGlyph(SLIDERS);
export const CropGlyph = imageGlyph(CROP);
export const EraserGlyph = imageGlyph(ERASER);
export const BucketGlyph = imageGlyph(BUCKET);

function lineOf(size: number) {
  return Math.max(1.5, size / 12);
}

export function MonitorGlyph({ color, size }: IconRenderProps) {
  const stroke = lineOf(size);
  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <View
        style={{
          marginTop: size * 0.16,
          width: size * 0.8,
          height: size * 0.54,
          borderWidth: stroke,
          borderRadius: size * 0.08,
          borderColor: color,
        }}
      />
      <View
        style={{ width: stroke, height: size * 0.12, backgroundColor: color }}
      />
      <View
        style={{
          width: size * 0.36,
          height: stroke,
          borderRadius: stroke,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export function MobileGlyph({ color, size }: IconRenderProps) {
  const stroke = lineOf(size);
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.48,
          height: size * 0.78,
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: size * 0.08,
          borderWidth: stroke,
          borderRadius: size * 0.12,
          borderColor: color,
        }}
      >
        <View
          style={{
            width: size * 0.12,
            height: stroke,
            borderRadius: stroke,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

function columnsGlyph(count: number) {
  return function Columns({ color, size }: IconRenderProps) {
    const stroke = lineOf(size);
    const column = {
      width: size * (count > 2 ? 0.2 : 0.26),
      height: size * 0.66,
      borderWidth: stroke,
      borderRadius: size * 0.06,
      borderColor: color,
    };
    return (
      <View
        style={[
          styles.center,
          { width: size, height: size, flexDirection: 'row', gap: size * 0.06 },
        ]}
      >
        {Array.from({ length: count }, (_, i) => (
          <View key={i} style={column} />
        ))}
      </View>
    );
  };
}

export const ColumnsGlyph = columnsGlyph(3);

export const TwoColumnsGlyph = columnsGlyph(2);

export function TagGlyph({ color, size }: IconRenderProps) {
  const stroke = lineOf(size);
  const height = size * 0.46;
  const body = size * 0.4;
  const tip = height / Math.SQRT2;
  const hole = stroke * 1.3;
  const round = size * 0.08;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: body + height / 2,
          height,
          transform: [{ rotate: '45deg' }],
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: height / 2,
            top: 0,
            width: body,
            height,
            borderRightWidth: stroke,
            borderTopWidth: stroke,
            borderBottomWidth: stroke,
            borderTopRightRadius: round,
            borderBottomRightRadius: round,
            borderColor: color,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: (height - tip) / 2,
            top: (height - tip) / 2,
            width: tip,
            height: tip,
            borderLeftWidth: stroke,
            borderBottomWidth: stroke,
            borderBottomLeftRadius: round * 0.75,
            borderColor: color,
            transform: [{ rotate: '45deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: height / 2 - hole / 2,
            top: (height - hole) / 2,
            width: hole,
            height: hole,
            borderRadius: hole,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

export function SortGlyph({ color, size }: IconRenderProps) {
  const stroke = lineOf(size);
  const head = size * 0.24;
  const shaft = {
    position: 'absolute' as const,
    top: size * 0.16,
    width: stroke,
    height: size * 0.68,
    borderRadius: stroke,
    backgroundColor: color,
  };
  const tip = {
    position: 'absolute' as const,
    width: head,
    height: head,
    borderColor: color,
    transform: [{ rotate: '45deg' }],
  };
  const left = size * 0.3;
  const right = size * 0.7;
  return (
    <View style={{ width: size, height: size }}>
      <View style={[shaft, { left: left - stroke / 2 }]} />
      <View
        style={[
          tip,
          {
            left: left - head / 2,
            top: size * 0.84 - head * 1.2,
            borderRightWidth: stroke,
            borderBottomWidth: stroke,
          },
        ]}
      />
      <View style={[shaft, { left: right - stroke / 2 }]} />
      <View
        style={[
          tip,
          {
            left: right - head / 2,
            top: size * 0.16 + head * 0.2,
            borderLeftWidth: stroke,
            borderTopWidth: stroke,
          },
        ]}
      />
    </View>
  );
}

export function PositionGlyph({ color, size }: IconRenderProps) {
  const stroke = lineOf(size);
  const box = size * 0.78;
  const dot = size * 0.26;
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: box,
          height: box * 0.92,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: size * 0.1,
          borderWidth: stroke,
          borderRadius: size * 0.12,
          borderColor: color,
        }}
      >
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: size * 0.04,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

export function ResizeGlyph({ color, size }: IconRenderProps) {
  const stroke = lineOf(size);
  const arm = size * 0.3;
  const line = {
    position: 'absolute' as const,
    left: size * 0.12,
    top: (size - stroke) / 2,
    width: size * 0.76,
    height: stroke,
    borderRadius: stroke,
    backgroundColor: color,
    transform: [{ rotate: '-45deg' }],
  };
  const corner = {
    position: 'absolute' as const,
    width: arm,
    height: arm,
    borderColor: color,
  };
  return (
    <View style={{ width: size, height: size }}>
      <View style={line} />
      <View
        style={[
          corner,
          {
            right: size * 0.14,
            top: size * 0.14,
            borderTopWidth: stroke,
            borderRightWidth: stroke,
          },
        ]}
      />
      <View
        style={[
          corner,
          {
            left: size * 0.14,
            bottom: size * 0.14,
            borderBottomWidth: stroke,
            borderLeftWidth: stroke,
          },
        ]}
      />
    </View>
  );
}

export function OverlayGlyph({ color, size }: IconRenderProps) {
  const stroke = lineOf(size);
  const box = size * 0.78;
  const hatch = {
    position: 'absolute' as const,
    width: box * 1.6,
    height: stroke * 0.85,
    backgroundColor: color,
    transform: [{ rotate: '-45deg' }],
  };
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={[
          styles.center,
          {
            width: box,
            height: box * 0.92,
            overflow: 'hidden',
            borderWidth: stroke,
            borderRadius: size * 0.12,
            borderColor: color,
          },
        ]}
      >
        <View style={[hatch, { top: box * 0.06 }]} />
        <View style={hatch} />
        <View style={[hatch, { bottom: box * 0.06 }]} />
      </View>
    </View>
  );
}
