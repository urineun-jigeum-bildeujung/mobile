# 골라주개냥 Mobile

골라주개냥 웹 서비스를 WebView로 감싼 모바일 앱입니다. 화면은 웹([web](https://github.com/urineun-jigeum-bildeujung/web))이 그리고, 이 저장소는 그것을 앱으로 실어 나릅니다.

## 실행

```bash
npm install
npm start
```

Metro 번들러가 뜨면 `a`(Android) 또는 `i`(iOS, macOS만)를 누릅니다.

네이티브 빌드까지 한 번에 하려면 아래를 씁니다. `android/`·`ios/` 폴더가 없으면 자동으로 생성됩니다.

```bash
npx expo run:android
```

### 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm start` | Metro 번들러 실행 |
| `npm run android` | Android 네이티브 빌드 후 실행 |
| `npm run ios` | iOS 네이티브 빌드 후 실행 (macOS만) |
| `npm run typecheck` | 타입 검사 |
| `npm run lint` | ESLint 검사 |
| `npm run format` | Prettier 포맷 적용 |
| `npm run format:check` | 포맷 위반 확인 (수정 없음) |

## 접속 주소

WebView가 불러올 주소는 `EXPO_PUBLIC_WEB_URL`로 정합니다. 값이 없으면 로컬 개발 서버를 바라봅니다.

| 실행 환경 | 기본 주소 |
| --- | --- |
| Android 에뮬레이터 | `http://10.0.2.2:3000` |
| iOS 시뮬레이터 | `http://localhost:3000` |

**에뮬레이터에서 `localhost`는 에뮬레이터 자신을 가리킵니다.** Android가 `10.0.2.2`를 쓰는 이유입니다. 실기기로 확인할 때는 호스트 PC의 LAN IP를 `.env.local`에 넣습니다.

```bash
cp .env.example .env.local
```

## 사전 준비

### Android (Windows·macOS)

Android Studio를 설치하고 환경 변수 두 개를 잡습니다. Windows 기준 경로는 아래와 같습니다.

| 변수 | 값 |
| --- | --- |
| `JAVA_HOME` | `C:\Program Files\Android\Android Studio\jbr` |
| `ANDROID_HOME` | `%LOCALAPPDATA%\Android\Sdk` |

`ANDROID_HOME`의 `platform-tools`를 `PATH`에 추가합니다.

### iOS (macOS만)

Xcode와 CocoaPods가 필요합니다. Windows에서는 로컬 빌드가 불가능합니다.

### 푸시 알림 (Android)

Android 빌드에는 Firebase의 `google-services.json`이 필요합니다. [Firebase 콘솔](https://console.firebase.google.com/)의 프로젝트 설정에서 Android 앱(패키지 `com.golajugaenyang.app`)을 등록해 내려받고 저장소 루트에 둡니다. `app.json`의 `android.googleServicesFile`이 이 경로를 가리키며, 파일은 git에 넣지 않습니다.

토큰은 앱이 알아서 만들지 않습니다. 웹의 설정에서 알림 스위치를 켜면 웹이 앱에 요청하고, 앱이 권한을 물어 받은 FCM 토큰을 웹에 돌려주면 웹이 로그인 세션으로 서버에 등록합니다. 앱이 열려 있을 때 온 푸시는 OS 배너 대신 웹에 알려 웹이 토스트와 종의 점으로 보여주고, 닫혀 있을 때는 OS 알림이 뜹니다. iOS는 APNs가 유료 개발자 계정에 묶여 있어 토큰을 받지 않고(스위치가 잠깁니다), 웹의 폴링으로만 받습니다.

에뮬레이터는 **Google Play 이미지**여야 토큰이 발급됩니다. Play 서비스가 없으면 토큰을 못 받고 웹이 폴링으로 돌아갑니다.

## 네이티브 폴더

`android/`·`ios/`는 **커밋하지 않습니다.** Expo의 CNG(Continuous Native Generation) 방식이라 `app.json`을 기준으로 매번 생성합니다. 네이티브 설정을 바꿔야 하면 폴더를 직접 고치는 대신 `app.json`이나 config plugin으로 옮깁니다. 직접 고친 내용은 다음 prebuild에서 사라집니다.

```bash
npx expo prebuild --clean
```

## 구조

| 경로 | 역할 |
| --- | --- |
| `App.tsx` | WebView 화면 |
| `src/config/web-url.ts` | 접속할 웹 주소 결정 |
| `src/hooks/use-webview-back.ts` | Android 하드웨어 뒤로가기 처리 |
| `src/hooks/use-android-push.ts` | 웹의 요청에 Android FCM 토큰을 돌려주고, 열려 있을 때 온 푸시를 웹에 알림 |
| `src/lib/web-event.ts` | 앱과 웹이 주고받는 신호 이름과 `injectJavaScript`·`postMessage` 변환 |
| `plugins/with-debug-network-security-config.js` | 디버그 빌드에서만 사용자 설치 CA를 신뢰하게 하는 config plugin |
