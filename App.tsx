// 웹 서비스를 WebView로 감싸 보여주는 앱 진입 화면

import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { WEB_URL } from './src/config/web-url';
import { PUSH_SUPPORTED, useAndroidPush } from './src/hooks/use-android-push';
import { useWebViewBack } from './src/hooks/use-webview-back';
import { toNativeInfoScript } from './src/lib/web-event';

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const syncCanGoBack = useWebViewBack(webViewRef);
  const handleWebMessage = useAndroidPush(webViewRef);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="auto" />

        <WebView
          ref={webViewRef}
          source={{ uri: WEB_URL }}
          style={styles.webView}
          onNavigationStateChange={(state) => syncCanGoBack(state.canGoBack)}
          onLoadEnd={() => setIsLoading(false)}
          // 웹이 설정 화면을 그리기 전에 이 앱이 푸시를 받을 수 있는지 알아야 한다
          injectedJavaScriptBeforeContentLoaded={toNativeInfoScript(PUSH_SUPPORTED)}
          onMessage={handleWebMessage}
        />

        {isLoading && (
          <View style={[StyleSheet.absoluteFill, styles.loading]}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
