---
'@zdot/app-ui': minor
---

QuestionPager — 묶음별 넘김 선택 블록. 위에 묶음 띠(같은 폭 한 줄, 높이 controlSize sm, 아래 border 1, 지금 묶음은 title 글자 semibold + primary 2 줄, 다 답한 묶음은 selectForeground 글자 + 체크 iconSize sm, 나머지 mutedForeground, tablist · tab), 아래에 지금 묶음 질문만(질문 이름 body semibold + 보기 2열 타일 높이 controlSize sm · radius lg · surface, 고른 타일은 primaryTint + selectForeground semibold, radiogroup · radio). 고른 보기를 다시 눌러도 해제되지 않음, 이번 선택으로 지금 묶음이 처음 다 채워졌고 마지막 묶음이 아니면 onValueChange 뒤 onActiveGroupChange 로 다음 묶음. QuestionAccordion 은 그대로.
