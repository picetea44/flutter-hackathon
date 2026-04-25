# [요구 사항 명세서] 트럼프 동결건조 (Project: Trump Freeze-Dried)

## 1. 프로젝트 개요

* **프로젝트명:** King's Twit
* **목적:** 트럼프 2기 행정부의 비정형 데이터(발언, SNS, 정책)를 정형화(동결건조)하여, 시장 변동성 및 향후 행보를 정밀 예측하는 분석 플랫폼 구축.
* **대상:** 주식 투자자, 지정학 리스크 분석가, 정치 데이터에 관심 있는 일반 사용자.

2. 시스템 아키텍처 (Technical Stack - Updated)
   Frontend: React.js (TypeScript)

상태 관리: Zustand 또는 Redux Toolkit (실시간 데이터 스트리밍 대응)

UI 프레임워크: Tailwind CSS (신속한 대시보드 레이아웃 구축)

Backend: Java Spring Boot 3.x

Database: MySQL 8.0

Infrastructure: Docker (환경 격리 및 로컬 DB 컨테이너화)

3. 데이터베이스 운용 전략 (Multi-Environment Strategy)
   운영 효율성과 데이터 안전성을 위해 Spring Boot의 Profiles 기능을 활용하여 환경을 엄격히 분리합니다.

3.1. 로컬 개발 환경 (local/dev)
DB: 로컬 Docker MySQL 컨테이너.

전략: ddl-auto: update. 개발 중 스키마 변경을 즉각 반영.

특징: 크롤링 테스트 데이터 및 가상 더미 데이터를 자유롭게 적재.

3.2. 테스트 환경 (test)
DB: H2 In-Memory Database 또는 별도의 Test MySQL 스키마.

전략: ddl-auto: create-drop. 테스트 실행 시마다 초기화하여 독립성 보장.

특징: JUnit5를 이용한 API 및 비즈니스 로직 검증 전용.

3.3. 운영 환경 (prod)
DB: 외부 Managed DB (AWS RDS 등) 또는 독립 서버 MySQL.

전략: ddl-auto: validate. 직접적인 스키마 변경 엄격 금지 (Flyway 또는 Liquibase 도입 권장).

특징: 실시간 수집된 트럼프의 실제 발언 및 시장 데이터의 무결성 유지.

4. 주요 기능 요구 사항 (Changes Highlighted)
   4.1. React 기반 실시간 대시보드
   [F3-1R] Component Architecture: React 컴포넌트 기반으로 인덱스 차트, 뉴스 피드, 감성 분석 리포트를 모듈화.

[F3-2R] Fast Refresh: 트럼프의 SNS 포스팅 감지 시, React Query(TanStack Query)를 활용하여 페이지 새로고침 없이 데이터 갱신.

4.2. 환경별 프로퍼티 관리
[F4-1] Spring Profiles: application-local.yml, application-test.yml, application-prod.yml로 DB 접속 정보 및 API Key 관리.

[F4-2] Secrets: 운영 환경의 민감 정보는 환경 변수(.env)로 분리하여 보안 강화.
