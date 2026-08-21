// Android 하드웨어 뒤로가기를 WebView 히스토리 이동으로 연결한다

import { type RefObject, useEffect, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import type WebView from 'react-native-webview';

/**
 * 반환된 함수를 WebView의 onNavigationStateChange에서 호출해
 * 현재 뒤로 갈 수 있는지를 알려준다.
 *
 * 히스토리가 없으면 false를 반환해 기본 동작(앱 종료)에 맡긴다.
 */
export function useWebViewBack(webViewRef: RefObject<WebView | null>) {
  const canGoBackRef = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBackRef.current) return false;

      webViewRef.current?.goBack();
      return true;
    });

    return () => subscription.remove();
  }, [webViewRef]);

  return (canGoBack: boolean) => {
    canGoBackRef.current = canGoBack;
  };
}
