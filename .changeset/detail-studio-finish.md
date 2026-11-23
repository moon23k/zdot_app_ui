---
'@ezpg/app-ui': patch
---

상세페이지 스튜디오 마감을 승인 시안에 맞춤: StudioSheet 윗모서리 16 · 위로 드리우는 그림자, ConfirmRow 알약 단추(위 여백 20, 비활성 주 단추는 옅은 회색), StudioBar 완료 알약(높이 36), RewriteTray · ImagePrompt 제안 칩을 흰 바탕 테두리 칩(높이 36 · 모서리 8)으로, PhotoToolBar 도구 간격 없앰 · 오른쪽 끝 흐림(가려진 도구가 있을 때만) · 아이콘 24, KeyboardBar · StudioDock · AdjustTiles 아이콘 24, StudioDock · AdjustTiles · SectionBoard 모서리 16, SectionEditTemplate 아래 도구 줄 바닥 흰색, AssetGrid 격자 아래 끝 흐림, SectionSettings 배치 타일 옅은 그림(LayoutPicker variant="soft") · 여백 슬라이더 얇게, TextFormatPanel 슬라이더 얇게. 새 부품 StudioToggle · StudioToggleList(한 번에 다듬기 줄 52 · 그린 스위치). 공용 부품은 기본 모양 그대로 두고 선택 prop 만 추가: Button pill, Slider size="sm", LayoutPicker variant="soft".
