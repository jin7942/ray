# RAY

[![npm version](https://img.shields.io/npm/v/@jin7942/ray?color=blue)](https://www.npmjs.com/package/@jin7942/ray)
[![npm downloads](https://img.shields.io/npm/dm/@jin7942/ray)](https://www.npmjs.com/package/@jin7942/ray)
[![license](https://img.shields.io/npm/l/@jin7942/ray)](./LICENSE)

**ver: 1.4.5**

![rayExample](./ray.png)

**단순하고 가벼운 자동 배포 도구 RAY**

RAY는 GitHub 저장소를 클론하고, 빌드하고, Docker 이미지로 만들어 컨테이너를 무중단으로 교체하는 자동화 배포 도구입니다.  
복잡한 설정 없이, 단 하나의 JSON 파일만으로도 전체 배포 파이프라인을 구성할 수 있습니다.

[README for english](./README.md)

---

## 주요 기능

-   GitHub 저장소 클론
-   Docker 이미지 생성 및 컨테이너 배포
-   기존 컨테이너 무중단 교체
-   JSON 기반 설정 파일
-   CLI 또는 라이브러리 방식 사용 가능

---

## 설치 방법

```bash
npm install -g @jin7942/ray
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

```jsonc
{
    "projects": [
        {
            "name": "my-app",
            "repo": "https://github.com/user/my-app.git",
            "branch": "main",
            //"buildCommand": "npm run build", 더 이상 RAY가 빌드커멘드를 수행하지 않습니다.
            // 도커 파일에서 실행 되도록 변경 되었습니다.
            "docker": {
                "image": "my-app-image",
                "containername": "my-app-container",
                "path": "./Dockerfile",
                "network": ["net1", "net2"], // --network 옵션을 지원합니다.
                "volumes": ["/host/path:/app/path", "/tmp/test:/app/test"] // 도커 컨테이너 볼륨 마운트 지원 추가
            },
            "internal": {
                "logdir": "./logs",
                "maxLogDirSize": 5242880,
                "logLevel": "info",
                "envFilePath": "./.env"
            }
        }
    ]
}
```

## 도커 파일 예시 (`DockerFile`)

```docker
FROM node:22-alpine AS builder

WORKDIR /app
COPY . .

RUN apk update && apk upgrade
RUN npm install
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .

RUN apk add --no-cache git

RUN npm install --omit=dev

EXPOSE 7979

CMD ["node", "dist/server.js"]

```

### 도커파일 내에 빌드 로직을 반드시 포함하여야 합니다. RAY 1.2.0 버전부터는 더 이상 빌드 커맨드가 작동하지 않습니다.

---

## 라이브러리로 사용하기

```ts
import { loadProjectConfig, runRayPipeline } from '@jin7942/ray';

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

## 구현 예제

서버에서 사용 예

## [RAY Auto Deploy Server](https://github.com/jin7942/ray-auto-deploy-server) — webhock 이벤트를 수신하여 자동배포를 수행하는 서버 입니다.

---

## 프로젝트 철학

## Ray는 복잡한 설정 없이 누구나 자동배포를 경험할 수 있도록 설계된 경량형 CI/CD 도구입니다. 특히 배포 경험이 부족한 학생이나 초보 개발자도 쉽게 사용할 수 있도록, 설정은 최소화하고 사용성은 극대화했습니다.

## 릴리즈 히스토리

| 버전   | 날짜       | 설명                                                           |
| ------ | ---------- | -------------------------------------------------------------- |
| v1.0.0 | 2025-04-09 | 첫 정식 릴리즈. 기본 기능 구현 완료                            |
| v1.1.0 | 2025-04-10 | 환경변수 설정 지원                                             |
| v1.2.0 | 2025-04-11 | 컨테이너 외부 로그 저장 지원, Dockerfile 내 빌드 방식으로 전환 |
| v1.3.0 | 2025-04-12 | 이미지 빌드시 네트워크 지정 옵션 지원, Git clone 프로세스 개선 |
| v1.4.0 | 2025-04-12 | 도커 컨테이너 볼륨 마운트 지원 추가.                           |

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
