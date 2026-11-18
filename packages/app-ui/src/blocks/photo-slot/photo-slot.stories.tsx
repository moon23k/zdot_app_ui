import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { demoPhotoIds, sample, Section } from '../../__stories__/helpers';
import { PhotoSlot, type SlotPhoto } from './photo-slot';

const filled: SlotPhoto = { ...sample(demoPhotoIds.mug, 600, 400) };

function Live() {
  const [photo, setPhoto] = useState<SlotPhoto | null>(filled);
  return (
    <PhotoSlot
      label="사진"
      photo={photo}
      onAdd={() => setPhoto(filled)}
      onRemove={() => setPhoto(null)}
    />
  );
}

function Demo() {
  return (
    <>
      <Section title="사진 · 지우기">
        <Live />
      </Section>
      <Section title="빈 상태">
        <PhotoSlot label="사진" photo={null} onAdd={() => {}} />
      </Section>
      <Section title="업로드 중 · 실패">
        <PhotoSlot
          photo={{ ...filled, status: 'uploading' }}
          onRemove={() => {}}
        />
        <PhotoSlot
          photo={{ ...filled, status: 'failed' }}
          onRemove={() => {}}
          onRetry={() => {}}
        />
      </Section>
    </>
  );
}

const meta = {
  title: 'Blocks/Product/PhotoSlot',
  component: Demo,
} satisfies Meta<typeof Demo>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
