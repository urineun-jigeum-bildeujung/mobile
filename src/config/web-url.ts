// WebView가 불러올 웹 서비스 주소를 실행 환경에 맞게 결정한다

import { Platform } from 'react-native';

const DEV_PORT = 3000;

// Android 에뮬레이터는 호스트 PC의 localhost를 10.0.2.2로 접근한다.
// iOS 시뮬레이터는 호스트와 localhost를 공유한다.
const DEV_HOST = Platform.select({
  android: '10.0.2.2',
  default: 'localhost',
});

/**
 * 배포 환경에서는 EXPO_PUBLIC_WEB_URL을 지정한다.
 * 값이 없으면 로컬 개발 서버를 바라본다.
 */
export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? `http://${DEV_HOST}:${DEV_PORT}`;
