import { useState } from 'react';
import { useApp } from '../store';
import { Card, SectionHeader, SimTag, RiskBadge, LiveDot, Progress } from '../components/ui';
import {
  ShieldCheck, Send, UserCheck, Users, Zap, Home, CheckCircle2, Clock,
  ChevronRight, X, AlertTriangle, MapPin,
} from 'lucide-react';
import { RISK_META } from '../types';
import type { IncidentInfo } from '../types';

const STATUS_FLOW = ['monitoring', 'review', 'deployed', 'evacuation', 'resolved'];
const STATUS_LABELS: Record<string, string> = {
  monitoring: 'Monitoring',
  review: 'Under Review',
  deployed: 'Response Deployed',
  evacuation: 'Evacuation Prepared',
  resolved: 'Resolved',
};
const STATUS_COLORS: Record<string, string> = {
  monitoring: '#64798A',
  review: '#EAB308',
  deployed: '#1976B9',
  evacuation: '#F97316',
  resolved: '#22A06B',
};

export function AuthorityResponse() {
  const { incidents, updateIncident } = useApp();
  const [selected, setSelected] = useState<IncidentInfo | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Authority Response System</h1>
          <p className="text-sm text-ink-500 mt-1">Incident management and response coordination</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveDot label="Live" />
          <SimTag text="Prototype IMS" />
        </div>
      </div>

      {/* Incident lifecycle */}
      <Card className="p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3">Incident Lifecycle</div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {STATUS_FLOW.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${STATUS_COLORS[s]}15` }}>
                <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[s] }} />
                <span className="text-xs font-semibold" style={{ color: STATUS_COLORS[s] }}>{STATUS_LABELS[s]}</span>
              </div>
              {i < STATUS_FLOW.length - 1 && <ChevronRight size={14} className="text-ink-300" />}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident list */}
        <div className="lg:col-span-2 space-y-3">
          {incidents.map((inc) => (
            <Card key={inc.id} hover className={`p-5 ${selected?.id === inc.id ? 'ring-2 ring-brand-200' : ''}`} onClick={() => setSelected(inc)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${RISK_META[inc.risk].bg}`} style={{ color: RISK_META[inc.risk].color }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-ink-900">{inc.location}</span>
                      <RiskBadge level={inc.risk} size="sm" />
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">{inc.district} · {inc.id}</div>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-ink-500">Authority: <span className="font-semibold text-ink-900">{inc.authority}</span></span>
                      <span className="text-ink-300">·</span>
                      <span className="text-ink-500">Team: <span className="font-semibold text-ink-900">{inc.team}</span></span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-1 rounded-full" style={{ background: `${STATUS_COLORS[inc.status]}15`, color: STATUS_COLORS[inc.status] }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[inc.status] }} />
                    {STATUS_LABELS[inc.status]}
                  </span>
                  <div className="text-[10px] text-ink-400 mt-1.5">{inc.lastUpdated}</div>
                </div>
              </div>

              {/* Status progress */}
              <div className="mt-3 flex items-center gap-1">
                {STATUS_FLOW.map((s, i) => {
                  const currentIdx = STATUS_FLOW.indexOf(inc.status);
                  const done = i <= currentIdx;
                  return (
                    <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${done ? '' : 'bg-surface-alt'}`} style={{ background: done ? STATUS_COLORS[inc.status] : undefined }}>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <Card className="p-5 sticky top-20 animate-slide-in-right">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-ink-900">{selected.location}</h3>
                  <p className="text-xs text-ink-500">{selected.district} · {selected.id}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-ink-400 hover:text-ink-900"><X size={16} /></button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <span className="text-xs text-ink-500">Risk Level</span>
                  <RiskBadge level={selected.risk} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <span className="text-xs text-ink-500">Priority</span>
                  <RiskBadge level={selected.priority} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <span className="text-xs text-ink-500">Assigned Authority</span>
                  <span className="text-sm font-bold text-ink-900">{selected.authority}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <span className="text-xs text-ink-500">Response Team</span>
                  <span className="text-sm font-bold text-ink-900">{selected.team}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <span className="text-xs text-ink-500">Current Status</span>
                  <span className="text-sm font-bold" style={{ color: STATUS_COLORS[selected.status] }}>{STATUS_LABELS[selected.status]}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-2">Response Actions</div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => { updateIncident(selected.id, { status: 'review' }); setSelected({ ...selected, status: 'review' }); }}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-surface-alt text-ink-700 text-sm font-semibold hover:bg-surface-base transition-colors"
                >
                  <Send size={14} /> Send Warning
                </button>
                <button
                  onClick={() => { updateIncident(selected.id, { status: 'deployed' }); setSelected({ ...selected, status: 'deployed' }); }}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-brand-50 text-brand-600 text-sm font-semibold hover:bg-brand-100 transition-colors"
                >
                  <UserCheck size={14} /> Notify Authority & Deploy
                </button>
                <button
                  onClick={() => { updateIncident(selected.id, { status: 'deployed' }); setSelected({ ...selected, status: 'deployed' }); }}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-surface-alt text-ink-700 text-sm font-semibold hover:bg-surface-base transition-colors"
                >
                  <Users size={14} /> Assign Rescue Team
                </button>
                <button
                  onClick={() => { updateIncident(selected.id, { status: 'evacuation' }); setSelected({ ...selected, status: 'evacuation' }); }}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-risk-highBg text-risk-high text-sm font-semibold hover:bg-risk-highBg/80 transition-colors"
                >
                  <Zap size={14} /> Activate Response & Prepare Evacuation
                </button>
                <button
                  onClick={() => { updateIncident(selected.id, { status: 'resolved' }); setSelected({ ...selected, status: 'resolved' }); }}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-risk-lowBg text-risk-low text-sm font-semibold hover:bg-risk-lowBg/80 transition-colors"
                >
                  <CheckCircle2 size={14} /> Mark Resolved
                </button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center sticky top-20">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-surface-alt text-ink-300 mb-3">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-ink-900 mb-1">Select an Incident</h3>
              <p className="text-sm text-ink-500">Click any incident to manage response actions.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export function RescueOps() {
  const { tasks, updateTask } = useApp();

  const statusColors: Record<string, string> = {
    assigned: '#64798A',
    'in-progress': '#1976B9',
    completed: '#22A06B',
  };
  const statusLabels: Record<string, string> = {
    assigned: 'Assigned',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Rescue Operations</h1>
          <p className="text-sm text-ink-500 mt-1">Team task management and coordination</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveDot label="Live" />
          <SimTag text="Prototype Ops" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-ink-900 tnum">{tasks.filter(t => t.status === 'assigned').length}</div>
          <div className="text-xs text-ink-500 font-medium mt-1">Assigned</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-brand-500 tnum">{tasks.filter(t => t.status === 'in-progress').length}</div>
          <div className="text-xs text-ink-500 font-medium mt-1">In Progress</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-risk-low tnum">{tasks.filter(t => t.status === 'completed').length}</div>
          <div className="text-xs text-ink-500 font-medium mt-1">Completed</div>
        </Card>
      </div>

      {/* Task cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink-900">{t.team}</span>
                  <RiskBadge level={t.priority} size="sm" />
                </div>
                <div className="text-xs text-ink-500 mt-0.5 flex items-center gap-1">
                  <MapPin size={12} /> {t.location}
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-1 rounded-full" style={{ background: `${statusColors[t.status]}15`, color: statusColors[t.status] }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[t.status] }} />
                {statusLabels[t.status]}
              </span>
            </div>

            <p className="text-sm text-ink-700 mb-4">{t.task}</p>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-ink-500">Progress</span>
                <span className="text-sm font-bold text-brand-500 tnum">{t.progress}%</span>
              </div>
              <Progress value={t.progress} color={statusColors[t.status]} />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-500 flex items-center gap-1"><Clock size={12} /> ETA: <span className="font-semibold text-ink-900">{t.eta}</span></span>
              <div className="flex gap-1.5">
                {t.status !== 'completed' && (
                  <button
                    onClick={() => updateTask(t.id, { status: 'in-progress', progress: Math.min(100, t.progress + 25) })}
                    className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-600 text-xs font-semibold hover:bg-brand-100"
                  >
                    Advance
                  </button>
                )}
                {t.status !== 'completed' && (
                  <button
                    onClick={() => updateTask(t.id, { status: 'completed', progress: 100, eta: 'Complete' })}
                    className="px-3 py-1.5 rounded-lg bg-risk-lowBg text-risk-low text-xs font-semibold hover:bg-risk-lowBg/80"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
