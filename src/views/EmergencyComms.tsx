import { useState } from 'react';
import { useApp, ALL_ZONES } from '../store';
import { Card, SectionHeader, SimTag, RiskBadge, LiveDot } from '../components/ui';
import {
  Radio, MessageSquare, Send, Smartphone, CheckCircle2, Clock, Zap,
  Phone, Shield, Ambulance, Flame, HardHat, Mountain as MountainIcon, Bell,
} from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data';
import { RISK_META } from '../types';
import type { RiskLevel } from '../types';

const CHANNELS = [
  { key: 'sms', label: 'SMS', icon: <MessageSquare size={16} />, color: '#1976B9' },
  { key: 'whatsapp', label: 'WhatsApp', icon: <Smartphone size={16} />, color: '#20A39E' },
  { key: 'telegram', label: 'Telegram', icon: <Send size={16} />, color: '#55B9E6' },
];

const TARGET_GROUPS = ['All Citizens in Zone', 'Vulnerable Areas Only', 'Schools & Institutions', 'Emergency Personnel'];

const STEPS = ['Message Generated', 'Queued', 'Dispatched', 'Delivery Simulated'];

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  shield: <Shield size={20} />,
  ambulance: <Ambulance size={20} />,
  flame: <Flame size={20} />,
  helmet: <HardHat size={20} />,
  phone: <Phone size={20} />,
  mountain: <MountainIcon size={20} />,
};

export function EmergencyComms() {
  const { selectZone, setView } = useApp();
  const [location, setLocation] = useState(ALL_ZONES[0].name);
  const [risk, setRisk] = useState<RiskLevel>('high');
  const [target, setTarget] = useState(TARGET_GROUPS[0]);
  const [channel, setChannel] = useState('sms');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [step, setStep] = useState(-1);
  const [sent, setSent] = useState(false);

  const zone = ALL_ZONES.find((z) => z.name === location)!;

  const generateMessage = () => {
    const m = RISK_META[risk];
    const msg = `⚠ BHOOSHANKET EMERGENCY ALERT\n\n${m.label} landslide risk detected near ${location}.\n\nPlease avoid vulnerable areas and follow instructions from authorities.\n\nRisk Level: ${m.label.toUpperCase()}\nLocation: ${zone.district}, ${zone.state}\nAI Probability: ${zone.probability}%\n\n— BhooShanket AI Prototype`;
    setMessage(msg);
  };

  const sendAlert = () => {
    setSending(true);
    setSent(false);
    setStep(0);
    let s = 0;
    const interval = setInterval(() => {
      s++;
      if (s >= STEPS.length) {
        clearInterval(interval);
        setSending(false);
        setSent(true);
        setStep(-1);
      } else {
        setStep(s);
      }
    }, 700);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Emergency Communication System</h1>
          <p className="text-sm text-ink-500 mt-1">Multi-platform alert dispatch and delivery simulation</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveDot label="Live" />
          <SimTag text="Prototype Notification" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composer */}
        <Card className="p-6">
          <SectionHeader title="Alert Composer" subtitle="Configure and dispatch emergency alert" icon={<Radio size={18} />} />

          <div className="space-y-4">
            {/* Location */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1.5">Select Location</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface-card text-sm text-ink-900 font-medium">
                {ALL_ZONES.map((z) => <option key={z.name} value={z.name}>{z.name} ({z.district})</option>)}
              </select>
            </div>

            {/* Risk level */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1.5">Select Risk Level</label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'critical'] as RiskLevel[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRisk(r)}
                    className={`py-2.5 rounded-lg text-xs font-bold uppercase border transition-all ${risk === r ? `${RISK_META[r].bg} ${RISK_META[r].text} border-current` : 'bg-surface-card border-line text-ink-500 hover:bg-surface-alt'}`}
                    style={risk === r ? { borderColor: RISK_META[r].color, color: RISK_META[r].color } : {}}
                  >
                    {RISK_META[r].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target group */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1.5">Select Target Group</label>
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface-card text-sm text-ink-900 font-medium">
                {TARGET_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Channel */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1.5">Communication Channel</label>
              <div className="grid grid-cols-3 gap-2">
                {CHANNELS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setChannel(c.key)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold border transition-all ${channel === c.key ? 'bg-brand-50 border-brand-300 text-brand-600' : 'bg-surface-card border-line text-ink-700 hover:bg-surface-alt'}`}
                  >
                    <span style={{ color: channel === c.key ? c.color : undefined }}>{c.icon}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wide text-ink-500">Alert Message</label>
                <button onClick={generateMessage} className="text-xs text-brand-500 font-semibold hover:text-brand-600 flex items-center gap-1">
                  <Zap size={12} /> Auto-Generate
                </button>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Click Auto-Generate or type your alert message..."
                className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface-base text-sm text-ink-900 placeholder:text-ink-300 resize-none font-mono"
              />
            </div>

            {/* Send */}
            <button
              onClick={sendAlert}
              disabled={sending || !message}
              className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-semibold text-sm shadow-float hover:bg-brand-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              {sending ? 'Dispatching...' : 'Simulate Alert Dispatch'}
            </button>
          </div>
        </Card>

        {/* Delivery simulation */}
        <Card className="p-6">
          <SectionHeader title="Delivery Simulation" subtitle="Track alert dispatch progress" icon={<Send size={18} />} badge={<SimTag text="Simulated" />} />

          {!sending && !sent && step === -1 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-alt text-ink-300 mb-3">
                <Radio size={28} />
              </div>
              <p className="text-sm text-ink-500">Configure and dispatch an alert to see delivery simulation.</p>
            </div>
          )}

          {(sending || sent) && (
            <div className="animate-fade-in">
              {/* Steps */}
              <div className="space-y-1 mb-6">
                {STEPS.map((s, i) => {
                  const done = sent || (sending && step > i);
                  const active = sending && step === i;
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-all ${
                        done ? 'bg-risk-low text-white' : active ? 'bg-brand-500 text-white' : 'bg-surface-alt text-ink-300'
                      }`}>
                        {done ? <CheckCircle2 size={16} /> : active ? <div className="w-3 h-3 rounded-full bg-white animate-pulse-soft" /> : <Clock size={14} />}
                      </div>
                      <span className={`text-sm font-medium ${done ? 'text-ink-900' : active ? 'text-brand-600' : 'text-ink-400'}`}>{s}</span>
                      {i < STEPS.length - 1 && <div className={`flex-1 h-px ${done ? 'bg-risk-low' : 'bg-line'}`} />}
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              {sent && (
                <div className="p-4 rounded-xl bg-risk-lowBg border border-risk-low/30 animate-fade-up">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={18} className="text-risk-low" />
                    <span className="font-bold text-ink-900">Alert Delivery Simulated</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-ink-500">Channel</span><span className="font-semibold text-ink-900 capitalize">{channel}</span></div>
                    <div className="flex justify-between"><span className="text-ink-500">Location</span><span className="font-semibold text-ink-900">{location}</span></div>
                    <div className="flex justify-between"><span className="text-ink-500">Target</span><span className="font-semibold text-ink-900">{target}</span></div>
                    <div className="flex justify-between"><span className="text-ink-500">Recipients</span><span className="font-semibold text-ink-900">{Math.floor(Math.random() * 5000) + 1200}</span></div>
                    <div className="flex justify-between"><span className="text-ink-500">Delivery Rate</span><span className="font-semibold text-risk-low">96.4%</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Message preview */}
          {message && (
            <div className="mt-4 p-4 rounded-xl bg-surface-base border border-line">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-2">Message Preview</div>
              <pre className="text-xs text-ink-700 whitespace-pre-wrap font-mono leading-relaxed">{message}</pre>
            </div>
          )}
        </Card>
      </div>

      {/* Emergency Contacts */}
      <Card className="p-6">
        <SectionHeader title="Emergency Authority Contacts" subtitle="Quick access to emergency services" icon={<Phone size={18} />} badge={<SimTag text="Demo Emergency Contacts" />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((c) => (
            <div key={c.service} className="p-4 rounded-xl bg-surface-base border border-line hover:border-brand-200 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500">
                    {CONTACT_ICONS[c.icon]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink-900">{c.service}</div>
                    <div className="text-[11px] text-ink-500">{c.region}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${c.available ? 'bg-risk-lowBg text-risk-low' : 'bg-ink-300/20 text-ink-400'}`}>
                  {c.available ? 'Available' : 'Offline'}
                </span>
              </div>
              <div className="text-2xl font-bold text-ink-900 tnum mb-3">{c.number}</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={!c.available}
                  onClick={() => alert(`Prototype: Calling ${c.service} at ${c.number}...`)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Phone size={13} /> Call
                </button>
                <button
                  disabled={!c.available}
                  onClick={() => alert(`Prototype: Notification sent to ${c.service}...`)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-alt text-ink-700 text-xs font-semibold hover:bg-surface-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Bell size={13} /> Notify
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
