---
'@ezpg/app-ui': patch
---

상세페이지 스튜디오 3차 마감: 구획 썸네일이 사진이 있으면 사진 가운데를 보여 줌(DetailPart blank — 사진 없는 자리 구분), 구획 시트가 열릴 때 스크롤로 닿을 수 있는 줄 경계만 고르고 내용 높이 변화에 다시 맞춤(sheetEdge reach), 미리보기 카드가 잘린 글 대신 사진 끝 · 글 경계에서 끝남(DraftPreview pageHeight · draftPreviewFit), 흐림 띠 틈 없앰(EdgeFade 겹친 층), 시안 색 목록 DETAIL_TEXT_COLORS · DETAIL_BACKGROUND_COLORS, 제목 판정 detailIsTitle(7단계 이상 또는 굵은 6단계 — 빈 제목 자리 · 구획 추가 그림). 기존 기본값은 그대로.
