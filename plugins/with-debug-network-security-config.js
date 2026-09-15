// 디버그 빌드에서만 사용자 설치 CA를 신뢰하도록 Network Security Config를 넣는 config plugin

const fs = require('node:fs/promises');
const path = require('node:path');

const { AndroidConfig, withAndroidManifest, withDangerousMod } = require('expo/config-plugins');

const RESOURCE_NAME = 'network_security_config';

// Android 7.0(API 24)부터 앱은 사용자가 기기에 직접 깐 CA를 신뢰하지 않는다. 이 앱은 minSdk가 24라
// 대상 기기 전부가 해당하고, 그래서 Burp 같은 프록시의 CA를 깔아도 HTTPS가 핸드셰이크에서 끊긴다.
//
// <debug-overrides>는 android:debuggable="true"인 빌드에서만 적용된다. 릴리스 빌드는 이 파일을
// 참조하더라도 블록을 통째로 무시하고 시스템 CA만 신뢰하는 기본 동작 그대로다.
// https://developer.android.com/privacy-and-security/security-config#TrustingDebugCa
const RESOURCE_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <debug-overrides>
    <trust-anchors>
      <certificates src="system" />
      <certificates src="user" />
    </trust-anchors>
  </debug-overrides>
</network-security-config>
`;

/** res/xml/network_security_config.xml을 만든다 */
function withResourceFile(config) {
  return withDangerousMod(config, [
    'android',
    async (androidConfig) => {
      const resourceFolder = await AndroidConfig.Paths.getResourceFolderAsync(
        androidConfig.modRequest.projectRoot,
      );
      const xmlFolder = path.join(resourceFolder, 'xml');

      await fs.mkdir(xmlFolder, { recursive: true });
      await fs.writeFile(path.join(xmlFolder, `${RESOURCE_NAME}.xml`), RESOURCE_CONTENT, 'utf8');

      return androidConfig;
    },
  ]);
}

/** <application>이 위 파일을 바라보게 한다 */
function withManifestAttribute(config) {
  return withAndroidManifest(config, (androidConfig) => {
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(androidConfig.modResults);

    application.$['android:networkSecurityConfig'] = `@xml/${RESOURCE_NAME}`;

    return androidConfig;
  });
}

module.exports = function withDebugNetworkSecurityConfig(config) {
  return withManifestAttribute(withResourceFile(config));
};
