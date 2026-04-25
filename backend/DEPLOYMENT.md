# King's Twit Backend - Docker 배포 가이드

## 📋 개요

Docker 기반 King's Twit 백엔드 배포 설정입니다.
- 백엔드 애플리케이션 (Spring Boot)
- MySQL 8.0 데이터베이스
- .env 파일 기반 환경 변수 관리

---

## 🚀 빠른 시작

### 1. 환경 변수 설정

`.env` 파일 생성:
```bash
cp .env.example .env
```

`.env` 수정:
```env
# 필수: Google Gemini API 키
GOOGLE_API_KEY=your-gemini-api-key-here

# 필수: 운영 DB 비밀번호 (보안: 충분히 복잡하게)
KINGSTWIT_DB_PASSWORD=YourSecurePassword123!

# 선택: 다른 설정 (기본값 사용 가능)
KINGSTWIT_DB_USER=kingstwit_user
KINGSTWIT_DB_NAME=kings_twit_prod
SPRING_PROFILES_ACTIVE=prod
```

### 2. Docker 이미지 빌드 및 시작

```bash
# 이미지 빌드 및 컨테이너 시작
docker-compose -f docker-compose.kingstwit.yml up -d

# 로그 확인
docker-compose -f docker-compose.kingstwit.yml logs -f kingstwit-backend
```

### 3. 상태 확인

```bash
# 실행 중인 컨테이너 확인
docker-compose -f docker-compose.kingstwit.yml ps

# 백엔드 헬스 체크
curl http://localhost:8080/api/actuator/health
```

---

## 📦 서비스 구조

### kingstwit-mysql
- **이미지**: MySQL 8.0
- **포트**: 3306
- **데이터**: kingstwit-mysql-data 볼륨
- **상태**: Health check 포함

### kingstwit-backend
- **이미지**: 멀티스테이지 빌드 (Alpine 기반)
- **포트**: 8080
- **프로필**: prod (운영)
- **의존성**: kingstwit-mysql 서비스 대기

---

## 🔧 환경 변수 설명

### 필수 변수

| 변수 | 설명 | 예시 |
|-----|------|------|
| `GOOGLE_API_KEY` | Gemini API 키 | `AIza...` |

### 데이터베이스 설정

| 변수 | 기본값 | 설명 |
|-----|--------|------|
| `KINGSTWIT_DB_HOST` | `kingstwit-mysql` | DB 호스트명 |
| `KINGSTWIT_DB_PORT` | `3306` | DB 포트 |
| `KINGSTWIT_DB_NAME` | `kings_twit_prod` | 데이터베이스명 |
| `KINGSTWIT_DB_USER` | `kingstwit_user` | DB 사용자 |
| `KINGSTWIT_DB_PASSWORD` | ❌ 필수 | DB 비밀번호 |

### 애플리케이션 설정

| 변수 | 기본값 | 설명 |
|-----|--------|------|
| `SPRING_PROFILES_ACTIVE` | `prod` | Spring 프로필 |
| `APP_ENV` | `production` | 환경 표시 |

---

## 🐳 Docker 명령어

### 시작/중지

```bash
# 시작 (백그라운드)
docker-compose -f docker-compose.kingstwit.yml up -d

# 종료 및 컨테이너 제거
docker-compose -f docker-compose.kingstwit.yml down

# 종료 (볼륨 유지)
docker-compose -f docker-compose.kingstwit.yml stop
```

### 로그 조회

```bash
# 백엔드 로그 (실시간)
docker-compose -f docker-compose.kingstwit.yml logs -f kingstwit-backend

# DB 로그
docker-compose -f docker-compose.kingstwit.yml logs -f kingstwit-mysql

# 최근 100줄
docker-compose -f docker-compose.kingstwit.yml logs --tail 100 kingstwit-backend
```

### 상태 확인

```bash
# 실행 중인 컨테이너
docker-compose -f docker-compose.kingstwit.yml ps

# 이미지 목록
docker images | grep kingstwit

# 볼륨 확인
docker volume ls | grep kingstwit
```

### 재빌드

```bash
# 이미지 재빌드 (캐시 무시)
docker-compose -f docker-compose.kingstwit.yml build --no-cache

# 재시작
docker-compose -f docker-compose.kingstwit.yml up -d
```

---

## 📝 데이터베이스 초기화

### 첫 실행 시

1. `kingstwit-mysql` 컨테이너가 자동으로:
   - 데이터베이스 생성
   - 사용자 생성 및 권한 부여
   
2. `kingstwit-backend` 컨테이너가:
   - 스키마 자동 검증 (`ddl-auto: validate`)
   - 필수 테이블 확인

### 데이터 초기화

```bash
# MySQL 접속
docker exec -it kingstwit-mysql mysql -u root -p

# 데이터 확인
mysql> SELECT * FROM kings_twit_prod.statements;

# 데이터 삭제 (주의!)
mysql> DELETE FROM kings_twit_prod.statements;
```

---

## 🔐 보안 설정

### 권장사항

1. **.env 파일**
   - 절대 Git에 커밋하지 마세요
   - `.gitignore`에 추가
   - 운영 환경에서 파일 권한 600 설정

2. **데이터베이스 비밀번호**
   - 복잡한 비밀번호 사용 (대문자, 숫자, 특수문자)
   - 정기적으로 변경

3. **Gemini API 키**
   - 노출되지 않도록 주의
   - 주기적으로 키 로테이션

### 운영 체크리스트

```bash
# .env 파일 권한 설정
chmod 600 .env

# Git 확인
grep -i password .git/config .gitignore

# 컨테이너 보안 업데이트
docker pull mysql:8.0
docker pull eclipse-temurin:17-jre-alpine
```

---

## 🩺 헬스 체크 & 모니터링

### 애플리케이션 상태

```bash
# 헬스 체크
curl http://localhost:8080/api/actuator/health

# 활성 프로필 확인
curl http://localhost:8080/api/actuator/env | grep ACTIVE

# API 문서
http://localhost:8080/api/swagger-ui.html
```

### 컨테이너 상태

```bash
# 리소스 사용량
docker stats

# 컨테이너 상세 정보
docker inspect kingstwit-backend

# 네트워크 테스트
docker exec kingstwit-backend curl http://kingstwit-mysql:3306
```

---

## 📊 로그 레벨 조정

`application-prod.yml`에서 필요시 조정:

```yaml
logging:
  level:
    root: INFO           # WARNING, INFO, DEBUG
    com.hackathon: DEBUG # 애플리케이션 로그 레벨
```

변경 후 재시작:
```bash
docker-compose -f docker-compose.kingstwit.yml restart kingstwit-backend
```

---

## 🚨 트러블슈팅

### 백엔드 시작 실패

```bash
# 로그 확인
docker-compose -f docker-compose.kingstwit.yml logs kingstwit-backend

# 일반적 원인:
# 1. GOOGLE_API_KEY 누락 → .env 확인
# 2. DB 연결 실패 → MySQL 상태 확인
# 3. 포트 충돌 → 8080 포트 사용 여부 확인
```

### 데이터베이스 연결 실패

```bash
# MySQL 상태 확인
docker-compose -f docker-compose.kingstwit.yml logs kingstwit-mysql

# 컨테이너 재시작
docker-compose -f docker-compose.kingstwit.yml restart kingstwit-mysql

# 볼륨 재설정 (데이터 손실!)
docker-compose -f docker-compose.kingstwit.yml down -v
docker-compose -f docker-compose.kingstwit.yml up -d
```

### 포트 충돌

```bash
# 포트 사용 확인 (Windows)
netstat -ano | findstr :8080

# 포트 사용 확인 (Linux/Mac)
lsof -i :8080

# docker-compose.kingstwit.yml에서 포트 변경:
# ports:
#   - "8081:8080"  # 호스트:컨테이너
```

---

## 📦 이미지 최적화

현재 Dockerfile은 멀티스테이지 빌드로 최적화됨:

1. **Builder 스테이지**
   - 전체 JDK 사용
   - Gradle 빌드 실행
   - 빌드 캐시 활용

2. **Runtime 스테이지**
   - JRE만 포함 (경량)
   - 최종 이미지 크기 ~350MB

---

## 🔄 업데이트 배포

새 버전 배포:

```bash
# 1. 코드 변경
git pull origin main

# 2. 이미지 재빌드
docker-compose -f docker-compose.kingstwit.yml build --no-cache

# 3. 컨테이너 재시작
docker-compose -f docker-compose.kingstwit.yml up -d

# 4. 상태 확인
docker-compose -f docker-compose.kingstwit.yml ps
curl http://localhost:8080/api/actuator/health
```

---

## 📞 지원

문제 발생 시:
1. 로그 확인: `docker-compose ... logs kingstwit-backend`
2. 포트/네트워크 확인: `docker inspect kingstwit-backend`
3. 환경 변수 확인: `docker exec kingstwit-backend env | grep -i google`
