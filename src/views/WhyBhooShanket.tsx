import { useApp, ALL_ZONES } from '../store';
import { Card, SectionHeader, SimTag } from '../components/ui';
import {
  Brain, GitBranch, ShieldCheck, MapPin, WifiOff, Bell, Users, Layers,
  CheckCircle2, ArrowRight, CloudRain, Cpu, AlertTriangle, Eye, Activity,
  Zap, Target, Crosshair, Mountain,
} from 'lucide-react';

const WORKFLOW = [
  { label: 'Multi-Source Data', desc: 'IoT sensors, weather stations, satellite data', icon: <Layers size={16} />, color: '#1976B9' },
  { label: 'Data Fusion', desc: 'Combine & normalize multi-source inputs', icon: <GitBranch size={16} />, color: '#55B9E6' },
  { label: 'AI Multi-Factor Risk Engine', desc: 'Weighted model across 5+ factors', icon: <Brain size={16} />, color: '#20A39E' },
  { label: 'Risk Score + Confidence', desc: 'Transparent, explainable probability', icon: <Target size={16} />, color: '#1976B9' },
  { label: 'Impact & Vulnerability Analysis', desc: 'Infrastructure & population exposure', icon: <AlertTriangle size={16} />, color: '#F97316' },
  { label: 'GIS Risk Map', desc: 'Spatial visualization of risk zones', icon: <MapPin size={16} />, color: '#55B9E6' },
  { label: 'Early Warning', desc: 'Tiered alert: Advisory → Critical', icon: <Bell size={16} />, color: '#DC2626' },
  { label: 'Field Verification', desc: 'Geo-tagged ground truth reports', icon: <Crosshair size={16} />, color: '#20A39E' },
  { label: 'Authority Response', desc: 'Incident management & team deployment', icon: <ShieldCheck size={16} />, color: '#1976B9' },
  { label: 'Rescue Prioritisation', desc: 'Risk-based task assignment', icon: <Users size={16} />, color: '#F97316' },
  { label: 'Citizen Safety', desc: 'Alerts, safe zones, evacuation routes', icon: <Mountain size={16} />, color: '#22A06B' },
];

const DIFFERENTIATORS = [
  { icon: <Brain size={22} />, title: 'Multi-Factor Prediction', desc: 'Not just rainfall — combines 5+ environmental factors with weighted AI model for accurate landslide risk prediction.', color: '#1976B9' },
  { icon: <Eye size={22} />, title: 'Explainable AI', desc: 'Every risk score shows exactly which factors contributed and by how much. Transparent, auditable, trustworthy.', color: '#20A39E' },
  { icon: <AlertTriangle size={22} />, title: 'Risk × Vulnerability', desc: 'Goes beyond hazard detection to assess infrastructure exposure, population density, and vulnerability index.', color: '#F97316' },
  { icon: <Crosshair size={22} />, title: 'Field Verification', desc: 'AI predictions are verified by on-ground field teams with geo-tagged photo evidence before action.', color: '#55B9E6' },
  { icon: <WifiOff size={22} />, title: 'Offline-First Concept', desc: 'Designed for remote mountain regions with poor connectivity. Local cache, batched sync, priority queues.', color: '#20A39E' },
  { icon: <Bell size={22} />, title: 'Geo-Targeted Alerts', desc: 'Alerts are targeted to specific zones and citizen groups — not blanket warnings. Multi-channel dispatch.', color: '#DC2626' },
  { icon: <Users size={22} />, title: 'Rescue Prioritisation', desc: 'Rescue teams and tasks are automatically prioritized by risk level, population affected, and vulnerability.', color: '#1976B9' },
  { icon: <Activity size={22} />, title: 'End-to-End Workflow', desc: 'Complete pipeline from sensor data to citizen safety — not just an alert system, a full disaster intelligence platform.', color: '#22A06B' },
];

export function WhyBhooShanket() {
  const { setView } = useApp();

  const stats = [
    { val: '5+', label: 'Risk Factors', sub: 'Weighted AI model' },
    { val: '8', label: 'NER States', sub: 'Full coverage' },
    { val: '17', label: 'Monitoring Zones', sub: 'IoT connected' },
    { val: '92%', label: 'AI Accuracy', sub: 'Prototype demo' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Why BhooShanket?</h1>
          <p className="text-sm text-ink-500 mt-1">Beyond simple rainfall alerts — a complete disaster intelligence ecosystem</p>
        </div>
        <SimTag text="SIH 2026 · Problem ID SIH26001" />
      </div>

      {/* Hero stats */}
      <Card className="p-8 topo-dense text-center">
        <h2 className="text-3xl font-bold text-ink-900 mb-2">A Complete Landslide Intelligence Ecosystem</h2>
        <p className="text-ink-500 max-w-2xl mx-auto mb-6">
          BhooShanket AI transforms environmental signals into actionable intelligence — from multi-source data fusion to AI risk prediction, field verification, and citizen safety.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-surface-card border border-line">
              <div className="text-3xl font-bold text-brand-500 tnum">{s.val}</div>
              <div className="text-sm font-semibold text-ink-900 mt-1">{s.label}</div>
              <div className="text-[11px] text-ink-500">{s.sub}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Workflow */}
      <Card className="p-6">
        <SectionHeader title="BhooShanket Workflow" subtitle="From environmental data to citizen safety" icon={<GitBranch size={18} />} />
        <div className="flex flex-col gap-2">
          {WORKFLOW.map((w, i) => (
            <div key={i} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0" style={{ background: `${w.color}15`, color: w.color }}>
                {w.icon}
              </div>
              <div className="flex-1 p-3 rounded-lg bg-surface-base border border-line">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-ink-400 tnum w-6">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-ink-900">{w.label}</span>
                    <span className="text-xs text-ink-500 ml-2">— {w.desc}</span>
                  </div>
                </div>
              </div>
              {i < WORKFLOW.length - 1 && <ArrowRight size={16} className="text-ink-300 rotate-90 absolute" style={{ marginLeft: 18, marginTop: 52 }} />}
            </div>
          ))}
        </div>
      </Card>

      {/* Differentiators */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-ink-900">Key Differentiators</h2>
          <p className="text-sm text-ink-500 mt-1">What makes BhooShanket different from simple rainfall alert systems</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIFFERENTIATORS.map((d, i) => (
            <Card key={i} hover className="p-5 animate-fade-up" >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0" style={{ background: `${d.color}15`, color: d.color }}>
                  {d.icon}
                </div>
                <div>
                  <h3 className="font-bold text-ink-900 mb-1">{d.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{d.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <Card className="p-6">
        <SectionHeader title="BhooShanket vs. Simple Rainfall Alerts" subtitle="Why multi-factor AI matters" icon={<Zap size={18} />} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left py-3 px-4 font-bold text-ink-900">Capability</th>
                <th className="text-center py-3 px-4 font-bold text-ink-400">Simple Rainfall Alert</th>
                <th className="text-center py-3 px-4 font-bold text-brand-500">BhooShanket AI</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cap: 'Multi-factor risk analysis', simple: false, bhoo: true },
                { cap: 'Explainable AI reasoning', simple: false, bhoo: true },
                { cap: 'Soil moisture & slope monitoring', simple: false, bhoo: true },
                { cap: 'Risk × Vulnerability assessment', simple: false, bhoo: true },
                { cap: 'GIS interactive risk map', simple: false, bhoo: true },
                { cap: 'Field verification system', simple: false, bhoo: true },
                { cap: 'Offline-first design', simple: false, bhoo: true },
                { cap: 'Geo-targeted citizen alerts', simple: 'Partial', bhoo: true },
                { cap: 'Rescue prioritisation', simple: false, bhoo: true },
                { cap: 'End-to-end workflow', simple: false, bhoo: true },
                { cap: 'Basic rainfall threshold alert', simple: true, bhoo: true },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-surface-base/50' : ''}>
                  <td className="py-3 px-4 font-medium text-ink-700">{row.cap}</td>
                  <td className="py-3 px-4 text-center">
                    {row.simple === true ? <CheckCircle2 size={16} className="text-risk-low mx-auto" /> :
                     row.simple === 'Partial' ? <span className="text-xs text-ink-400 font-semibold">Partial</span> :
                     <span className="text-ink-300">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle2 size={16} className="text-brand-500 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CTA */}
      <Card className="p-8 text-center bg-gradient-to-br from-brand-50/50 to-teal-50/50">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-400 text-white mb-4">
          <Mountain size={28} />
        </div>
        <h2 className="text-2xl font-bold text-ink-900 mb-2">Predict. Alert. Respond. Protect.</h2>
        <p className="text-ink-500 max-w-xl mx-auto mb-6">
          BhooShanket AI is a complete disaster intelligence platform built for the North Eastern Region of India.
        </p>
        <button onClick={() => setView('dashboard')} className="px-8 py-3.5 rounded-xl bg-brand-500 text-white font-semibold text-sm shadow-float hover:bg-brand-600 transition-all inline-flex items-center gap-2">
          Explore the Dashboard <ArrowRight size={18} />
        </button>
      </Card>
    </div>
  );
}
