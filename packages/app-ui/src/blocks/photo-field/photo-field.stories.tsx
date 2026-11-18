import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { demoPhotoIds, sample, Section } from '../../__stories__/helpers';
import { PhotoField, type FieldPhoto } from './photo-field';

const initial: FieldPhoto[] = [
  { id: '1', ...sample(demoPhotoIds.clothes, 400) },
  { id: '2', ...sample(demoPhotoIds.latte, 400), status: 'uploading' },
  { id: '3', ...sample(demoPhotoIds.mug, 400), status: 'failed' },
];

const single: FieldPhoto = { id: '1', ...sample(demoPhotoIds.mug, 400) };

function Many() {
  const [photos, setPhotos] = useState(initial);
  return (
    <PhotoField
      photos={photos}
      onPhotosChange={setPhotos}
      onAdd={() => {}}
      onRemove={(id) => setPhotos((list) => list.filter((p) => p.id !== id))}
      onRetry={(id) =>
        setPhotos((list) =>
          list.map((p) =>
            p.id === id ? { ...p, status: 'uploading' as const } : p
          )
        )
      }
    />
  );
}

function One() {
  const [photos, setPhotos] = useState<FieldPhoto[]>([single]);
  return (
    <PhotoField
      label="사진"
      photos={photos}
      max={1}
      onAdd={() => setPhotos([single])}
      onRemove={() => setPhotos([])}
    />
  );
}

function Demo() {
  return (
    <GestureHandlerRootView>
      <Section title="추가 · 대표 · 업로드 중 · 실패 · 끌어 순서 바꾸기">
        <Many />
      </Section>
      <Section title="한 장">
        <One />
      </Section>
      <Section title="한 장 · 빈 상태">
        <PhotoField label="사진" photos={[]} max={1} onAdd={() => {}} />
      </Section>
    </GestureHandlerRootView>
  );
}

const meta = {
  title: 'Blocks/Product/PhotoField',
  component: Demo,
} satisfies Meta<typeof Demo>;
export default meta;

export const AllVariants: StoryObj<typeof meta> = {};
