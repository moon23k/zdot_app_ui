import { useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Field } from '../../components/field/field';
import { ListRow } from '../../components/list-row/list-row';
import { Sheet, SheetOptions } from '../../components/sheet/sheet';
import { Text } from '../../components/text/text';
import { CheckGlyph, ScanGlyph } from '../../internal/glyphs';
import { Photo } from '../../components/photo/photo';
import { useTheme } from '../../theme/theme-provider';
import { ListSection } from '../../templates/parts';
import { makeStyles } from '../../utils/styles';

export type ShipCarrier = { code: string; name: string };

export type BulkShipRow = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string | null;
  trackingNo: string;
};

export type BulkShipListProps = {
  carriers: readonly ShipCarrier[];
  carrier: string | null;
  onCarrierChange: (code: string) => void;
  rows: readonly BulkShipRow[];
  onTrackingChange: (id: string, value: string) => void;
  onScan?: (id: string) => void;
  bottomInset?: number;
  style?: StyleProp<ViewStyle>;
};

export type TrackingIssue = 'invalid' | 'duplicate';

const TRACKING = /^[0-9-]{8,20}$/;
const INVALID = '송장번호를 확인해 주세요';
const DUPLICATE = '같은 송장번호가 다른 주문에도 있어요';
const THUMB = 40;

export function trackingIssues(
  rows: readonly BulkShipRow[]
): Record<string, TrackingIssue> {
  const key = (v: string) => v.trim().replace(/-/g, '');
  const seen = new Map<string, number>();
  for (const row of rows) {
    const k = key(row.trackingNo);
    if (k && TRACKING.test(row.trackingNo.trim())) {
      seen.set(k, (seen.get(k) ?? 0) + 1);
    }
  }
  const issues: Record<string, TrackingIssue> = {};
  for (const row of rows) {
    const value = row.trackingNo.trim();
    if (!value) continue;
    if (!TRACKING.test(value)) issues[row.id] = 'invalid';
    else if ((seen.get(key(value)) ?? 0) > 1) issues[row.id] = 'duplicate';
  }
  return issues;
}

const useStyles = makeStyles((t) => ({
  row: {
    gap: t.space[3],
    paddingHorizontal: t.layout.screenX,
    paddingVertical: t.space[4],
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: t.space[3] },
  body: { flex: 1, minWidth: 0 },
  thumb: { width: THUMB, height: THUMB },
  line: { height: 1, backgroundColor: t.colors.muted },
}));

export function BulkShipList({
  carriers,
  carrier,
  onCarrierChange,
  rows,
  onTrackingChange,
  onScan,
  bottomInset = 0,
  style,
}: BulkShipListProps) {
  const t = useTheme();
  const s = useStyles();
  const [picking, setPicking] = useState(false);
  const issues = trackingIssues(rows);
  const selected = carriers.find((c) => c.code === carrier);
  return (
    <View style={style}>
      <ListSection card>
        <ListRow
          title="택배사"
          value={selected?.name ?? '선택'}
          chevron
          onPress={() => setPicking(true)}
        />
      </ListSection>
      <ListSection card>
        {rows.map((row) => {
          const issue = issues[row.id];
          const ok = Boolean(row.trackingNo.trim()) && !issue;
          return (
            <View key={row.id} style={s.row}>
              <View style={s.head}>
                <Photo
                  source={{ uri: row.image ?? '' }}
                  seed={row.title}
                  radius={t.radius.md}
                  style={s.thumb}
                />
                <View style={s.body}>
                  <Text variant="label" weight="medium" numberOfLines={1}>
                    {row.title}
                  </Text>
                  {row.subtitle ? (
                    <Text variant="caption" tone="muted" numberOfLines={1}>
                      {row.subtitle}
                    </Text>
                  ) : null}
                </View>
                {ok ? (
                  <CheckGlyph color={t.colors.success} size={t.iconSize.md} />
                ) : null}
              </View>
              <Field
                value={row.trackingNo}
                onChangeText={(v) => onTrackingChange(row.id, v)}
                placeholder="송장번호"
                keyboardType="number-pad"
                inputMode="numeric"
                autoCorrect={false}
                maxLength={20}
                accessibilityLabel={`${row.title} 송장번호`}
                error={issue === 'invalid' ? INVALID : undefined}
                warning={issue === 'duplicate' ? DUPLICATE : undefined}
                trailing={onScan ? ScanGlyph : undefined}
                onTrailingPress={onScan ? () => onScan(row.id) : undefined}
                trailingLabel={`${row.title} 송장 스캔`}
              />
            </View>
          );
        })}
      </ListSection>
      <Sheet
        open={picking}
        onOpenChange={setPicking}
        title="택배사 선택"
        bottomInset={bottomInset}
      >
        <SheetOptions
          items={carriers.map((c) => ({ value: c.code, label: c.name }))}
          value={carrier}
          onValueChange={(code) => {
            onCarrierChange(code);
            setPicking(false);
          }}
        />
      </Sheet>
    </View>
  );
}
