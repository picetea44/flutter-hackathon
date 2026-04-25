# Hackathon Project

Spring Boot + React 기반 풀스택 프로젝트입니다.

## 프로젝트 구조

```
.
├── backend/                 # Spring Boot 백엔드
│   ├── src/main/java/      # 소스 코드
│   │   └── com/hackathon/
│   │       ├── domain/      # 도메인 엔티티
│   │       ├── application/ # 비즈니스 로직 (서비스)
│   │       ├── presentation/# 컨트롤러/API
│   │       ├── infrastructure/ # 저장소/외부 통합
│   │       └── config/      # 설정
│   ├── src/test/java/      # 테스트 코드
│   ├── build.gradle        # Gradle 설정
│   └── application.yml      # Spring 설정
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── components/      # React 컴포넌트 (50줄 이내)
│   │   ├── hooks/           # Custom Hooks (비즈니스 로직)
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── utils/           # 유틸리티 함수
│   │   └── styles/          # 스타일
│   ├── package.json         # npm 설정
│   └── vite.config.js       # Vite 설정
└── README.md
```

## 코드 제약사항

CLAUDE.md 참조:
- 파일: 최대 100줄
- 함수/메서드: 최대 10줄 (Java)
- 파라미터: 최대 4개
- 원시값/문자열은 객체로 래핑
- Java: Indent Depth 1, Early Return, TDD 검증
- React: 컴포넌트 50줄 이내, 로직과 표현 분리

## 실행 방법

### 백엔드
```bash
cd backend
./gradlew bootRun
```
서버는 `http://localhost:8080/api`에서 실행됩니다.

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
```
앱은 `http://localhost:3000`에서 실행됩니다.

## 테스트

### 백엔드
```bash
cd backend
./gradlew test
```

### 프론트엔드
```bash
cd frontend
npm test
```
