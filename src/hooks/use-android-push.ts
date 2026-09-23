// 안드로이드에서 웹의 요청을 받아 FCM 토큰을 넘기고, 앱이 열려 있을 때 온 푸시를 웹에 알린다

import * as Notifications from 'expo-notifications';
import { type RefObject, useEffect } from 'react';
import { Platform } from 'react-native';
import type WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';

import { parseWebMessage, toWebEventScript, WEB_EVENT, WEB_MESSAGE } from '../lib/web-event';

// iOS는 APNs가 유료 개발자 계정에 묶여 있어 토큰을 받지 않는다. 웹의 폴링으로만 받는다
export const PUSH_SUPPORTED = Platform.OS === 'android';

// 앱이 열려 있을 때 온 푸시는 OS 배너 없이 웹에만 알린다. 토스트와 종의 점은 웹이 그린다.
// 앱이 백그라운드거나 꺼져 있으면 이 핸들러를 거치지 않고 OS가 알림을 띄운다.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/** 권한을 묻고 토큰을 받는다. 거부했으면 `null` */
async function fetchPushToken(): Promise<string | null> {
  // Android 13부터는 채널이 하나 있어야 알림 권한 프롬프트가 뜬다
  await Notifications.setNotificationChannelAsync('default', {
    name: '알림',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
  const { granted } = await Notifications.requestPermissionsAsync();
  if (!granted) return null;

  const { data } = await Notifications.getDevicePushTokenAsync();
  return data;
}

/**
 * 반환된 함수를 WebView의 onMessage에 건다.
 *
 * 토큰은 앱이 알아서 만들지 않는다. 웹의 설정 스위치가 켜질 때(그리고 켜 둔 채 다시 열 때) 웹이
 * 요청하면 그때 권한을 묻고 돌려준다 — 등록은 로그인 세션을 쥔 웹이 한다.
 * 권한을 거부했거나 Play 서비스가 없는 기기는 토큰을 넘기지 않아 스위치가 켜지지 않는다.
 */
export function useAndroidPush(webViewRef: RefObject<WebView | null>) {
  useEffect(() => {
    if (!PUSH_SUPPORTED) return;

    const subscription = Notifications.addNotificationReceivedListener(() => {
      webViewRef.current?.injectJavaScript(toWebEventScript(WEB_EVENT.pushReceived));
    });
    return () => subscription.remove();
  }, [webViewRef]);

  return (event: WebViewMessageEvent) => {
    if (!PUSH_SUPPORTED) return;
    if (parseWebMessage(event.nativeEvent.data)?.type !== WEB_MESSAGE.requestPushToken) return;

    fetchPushToken()
      .then((token) => {
        webViewRef.current?.injectJavaScript(
          token === null
            ? toWebEventScript(WEB_EVENT.pushDenied)
            : toWebEventScript(WEB_EVENT.pushToken, token),
        );
      })
      .catch((error: unknown) => {
        // 에뮬레이터에 Play 서비스가 없을 때 주로 난다. 웹에는 거부와 같이 알린다
        console.warn('FCM 토큰을 받지 못했다', error);
        webViewRef.current?.injectJavaScript(toWebEventScript(WEB_EVENT.pushDenied));
      });
  };
}
