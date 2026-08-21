# 골라주개냥 Mobile

골라주개냥 웹 서비스를 WebView로 감싼 모바일 앱이다. 화면은 웹([web](https://github.com/urineun-jigeum-bildeujung/web))이 그리고, 이 저장소는 그것을 앱으로 실어 나른다.

## 실행

```bash
npm install
npm start
```

Metro 번들러가 뜨면 `a`(Android) 또는 `i`(iOS, macOS만)를 누른다.

네이티브 빌드까지 한 번에 하려면 아래를 쓴다. `android/`·`ios/` 폴더가 없으면 자동으로 생성된다.

```bash
npx expo run:android
```

## 접속 주소

WebView가 불러올 주소는 `EXPO_PUBLIC_WEB_URL`로 정한다. 값이 없으면 로컬 개발 서버를 바라본다.

| 실행 환경 | 기본 주소 |
| --- | --- |
| Android 에뮬레이터 | `http://10.0.2.2:3000` |
| iOS 시뮬레이터 | `http://localhost:3000` |

**에뮬레이터에서 `localhost`는 에뮬레이터 자신을 가리킨다.** Android가 `10.0.2.2`를 쓰는 이유다. 실기기로 확인할 때는 호스트 PC의 LAN IP를 `.env.local`에 넣는다.

```bash
cp .env.example .env.local
```

## 사전 준비

### Android (Windows·macOS)

Android Studio를 설치하고 환경 변수 두 개를 잡는다. Windows 기준 경로는 아래와 같다.

| 변수 | 값 |
| --- | --- |
| `JAVA_HOME` | `C:\Program Files\Android\Android Studio\jbr` |
| `ANDROID_HOME` | `%LOCALAPPDATA%\Android\Sdk` |

`ANDROID_HOME`의 `platform-tools`를 `PATH`에 추가한다.

### iOS (macOS만)

Xcode와 CocoaPods가 필요하다. Windows에서는 로컬 빌드가 불가능하다.

## 네이티브 폴더

`android/`·`ios/`는 **커밋하지 않는다.** Expo의 CNG(Continuous Native Generation) 방식이라 `app.json`을 기준으로 매번 생성한다. 네이티브 설정을 바꿔야 하면 폴더를 직접 고치는 대신 `app.json`이나 config plugin으로 옮긴다. 직접 고친 내용은 다음 prebuild에서 사라진다.

```bash
npx expo prebuild --clean
```

## 구조

| 경로 | 역할 |
| --- | --- |
| `App.tsx` | WebView 화면 |
| `src/config/web-url.ts` | 접속할 웹 주소 결정 |
| `src/hooks/use-webview-back.ts` | Android 하드웨어 뒤로가기 처리 |
