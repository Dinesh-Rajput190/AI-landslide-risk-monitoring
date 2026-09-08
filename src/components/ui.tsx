import { useEffect, useRef, useState } from 'react';
import { RISK_META } from '../types';
import type { RiskLevel } from '../types';

/* ---------- Animated counting number ---------- */
export function AnimatedNumber({ value, duration = 900, suffix = '', decimals = 0 }: { value: number; duration?: number; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = display;
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className="tnum">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------- Risk Badge ---------- */
export function RiskBadge({ level, size = 'md' }: { level: RiskLevel; size?: 'sm' | 'md' | 'lg' }) {
  const m = RISK_META[level];
  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wide ${sizes[size]} ${m.bg} ${m.text}`}
      style={{ border: `1px solid ${m.color}30` }}
    >
      <span className="rounded-full" style={{ width: size === 'lg' ? 8 : 6, height: size === 'lg' ? 8 : 6, background: m.color }} />
      {m.label}
    </span>
  );
}

/* ---------- Card ---------- */
export function Card({ children, className = '', hover = false, onClick }: { children: React.ReactNode; className?: string; hover?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-card rounded-xl border border-line shadow-card ${hover ? 'transition-all duration-300 hover:shadow-cardHover hover:-translate-y-0.5 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Section Header ---------- */
export function SectionHeader({ title, subtitle, icon, badge, right }: { title: string; subtitle?: string; icon?: React.ReactNode; badge?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 text-brand-500 shrink-0">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-ink-900">{title}</h2>
            {badge}
          </div>
          {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

/* ---------- Simulation Tag ---------- */
export function SimTag({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-500 bg-surface-alt border border-line rounded-full px-2 py-0.5 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-soft" />
      {text}
    </span>
  );
}

/* ---------- Live Dot ---------- */
export function LiveDot({ label = 'LIVE', color = '#22A06B' }: { label?: string; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color }}>
      <span className="relative flex w-2 h-2">
        <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: color }} />
        <span className="relative rounded-full w-2 h-2" style={{ background: color }} />
      </span>
      {label}
    </span>
  );
}

/* ---------- Sparkline (mini SVG line chart) ---------- */
export function Sparkline({ data, color = '#1976B9', height = 32, width = 100, fill = true }: { data: number[]; color?: string; height?: number; width?: number; fill?: boolean }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const path = `M ${pts.join(' L ')}`;
  const areaPath = `${path} L ${width},${height} L 0,${height} Z`;
  const gradId = `spark-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {fill && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradId})`} />
        </>
      )}
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="2.5" fill={color} />
    </svg>
  );
}

/* ---------- Bar Chart (SVG) ---------- */
export function BarChart({ data, labels, color = '#1976B9', height = 120, maxVal }: { data: number[]; labels?: string[]; color?: string; height?: number; maxVal?: number }) {
  const max = maxVal ?? Math.max(...data, 1);
  const barW = 100 / data.length;
  return (
    <div>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        {data.map((d, i) => {
          const h = (d / max) * (height - 16);
          return (
            <g key={i}>
              <rect
                x={i * barW + barW * 0.15}
                y={height - h - 12}
                width={barW * 0.7}
                height={h}
                rx={1.2}
                fill={color}
                opacity={0.85}
              >
                <animate attributeName="height" from="0" to={h} dur="0.6s" fill="freeze" />
                <animate attributeName="y" from={height - 12} to={height - h - 12} dur="0.6s" fill="freeze" />
              </rect>
            </g>
          );
        })}
      </svg>
      {labels && (
        <div className="flex justify-between mt-1">
          {labels.map((l, i) => (
            <span key={i} className="text-[9px] text-ink-400 flex-1 text-center">{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Donut Chart ---------- */
export function Donut({ value, max = 100, size = 120, stroke = 12, color = '#1976B9', label, sublabel, animate = true }: { value: number; max?: number; size?: number; stroke?: number; color?: string; label?: string; sublabel?: string; animate?: boolean }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    if (!animate) { setAnimPct(pct); return; }
    const start = performance.now();
    const from = 0;
    const dur = 1000;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      setAnimPct(from + (pct - from) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pct, animate]);

  const offset = circ * (1 - animPct);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF6FB" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-2xl font-bold text-ink-900 tnum">{label}</span>}
        {sublabel && <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-500 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}

/* ---------- Radial Gauge (semi-circle) ---------- */
export function RadialGauge({ value, max = 100, size = 160, label, unit, color = '#1976B9' }: { value: number; max?: number; size?: number; label?: string; unit?: string; color?: string }) {
  const [animVal, setAnimVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const pct = value / max;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      const e = 1 - Math.pow(1 - t, 3);
      setAnimVal(pct * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, max]);

  const r = size / 2 - 16;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = Math.PI;
  const endAngle = startAngle + animVal * Math.PI;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = animVal > 0.5 ? 1 : 0;
  const trackEndX = cx + r * Math.cos(0);
  const trackEndY = cy + r * Math.sin(0);

  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size / 2 + 20}>
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${trackEndX} ${trackEndY}`} fill="none" stroke="#EEF6FB" strokeWidth="12" strokeLinecap="round" />
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
        <span className="text-2xl font-bold text-ink-900 tnum">{value}<span className="text-sm text-ink-500 ml-0.5">{unit}</span></span>
        {label && <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">{label}</span>}
      </div>
    </div>
  );
}

/* ---------- Area Chart (multi-series SVG) ---------- */
export function AreaChart({ series, height = 160, labels, maxVal }: { series: { name: string; data: number[]; color: string }[]; height?: number; labels?: string[]; maxVal?: number }) {
  const width = 300;
  const max = maxVal ?? Math.max(...series.flatMap((s) => s.data), 1);
  const min = 0;
  const range = max - min || 1;

  return (
    <div>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" y1={height * g} x2={width} y2={height * g} stroke="#DCE8F0" strokeWidth="0.5" strokeDasharray="2 2" />
        ))}
        {series.map((s, si) => {
          const pts = s.data.map((d, i) => {
            const x = (i / (s.data.length - 1)) * width;
            const y = height - ((d - min) / range) * (height - 8) - 4;
            return `${x},${y}`;
          });
          const path = `M ${pts.join(' L ')}`;
          const areaPath = `${path} L ${width},${height} L 0,${height} Z`;
          const gradId = `area-${si}-${Math.random().toString(36).slice(2, 7)}`;
          return (
            <g key={si}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill={`url(#${gradId})`} />
              <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
      {labels && (
        <div className="flex justify-between mt-1 px-1">
          {labels.map((l, i) => (
            <span key={i} className="text-[9px] text-ink-400">{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Toggle ---------- */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (b: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${checked ? 'bg-brand-500' : 'bg-ink-300'}`}
        style={{ height: 22 }}
      >
        <span
          className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
          style={{ width: 18, height: 18 }}
        />
      </button>
      {label && <span className="text-sm text-ink-700">{label}</span>}
    </label>
  );
}

/* ---------- Progress Bar ---------- */
export function Progress({ value, max = 100, color = '#1976B9', height = 6, showLabel = false }: { value: number; max?: number; color?: string; height?: number; showLabel?: boolean }) {
  const pct = Math.min(100, (value / max) * 100);
  const [animPct, setAnimPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 50);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div className="w-full">
      <div className="w-full rounded-full bg-surface-alt overflow-hidden" style={{ height }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${animPct}%`, background: color }}
        />
      </div>
      {showLabel && <span className="text-xs text-ink-500 mt-1 block">{Math.round(pct)}%</span>}
    </div>
  );
}
