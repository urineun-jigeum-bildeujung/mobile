// 앱과 웹뷰 안의 웹이 주고받는 신호. 웹 저장소의 `shared/lib/native-bridge`와 이름을 맞춘다.
//
// 앱 → 웹은 `injectJavaScript`로 window 이벤트를 쏘고, 웹 → 앱은 `window.ReactNativeWebView.postMessage`로
// JSON 문자열을 보낸다. 한쪽만 바꾸면 신호가 조용히 사라진다.

/** 앱이 웹에 보내는 window 이벤트 */
export const WEB_EVENT = {
  /** FCM 토큰. `detail`은 토큰 문자열. 웹이 로그인 세션으로 서버에 등록한다 */
  pushToken: 'golaju:push-token',
  /** 알림 권한을 거부해 토큰을 못 받았다 */
  pushDenied: 'golaju:push-denied',
  /** 앱이 열려 있을 때 푸시가 왔다. 웹이 알림 목록을 다시 받아 토스트와 종의 점을 갱신한다 */
  pushReceived: 'golaju:push-received',
} as const;

/** 웹이 앱에 보내는 메시지의 `type` */
export const WEB_MESSAGE = {
  /** 설정에서 알림을 켰다(또는 켜 둔 채 다시 열었다). 권한을 묻고 토큰을 돌려 달라 */
  requestPushToken: 'golaju:request-push-token',
} as const;

type WebEventName = (typeof WEB_EVENT)[keyof typeof WEB_EVENT];

/**
 * `WebView.injectJavaScript`에 넘길 스크립트를 만든다.
 * 끝의 `true`는 react-native-webview가 요구한다 — 없으면 iOS에서 경고가 난다.
 */
export function toWebEventScript(name: WebEventName, detail: string | null = null): string {
  return `window.dispatchEvent(new CustomEvent(${JSON.stringify(name)}, { detail: ${JSON.stringify(detail)} })); true;`;
}

/**
 * 웹이 문서를 읽기 전에 실행할 스크립트. 이 앱이 푸시를 받을 수 있는지 알려 준다.
 * 설정 화면이 그리기 전에 알아야 스위치를 잠글지 정할 수 있어 이벤트가 아니라 전역 값으로 둔다.
 */
export function toNativeInfoScript(pushSupported: boolean): string {
  return `window.golajuNative = ${JSON.stringify({ pushSupported })}; true;`;
}

/** 웹이 보낸 메시지를 읽는다. 우리 형식이 아니면 `null` */
export function parseWebMessage(raw: string): { type: string } | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && 'type' in parsed) {
      const { type } = parsed as { type: unknown };
      return typeof type === 'string' ? { type } : null;
    }
  } catch {
    // JSON이 아니면 우리 메시지가 아니다
  }
  return null;
}
