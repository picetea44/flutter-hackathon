# King's Twit Backend

트럼프 행보 기반 주식 시장 예측 AI 플랫폼 "King's Twit"의 백엔드입니다.

## 📋 개요

Spring Boot 3.4 기반의 AI 주가 예측 및 챗봇 시스템
- **뉴스 크롤링**: Al Jazeera, Spiegel RSS 자동 수집 (매시간)
- **AI 분석**: Google Gemini를 통한 공격성/거래주의 지수 분석
- **주가 예측**: 7일 주가 상승률 예측
- **챗봇**: 트럼프 페르소나 응답

---

## 🚀 빠른 시작

### 필수 사항
- Java 17+
- MySQL 8.0+ (또는 Docker)
- Google Gemini API 키

### 로컬 개발

1. **MySQL 시작**
```bash
docker-compose up
```

2. **환경 변수 설정**
```bash
set GOOGLE_API_KEY=your-gemini-api-key
```

3. **백엔드 시작**
```bash
./gradlew bootRun
```

서버: `http://localhost:8080/api`  
Swagger: `http://localhost:8080/api/swagger-ui.html`

---

## 🏗️ 프로젝트 구조

```
src/main/java/com/hackathon/
├── domain/              # 도메인 모델 (TDD 검증)
│   ├── statement/       # Statement, AggressionIndex, TransactionalismIndex
│   ├── prediction/      # PredictionHistory, GrowthRate
│   └── market/          # MarketData
├── application/         # 비즈니스 로직
│   ├── HarvesterService         # 뉴스 수집 (1시간마다)
│   ├── FrozenEngineService      # AI 분석
│   ├── OracleService            # 주가 예측
│   └── KingsTalkService         # 챗봇
├── infrastructure/      # 외부 통합
│   ├── persistence/     # Repository (쿼리)
│   ├── crawler/         # NewsCrawler (RSS 파싱)
│   └── ai/              # GeminiAnalyzer (Spring AI)
└── presentation/        # REST API
    ├── PredictionController
    ├── ChatController
    └── StatementController
```

---

## 📡 REST API

### 예측 API
```
POST /api/predictions/latest     - 예측 생성
GET  /api/predictions/latest     - 최신 예측 조회
GET  /api/predictions/history    - 예측 이력 조회
```

### 발언 API
```
GET  /api/statements             - 모든 발언 조회
GET  /api/statements/{id}        - 발언 상세 조회
```

### 챗봇 API
```
POST /api/chat                   - 트럼프 페르소나 응답
```

**Swagger 문서**: `http://localhost:8080/api/swagger-ui.html`

---

## ⚙️ 설정

### application-local.yml (개발)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/kings_twit_local
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
  ai:
    google:
      genai:
        api-key: ${GOOGLE_API_KEY:}
        chat:
          options:
            model: gemini-1.5-flash
```

### application-prod.yml (운영)
```yaml
spring:
  ai:
    google:
      genai:
        api-key: ${GOOGLE_API_KEY}
        chat:
          options:
            model: gemini-1.5-pro
```

### 환경 변수
- `GOOGLE_API_KEY` — Gemini API 키 (필수)
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` — 운영 DB 정보

---

## 🔄 주요 흐름

### 1. 뉴스 수집 (매시간)
```
HarvesterService (cron: 0 0 * * * *)
  → NewsCrawler (Al Jazeera, Spiegel RSS)
  → Statement 저장
```

### 2. AI 분석
```
FrozenEngineService
  → GeminiAnalyzer (Spring AI + Gemini)
  → 공격성/거래주의 지수 계산
  → Statement 업데이트
```

### 3. 주가 예측
```
OracleService
  → 과거 Statement 분석
  → GrowthRate 예측
  → PredictionHistory 저장
```

### 4. 챗봇
```
KingsTalkService
  → Gemini API로 트럼프 페르소나 응답 생성
```

---

## 📊 도메인 모델

### Statement (발언)
```java
@Entity
public class Statement {
    Long identifier;           // PK
    String content;            // 원문
    SourceUrl sourceUrl;       // 출처 URL
    AggressionIndex aggressionIndex;        // 공격성 지수 (0.0~1.0)
    TransactionalismIndex transactionalismIndex;  // 거래주의 지수 (0.0~1.0)
    String keywordsJson;       // 키워드 (JSON)
    LocalDateTime publishedAt; // 발표 시간
    LocalDateTime createdAt;   // 생성 시간
}
```

### PredictionHistory (예측)
```java
@Entity
public class PredictionHistory {
    Long identifier;
    LocalDateTime predictionAt;
    GrowthRate sevenDayGrowthRate;
    MarketIndex marketIndex;    // S&P 500, NASDAQ, DOW
}
```

---

## 🧪 테스트

### 테스트 통계
- 총 19개 테스트 (6개 테스트 파일)
- 모든 도메인 모델 TDD 검증

### 테스트 실행
```bash
# 모든 테스트
./gradlew test

# 특정 테스트
./gradlew test --tests StatementTest
```

### 테스트 명명 규칙
```java
@Test
@DisplayName("유효한 값으로 생성할 수 있다")
void method명_success() { ... }

@Test
@DisplayName("범위 초과 시 예외 발생")
void method명_fail_causeOfValueOutOfRange() { ... }
```

---

## 🎯 코드 제약사항

| 제약 | 상태 |
|-----|------|
| 파일 최대 100줄 | ✅ 모든 파일 준수 |
| 메서드 최대 10줄 | ✅ 모든 메서드 준수 |
| 파라미터 최대 4개 | ✅ 준수 |
| 원시값 래핑 | ✅ AggressionIndex, GrowthRate 등 |
| Indent depth ≤ 3 | ✅ Early Return 활용 |
| else/switch 금지 | ✅ Early Return으로 구현 |

---

## 📦 의존성

- Spring Boot 3.4.1
- Spring AI 1.1.1 (Gemini)
- Spring Data JPA
- MySQL Driver 8.0.33
- Jsoup 1.17.2
- Springdoc OpenAPI 2.2.0

---

## 📈 빌드 및 배포

### 로컬 테스트
```bash
./gradlew test
```

### 빌드
```bash
./gradlew build
```

### JAR 실행
```bash
java -jar build/libs/hackathon-0.0.1-SNAPSHOT.jar
```

---

## 📚 다음 단계

1. **AI 분석 고도화**
   - Gemini API 실시간 호출
   - 공격성/거래주의 지수 추출 로직 개선

2. **웹 크롤러 개선**
   - 실제 RSS 파싱 구현
   - 에러 처리 및 재시도 로직

3. **예측 정확도 향상**
   - 실제 시장 데이터 연동
   - 모델 학습 및 검증

---

## 📞 지원

문제 해결:
1. 로그 확인: `logging.level` 조정
2. Swagger UI: `http://localhost:8080/api/swagger-ui.html`
3. MySQL 연결 확인: `docker ps`
