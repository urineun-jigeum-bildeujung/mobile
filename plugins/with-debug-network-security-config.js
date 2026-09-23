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
const DEBUG_OVERRIDES = `  <debug-overrides>
    <trust-anchors>
      <certificates src="system" />
      <certificates src="user" />
    </trust-anchors>
  </debug-overrides>`;

/** 릴리스가 쓰는 파일(main). 평문 HTTP는 targetSdk 28 이상 기본값대로 막힌다 */
const RESOURCE_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
${DEBUG_OVERRIDES}
</network-security-config>
`;

// 매니페스트에 networkSecurityConfig가 걸리면 Android는 usesCleartextTraffic을 무시하고 이 파일만 본다.
// RN 디버그 매니페스트가 넣는 usesCleartextTraffic="true"가 소용없어져 Metro(http://10.0.2.2)와 로컬 웹이
// 막혔다(#12). 그래서 디버그 소스셋에만 평문을 허용한 같은 이름의 파일을 두고, 리소스 병합에서 debug가
// main을 덮게 한다. 릴리스는 위 파일 그대로다.
const DEBUG_RESOURCE_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="true" />
${DEBUG_OVERRIDES}
</network-security-config>
`;

/** main과 debug 소스셋에 res/xml/network_security_config.xml을 만든다 */
function withResourceFile(config) {
  return withDangerousMod(config, [
    'android',
    async (androidConfig) => {
      const { projectRoot, platformProjectRoot } = androidConfig.modRequest;
      const mainXmlFolder = path.join(
        await AndroidConfig.Paths.getResourceFolderAsync(projectRoot),
        'xml',
      );
      const debugXmlFolder = path.join(platformProjectRoot, 'app', 'src', 'debug', 'res', 'xml');

      for (const [folder, content] of [
        [mainXmlFolder, RESOURCE_CONTENT],
        [debugXmlFolder, DEBUG_RESOURCE_CONTENT],
      ]) {
        await fs.mkdir(folder, { recursive: true });
        await fs.writeFile(path.join(folder, `${RESOURCE_NAME}.xml`), content, 'utf8');
      }

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
