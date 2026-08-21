// ESLint 설정. Expo 기본 규칙만 쓰고 포맷은 Prettier가 담당한다.

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'android/*', 'ios/*', '.expo/*'],
  },
]);
