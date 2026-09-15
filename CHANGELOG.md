# 변경 이력

이 저장소에서 무엇이 언제 달라졌는지 기록합니다. **날짜 단위로 쌓고, 각 항목에 이슈 번호를 답니다.**

- 이 문서는 **시간축**을 다룹니다. 저장소가 지금 어떤 상태인지는 [README](./README.md)를 봅니다.
- 릴리스 시점에는 해당 날짜 위에 버전 제목(`## v1.0.0`)을 얹습니다.
- 화면과 기능의 변경 이력은 [web 저장소](https://github.com/urineun-jigeum-bildeujung/web/blob/dev/CHANGELOG.md)에 있습니다. 여기에는 앱 셸의 변화만 남깁니다.

---

## 2026-09-15

### 개발 환경

- 디버그 빌드에서만 사용자가 기기에 설치한 CA를 신뢰하도록 Network Security Config를 넣었다. 사이버보안팀이 Burp로 앱 트래픽을 보려면 필요한데, Android 7.0(API 24)부터는 사용자 CA를 신뢰하지 않아 HTTPS가 핸드셰이크에서 끊겼다. `minSdkVersion`이 24라 대상 기기 전부가 해당한다. `<debug-overrides>`는 `android:debuggable="true"`인 빌드에서만 적용된다. 설정 파일과 매니페스트 참조 자체는 릴리스 산출물에도 들어가지만, 릴리스에는 `debuggable`이 없어 Android가 그 블록을 무시하므로 **사용자 CA 신뢰가 적용되지 않는다** — 릴리스 병합 매니페스트에 `networkSecurityConfig`는 있고 `debuggable`은 없는 것을 빌드로 확인했다. `android/`는 prebuild가 다시 만들어 손으로 고칠 수 없어 config plugin(`plugins/with-debug-network-security-config.js`)으로 넣고 `app.json`에 등록했다. `expo-build-properties`로는 안 된다 — 그 플러그인의 Android 옵션에 `usesCleartextTraffic`은 있어도 `networkSecurityConfig`가 없다 (#9)

## 2026-08-24

### 개발 환경

- 커밋 메시지 어투를 명사형 종결로 맞췄다. web 저장소에서 정한 규칙이고, 두 저장소를 오가며 작업하므로 로그 형식이 갈리지 않게 했다. 규칙 원문은 web의 컨벤션 문서에 두고 여기서는 참조한다 (#7)

### 수정

- `feat(#1):`처럼 본문이 없거나 공백뿐인 커밋 메시지와 PR 제목이 형식 검사를 통과하던 문제 해결 — 커밋 훅의 `.+`가 공백에도 걸렸고, PR 제목 검사는 콜론까지만 봐서 두 곳이 같은 입력에 다른 답을 냈다. 이제 양쪽 다 콜론 뒤에 공백 하나와 비공백 본문을 요구하며, 정규식이 web 저장소와 같아졌다 (#5)

## 2026-08-21

### 추가

- 저장소를 만들고 Expo(SDK 57) 기반 WebView 셸을 올렸다. 웹 주소를 감싸 보여주는 화면 하나가 전부이고, 없으면 앱을 못 쓰는 세 가지를 함께 넣었다 — 상단·하단 safe area, 기기 뒤로가기를 WebView 히스토리로 연결(히스토리가 없으면 앱 종료), 초기 로딩 표시. Android 에뮬레이터(API 37)에서 빌드·설치·실행과 웹 연결까지 확인했다
- 저장소 기본 설정을 갖췄다 — Prettier·ESLint, 커밋 형식을 검사하고 브랜치명의 이슈 번호를 채워 넣는 husky 훅, 이슈·PR 템플릿, CI(typecheck·format·lint), 제목 유형으로 라벨을 붙이는 워크플로우, CodeRabbit 리뷰 설정 (#1)

### 변경

- README를 `~합니다` 체로 바꿔 web 저장소와 문체를 맞췄다. 소개 문서는 읽는 사람을 상정해 존댓말을 쓰고, 이 변경 이력과 규칙 문서는 기록·규정이라 평서체를 유지한다 (#3)

### 개발 환경

- WebView가 로컬 dev 서버에 붙지 못하던 문제를 web 저장소에서 해결했다. Next.js dev 서버가 `localhost` 밖에서 오는 개발용 청크 요청을 403으로 막아, 화면은 그려지는데 하이드레이션이 실패하고 버튼이 하나도 눌리지 않았다. 에뮬레이터가 보는 주소를 허용 출처에 추가했다 ([web#37](https://github.com/urineun-jigeum-bildeujung/web/issues/37))

> 위 두 항목 중 저장소 생성 건에는 이슈 번호가 없습니다. 저장소를 만드는 시점이라 이슈를 먼저 열 수 없었습니다.
