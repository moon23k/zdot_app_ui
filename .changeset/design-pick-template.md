---
'@zdot/app-ui': minor
---

DesignPickTemplate — 디자인 고르기 화면 틀. 위 줄은 topInset 아래 headerHeight 높이에 왼쪽 뒤로 버튼(HeaderIconButton, 선택)과 가운데 안 고르기 칸(높이 controlSize sm · radius full · border 바탕, 고른 칸은 surface + shadow sm 이 미끄러져 이동, label 글자 mutedForeground → title semibold, tablist · tab), 아래는 preview 칸이 화면 끝까지(ScrollView 로 감싸지 않음, 바탕 background). 미리보기 위에 뜬 바(좌우 space 4 · bottomInset + space 2, padding space 2 · radius xl · surface · border 1 · shadow md) 안에 한 줄로 tools(아이콘 위 caption 이름, 너비 space 16 · 높이 controlSize lg · radius lg, 고른 것은 muted 바탕 + semibold, button · selected)와 primaryAction(lg 버튼, 남은 폭), tray 가 있으면 그 줄 위에 border 1 구분선과 함께 표시. tools · tray 가 없으면 primaryAction 만.
