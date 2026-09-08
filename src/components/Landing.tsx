import { useState } from 'react';
import { Mountain, Eye, EyeOff, Mail, Lock, ArrowRight, Activity, Satellite, ShieldAlert, Radio } from 'lucide-react';
import { SimTag } from './ui';

export function Landing({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div className="min-h-screen bg-surface-base topo-bg flex flex-col lg:flex-row">
      {/* Left: Cinematic hero */}
      <div className="lg:flex-1 relative overflow-hidden flex flex-col justify-between p-8 lg:p-14 xl:p-20">
        {/* Animated contour SVG */}
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            <g fill="none" stroke="#1976B9" strokeOpacity="0.07" strokeWidth="1">
              {Array.from({ length: 20 }, (_, i) => (
                <path key={i} d={`M0,${300 + i * 12} Q200,${250 + i * 12 + Math.sin(i) * 30} 400,${300 + i * 12} T800,${300 + i * 12}`}>
                  <animate attributeName="d" dur={`${8 + i}s`} repeatCount="indefinite"
                    values={`M0,${300 + i * 12} Q200,${250 + i * 12 + Math.sin(i) * 30} 400,${300 + i * 12} T800,${300 + i * 12};M0,${300 + i * 12} Q200,${270 + i * 12 + Math.cos(i) * 25} 400,${300 + i * 12} T800,${300 + i * 12};M0,${300 + i * 12} Q200,${250 + i * 12 + Math.sin(i) * 30} 400,${300 + i * 12} T800,${300 + i * 12}`} />
                </path>
              ))}
            </g>
          </svg>
        </div>

        {/* Mountain silhouette */}
        <svg className="absolute bottom-0 left-0 w-full opacity-[0.06]" viewBox="0 0 800 200" preserveAspectRatio="none">
          <path d="M0,200 L0,140 L120,60 L200,100 L320,30 L420,80 L520,40 L640,90 L750,50 L800,70 L800,200 Z" fill="#1976B9" />
          <path d="M0,200 L0,170 L100,110 L180,140 L280,80 L380,120 L480,90 L600,130 L720,100 L800,120 L800,200 Z" fill="#20A39E" />
        </svg>

        {/* Floating sensor nodes */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { x: 15, y: 30 }, { x: 70, y: 25 }, { x: 45, y: 55 }, { x: 85, y: 50 }, { x: 25, y: 70 },
          ].map((p, i) => (
            <div key={i} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <div className="relative w-3 h-3">
                <div className="absolute inset-0 rounded-full bg-brand-400/30 animate-pulse-ring" />
                <div className="absolute inset-0.5 rounded-full bg-brand-500/60" />
              </div>
            </div>
          ))}
        </div>

        {/* Top brand */}
        <div className="relative z-10 flex items-center gap-3 animate-fade-in">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-teal-400 text-white shadow-float">
            <Mountain size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-extrabold text-ink-900 text-lg tracking-tight">BhooShanket AI</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-teal-500">Landslide Risk Intelligence</div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 max-w-xl animate-fade-up">
          <div className="mb-5">
            <SimTag text="Simulation Environment" />
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-ink-900 leading-[1.1] tracking-tight">
            Predict. Alert.<br />
            Respond. <span className="text-brand-500">Protect.</span>
          </h1>
          <p className="mt-5 text-base lg:text-lg text-ink-500 leading-relaxed max-w-md">
            Transforming environmental signals into early warnings, actionable intelligence and faster emergency response for the North Eastern Region of India.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: <Activity size={16} />, label: 'IoT Sensor Network' },
              { icon: <Satellite size={16} />, label: 'AI Risk Engine' },
              { icon: <ShieldAlert size={16} />, label: 'Early Warning' },
              { icon: <Radio size={16} />, label: 'Emergency Response' },
            ].map((f) => (
              <div key={f.label} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card/80 border border-line text-sm font-medium text-ink-700 backdrop-blur-sm">
                <span className="text-brand-500">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 max-w-md animate-fade-up">
          {[
            { val: '17', label: 'Monitoring Zones' },
            { val: '8', label: 'NE States Covered' },
            { val: '24/7', label: 'Live Intelligence' },
          ].map((s) => (
            <div key={s.label} className="bg-surface-card/70 backdrop-blur-sm rounded-xl border border-line p-3.5">
              <div className="text-2xl font-bold text-brand-500 tnum">{s.val}</div>
              <div className="text-[11px] text-ink-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Login panel */}
      <div className="lg:w-[440px] xl:w-[480px] flex items-center justify-center p-6 lg:p-10 bg-surface-card border-l border-line">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900">Authority Sign In</h2>
            <p className="text-sm text-ink-500 mt-1.5">Access the BhooShanket AI Command Center.</p>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wide mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="authority@bhooshanket.gov.in"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-line bg-surface-base text-sm text-ink-900 placeholder:text-ink-300 transition-all focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-line bg-surface-base text-sm text-ink-900 placeholder:text-ink-300 transition-all focus:bg-white"
                />
                <button
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 p-1"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <button
                  onClick={() => setRemember(!remember)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${remember ? 'bg-brand-500 border-brand-500' : 'border-ink-300 bg-white'}`}
                >
                  {remember && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </button>
                <span className="text-sm text-ink-700">Remember me</span>
              </label>
              <button className="text-sm text-brand-500 font-medium hover:text-brand-600">Forgot?</button>
            </div>

            {/* Sign in */}
            <button
              onClick={onLogin}
              className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-semibold text-sm shadow-float hover:bg-brand-600 transition-all duration-200 hover:shadow-cardHover flex items-center justify-center gap-2 group"
            >
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-line" />
              <span className="text-xs text-ink-400 font-medium">or</span>
              <div className="flex-1 h-px bg-line" />
            </div>

            {/* Demo access */}
            <button
              onClick={onLogin}
              className="w-full py-3.5 rounded-xl bg-surface-alt border border-line text-ink-900 font-semibold text-sm hover:bg-brand-50 hover:border-brand-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse-soft" />
              Demo Access — Explore Prototype
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <SimTag text="Prototype System" />
            <SimTag text="Demo AI Analysis" />
          </div>

          <p className="mt-6 text-center text-[11px] text-ink-400 leading-relaxed">
            This is a simulation prototype. All data is simulated and does not represent real government services or live emergency systems.
          </p>
        </div>
      </div>
    </div>
  );
}
