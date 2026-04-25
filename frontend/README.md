# TrumpTalk Frontend

AI 기반 트럼프 행동 예측 및 시장 지능 플랫폼의 프론트엔드

## 📋 개요

React 19 + Vite + Tailwind CSS v4 기반의 현대적 금융 지능 대시보드
- 실시간 주가 예측 시각화
- AI 트럼프 페르소나 챗봇
- 시장 위험도 분석 대시보드
- 반응형 모바일 디자인

---

## 🚀 빠른 시작

### 필수 사항
- Node.js 18+ 
- npm 또는 yarn

### 1단계: 의존성 설치

```bash
npm install
```

### 2단계: 환경 변수 설정

`.env.local` 파일 생성 (프로젝트 루트):

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

**환경 변수 설명:**
- `VITE_API_BASE_URL` - 백엔드 API 주소 (필수)
- `VITE_GEMINI_API_KEY` - Gemini API 키 (선택, 로컬 테스트)

### 3단계: 개발 서버 실행

```bash
npm run dev
```

**접속 주소:**
- Local: `http://localhost:3000`
- Network: `http://YOUR_IP:3000` (같은 네트워크)

---

## 📦 기술 스택

| 기술 | 버전 | 용도 |
|-----|------|------|
| **React** | 19.0.0 | UI 프레임워크 |
| **Vite** | 6.2.0 | 빌드 도구 (번개 같은 HMR) |
| **TypeScript** | 5.8.2 | 타입 안전성 |
| **Tailwind CSS** | 4.1.14 | 유틸리티 스타일 |
| **Motion** | 12.23.24 | 스무스 애니메이션 |
| **Lucide React** | 0.546.0 | 아이콘 라이브러리 |
| **@google/genai** | 1.29.0 | Gemini API 통합 |

---

## 🎨 디자인 시스템

### 브랜드 컬러

```css
--color-brand-primary: #00f0ff;        /* Cyan (주요) */
--color-brand-primary-dim: #00dbe9;    /* Cyan Dark */
--color-brand-secondary: #ff3b30;      /* Red (경고/주의) */
--color-brand-background: #131313;     /* 검은색 배경 */
--color-brand-surface: #201f1f;        /* 카드/패널 */
--color-brand-surface-low: #1c1b1b;    /* 낮은 강조 */
--color-brand-surface-high: #2a2a2a;   /* 높은 강조 */
```

### 폰트

- **Display**: Space Grotesk (제목, 큰 텍스트)
- **Sans**: Inter (본문, UI)
- **Mono**: Space Grotesk (코드)

### 컴포넌트 클래스

```css
.glass-panel {
  /* 반투명 글래스모피즘 패널 */
  @apply bg-white/[0.03] backdrop-blur-xl border border-white/10;
}

.active-border-glow {
  /* 사이안 빛 효과가 있는 보더 */
  @apply border border-brand-primary/50 shadow-[0_0_12px_rgba(0,240,255,0.2)];
}

.inner-glow-top {
  /* 상단 내부 빛 효과 */
  @apply shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)];
}
```

---

## 📂 프로젝트 구조

```
src/
├── App.tsx                 # 메인 애플리케이션 컴포넌트
├── main.tsx               # 엔트리 포인트
├── index.css              # 글로벌 스타일 (Tailwind + 커스텀)
├── components/            # 재사용 UI 컴포넌트 (예정)
├── hooks/                 # React Hooks
│   ├── useLatestPrediction.ts   # 최신 예측 조회
│   ├── useStatements.ts         # 발언 조회
│   └── useTrumpChat.ts          # 챗봇 메시지
├── services/              # API 및 유틸리티
│   ├── api.ts            # API 클라이언트
│   └── types.ts          # TypeScript 타입 정의
└── vite-env.d.ts         # Vite 타입 정의
```

---

## 🎯 주요 기능

### 1. Hero Section (영웅 섹션)
- 최신 예측 시각화
- 신호 배지 (BULLISH/BEARISH/NEUTRAL)
- 변동성 지수 차트

### 2. Signal Input (신호 입력)
- 트럼프에게 질문하기 입력창
- 빠른 질문 버튼 (관세 영향?, 금리 전망?)
- 실시간 분석 피드백

### 3. Intelligence Suite
- Move Prediction (움직임 예측)
- Market Impact (시장 영향)
- AI Chat Preview (챗봇 미리보기)

### 4. Command Center (명령 센터)
- 실시간 위험도 평가
- 섹터별 위험도 게이지 (Energy, Tech, Finance)
- 시장 전략 표시 (ACCUMULATE, etc.)

### 5. Chat Simulation (챗봇)
- 트럼프 페르소나 대화
- 실시간 메시지 스트리밍
- 오류 처리 및 타이핑 인디케이터

### 6. Process Steps
- 데이터 수집 → 맥락화 → 시뮬레이션 → 실행

---

## 📡 API 연동

### 백엔드 API 엔드포인트

```typescript
// services/api.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 예측 API
GET  /api/predictions/latest      // 최신 예측
GET  /api/predictions/history     // 예측 이력
POST /api/predictions/latest      // 새 예측 생성

// 발언 API
GET  /api/statements              // 모든 발언
GET  /api/statements/{id}         // 발언 상세

// 챗봇 API
POST /api/chat                    // 메시지 전송
```

### 사용 중인 Hooks

**useLatestPrediction**
```typescript
const { prediction, loading, error } = useLatestPrediction();
// prediction: PredictionHistory | null
// loading: boolean
// error: string | null
```

**useTrumpChat**
```typescript
const { messages, pending, error, send } = useTrumpChat();
// messages: ChatMessage[]
// pending: boolean
// error: string | null
// send: (text: string) => Promise<void>
```

**useStatements**
```typescript
const { statements, loading, error } = useStatements();
// statements: Statement[]
// loading: boolean
// error: string | null
```

---

## 🛠️ NPM 스크립트

### 개발

```bash
# 개발 서버 시작 (포트 3000)
npm run dev

# TypeScript 타입 체크
npm run lint

# 타입 체크 없이 빌드
npm run build
```

### 운영

```bash
# 프로덕션 빌드
npm run build

# 빌드된 앱 미리보기
npm run preview

# 빌드 결과물 정리
npm run clean
```

---

## 🚀 배포

### Vercel (권장)

1. GitHub에 푸시
2. Vercel 대시보드에서 프로젝트 임포트
3. 환경 변수 설정:
   - `VITE_API_BASE_URL` - 백엔드 API URL
   - `VITE_GEMINI_API_KEY` - Gemini API 키
4. 자동 배포

### Docker

```bash
# Dockerfile 빌드
docker build -t trumptalk-frontend .

# 컨테이너 실행
docker run -p 3000:3000 trumptalk-frontend
```

### 수동 배포

```bash
# 프로덕션 빌드
npm run build

# dist/ 폴더를 웹 서버에 배포
# Nginx, Apache, GitHub Pages 등
```

---

## 🐛 디버깅

### 포트 충돌

```bash
# 다른 포트에서 실행 (예: 3001)
npm run dev -- --port 3001
```

### 백엔드 연결 실패

1. `.env.local` 확인
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

2. 백엔드 서버 실행 확인
   ```bash
   curl http://localhost:8080/api/actuator/health
   ```

3. CORS 설정 확인 (백엔드)
   - 백엔드에서 프론트엔드 도메인 허용

### 스타일 적용 안됨

1. Tailwind CSS 빌드 확인
   ```bash
   npm run build
   ```

2. 브라우저 캐시 초기화 (Ctrl+Shift+Delete)

3. 개발 서버 재시작
   ```bash
   npm run dev
   ```

---

## 📊 성능 최적화

현재 최적화:
- ✅ Vite 번들 최적화 (코드 스플리팅)
- ✅ Lazy loading 컴포넌트
- ✅ Tailwind CSS 프루닝
- ✅ Motion 애니메이션 최적화

---

## 🔐 보안

### 환경 변수 보안

- ❌ 절대 `.env.local`을 Git에 커밋하면 안 됨
- ✅ `.gitignore`에 추가됨
- ✅ Gemini API 키는 백엔드에서만 사용

### API 보안

- ✅ HTTPS 통신 (운영)
- ✅ CORS 검증
- ✅ 입력값 검증

---

## 🧪 테스트 (예정)

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e
```

---

## 📝 코드 스타일

- **Formatter**: Prettier (`.prettierrc` 설정됨)
- **Linter**: TypeScript strict mode
- **패키지**: ESM (ES modules)

---

## 🌐 브라우저 호환성

- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

모바일:
- ✅ iOS Safari 17+
- ✅ Chrome Android

---

## 📚 관련 문서

- [백엔드 README](../backend/README.md)
- [백엔드 배포 가이드](../backend/DEPLOYMENT.md)
- [전체 아키텍처](../.claude/architecture/architecture.md)

---

## 💡 팁

### HMR (Hot Module Replacement)
Vite의 HMR이 활성화되어 있어 코드 저장 시 즉시 브라우저에 반영됨

### Responsive Design
Tailwind의 반응형 클래스 사용:
```tsx
className="text-sm md:text-base lg:text-lg"
// 모바일: sm, 태블릿: md, 데스크톱: lg
```

### 애니메이션
Motion 라이브러리 사용:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  콘텐츠
</motion.div>
```

---

## 🤝 기여

버그 리포트 또는 기능 제안: GitHub Issues

---

## 📞 지원

문제 발생 시:
1. 콘솔 에러 확인 (F12 DevTools)
2. 네트워크 탭에서 API 요청 확인
3. `.env.local` 설정 재확인