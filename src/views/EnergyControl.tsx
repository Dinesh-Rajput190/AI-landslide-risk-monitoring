import { useApp, ALL_ZONES } from '../store';
import { Card, SectionHeader, SimTag, Toggle, LiveDot, AnimatedNumber } from '../components/ui';
import { Zap, Moon, Sun, Activity, Cpu, Bell, Gauge, Battery, Eye, AlertTriangle, Power } from 'lucide-react';

export function EnergyControl() {
  const { monitoringMode, setMonitoringMode, alertPriority, setAlertPriority } = useApp();

  const modes = [
    { key: 'active', label: 'Active Monitoring', desc: 'Full sensor power · 24/7 real-time data', icon: <Sun size={20} />, color: '#1976B9', bg: 'bg-brand-50' },
    { key: 'energy', label: 'Energy Saving', desc: 'Reduced sampling rate · Battery conservation', icon: <Zap size={20} />, color: '#20A39E', bg: 'bg-teal-50' },
    { key: 'night', label: 'Night Monitoring', desc: 'Priority alerts only · Low-light operation', icon: <Moon size={20} />, color: '#55B9E6', bg: 'bg-brand-50' },
  ];

  const activeMode = modes.find((m) => m.key === monitoringMode)!;
  const totalSensors = ALL_ZONES.reduce((acc, z) => acc + z.sensors.length, 0);

  const sensorsActive = monitoringMode === 'active' ? totalSensors : monitoringMode === 'energy' ? Math.floor(totalSensors * 0.6) : Math.floor(totalSensors * 0.4);
  const powerUsage = monitoringMode === 'active' ? 100 : monitoringMode === 'energy' ? 58 : 35;
  const samplingRate = monitoringMode === 'active' ? '1 sec' : monitoringMode === 'energy' ? '5 sec' : '10 sec';

  const zoneActivity = ALL_ZONES.slice(0, 6).map((z, i) => ({
    name: z.name,
    power: monitoringMode === 'active' ? 100 : monitoringMode === 'energy' ? 50 + (i % 3) * 15 : 25 + (i % 3) * 10,
    active: monitoringMode === 'active' || (monitoringMode === 'energy' && z.risk !== 'low') || (monitoringMode === 'night' && (z.risk === 'critical' || z.risk === 'high')),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Smart Energy Control</h1>
          <p className="text-sm text-ink-500 mt-1">Intelligent monitoring mode management</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveDot label="System Active" />
          <SimTag text="Prototype Energy Control" />
        </div>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((m) => {
          const isActive = monitoringMode === m.key;
          return (
            <Card key={m.key} hover className={`p-6 cursor-pointer transition-all ${isActive ? 'ring-2 ring-brand-300' : ''}`} onClick={() => setMonitoringMode(m.key as 'active' | 'energy' | 'night')}>
              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${m.bg} mb-4`} style={{ color: m.color }}>
                {m.icon}
              </div>
              <h3 className="font-bold text-ink-900 mb-1">{m.label}</h3>
              <p className="text-xs text-ink-500 mb-3">{m.desc}</p>
              <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-1 rounded-full ${isActive ? 'bg-brand-500 text-white' : 'bg-surface-alt text-ink-400'}`}>
                {isActive ? 'Active' : 'Switch Mode'}
              </div>
            </Card>
          );
        })}
      </div>

      {/* System status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <SectionHeader title="Monitoring System" subtitle="Current operational status" icon={<Activity size={18} />} />
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
              <span className="text-sm text-ink-500">Current Mode</span>
              <span className="text-sm font-bold" style={{ color: activeMode.color }}>{activeMode.label}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
              <span className="text-sm text-ink-500">Sensors Active</span>
              <span className="text-sm font-bold text-ink-900 tnum">{sensorsActive} / {totalSensors}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
              <span className="text-sm text-ink-500">Sampling Rate</span>
              <span className="text-sm font-bold text-ink-900">{samplingRate}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
              <span className="text-sm text-ink-500">Power Usage</span>
              <span className="text-sm font-bold" style={{ color: powerUsage > 80 ? '#F97316' : powerUsage > 50 ? '#EAB308' : '#22A06B' }}>{powerUsage}%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Power Distribution" subtitle="Energy consumption by mode" icon={<Gauge size={18} />} />
          <div className="flex flex-col items-center py-4">
            <div className="relative w-32 h-32 mb-4">
              <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EEF6FB" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={powerUsage > 80 ? '#F97316' : powerUsage > 50 ? '#EAB308' : '#22A06B'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - powerUsage / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-ink-900 tnum"><AnimatedNumber value={powerUsage} suffix="%" /></span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
                <div className="flex items-center justify-center gap-1.5 text-xs text-ink-500 mb-1"><Battery size={12} /> Avg Battery</div>
                <div className="text-lg font-bold text-ink-900 tnum">72%</div>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
                <div className="flex items-center justify-center gap-1.5 text-xs text-ink-500 mb-1"><Power size={12} /> Solar</div>
                <div className="text-lg font-bold text-risk-low tnum">ON</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Alert Priority" subtitle="Automatic alert configuration" icon={<Bell size={18} />} />
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-risk-crit" />
                <span className="text-sm text-ink-700">Auto Priority Critical</span>
              </div>
              <Toggle checked={alertPriority} onChange={setAlertPriority} />
            </div>
            <div className="p-3 rounded-lg bg-surface-base border border-line">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={16} className="text-brand-500" />
                <span className="text-sm font-medium text-ink-700">Night Mode Behavior</span>
              </div>
              <p className="text-xs text-ink-500">In Night Monitoring Mode, only HIGH and CRITICAL alerts trigger full sensor activation. LOW and MEDIUM zones remain in low-power standby.</p>
            </div>
            <div className="p-3 rounded-lg bg-risk-lowBg border border-risk-low/20">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-risk-low" />
                <span className="text-xs font-semibold text-risk-low">Emergency Readiness: Maintained</span>
              </div>
              <p className="text-xs text-ink-500 mt-1">All critical sensors remain active regardless of power mode.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Zone activity */}
      <Card className="p-6">
        <SectionHeader title="Monitoring Zone Activity" subtitle="Per-zone power and sensor status" icon={<Cpu size={18} />} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {zoneActivity.map((z) => (
            <div key={z.name} className="flex items-center justify-between p-3.5 rounded-xl bg-surface-base border border-line">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${z.active ? 'bg-brand-50 text-brand-500' : 'bg-surface-alt text-ink-300'}`}>
                  <Cpu size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-900 truncate">{z.name}</div>
                  <div className="text-[11px] text-ink-500">{z.active ? 'Active' : 'Standby'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-20 h-1.5 rounded-full bg-surface-alt overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${z.power}%`, background: z.active ? '#1976B9' : '#AEBEC9' }} />
                </div>
                <span className="text-xs font-bold tnum text-ink-700 w-10 text-right">{z.power}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
