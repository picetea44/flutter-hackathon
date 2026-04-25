## 1. 프로젝트 개요

* **이름:** King's Twit (킹즈 트윗)
* **슬로건:** "왕의 한마디를 데이터로 동결건조하다."
* **목적:** 트럼프 2기 행정부의 비정형 데이터를 실시간 수집·분석하여 **주식 시장 예상 상승률(%)**을 도출하고 트럼프 페르소나와 대화하는 지능형 백엔드 시스템.

## 2. 기술 스택 (The Tech Stack)

* **Core:** Java 17 / Spring Boot 3.x
* **AI:** **Spring AI (Google Gemini 1.5 Flash/Pro)**
* **Scraper:** Jsoup (알자지라, 슈피겔 등 다국적 외신 RSS 및 기사)
* **Database:** MySQL 8.0 (Docker 기반 환경 분리)
* **Tool:** Springdoc-openapi (Swagger UI)

## 3. 핵심 기능 (The Core Features)

### ① 하베스터 (The Harvester - 1시간 자동 수집)

* **기능:** `@Scheduled(cron = "0 0 * * * *")`를 통해 매 정시마다 외신 크롤링 실행.
* **소스:** 중동(Al Jazeera), 유럽(Spiegel) 등 트럼프 행보를 객관적으로 분석하는 다국적 언론사.
* **동작:** 새로운 기사가 발견될 경우에만 분석 파이프라인으로 데이터 전달.

### ② 프로즌 엔진 (The Frozen Engine - AI 분석)

* **기능:** Gemini를 통해 수집된 텍스트에서 **공격성(Aggression)**과 **거래성(Transactionalism)** 수치 추출.
* **동결건조:** 비정형 뉴스를 JSON 형태의 정형 데이터로 변환하여 DB 적재.

### ③ 오라클 (The Oracle - 주가 상승률 예측)

* **기능:** 과거 데이터와 현재 발언의 맥락을 결합하여 **향후 7일간의 예상 상승률(%)** 도출.
* **수식:** $Expected\ Growth\ Rate = f(\text{Persona Analysis, Historical Context, Market Sentiment})$.
* **기록:** `PredictionHistory` 테이블에 시간대별 예측치를 누적하여 트렌드 데이터 생성.

### ④ 킹즈 톡 (The King's Talk - 페르소나 채팅)

* **기능:** 트럼프 특유의 화법(최상급, 반복, 제3자 인용)을 적용한 AI 챗봇.
* **특징:** 본인의 정책이 가져올 경제적 이득(예상 수익률)을 자랑하며 답변하는 스타일.

---

## 4. 데이터베이스 및 환경 전략

| 구분      | 환경 (Profile) | ddl-auto      | 특징                                 |
|:--------|:-------------|:--------------|:-----------------------------------|
| **개발**  | `local`      | `update`      | Docker MySQL 연동, 실시간 스케줄러 테스트      |
| **테스트** | `test`       | `create-drop` | H2 In-Memory 사용, JUnit5 비즈니스 로직 검증 |
| **운영**  | `prod`       | `validate`    | Flyway 기반 스키마 관리, 데이터 무결성 최우선      |

---

## 5. 상세 데이터 엔티티 (Data Model)

1. **Statement (발언 데이터):** 원문, 출처, 공격성 지수, 거래주의 지수, 핵심 키워드.
2. **PredictionHistory (예측 이력):** 예측 시간, 예측 상승률(%), 대상 지수(S&P 500, NASDAQ 등).
3. **MarketData (시장 실제 지표):** 실제 주가, 변동률 (예측 정확도 교차 검증용).
