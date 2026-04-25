# King's Twit Backend

트럼프 행보 기반 주식 시장 예측 AI 플랫폼 "King's Twit"의 백엔드입니다.

## 프로젝트 구조

```
src/main/java/com/hackathon/
├── domain/          # 도메인 모델 (엔티티, 값 객체)
│   ├── statement/   # 발언 도메인
│   ├── prediction/  # 예측 도메인
│   └── market/      # 시장 데이터 도메인
├── application/     # 비즈니스 로직 (서비스)
├── infrastructure/  # 외부 통합 (Repository, Crawler, AI)
└── presentation/    # REST API (Controller)
```

## API 문서

Swagger UI: `http://localhost:8080/api/swagger-ui.html`

### 예측 API

**최신 예측 생성**
```
POST /api/predictions/latest
```

**최신 예측 조회**
```
GET /api/predictions/latest
```

**예측 이력 조회**
```
GET /api/predictions/history
```

### King's Talk 챗봇 API

**트럼프 페르소나 응답**
```
POST /api/chat
Content-Type: application/json

{
  "message": "경제 정책에 대해 말해줄래?"
}
```

### 발언 조회 API

**모든 발언 조회**
```
GET /api/statements
```

**발언 상세 조회**
```
GET /api/statements/{statementId}
```

## 환경 설정

### 로컬 개발 환경
```bash
docker-compose up
./gradlew bootRun
```

프로필: `local`
- MySQL 연동 (localhost:3306)
- ddl-auto: update (스키마 자동 변경)

### 테스트 환경
```bash
./gradlew test
```

프로필: `test`
- H2 In-Memory DB
- ddl-auto: create-drop

## 스케줄러

### Harvester (1시간마다)
```
@Scheduled(cron = "0 0 * * * *")
```
Al Jazeera, Spiegel 등 국제 뉴스에서 트럼프 관련 기사 자동 수집

## 핵심 기능

1. **The Harvester** — 국제 뉴스 RSS 자동 수집
2. **The Frozen Engine** — Gemini AI로 공격성/거래주의 지수 분석
3. **The Oracle** — 7일 주가 상승률 예측
4. **The King's Talk** — 트럼프 페르소나 챗봇

## 코드 제약사항

- 파일 최대 100줄
- 메서드 최대 10줄
- 파라미터 최대 4개
- 원시값은 전용 객체로 래핑
- Indent depth ≤ 3
- else/switch 금지 (Early Return)
- 모든 엔티티/도메인은 TDD로 검증

## 테스트 실행

```bash
./gradlew test
```

테스트 이름 규칙:
- `method명_success`
- `method명_fail_causeOf설명`
- `@DisplayName`으로 한국어 설명 추가

## 빌드

```bash
./gradlew build
```

## 의존성

- Spring Boot 3.2.0
- Spring AI (Gemini)
- Jsoup (웹 크롤링)
- MySQL 8.0
- Springdoc-openapi (Swagger UI)
