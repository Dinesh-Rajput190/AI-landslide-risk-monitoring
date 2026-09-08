import { useState } from 'react';
import { useApp, ALL_ZONES } from '../store';
import { Card, SimTag, RiskBadge, LiveDot } from '../components/ui';
import {
  ShieldCheck, AlertCircle, CheckCircle2, Phone, MapPin, Send, Heart,
  Navigation, Route, ArrowRight, BookOpen, CloudRain, Home, Users, X,
} from 'lucide-react';
import { RISK_META } from '../types';
import type { RiskLevel } from '../types';

export function CitizenSafety() {
  const { addEmergencyRequest, setView, emergencyRequests } = useApp();
  const [status, setStatus] = useState<'idle' | 'safe' | 'help'>('idle');
  const [form, setForm] = useState({ name: '', phone: '', location: '', type: 'Landslide Risk', note: '' });
  const [submitted, setSubmitted] = useState(false);

  const submitHelp = () => {
    const req = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      name: form.name || 'Anonymous Citizen',
      phone: form.phone,
      location: form.location || 'Unknown Location',
      type: form.type,
      note: form.note,
      time: 'Just now',
      status: 'pending' as const,
    };
    addEmergencyRequest(req);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Citizen Safety Interface</h1>
          <p className="text-sm text-ink-500 mt-1">Report your status and request emergency help</p>
        </div>
        <SimTag text="Prototype Citizen Portal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main safety check */}
        <Card className="lg:col-span-2 p-8 text-center">
          {status === 'idle' && !submitted && (
            <div className="animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-50 text-brand-500 mb-5 animate-breathe">
                <ShieldCheck size={36} />
              </div>
              <h2 className="text-3xl font-bold text-ink-900 mb-2">Are You Safe?</h2>
              <p className="text-ink-500 mb-8 max-w-md mx-auto">Report your current safety status. Your response helps authorities coordinate rescue efforts.</p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <button
                  onClick={() => setStatus('safe')}
                  className="flex-1 py-5 rounded-2xl bg-risk-lowBg border-2 border-risk-low/30 text-risk-low font-bold text-lg hover:bg-risk-lowBg/70 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={24} /> I Am Safe
                </button>
                <button
                  onClick={() => setStatus('help')}
                  className="flex-1 py-5 rounded-2xl bg-risk-critBg border-2 border-risk-crit/30 text-risk-crit font-bold text-lg hover:bg-risk-critBg/70 transition-all flex items-center justify-center gap-2"
                >
                  <AlertCircle size={24} /> I Need Help
                </button>
              </div>
            </div>
          )}

          {status === 'safe' && (
            <div className="animate-fade-up py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-risk-lowBg text-risk-low mb-5">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold text-ink-900 mb-2">Safety Status Recorded</h2>
              <p className="text-ink-500 max-w-md mx-auto mb-6">Your safety status has been recorded in this prototype. Stay alert and follow authority instructions.</p>
              <button onClick={() => setStatus('idle')} className="px-6 py-3 rounded-xl bg-brand-50 text-brand-600 font-semibold text-sm hover:bg-brand-100 transition-colors">
                Back to Safety Check
              </button>
            </div>
          )}

          {status === 'help' && !submitted && (
            <div className="text-left animate-slide-up">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-risk-critBg text-risk-crit mb-3">
                  <AlertCircle size={28} />
                </div>
                <h2 className="text-2xl font-bold text-ink-900">Emergency Help Request</h2>
                <p className="text-sm text-ink-500 mt-1">Fill this form to send a request to the response control center.</p>
              </div>

              <div className="space-y-4 max-w-lg mx-auto">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl border border-line bg-surface-base text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">Phone Number</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Your contact number" className="w-full px-4 py-3 rounded-xl border border-line bg-surface-base text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Your current location or nearby landmark" className="w-full px-4 py-3 rounded-xl border border-line bg-surface-base text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">Emergency Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-line bg-surface-card text-sm font-medium">
                    <option>Landslide Risk</option>
                    <option>Trapped by Debris</option>
                    <option>Flooding</option>
                    <option>Need Evacuation</option>
                    <option>Medical Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">Additional Note</label>
                  <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={3} placeholder="Describe your situation..." className="w-full px-4 py-3 rounded-xl border border-line bg-surface-base text-sm resize-none" />
                </div>
                <button onClick={submitHelp} className="w-full py-4 rounded-xl bg-risk-crit text-white font-bold text-sm shadow-float hover:bg-risk-crit/90 transition-all flex items-center justify-center gap-2">
                  <Send size={18} /> Send Help Request
                </button>
              </div>
            </div>
          )}

          {submitted && (
            <div className="animate-fade-up py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-risk-lowBg text-risk-low mb-5">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold text-ink-900 mb-2">Request Sent</h2>
              <p className="text-ink-500 max-w-md mx-auto mb-6">Your emergency request has been sent to the prototype response control center. Authorities have been notified.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => { setSubmitted(false); setStatus('idle'); }} className="px-6 py-3 rounded-xl bg-brand-50 text-brand-600 font-semibold text-sm hover:bg-brand-100">
                  Submit Another
                </button>
                <button onClick={() => setView('response')} className="px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600">
                  View in Response Center
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Side: emergency contacts quick access */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-ink-900 mb-3 flex items-center gap-2"><Phone size={18} className="text-brand-500" /> Quick Emergency Numbers</h3>
            <div className="space-y-2">
              {[
                { name: 'Police', num: '100' },
                { name: 'Ambulance', num: '108' },
                { name: 'Fire & Rescue', num: '101' },
                { name: 'NDRF', num: '1077' },
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <span className="text-sm font-medium text-ink-700">{c.name}</span>
                  <span className="text-lg font-bold text-brand-500 tnum">{c.num}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-ink-900 mb-3 flex items-center gap-2"><Heart size={18} className="text-risk-crit" /> Emergency Requests</h3>
            {emergencyRequests.length === 0 ? (
              <p className="text-sm text-ink-400">No requests submitted yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {emergencyRequests.map((r) => (
                  <div key={r.id} className="p-3 rounded-lg bg-surface-base border border-line">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-900">{r.name}</span>
                      <span className="text-[10px] font-bold uppercase text-risk-crit bg-risk-critBg px-2 py-0.5 rounded-full">{r.status}</span>
                    </div>
                    <div className="text-xs text-ink-500 mt-1">{r.location} · {r.type}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-ink-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={() => setView('safezones')} className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line hover:border-brand-200 transition-colors text-sm font-medium text-ink-700">
                <span className="flex items-center gap-2"><MapPin size={16} className="text-brand-500" /> Find Safe Zones</span>
                <ArrowRight size={14} className="text-ink-400" />
              </button>
              <button onClick={() => setView('saferoutes')} className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line hover:border-brand-200 transition-colors text-sm font-medium text-ink-700">
                <span className="flex items-center gap-2"><Route size={16} className="text-teal-400" /> Find Safe Route</span>
                <ArrowRight size={14} className="text-ink-400" />
              </button>
              <button onClick={() => setView('precautions')} className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line hover:border-brand-200 transition-colors text-sm font-medium text-ink-700">
                <span className="flex items-center gap-2"><BookOpen size={16} className="text-brand-500" /> Safety Precautions</span>
                <ArrowRight size={14} className="text-ink-400" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function SafeZones() {
  const { selectedZone, selectZone } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Safe Zone Finder</h1>
          <p className="text-sm text-ink-500 mt-1">Nearby shelters, assembly areas, and low-risk locations</p>
        </div>
        <SimTag text="Prototype Safe Zones" />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-ink-700">Monitoring Zone:</span>
          <select value={selectedZone.name} onChange={(e) => selectZone(e.target.value)} className="px-3 py-2 rounded-lg border border-line bg-surface-card text-sm font-medium text-ink-900">
            {ALL_ZONES.map((z) => <option key={z.name} value={z.name}>{z.name}</option>)}
          </select>
        </div>
      </Card>

      {/* Safe zone visual map */}
      <Card className="p-6">
        <div className="relative w-full h-56 rounded-xl bg-surface-base border border-line overflow-hidden topo-dense">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Current location */}
            <g>
              <circle cx="200" cy="100" r="6" fill="#1976B9" stroke="white" strokeWidth="2" />
              <circle cx="200" cy="100" r="12" fill="#1976B9" opacity="0.2">
                <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="200" y="85" fontSize="7" fill="#1976B9" textAnchor="middle" fontWeight="700">You</text>
            </g>
            {/* Safe zones */}
            {selectedZone.safeZones.map((sz, i) => {
              const x = 80 + i * 120;
              const y = 60 + (i % 2) * 80;
              return (
                <g key={i}>
                  <line x1="200" y1="100" x2={x} y2={y} stroke="#22A06B" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 3" />
                  <circle cx={x} cy={y} r="8" fill="#22A06B" opacity="0.2" />
                  <circle cx={x} cy={y} r="5" fill="#22A06B" stroke="white" strokeWidth="1.5" />
                  <text x={x} y={y - 12} fontSize="6" fill="#22A06B" textAnchor="middle" fontWeight="600">{sz.name.substring(0, 14)}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </Card>

      {/* Safe zone cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedZone.safeZones.map((sz, i) => (
          <Card key={i} hover className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-risk-lowBg text-risk-low">
                  {sz.type === 'shelter' ? <Home size={18} /> : sz.type === 'assembly' ? <Users size={18} /> : <MapPin size={18} />}
                </div>
                <div>
                  <div className="text-sm font-bold text-ink-900">{sz.name}</div>
                  <div className="text-[11px] text-ink-500 capitalize">{sz.type.replace('-', ' ')}</div>
                </div>
              </div>
              <RiskBadge level={sz.risk} size="sm" />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-2.5 rounded-lg bg-surface-base border border-line text-center">
                <div className="text-sm font-bold text-ink-900 tnum">{sz.distance.toFixed(1)}km</div>
                <div className="text-[9px] text-ink-500">Distance</div>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-base border border-line text-center">
                <div className="text-sm font-bold text-ink-900 tnum">{sz.capacity}</div>
                <div className="text-[9px] text-ink-500">Capacity</div>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-base border border-line text-center">
                <div className="text-sm font-bold text-risk-low tnum">{sz.availability}%</div>
                <div className="text-[9px] text-ink-500">Available</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-lg bg-brand-50 text-brand-600 text-xs font-semibold hover:bg-brand-100 transition-colors flex items-center justify-center gap-1.5">
                <MapPin size={13} /> View on Map
              </button>
              <button className="flex-1 py-2.5 rounded-lg bg-teal-50 text-teal-500 text-xs font-semibold hover:bg-teal-100 transition-colors flex items-center justify-center gap-1.5">
                <Navigation size={13} /> Directions
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SafeRoutes() {
  const { selectedZone } = useApp();
  const [from] = useState('Current Location');
  const [to, setTo] = useState(selectedZone.safeZones[0]?.name ?? 'Safe Shelter');

  const routeRisk: { segment: string; risk: RiskLevel }[] = [
    { segment: 'Start → Checkpoint A', risk: selectedZone.risk },
    { segment: 'Checkpoint A → Ridge Path', risk: 'low' },
    { segment: 'Ridge Path → Safe Zone', risk: 'low' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Find Safest Route</h1>
          <p className="text-sm text-ink-500 mt-1">Route optimized to avoid high-risk and critical zones</p>
        </div>
        <SimTag text="Prototype Route Simulation" />
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1.5">Current Location</label>
            <div className="px-4 py-3 rounded-xl border border-line bg-surface-base text-sm font-medium text-ink-900 flex items-center gap-2">
              <MapPin size={16} className="text-brand-500" /> {from} · {selectedZone.district}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1.5">Destination</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-line bg-surface-card text-sm font-medium text-ink-900">
              {selectedZone.safeZones.map((sz) => <option key={sz.name} value={sz.name}>{sz.name}</option>)}
            </select>
          </div>
        </div>

        {/* Route visual */}
        <div className="relative w-full h-64 rounded-xl bg-surface-base border border-line overflow-hidden topo-dense mb-6">
          <svg viewBox="0 0 400 250" className="w-full h-full">
            {/* Risk zones to avoid */}
            <circle cx="160" cy="80" r="25" fill="#F97316" opacity="0.08" />
            <circle cx="160" cy="80" r="18" fill="#F97316" opacity="0.12" />
            <text x="160" y="84" fontSize="7" fill="#F97316" textAnchor="middle" fontWeight="600">High Risk</text>

            <circle cx="280" cy="170" r="22" fill="#DC2626" opacity="0.08" />
            <circle cx="280" cy="170" r="15" fill="#DC2626" opacity="0.12" />
            <text x="280" y="174" fontSize="7" fill="#DC2626" textAnchor="middle" fontWeight="600">Critical</text>

            {/* Safe route path */}
            <path d="M40,200 Q80,160 120,150 T220,100 T380,40" fill="none" stroke="#22A06B" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 4" className="animate-route-dash" />
            <path d="M40,200 Q80,160 120,150 T220,100 T380,40" fill="none" stroke="#22A06B" strokeWidth="1" strokeLinecap="round" opacity="0.3" />

            {/* Start */}
            <circle cx="40" cy="200" r="6" fill="#1976B9" stroke="white" strokeWidth="2" />
            <text x="40" y="218" fontSize="8" fill="#1976B9" textAnchor="middle" fontWeight="700">Start</text>

            {/* End */}
            <circle cx="380" cy="40" r="7" fill="#22A06B" stroke="white" strokeWidth="2" />
            <circle cx="380" cy="40" r="12" fill="#22A06B" opacity="0.2">
              <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="380" y="28" fontSize="8" fill="#22A06B" textAnchor="middle" fontWeight="700">Safe Zone</text>

            {/* Checkpoints */}
            <circle cx="120" cy="150" r="3" fill="#20A39E" />
            <circle cx="220" cy="100" r="3" fill="#20A39E" />
          </svg>
        </div>

        {/* Route details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-surface-base border border-line">
            <div className="text-[10px] font-bold uppercase text-ink-500">Est. Distance</div>
            <div className="text-xl font-bold text-ink-900 tnum mt-1">{(selectedZone.safeZones[0]?.distance ?? 2.5) * 1.3}km</div>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-base border border-line">
            <div className="text-[10px] font-bold uppercase text-ink-500">Est. Time</div>
            <div className="text-xl font-bold text-ink-900 tnum mt-1">~45 min</div>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-base border border-line">
            <div className="text-[10px] font-bold uppercase text-ink-500">Route Status</div>
            <div className="text-xl font-bold text-risk-low mt-1">Safe</div>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-base border border-line">
            <div className="text-[10px] font-bold uppercase text-ink-500">Risk Along Route</div>
            <div className="text-xl font-bold text-risk-low mt-1">Low</div>
          </div>
        </div>

        {/* Segment breakdown */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-2">Route Segments</div>
          {routeRisk.map((seg, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-500 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm font-medium text-ink-700">{seg.segment}</span>
              </div>
              <RiskBadge level={seg.risk} size="sm" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function Precautions() {
  const { selectedZone } = useApp();
  const risk = selectedZone.risk;

  const precautions: Record<RiskLevel, { title: string; items: string[] }> = {
    low: {
      title: 'Stay Informed',
      items: [
        'Monitor weather updates and official alerts regularly.',
        'Keep emergency contact numbers saved on your phone.',
        'Be aware of your surroundings and nearby safe zones.',
        'Follow social media channels of local disaster management authority.',
      ],
    },
    medium: {
      title: 'Stay Prepared',
      items: [
        'Avoid traveling through vulnerable slope areas during rainfall.',
        'Keep an emergency kit ready (water, food, first aid, torch).',
        'Charge your phone and keep a power bank available.',
        'Inform family members about your location and plans.',
        'Monitor emergency alerts closely.',
      ],
    },
    high: {
      title: 'Stay Alert',
      items: [
        'Avoid travelling through vulnerable slope areas.',
        'Monitor emergency alerts continuously.',
        'Keep emergency contacts available and accessible.',
        'Follow authority instructions at all times.',
        'Move to safer locations when advised by authorities.',
        'Do not attempt to cross landslide-affected roads.',
      ],
    },
    critical: {
      title: 'Act Now — Evacuate',
      items: [
        'Evacuate immediately to the nearest safe zone or shelter.',
        'Do not wait for further warnings — move to higher ground.',
        'Avoid vulnerable slope areas, riverbanks, and debris paths.',
        'Follow authority instructions and evacuation routes.',
        'Help elderly, children, and disabled persons to evacuate.',
        'Do not return until authorities declare the area safe.',
        'Call 1077 (NDRF) or 100 (Police) if you need rescue assistance.',
      ],
    },
  };

  const prec = precautions[risk];
  const m = RISK_META[risk];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Safety Precautions</h1>
          <p className="text-sm text-ink-500 mt-1">Dynamic guidance based on current risk level</p>
        </div>
        <SimTag text="Prototype Safety Guidance" />
      </div>

      {/* Current risk banner */}
      <Card className={`p-6 border-2 ${m.border}`}>
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${m.bg}`} style={{ color: m.color }}>
            <CloudRain size={28} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-500">Current Risk at {selectedZone.name}</div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-bold" style={{ color: m.color }}>{m.label} Risk</span>
              <RiskBadge level={risk} />
            </div>
          </div>
        </div>
      </Card>

      {/* Precautions */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={20} className="text-brand-500" />
          <h2 className="text-lg font-bold text-ink-900">{prec.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prec.items.map((item, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${m.border} ${m.bg} animate-fade-up`} style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-center w-7 h-7 rounded-full shrink-0" style={{ background: m.color }}>
                <span className="text-white text-xs font-bold">{i + 1}</span>
              </div>
              <p className="text-sm text-ink-700 font-medium leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Emergency contacts reminder */}
      <Card className="p-6 bg-gradient-to-r from-brand-50/50 to-teal-50/50">
        <h3 className="font-bold text-ink-900 mb-4 flex items-center gap-2"><Phone size={18} className="text-brand-500" /> Emergency Contacts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Police', num: '100' },
            { name: 'Ambulance', num: '108' },
            { name: 'Fire & Rescue', num: '101' },
            { name: 'NDRF', num: '1077' },
          ].map((c) => (
            <div key={c.name} className="p-3 rounded-xl bg-surface-card border border-line text-center">
              <div className="text-xs text-ink-500">{c.name}</div>
              <div className="text-xl font-bold text-brand-500 tnum">{c.num}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
