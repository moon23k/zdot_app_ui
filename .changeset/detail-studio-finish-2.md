---
'@ezpg/app-ui': patch
---

상세페이지 스튜디오 2차 마감: DetailCanvas 가 그리는 글(편집 칸 값 제외)은 한글 낱말 안에서 줄이 바뀌지 않게 낱말 글자 사이에 줄바꿈 금지 문자를 넣어 그림(가운뎃점은 앞 낱말에, 한 글자 낱말은 뒤 숫자에 붙임), 새 선택 prop onMeasure · DetailPartsContext(글 · 사진 자리 보고). SectionThumb 는 offset 을 주지 않으면 실제 자리로 썸네일 범위를 잡음(사진으로 시작하면 사진 가운데, 글로 시작하면 첫 글부터, 아래 끝에 걸친 글 줄은 빼고). SectionEditTemplate 은 시트가 열리면 시트 윗변이 글 줄을 자르지 않게 스크롤을 맞춤. SectionBoard 더보기 메뉴는 글 칸 폭 전체를 덮고 위아래 끝이 줄 사이에 오게(SectionAnchor fill · pitch, 기본 메뉴는 그대로). CompareSlider inset(나눔 선이 선택 테두리 안에). PhotoToolBar 는 넘칠 때 도구 칸 단위로 멈춤. SectionSettings 배경 색은 한 줄 8색(서식 패널 색과 같은 지름). TextFormatPanel 굵기 칸은 칸마다 자기 굵기(SegmentedControl item weight). 새 글리프 FocusGlyph. 선택 prop: Button steady(꺼져도 크기 그대로 · 옅은 회색 — ConfirmRow · StudioBar 완료에 사용), Skeleton sheen(움직임 줄이기에서도 빛 띠를 그림 — AssetGrid 만드는 중 칸), Chip · ChipGroup item cost(칩 안 마름모 비용).
