import { useState } from 'react';
import { useApp, ALL_ZONES } from '../store';
import { Card, SectionHeader, SimTag, RiskBadge, LiveDot } from '../components/ui';
import {
  MapPin, Camera, FileText, Send, CheckCircle2, Clock, Map as MapIcon,
  Upload, Crosshair, Image as ImageIcon, AlertTriangle, Eye,
} from 'lucide-react';
import { RISK_META } from '../types';
import type { RiskLevel } from '../types';

interface FieldReport {
  id: string;
  location: string;
  zone: string;
  type: string;
  severity: RiskLevel;
  description: string;
  gps: string;
  hasPhoto: boolean;
  status: 'submitted' | 'verified' | 'rejected';
  time: string;
}

const INITIAL_REPORTS: FieldReport[] = [
  {
    id: 'FR-001',
    location: 'Near Cherrapunji Ridge',
    zone: 'Cherrapunji Ridge Alert',
    type: 'Soil Erosion',
    severity: 'critical',
    description: 'Visible soil erosion and crack formation on slope face. Water seepage observed.',
    gps: '25.2702°N, 91.7323°E',
    hasPhoto: true,
    status: 'verified',
    time: '15m ago',
  },
  {
    id: 'FR-002',
    location: 'Tawang Pass Road',
    zone: 'Tawang Ridge Monitor',
    type: 'Road Crack',
    severity: 'high',
    description: 'Road surface cracking observed near hairpin bend. Minor debris on road.',
    gps: '27.5860°N, 91.8594°E',
    hasPhoto: true,
    status: 'verified',
    time: '32m ago',
  },
  {
    id: 'FR-003',
    location: 'Shillong Hill Sector',
    zone: 'Shillong Monitoring Zone',
    type: 'Water Accumulation',
    severity: 'medium',
    description: 'Rainwater accumulation at base of slope. Drainage blocked.',
    gps: '25.5788°N, 91.8933°E',
    hasPhoto: false,
    status: 'submitted',
    time: '1h ago',
  },
];

export function FieldVerification() {
  const { selectZone, setView } = useApp();
  const [reports, setReports] = useState<FieldReport[]>(INITIAL_REPORTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    location: '',
    zone: ALL_ZONES[0].name,
    type: 'Soil Erosion',
    severity: 'high' as RiskLevel,
    description: '',
  });

  const submitReport = () => {
    const report: FieldReport = {
      id: `FR-${String(reports.length + 1).padStart(3, '0')}`,
      location: form.location || 'Field Location',
      zone: form.zone,
      type: form.type,
      severity: form.severity,
      description: form.description || 'No description provided.',
      gps: `${(25 + Math.random() * 3).toFixed(4)}°N, ${(91 + Math.random() * 2).toFixed(4)}°E`,
      hasPhoto: false,
      status: 'submitted',
      time: 'Just now',
    };
    setReports([report, ...reports]);
    setShowForm(false);
    setForm({ location: '', zone: ALL_ZONES[0].name, type: 'Soil Erosion', severity: 'high', description: '' });
  };

  const verifyReport = (id: string) => {
    setReports(reports.map((r) => r.id === id ? { ...r, status: 'verified' } : r));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Field Verification & Geo-tagged Reports</h1>
          <p className="text-sm text-ink-500 mt-1">On-ground verification of AI-detected risk zones</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveDot label="Live" />
          <SimTag text="Prototype Field Reports" />
        </div>
      </div>

      {/* Workflow */}
      <Card className="p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3">Field Verification Workflow</div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {[
            { label: 'AI Detects Risk', icon: <AlertTriangle size={14} /> },
            { label: 'Field Team Dispatched', icon: <MapPin size={14} /> },
            { label: 'On-Site Inspection', icon: <Eye size={14} /> },
            { label: 'Geo-tagged Report', icon: <Crosshair size={14} /> },
            { label: 'Photo Evidence', icon: <Camera size={14} /> },
            { label: 'Verified & Actioned', icon: <CheckCircle2 size={14} /> },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-alt">
                <span className="text-brand-500">{s.icon}</span>
                <span className="text-xs font-semibold text-ink-700">{s.label}</span>
              </div>
              {i < 5 && <span className="text-ink-300">→</span>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-ink-900">Field Reports ({reports.length})</span>
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">
              <FileText size={14} /> New Report
            </button>
          </div>

          {showForm && (
            <Card className="p-5 animate-slide-up">
              <SectionHeader title="Submit Field Report" subtitle="Geo-tagged ground verification" icon={<FileText size={18} />} />
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-ink-500 mb-1.5">Location Name</label>
                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Near Tawang Pass" className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface-base text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-ink-500 mb-1.5">Monitoring Zone</label>
                    <select value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface-card text-sm font-medium">
                      {ALL_ZONES.map((z) => <option key={z.name} value={z.name}>{z.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-ink-500 mb-1.5">Incident Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface-card text-sm font-medium">
                      <option>Soil Erosion</option>
                      <option>Road Crack</option>
                      <option>Water Accumulation</option>
                      <option>Debris Flow</option>
                      <option>Slope Failure</option>
                      <option>Tree Uprooting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-ink-500 mb-1.5">Severity</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['low', 'medium', 'high', 'critical'] as RiskLevel[]).map((r) => (
                        <button key={r} onClick={() => setForm({ ...form, severity: r })}
                          className={`py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${form.severity === r ? `${RISK_META[r].bg} ${RISK_META[r].text}` : 'bg-surface-card border-line text-ink-500'}`}
                          style={form.severity === r ? { borderColor: RISK_META[r].color, color: RISK_META[r].color } : {}}>
                          {RISK_META[r].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-ink-500 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe what you observed on-site..." className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface-base text-sm resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-surface-base border border-line border-dashed flex items-center gap-3">
                    <Crosshair size={20} className="text-brand-500" />
                    <div>
                      <div className="text-xs font-semibold text-ink-700">GPS Location</div>
                      <div className="text-[11px] text-ink-500 tnum">{(25 + Math.random() * 3).toFixed(4)}°N, {(91 + Math.random() * 2).toFixed(4)}°E</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-base border border-line border-dashed flex items-center gap-3 cursor-pointer hover:bg-surface-alt transition-colors">
                    <Upload size={20} className="text-teal-400" />
                    <div>
                      <div className="text-xs font-semibold text-ink-700">Photo Upload</div>
                      <div className="text-[11px] text-ink-500">Click to attach (simulated)</div>
                    </div>
                  </div>
                </div>
                <button onClick={submitReport} className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600 flex items-center justify-center gap-2">
                  <Send size={16} /> Submit Report
                </button>
              </div>
            </Card>
          )}

          {reports.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${RISK_META[r.severity].bg}`} style={{ color: RISK_META[r.severity].color }}>
                    <MapPin size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-ink-900">{r.location}</span>
                      <RiskBadge level={r.severity} size="sm" />
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">{r.id} · {r.type} · {r.time}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full shrink-0 ${
                  r.status === 'verified' ? 'bg-risk-lowBg text-risk-low' :
                  r.status === 'rejected' ? 'bg-risk-critBg text-risk-crit' :
                  'bg-surface-alt text-ink-500'
                }`}>{r.status}</span>
              </div>
              <p className="text-sm text-ink-700 mb-2">{r.description}</p>
              <div className="flex items-center gap-3 text-xs text-ink-500">
                <span className="flex items-center gap-1"><Crosshair size={12} /> {r.gps}</span>
                {r.hasPhoto && <span className="flex items-center gap-1 text-teal-500"><ImageIcon size={12} /> Photo attached</span>}
              </div>
              {r.status === 'submitted' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => verifyReport(r.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-risk-lowBg text-risk-low text-xs font-semibold hover:bg-risk-lowBg/80">
                    <CheckCircle2 size={13} /> Verify
                  </button>
                  <button onClick={() => { selectZone(r.zone); setView('risk'); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-alt text-ink-700 text-xs font-semibold hover:bg-surface-base">
                    <MapIcon size={13} /> View Zone
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Side: GPS/Photo mock */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-ink-900 mb-3 flex items-center gap-2"><Crosshair size={18} className="text-brand-500" /> GPS Tagging</h3>
            <div className="relative w-full h-40 rounded-xl bg-surface-base border border-line overflow-hidden topo-dense">
              <svg viewBox="0 0 200 150" className="w-full h-full">
                <g fill="none" stroke="#DCE8F0" strokeWidth="0.5">
                  {Array.from({ length: 6 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 25} x2="200" y2={i * 25} />)}
                  {Array.from({ length: 8 }, (_, i) => <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="150" />)}
                </g>
                <g>
                  <circle cx="100" cy="75" r="8" fill="#1976B9" opacity="0.2">
                    <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="100" cy="75" r="5" fill="#1976B9" stroke="white" strokeWidth="2" />
                </g>
                <text x="100" y="95" fontSize="7" fill="#1976B9" textAnchor="middle" fontWeight="700">Field Location</text>
              </svg>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-surface-base border border-line">
              <div className="text-[10px] font-bold uppercase text-ink-500">Coordinates</div>
              <div className="text-sm font-bold text-ink-900 tnum mt-0.5">25.2702°N, 91.7323°E</div>
              <div className="text-[11px] text-ink-500 mt-1">Accuracy: ±3m (Simulated GPS)</div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-ink-900 mb-3 flex items-center gap-2"><Camera size={18} className="text-teal-500" /> Photo Evidence</h3>
            <div className="space-y-2">
              {reports.filter(r => r.hasPhoto).map((r) => (
                <div key={r.id} className="p-3 rounded-lg bg-surface-base border border-line">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-surface-alt text-teal-400">
                      <ImageIcon size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-ink-900 truncate">{r.location}</div>
                      <div className="text-[10px] text-ink-500">{r.id} · {r.time}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-3 rounded-lg bg-surface-base border border-line border-dashed text-center text-xs text-ink-400">
                Photo upload is simulated in this prototype
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
