/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  User, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Sparkles, 
  Megaphone, 
  MessageSquare, 
  BrainCircuit, 
  BarChart3, 
  ShieldAlert,
  Send,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLatestPrediction } from './hooks/useLatestPrediction';
import { useTrumpChat, type ChatMessage } from './hooks/useTrumpChat';
import type { PredictionHistory } from './services/types';

// --- Sub-components ---

const Navbar = () => (
  <nav className="fixed top-0 w-full border-b border-white/10 bg-black/40 backdrop-blur-md z-50 flex justify-between items-center px-6 md:px-10 py-4 inner-glow-top">
    <div className="text-2xl font-black tracking-tighter text-brand-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] font-display uppercase">
      TRUMPTALK
    </div>
    <div className="hidden md:flex gap-8">
      {['Home', 'Predictions', 'Market Insights', 'AI Chat', 'Ads'].map((item) => (
        <a 
          key={item}
          href={`#${item.toLowerCase().replace(' ', '-')}`}
          className={`font-display uppercase tracking-wider text-xs font-bold transition-colors ${
            item === 'Home' ? 'text-brand-primary border-b-2 border-brand-primary pb-1' : 'text-slate-400 hover:text-white'
          }`}
        >
          {item}
        </a>
      ))}
    </div>
    <div className="flex items-center gap-4">
      <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-brand-primary transition-colors" />
      <User className="w-5 h-5 text-slate-400 cursor-pointer hover:text-brand-primary transition-colors" />
    </div>
  </nav>
);

const MarketTicker = () => (
  <div className="fixed top-[64px] w-full bg-brand-surface-low border-b border-white/5 z-40 h-8 flex items-center overflow-hidden">
    <div className="animate-ticker flex whitespace-nowrap gap-12 items-center">
      {[1, 2].map((i) => (
        <span key={i} className="text-[10px] font-display uppercase tracking-widest text-brand-primary-dim">
          DJIA +1.24% • NASDAQ -0.45% • BTC $98,400 • GOLD +0.12% • TARIFF RISK: HIGH • FED WATCH: HAWKISH •{' '}
        </span>
      ))}
    </div>
  </div>
);

interface HeroSectionProps {
  prediction: PredictionHistory | null;
  loading: boolean;
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

const HeroSection = ({ prediction, loading }: HeroSectionProps) => {
  const growth = prediction?.growthRate.percentageValue;
  const signal = loading ? 'LOADING' : signalLabel(growth);
  const impact = loading ? '실시간 분석 중...' : `${formatGrowth(growth)} IMPACT EXPECTED`;
  return (
    <section className="relative pt-32 min-h-screen flex flex-col lg:flex-row px-6 md:px-10 gap-6">
      {/* Left Panel: Visual */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative w-full lg:w-1/2 min-h-[500px] lg:min-h-[700px] rounded-none overflow-hidden group border border-white/5"
      >
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU6-kiNfiA7jzKWBmzwESqZwwmZq4djoJh8WUVBh-NlZAe91KssNYEBOqDmXqJb-kGeVd_u04LcmVw0eXAzHiv2Xo8dXnziKJpjuXHYaABaBB6fjrEo8d2g2yTHDO_NRkXOOer7hSPBuo6IAdIWmC_r_j2GCfNsrlmpU5_TLWam9xqZ5RBzfEp1Pnuu76FYX3-HcQO0zOiia1j0IG-Za3e4rFZk3DLoV02PJhM123Kf3lNj8pYaD7C6RqwxzuNzM8DUyt1RJ9hzdM" 
          alt="Intelligence Profile"
          className="w-full h-full object-cover grayscale brightness-50 contrast-125 group-hover:scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-background via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-transparent to-transparent"></div>
        
        {/* Signal Badge */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-6 md:left-10 w-28 md:w-32 h-28 md:h-32 rounded-full glass-panel border-brand-primary/50 flex flex-col items-center justify-center p-4 backdrop-blur-3xl"
        >
          <span className="text-[10px] font-display font-bold text-brand-primary mb-1 tracking-widest">SIGNAL</span>
          <span className="text-xl md:text-2xl font-black text-white font-display">{signal}</span>
          <div className="w-full h-1 bg-brand-primary mt-2"></div>
        </motion.div>
        
        <div className="absolute bottom-10 left-40 md:left-48 max-w-sm">
          <h1 className="font-display text-4xl md:text-6xl text-white uppercase italic tracking-tighter leading-none mb-4">
            DECIPHER<br />THE POWER.
          </h1>
          <p className="text-base text-slate-300 font-sans">
            Every word a market mover. Every signal an opportunity. Real-time intelligence from the source.
          </p>
        </div>
      </motion.div>

      {/* Right Panel: Insights */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/2 flex flex-col gap-6"
      >
        <div className="glass-panel p-6 h-64 relative overflow-hidden active-border-glow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-display font-bold text-slate-400 tracking-widest uppercase">VOLATILITY INDEX (T-SIGNAL)</span>
            <span className="text-xs font-display font-medium text-brand-primary tracking-wider">{impact}</span>
          </div>
          <div className="h-40 flex items-end gap-1.5">
            {[30, 45, 35, 70, 90, 60, 40, 55, 75, 45, 85].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 1 }}
                className={`flex-grow ${h > 65 ? 'bg-brand-primary/40 border-t-2 border-brand-primary' : 'bg-slate-800/50'}`}
              />
            ))}
          </div>
          <div className="absolute top-1/2 left-0 w-full border-t border-brand-secondary/30 border-dashed"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Megaphone, title: 'Recent Statement', val: '관세/금리 이슈 분석 완료', color: 'text-brand-primary' },
            { icon: History, title: 'Historical Pattern', val: '82% 상관관계 감지', color: 'text-brand-primary' },
            { icon: Sparkles, title: 'Next Keyword Prediction', val: ['관세', '중국', '에너지'], tags: true, color: 'text-brand-primary' },
            { icon: TrendingDown, title: 'Volatility Forecast', val: 'Sharp Move Imminent', color: 'text-brand-secondary' },
          ].map((item, i) => (
            <div key={i} className={`glass-panel p-5 transition-all hover:bg-white/5 border-l-2 ${item.color === 'text-brand-primary' ? 'border-l-brand-primary/20' : 'border-l-brand-secondary/20'}`}>
              <item.icon className={`w-5 h-5 ${item.color} mb-3`} />
              <h3 className="text-[10px] md:text-xs font-display font-bold text-slate-400 tracking-widest uppercase mb-1">{item.title}</h3>
              {item.tags ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(item.val as string[]).map(t => (
                    <span key={t} className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[10px] border border-brand-primary/30 uppercase font-display font-bold">{t}</span>
                  ))}
                </div>
              ) : (
                <p className={`text-sm md:text-base font-semibold ${item.color === 'text-brand-secondary' ? 'text-brand-secondary' : 'text-white'}`}>{item.val}</p>
              )}
            </div>
          ))}
        </div>

        <div className="w-full bg-brand-surface-high h-12 flex items-center justify-center border border-white/5">
          <span className="text-[10px] md:text-xs font-display font-bold text-slate-500 uppercase tracking-widest">
            Sponsored: Premium Market Access Terminal • <span className="text-brand-primary cursor-pointer hover:underline">Join Now</span>
          </span>
        </div>
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
    <div className="w-full px-6 md:px-10 mb-20 -mt-8 relative z-30">
      <div className="glass-panel p-1 rounded-none active-border-glow flex flex-col md:flex-row items-center gap-4">
        <div className="hidden md:flex pl-6 gap-2">
          {['관세 영향?', '금리 전망?'].map(q => (
            <span key={q} onClick={() => setDraft(q)} className="whitespace-nowrap px-3 py-1 glass-panel text-[10px] text-brand-primary cursor-pointer hover:bg-brand-primary hover:text-black transition-all uppercase font-display font-bold">{q}</span>
          ))}
        </div>
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

const Features = () => (
  <section className="py-20 px-6 md:px-10 bg-brand-surface-low/30">
    <div className="mb-12">
      <h2 className="font-display text-2xl md:text-4xl text-white uppercase tracking-tight mb-2">INTELLIGENCE SUITE</h2>
      <div className="h-1 w-24 bg-brand-primary"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { icon: BrainCircuit, title: 'Move Prediction', desc: 'Analyzing rhetorical structures to forecast policy shifts before they hit the wire.' },
        { icon: BarChart3, title: 'Market Impact', desc: 'Quantifying the dollar value of every social media interaction and public rally statement.' },
        { icon: MessageSquare, title: 'AI Chat Preview', desc: 'Interactive simulation environment for testing market hypotheses via direct conversational AI.' },
      ].map((feature, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -5 }}
          className="glass-panel p-8 group border-t-0 border-r-0 border-b-2 border-l-0 border-b-white/5 hover:border-b-brand-primary transition-all duration-300"
        >
          <div className="w-12 h-12 bg-brand-primary/10 border border-brand-primary flex items-center justify-center mb-6">
            <feature.icon className="w-6 h-6 text-brand-primary" />
          </div>
          <h3 className="font-display text-xl md:text-2xl text-white mb-4 uppercase font-bold">{feature.title}</h3>
          <p className="text-slate-400 font-sans leading-relaxed">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const CommandCenter = () => (
  <section className="py-20 px-6 md:px-10">
    <div className="glass-panel p-1 rounded-none overflow-hidden active-border-glow">
      <div className="bg-black/60 p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h2 className="font-display text-2xl md:text-4xl text-white uppercase font-bold">COMMAND CENTER</h2>
            <span className="text-[10px] font-display font-medium text-slate-500 tracking-[0.2em] uppercase">REAL-TIME RISK ASSESSMENT</span>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-white/10 text-[10px] font-display font-bold text-white uppercase tracking-widest hover:bg-white/5">SECTOR MAP</button>
            <button className="px-6 py-2 bg-brand-primary text-black text-[10px] font-display font-bold uppercase tracking-widest hover:bg-white">LIVE CHART</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">
          <div className="lg:col-span-8 bg-black/40 rounded-none border border-white/5 relative overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu54lZnX-3xH0tx89NgmSETCD-n7mn0BCQyriW7Wy8yt-3RnngqmVV8USHgDkNJOzUf9ywgDKkkyuJEG2OhYWXXpPAV0gYATiYGISSspows4oH7YqTpM0u8rlV5YjyRFpGwZIcC03W_PfV927bJDPKQtoUJhcqsLKnGxWxWkdSZhjeFhTOVB4sw0HKqpgjzTMEqqBLFSir84XoHaJYnxgpI9GZhPSwcWz9rLD7JNyW3YB5Lg_5KEFVtSyHGHSPTqUoDJu6sZuKxrQ"
              className="w-full h-full object-cover opacity-40 grayscale"
              alt="Live Markets"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="glass-panel px-4 py-2 text-[10px] font-display font-bold text-brand-primary uppercase tracking-widest">STRATEGY: ACCUMULATE</div>
              <div className="glass-panel px-4 py-2 text-[10px] font-display font-bold text-brand-secondary uppercase tracking-widest">RISK: CRITICAL</div>
            </div>
          </div>
          
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-grow glass-panel p-6">
              <h4 className="text-xs font-display font-bold text-slate-400 mb-6 uppercase tracking-widest">Risk Levels by Sector</h4>
              <div className="space-y-6">
                {[
                  { label: 'ENERGY', val: 92, color: 'bg-brand-secondary' },
                  { label: 'TECH', val: 45, color: 'bg-brand-primary' },
                  { label: 'FINANCE', val: 68, color: 'bg-brand-primary' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-[10px] font-display font-bold text-slate-300 mb-2 tracking-widest">
                      <span>{s.label}</span>
                      <span>{s.val}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.val}%` }}
                        viewport={{ once: true }}
                        className={`h-full ${s.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-32 glass-panel p-6 flex flex-col items-center justify-center border-l-4 border-l-brand-primary">
              <Zap className="w-5 h-5 text-brand-primary mb-2" />
              <span className="text-2xl font-display font-black text-brand-primary tracking-[0.2em] uppercase">STABLE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

interface ChatSimulationProps {
  messages: ChatMessage[];
  pending: boolean;
  error: string | null;
}

const ChatBubble = ({ message }: { message: ChatMessage }) => {
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

const ChatSimulation = ({ messages, pending, error }: ChatSimulationProps) => (
  <section className="py-20 px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
    <div className="order-2 md:order-1">
      <span className="text-[10px] font-display font-black text-brand-primary uppercase tracking-[0.3em] block mb-4">CONVERSATIONAL INTELLIGENCE</span>
      <h2 className="font-display text-4xl md:text-5xl lg:text-7xl text-white uppercase italic leading-tight mb-8">
        TALK TO THE<br />MARKET MOVER.
      </h2>
      <p className="text-lg text-slate-400 font-sans leading-relaxed mb-8">
        Our AI is trained on 40 years of transcripts, rallies, and legislative actions. Simulate reactions to potential economic shifts in real-time.
      </p>
      <button className="group border border-brand-primary text-brand-primary px-8 py-4 font-display font-bold uppercase tracking-widest hover:bg-brand-primary/10 transition-all flex items-center gap-3">
        LAUNCH SIMULATOR
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
    
    <div className="order-1 md:order-2 glass-panel rounded-none overflow-hidden h-[450px] flex flex-col shadow-2xl relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="bg-white/5 p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
        <span className="text-[10px] font-display font-bold text-white uppercase tracking-widest">TRUMPTALK AI SESSION v4.0</span>
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
      
      <div className="p-4 bg-black/40 border-t border-white/10 flex gap-4">
        <div className="flex-grow h-10 bg-white/5 border border-white/10 px-4 flex items-center text-xs text-slate-500 font-display">SIMULATION ACTIVE...</div>
        <button className="h-10 w-10 bg-brand-primary flex items-center justify-center text-black">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  </section>
);

const ProcessSteps = () => (
  <section className="py-20 px-6 md:px-10 bg-gradient-to-b from-transparent to-brand-surface-low/20">
    <h2 className="font-display text-3xl md:text-5xl text-white text-center mb-16 uppercase tracking-[0.2em] italic font-black">THE PROCESS</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { step: '01', title: 'Ingestion', desc: 'Real-time monitoring of all public and private channel signals.' },
        { step: '02', title: 'Contextualize', desc: 'Comparing current rhetoric against 40 years of historical patterns.' },
        { step: '03', title: 'Simulation', desc: 'AI-driven market stress-testing based on the identified signal.' },
        { step: '04', title: 'Execution', desc: 'Actionable trade signals and risk mitigation protocols delivered.' },
      ].map((item, i) => (
        <div key={i} className="text-center relative">
          <div className="text-8xl font-display font-black text-white/5 mb-[-3.5rem] select-none tracking-tighter italic">{item.step}</div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="relative z-10 glass-panel p-8 pt-12 border-t-2 border-t-brand-primary"
          >
            <h4 className="font-display text-xl text-white mb-3 uppercase font-bold tracking-widest">{item.title}</h4>
            <p className="text-slate-400 text-xs font-sans leading-relaxed italic">{item.desc}</p>
          </motion.div>
        </div>
      ))}
    </div>
  </section>
);

const Footer = () => (
  <footer className="mt-20 border-t border-white/5 bg-black/40">
    <div className="w-full px-6 md:px-10 py-20 flex flex-col items-center text-center">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-5xl md:text-7xl lg:text-9xl leading-none text-white uppercase italic tracking-tighter mb-10"
      >
        FRONT-RUN THE<br />MOMENTUM.
      </motion.h2>
      
      <div className="flex flex-col sm:flex-row gap-6 mb-16">
        <button className="bg-brand-primary text-black font-display font-black px-12 py-5 uppercase tracking-widest text-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          트럼프톡 시작하기
        </button>
        <button className="border-2 border-white text-white font-display font-black px-12 py-5 uppercase tracking-widest text-lg hover:bg-white hover:text-black transition-all">
          예측 보기
        </button>
      </div>
      
      <p className="text-[10px] font-display font-bold text-slate-600 uppercase tracking-[0.3em] max-w-2xl leading-loose">
        © 2026 TRUMPTALK INTELLIGENCE. ALL RIGHTS RESERVED. REGULATORY DISCLOSURE: MARKET DATA IS PROVIDED FOR INFORMATIONAL PURPOSES ONLY. TRADING INVOLVES SIGNIFICANT RISK.
      </p>
    </div>
    
    <div className="border-t border-white/5 px-6 md:px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-sm font-display font-black text-slate-300 uppercase tracking-widest">TrumpTalk</div>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
        {['Privacy Policy', 'Terms of Service', 'Risk Disclosure', 'SEC Filings'].map(l => (
          <a key={l} href="#" className="text-slate-500 hover:text-brand-primary transition-all font-display text-[10px] uppercase tracking-widest font-bold">{l}</a>
        ))}
      </div>
      <div className="text-slate-600 font-display text-[10px] uppercase tracking-widest">
        Design Intelligence v8.4.2
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const {prediction, loading} = useLatestPrediction();
  const {messages, pending, error, send} = useTrumpChat();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="bg-brand-background min-h-screen" />;

  return (
    <div className="min-h-screen bg-brand-background selection:bg-brand-primary selection:text-black">
      <Navbar />
      <MarketTicker />

      <main>
        <HeroSection prediction={prediction} loading={loading} />
        <SignalInput onSend={send} pending={pending} />

        {/* Ad Space Mid */}
        <section className="px-6 md:px-10 py-10">
          <div className="w-full h-32 border border-dashed border-white/10 flex flex-col items-center justify-center bg-brand-surface group hover:border-brand-primary/50 transition-colors">
            <span className="text-[10px] font-display font-bold text-slate-700 group-hover:text-brand-primary transition-colors uppercase tracking-[0.3em]">ADVERTISEMENT SPACE</span>
            <p className="text-[10px] text-slate-800 uppercase tracking-[0.1em] mt-2 font-display">Premium Partner Integrations Only</p>
          </div>
        </section>

        <Features />
        <CommandCenter />
        <ChatSimulation messages={messages} pending={pending} error={error} />
        <ProcessSteps />
      </main>

      <Footer />
    </div>
  );
}
