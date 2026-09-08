import { useState } from 'react';
import { useApp } from '../store';
import { Card, SectionHeader, SimTag, RiskBadge, LiveDot } from '../components/ui';
import {
  Bell, AlertTriangle, Eye, CheckCircle2, ArrowUpCircle, Clock, MapPin, Brain,
  ChevronRight, X,
} from 'lucide-react';
import { RISK_META } from '../types';
import type { AlertInfo } from '../types';

export function AlertCenter() {
  const { alerts, updateAlert, selectZone, setView } = useApp();
  const [selected, setSelected] = useState<AlertInfo | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const sorted = [...alerts].sort((a, b) => {
    const order = { critical: 3, high: 2, medium: 1, low: 0 };
    return order[b.risk] - order[a.risk];
  });

  const filtered = filter === 'all' ? sorted : sorted.filter((a) => a.risk === filter);

  const counts = {
    all: alerts.length,
    critical: alerts.filter((a) => a.risk === 'critical').length,
    high: alerts.filter((a) => a.risk === 'high').length,
    medium: alerts.filter((a) => a.risk === 'medium').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Emergency Alert Center</h1>
          <p className="text-sm text-ink-500 mt-1">AI-detected landslide risk alerts and response actions</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveDot label="Live" />
          <SimTag text="Demo Alerts" />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: 'all', label: 'All Alerts', count: counts.all },
          { key: 'critical', label: 'Critical', count: counts.critical },
          { key: 'high', label: 'High', count: counts.high },
          { key: 'medium', label: 'Medium', count: counts.medium },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.key ? 'bg-brand-500 text-white shadow-float' : 'bg-surface-card border border-line text-ink-700 hover:bg-surface-alt'
            }`}
          >
            {f.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f.key ? 'bg-white/20' : 'bg-surface-alt'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((a) => (
            <Card key={a.id} hover className={`p-5 border-l-4 ${selected?.id === a.id ? 'ring-2 ring-brand-200' : ''}`} onClick={() => setSelected(a)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${RISK_META[a.risk].bg}`} style={{ color: RISK_META[a.risk].color }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-ink-900">{a.location}</span>
                      <RiskBadge level={a.risk} size="sm" />
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">{a.district} · {a.state} · {a.id}</div>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-ink-500">AI: <span className="font-bold text-ink-900">{a.probability}%</span></span>
                      <span className="text-ink-300">·</span>
                      <span className="text-ink-500 flex items-center gap-1"><Clock size={12} /> {a.detectedTime}</span>
                      <span className="text-ink-300">·</span>
                      <span className={`font-semibold capitalize ${a.status === 'new' ? 'text-risk-crit' : a.status === 'escalated' ? 'text-risk-high' : 'text-ink-500'}`}>{a.status}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-ink-300 shrink-0" />
              </div>

              {/* Factors */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {a.factors.map((f, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-surface-alt text-ink-700 font-medium">{f}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <Card className="p-5 animate-slide-in-right sticky top-20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-ink-900">{selected.location}</h3>
                  <p className="text-xs text-ink-500">{selected.district} · {selected.state}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-ink-400 hover:text-ink-900"><X size={16} /></button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <span className="text-xs text-ink-500">Alert ID</span>
                  <span className="text-sm font-bold text-ink-900">{selected.id}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <span className="text-xs text-ink-500">Risk Level</span>
                  <RiskBadge level={selected.risk} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <span className="text-xs text-ink-500">AI Probability</span>
                  <span className="text-lg font-bold tnum" style={{ color: RISK_META[selected.risk].color }}>{selected.probability}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <span className="text-xs text-ink-500">Detected</span>
                  <span className="text-sm font-bold text-ink-900">{selected.detectedTime}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <span className="text-xs text-ink-500">Status</span>
                  <span className={`text-sm font-bold capitalize ${selected.status === 'new' ? 'text-risk-crit' : selected.status === 'escalated' ? 'text-risk-high' : 'text-ink-900'}`}>{selected.status}</span>
                </div>
              </div>

              {/* Factors */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-2">Primary Risk Factors</div>
                <div className="space-y-1.5">
                  {selected.factors.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-ink-700">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: RISK_META[selected.risk].color }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended action */}
              <div className={`p-3 rounded-xl ${RISK_META[selected.risk].bg} border ${RISK_META[selected.risk].border} mb-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <Brain size={16} style={{ color: RISK_META[selected.risk].color }} />
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: RISK_META[selected.risk].color }}>Recommended Action</span>
                </div>
                <p className="text-sm text-ink-700">{selected.action}</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { updateAlert(selected.id, { status: 'acknowledged' }); setSelected({ ...selected, status: 'acknowledged' }); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-brand-50 text-brand-600 text-xs font-semibold hover:bg-brand-100 transition-colors"
                >
                  <CheckCircle2 size={14} /> Acknowledge
                </button>
                <button
                  onClick={() => { updateAlert(selected.id, { status: 'review' }); setSelected({ ...selected, status: 'review' }); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-surface-alt text-ink-700 text-xs font-semibold hover:bg-surface-base transition-colors"
                >
                  <Eye size={14} /> Under Review
                </button>
                <button
                  onClick={() => { updateAlert(selected.id, { status: 'escalated' }); setSelected({ ...selected, status: 'escalated' }); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-risk-highBg text-risk-high text-xs font-semibold hover:bg-risk-highBg/80 transition-colors"
                >
                  <ArrowUpCircle size={14} /> Escalate
                </button>
                <button
                  onClick={() => { selectZone(selected.location); setView('risk'); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-surface-alt text-ink-700 text-xs font-semibold hover:bg-surface-base transition-colors"
                >
                  <MapPin size={14} /> View Intel
                </button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center sticky top-20">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-surface-alt text-ink-300 mb-3">
                <Bell size={24} />
              </div>
              <h3 className="font-bold text-ink-900 mb-1">Select an Alert</h3>
              <p className="text-sm text-ink-500">Click any alert to view details and take action.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
