# 골라주개냥 Mobile Agent Guide

## 이 저장소의 범위

**웹을 앱으로 실어 나르는 셸입니다.** 화면·비즈니스 로직·API 호출은 전부 [web](https://github.com/urineun-jigeum-bildeujung/web) 저장소가 담당합니다.

여기에 화면을 만들지 마십시오. 앱에 기능이 필요해 보이면 먼저 물어보십시오. 대개는 웹에서 하는 편이 맞고, 이 저장소가 맡아야 하는 것은 **웹이 할 수 없는 일**뿐입니다.

| 여기서 하는 일 | 웹에서 하는 일 |
| --- | --- |
| WebView 셸, 네이티브 권한, 스토어 배포 | 화면, 라우팅, 상태 관리, API 호출 |
| 하드웨어 뒤로가기, safe area, 딥링크 | 디자인 토큰, 접근성, 성능 |

## 행동 지침

web 저장소의 [AGENTS.md](https://github.com/urineun-jigeum-bildeujung/web/blob/dev/AGENTS.md)를 따릅니다. 이 저장소에 특히 중요한 것은 아래입니다.

- **단순함 우선.** 요청받지 않은 기능을 추가하지 마십시오. 화면 하나짜리 앱에 추상화를 세우지 마십시오.
- **한국어 문장은 콜론(:)으로 끝내지 마십시오.** 마침표·물음표·느낌표로 끝냅니다.
- **새 소스 파일 첫 줄에 역할을 설명하는 한국어 주석**을 답니다.
- **커밋은 `유형(#이슈번호): 내용` 형식**이고 한글로 씁니다. AI 표기(`Co-Authored-By`, `Generated with`, 🤖)를 남기지 않습니다.
- 파일·폴더 이름은 kebab-case입니다.

## 네이티브 폴더

`android/`·`ios/`는 `.gitignore` 대상입니다. **직접 고치지 마십시오.** 다음 prebuild에서 사라집니다.

네이티브 설정을 바꿔야 하면 `app.json`에 쓰거나 config plugin을 만듭니다.

## 검증

```bash
npm run typecheck
```

린트·테스트는 아직 없습니다. 화면이 늘어나면 그때 도입합니다.

## 확정되지 않은 것

작업 중 마주치면 임의로 정하지 말고 확인을 받으십시오.

| 항목 | 현재 상태 |
| --- | --- |
| 패키지 ID | `com.golajugaenyang.app`으로 임시 지정. **스토어 등록 후에는 변경 불가**하므로 등록 전에 확정 |
| 배포 웹 주소 | 미정. 로컬 개발 서버를 바라보고 있음 |
| 스토어 계정 | 개인·조직 여부 미정 |
| 앱 아이콘·스플래시 | Expo 기본값. 디자인팀 전달 대기 |

---

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.
