# RAY

**ver: 1.0.0**

**단순하고 가벼운 자동 배포 도구 RAY**

RAY는 GitHub 저장소를 클론하고, 빌드하고, Docker 이미지로 만들어 컨테이너를 무중단으로 교체하는 자동화 배포 도구입니다.  
복잡한 설정 없이, 단 하나의 JSON 파일만으로도 전체 배포 파이프라인을 구성할 수 있습니다.

[README for english](./README.md)

---

## 주요 기능

-   GitHub 저장소 클론
-   커스텀 빌드 명령어 실행
-   Docker 이미지 생성 및 컨테이너 배포
-   기존 컨테이너 무중단 교체
-   JSON 기반 설정 파일
-   CLI 또는 라이브러리 방식 사용 가능

---

## 설치 방법

```bash
npm install -g ray
```

---

## 사용법

```bash
ray init               # 기본 설정 파일 생성
ray init wizard        # 설정 마법사 실행
ray run                # 전체 프로젝트 실행
ray run <프로젝트명>     # 특정 프로젝트만 실행
ray help               # 도움말 출력
```

---

## 설정 파일 예시 (`ray.config.json`)

```json
{
    "projects": [
        {
            "name": "my-app",
            "repo": "https://github.com/user/my-app.git",
            "branch": "main",
            "buildCommand": "npm run build",
            "docker": {
                "image": "my-app-image",
                "containername": "my-app-container",
                "path": "./Dockerfile"
            },
            "internal": {
                "logdir": "./logs",
                "maxLogDirSize": 5242880,
                "logLevel": "info"
            }
        }
    ]
}
```

---

## 라이브러리로 사용하기

```ts
import { loadProjectConfig, runRayPipeline } from 'ray';

const config = await loadProjectConfig('my-app');
await runRayPipeline(config);
```

### [document](./DOCUMENT.md)

---

## 시스템 요구 사항

-   Node.js 18 이상
-   Git 설치
-   Docker 설치 및 실행 중

---

## 프로젝트 철학

**배포는 복잡할 필요가 없습니다.**  
RAY는 배포를 가장 단순한 형태로 구성하면서도 필요한 모든 기능을 갖춘 도구입니다.  
당신의 프로젝트를 한 줄로 배포하십시오.

---

## 릴리즈 히스토리

| 버전   | 날짜       | 설명                                      |
| ------ | ---------- | ----------------------------------------- |
| v1.0.0 | 2024-04-09 | 첫 정식 릴리즈. 기본 기능 구현 완료       |
| v1.1.0 | 예정       | 환경변수 설정 지원, 헬스체크 커스터마이징 |

---

## 라이선스

MIT

---

## 기여

본 프로젝트는 오픈소스로 자유롭게 확장/수정이 가능합니다.  
기여, 제안, 피드백은 언제든지 환영합니다.

-   이슈 등록: [GitHub Issues](https://github.com/jin7942/ray/issues)
-   풀 리퀘스트: 자유롭게 생성해주세요

## 프로젝트 링크

-   GitHub 저장소: https://github.com/jin7942/ray
-   이슈 트래커: https://github.com/jin7942/ray/issues
