import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { demoPhotoIds, sample, Section } from '../../__stories__/helpers';
import { AddThumbs, FactRows, PhotoMosaic, TintButton } from './detail-request';

const photos = [
  demoPhotoIds.mug,
  demoPhotoIds.latte,
  demoPhotoIds.cafe,
  demoPhotoIds.desk,
  demoPhotoIds.flatlay,
].map((id) => sample(id, 400).uri);

function Demo() {
  return (
    <>
      <Section title="사진 5장">
        <PhotoMosaic images={photos} onPress={() => {}} />
      </Section>
      <Section title="사진 1장">
        <PhotoMosaic images={photos.slice(0, 1)} onPress={() => {}} />
      </Section>
      <Section title="상품 정보">
        <FactRows
          rows={[
            { label: '재질', value: '도자기' },
            { label: '크기', value: '지름 8cm · 높이 9cm' },
            { label: '용량', value: '300ml' },
          ]}
        />
      </Section>
      <Section title="참고">
        <AddThumbs images={[]} onAdd={() => {}} addLabel="참고" />
        <AddThumbs
          images={photos.slice(0, 2)}
          onAdd={() => {}}
          addLabel="참고"
        />
      </Section>
      <Section title="단추">
        <TintButton cost={1000} onPress={() => {}}>
          만들기
        </TintButton>
        <TintButton onPress={() => {}}>편집</TintButton>
      </Section>
    </>
  );
}

const meta = {
  title: 'Blocks/Detail/DetailRequest',
  component: Demo,
} satisfies Meta<typeof Demo>;
export default meta;

export const AllVariants: StoryObj<typeof meta> = {};
