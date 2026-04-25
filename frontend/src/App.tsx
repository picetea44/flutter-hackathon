/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Send, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLatestPrediction } from './hooks/useLatestPrediction';
import { useTrumpChat, type ChatMessage } from './hooks/useTrumpChat';
import { useStatements } from './hooks/useStatements';
import { usePredictionHistory } from './hooks/usePredictionHistory';
import type { PredictionHistory } from './services/types';

const Navbar = () => (
  <nav className="fixed top-0 w-full border-b border-white/10 bg-black/40 backdrop-blur-md z-50 flex justify-between items-center px-6 md:px-10 py-4 inner-glow-top">
    <div className="text-2xl font-black tracking-tighter text-brand-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] font-display uppercase">
      TRUMPTALK
    </div>
  </nav>
);

interface HeroSectionProps {
  prediction: PredictionHistory | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
  onGenerate: () => void;
  onRefetch: () => void;
}

const formatGrowth = (value?: number) => {
  if (value === undefined || value === null) return '— %';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

const signalLabel = (value?: number) => {
  if (value === undefined || value === null) return 'PENDING';
  if (value > 0.5) return 'BULLISH';
  if (value < -0.5) return 'BEARISH';
  return 'NEUTRAL';
};

const HeroSection = ({
  prediction,
  loading,
  generating,
  error,
  onGenerate,
  onRefetch,
}: HeroSectionProps) => {
  const growth = prediction?.growthRate.percentageValue;
  const signal = loading || generating ? 'LOADING' : signalLabel(growth);
  const impact = loading || generating
    ? '실시간 분석 중...'
    : `${formatGrowth(growth)} IMPACT EXPECTED`;
  const hasError = !!error && !prediction;
  const isEmpty = !loading && !generating && !prediction && !error;

  return (
    <section className="relative pt-32 min-h-[60vh] flex flex-col items-center justify-center px-6 md:px-10 gap-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <span className="text-[10px] font-display font-black text-brand-primary uppercase tracking-[0.3em] block mb-4">
          MARKET PREDICTION
        </span>
        <h1 className="font-display text-4xl md:text-6xl text-white uppercase italic tracking-tighter leading-none mb-6">
          DECIPHER<br />THE POWER.
        </h1>
        <p className="text-base text-slate-300 font-sans mb-8">
          트럼프의 발언을 분석하여 시장의 움직임을 예측합니다.
        </p>

        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="glass-panel active-border-glow p-8 inline-flex flex-col items-center gap-4"
        >
          <span className="text-[10px] font-display font-bold text-brand-primary tracking-widest">
            SIGNAL
          </span>
          <span className="text-4xl md:text-5xl font-black text-white font-display">
            {signal}
          </span>
          <div className="w-full h-1 bg-brand-primary"></div>
          <span className="text-xs font-display font-medium text-brand-primary tracking-wider">
            {impact}
          </span>

          {hasError && (
            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="text-[10px] text-brand-secondary font-display uppercase tracking-widest">
                예측 데이터를 불러올 수 없습니다
              </span>
              <button
                onClick={onRefetch}
                className="bg-brand-primary text-black font-black px-6 py-3 uppercase tracking-widest hover:bg-white transition-all font-display text-xs"
              >
                다시 시도
              </button>
            </div>
          )}

          {isEmpty && (
            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 font-display uppercase tracking-widest">
                예측 데이터가 없습니다
              </span>
              <button
                onClick={onGenerate}
                className="bg-brand-primary text-black font-black px-6 py-3 uppercase tracking-widest hover:bg-white transition-all font-display text-xs"
              >
                예측 생성하기
              </button>
            </div>
          )}

          {prediction && (
            <button
              onClick={onGenerate}
              disabled={generating}
              className="border border-brand-primary/50 text-brand-primary font-bold px-4 py-2 uppercase tracking-widest hover:bg-brand-primary/10 transition-all font-display text-[10px] disabled:opacity-50"
            >
              {generating ? '생성 중...' : '새 예측 생성'}
            </button>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

interface SignalInputProps {
  onSend: (text: string) => void;
  pending: boolean;
}

const SignalInput = ({ onSend, pending }: SignalInputProps) => {
  const [draft, setDraft] = useState('');
  const submit = () => {
    onSend(draft);
    setDraft('');
  };
  return (
    <div className="w-full px-6 md:px-10 mb-10 relative z-30">
      <div className="glass-panel p-1 rounded-none active-border-glow flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && submit()}
          className="flex-grow bg-transparent border-none focus:ring-0 text-white font-display p-6 w-full placeholder:text-slate-600"
          placeholder="트럼프에게 물어보세요"
        />
        <button
          onClick={submit}
          disabled={pending || !draft.trim()}
          className="w-full md:w-auto bg-brand-primary text-black font-black px-12 py-6 uppercase tracking-widest hover:bg-white transition-all font-display text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? 'ANALYZING...' : 'SEND SIGNAL'}
        </button>
      </div>
    </div>
  );
};

interface ChatSectionProps {
  messages: ChatMessage[];
  pending: boolean;
  error: string | null;
}

const ChatBubble = ({ message }: any) => {
  if (!message) return null;
  const isUser = message.role === 'user';
  const wrapper = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubble = isUser
    ? 'bg-brand-primary/10 p-4 border border-brand-primary/20 max-w-[85%]'
    : 'glass-panel p-5 border-l-4 border-l-brand-primary max-w-[85%]';
  const text = isUser ? 'text-sm text-white' : 'text-sm text-slate-300 italic leading-relaxed';
  return (
    <div className={wrapper}>
      <div className={bubble}>
        <p className={text}>{message.text}</p>
      </div>
    </div>
  );
};

const ChatSection = ({ messages, pending, error }: ChatSectionProps) => (
  <section className="py-10 px-6 md:px-10">
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <span className="text-[10px] font-display font-black text-brand-primary uppercase tracking-[0.3em] block mb-2">
          CONVERSATIONAL INTELLIGENCE
        </span>
        <h2 className="font-display text-2xl md:text-4xl text-white uppercase italic tracking-tight">
          TALK TO THE MARKET MOVER.
        </h2>
      </div>

      <div className="glass-panel rounded-none overflow-hidden h-[450px] flex flex-col shadow-2xl relative">
        <div className="bg-white/5 p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
          <span className="text-[10px] font-display font-bold text-white uppercase tracking-widest">
            TRUMPTALK AI SESSION
          </span>
        </div>

        <div className="flex-grow p-6 space-y-6 overflow-y-auto font-sans">
          {messages.length === 0 && !pending && (
            <div className="text-slate-500 text-xs font-display uppercase tracking-widest">
              상단의 SEND SIGNAL로 트럼프에게 첫 질문을 던져보세요.
            </div>
          )}
          {messages.map((message, index) => (
            <ChatBubble key={index} message={message} />
          ))}
          {pending && (
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-display font-bold uppercase tracking-widest">
              <span className="animate-pulse">Typing analysis...</span>
            </div>
          )}
          {error && (
            <div className="text-brand-secondary text-xs font-display uppercase tracking-widest">
              ERROR: {error}
            </div>
          )}
        </div>

        <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-end">
          <Send className="w-4 h-4 text-brand-primary" />
        </div>
      </div>
    </div>
  </section>
);

const PredictionChart = ({ predictions }: { predictions: PredictionHistory[] }) => {
  if (predictions.length === 0) return null;

  const sorted = [...predictions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const chartHeight = 200;
  const chartWidth = 300;
  const padding = 30;

  const min = Math.min(...sorted.map(p => p.growthRate.percentageValue));
  const max = Math.max(...sorted.map(p => p.growthRate.percentageValue));
  const range = max - min || 1;

  const points = sorted.map((p, i) => {
    const x = (i / (sorted.length - 1 || 1)) * (chartWidth - 2 * padding) + padding;
    const normalizedValue = (p.growthRate.percentageValue - min) / range;
    const y = chartHeight - padding - normalizedValue * (chartHeight - 2 * padding);
    return { x, y, value: p.growthRate.percentageValue };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-[10px] font-display font-bold text-brand-primary uppercase tracking-widest">
        PREDICTION TREND
      </div>
      <svg width={chartWidth} height={chartHeight} className="border border-brand-primary/30">
        <path d={pathData} stroke="rgb(0, 240, 255)" strokeWidth="2" fill="none" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="rgb(0, 240, 255)" />
        ))}
      </svg>
    </div>
  );
};

const NewsSourcesSection = ({ statements }: { statements: any[] }) => {
  const recentStatements = statements.slice(0, 5);

  return (
    <section className="py-10 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="text-[10px] font-display font-black text-brand-primary uppercase tracking-[0.3em] block mb-2">
            NEWS SOURCES
          </span>
          <h2 className="font-display text-2xl md:text-4xl text-white uppercase italic tracking-tight">
            TRUMP'S ANALYZED STATEMENTS.
          </h2>
        </div>

        <div className="grid gap-4">
          {recentStatements.length === 0 ? (
            <p className="text-slate-400 text-sm">No statements found.</p>
          ) : (
            recentStatements.map((statement, idx) => (
              <motion.div
                key={statement.identifier}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-4 border-l-4 border-l-brand-primary hover:bg-white/5 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                      {statement.content}
                    </p>
                    <div className="flex items-center gap-4 text-[10px]">
                      <span className="text-brand-primary">
                        Aggression: {statement.aggressionIndex?.value?.toFixed(2) || 'N/A'}
                      </span>
                      <span className="text-brand-secondary">
                        Transactionalism: {statement.transactionalismIndex?.value?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                  </div>
                  {statement.sourceUrl?.url && (
                    <a
                      href={statement.sourceUrl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:text-white transition-colors flex-shrink-0"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const PredictionStatsSection = ({ predictions }: { predictions: PredictionHistory[] }) => {
  if (predictions.length === 0) return null;

  const sorted = [...predictions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const initial = sorted[0];
  const latest = sorted[sorted.length - 1];

  return (
    <section className="py-10 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="text-[10px] font-display font-black text-brand-primary uppercase tracking-[0.3em] block mb-2">
            PREDICTION ANALYSIS
          </span>
          <h2 className="font-display text-2xl md:text-4xl text-white uppercase italic tracking-tight">
            MARKET MOVEMENT TRACKING.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 text-center"
          >
            <span className="text-[10px] font-display font-bold text-brand-primary uppercase tracking-widest block mb-2">
              INITIAL PREDICTION
            </span>
            <span className="text-3xl font-black text-white font-display">
              {initial.growthRate.percentageValue >= 0 ? '+' : ''}
              {initial.growthRate.percentageValue.toFixed(2)}%
            </span>
            <span className="text-[10px] text-slate-400 mt-2 block">
              {new Date(initial.createdAt).toLocaleDateString()}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 text-center"
          >
            <span className="text-[10px] font-display font-bold text-brand-primary uppercase tracking-widest block mb-2">
              CURRENT PREDICTION
            </span>
            <span className="text-3xl font-black text-white font-display">
              {latest.growthRate.percentageValue >= 0 ? '+' : ''}
              {latest.growthRate.percentageValue.toFixed(2)}%
            </span>
            <span className="text-[10px] text-slate-400 mt-2 block">
              {new Date(latest.createdAt).toLocaleDateString()}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 text-center"
          >
            <span className="text-[10px] font-display font-bold text-brand-primary uppercase tracking-widest block mb-2">
              CHANGE
            </span>
            <span className="text-3xl font-black text-white font-display">
              {(latest.growthRate.percentageValue - initial.growthRate.percentageValue) >= 0 ? '+' : ''}
              {(latest.growthRate.percentageValue - initial.growthRate.percentageValue).toFixed(2)}%
            </span>
            <span className="text-[10px] text-slate-400 mt-2 block">
              Total shift
            </span>
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center">
          <PredictionChart predictions={predictions} />
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="mt-20 border-t border-white/5 bg-black/40 px-6 md:px-10 py-8">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="text-sm font-display font-black text-slate-300 uppercase tracking-widest">
        TrumpTalk
      </div>
      <p className="text-[10px] font-display font-bold text-slate-600 uppercase tracking-[0.3em]">
        © 2026 TRUMPTALK INTELLIGENCE
      </p>
    </div>
  </footer>
);

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    prediction,
    loading,
    generating,
    error: predictionError,
    generate,
    refetch,
  } = useLatestPrediction();
  const { messages, pending, error, send } = useTrumpChat();
  const { statements } = useStatements();
  const { history: predictions } = usePredictionHistory();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="bg-brand-background min-h-screen" />;

  return (
    <div className="min-h-screen bg-brand-background selection:bg-brand-primary selection:text-black">
      <Navbar />

      <main>
        <HeroSection
          prediction={prediction}
          loading={loading}
          generating={generating}
          error={predictionError}
          onGenerate={generate}
          onRefetch={refetch}
        />
        <SignalInput onSend={send} pending={pending} />
        <ChatSection messages={messages} pending={pending} error={error} />
        <PredictionStatsSection predictions={predictions} />
        <NewsSourcesSection statements={statements} />
      </main>

      <Footer />
    </div>
  );
}