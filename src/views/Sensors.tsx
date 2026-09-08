import { useApp } from '../store';
import { Card, SectionHeader, SimTag, Sparkline, LiveDot, AnimatedNumber } from '../components/ui';
import { LocationSelector } from '../components/LocationSelector';
import { Cpu, Battery, Signal, Activity, AlertTriangle, CheckCircle2, XCircle, Wifi } from 'lucide-react';

const SENSOR_TYPES: { type: string; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'rain', label: 'Rain Sensor', icon: <Activity size={16} />, color: '#55B9E6' },
  { type: 'soil', label: 'Soil Moisture', icon: <Activity size={16} />, color: '#20A39E' },
  { type: 'slope', label: 'Slope Movement', icon: <Activity size={16} />, color: '#F97316' },
  { type: 'temp', label: 'Temperature', icon: <Activity size={16} />, color: '#1976B9' },
  { type: 'humidity', label: 'Humidity', icon: <Activity size={16} />, color: '#20A39E' },
];

export function Sensors() {
  const { selectedZone } = useApp();
  const sensors = selectedZone.sensors;

  const online = sensors.filter((s) => s.status === 'online').length;
  const warning = sensors.filter((s) => s.status === 'warning').length;
  const offline = sensors.filter((s) => s.status === 'offline').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">IoT Sensor Monitoring</h1>
          <p className="text-sm text-ink-500 mt-1">Real-time sensor network status and readings</p>
        </div>
        <div className="flex items-center gap-3">
          <LocationSelector compact />
          <LiveDot label="Live" />
        </div>
      </div>

      {/* Overall metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-alt text-brand-500"><Cpu size={18} /></div>
            <span className="text-sm font-medium text-ink-500">Total Sensors</span>
          </div>
          <div className="text-3xl font-bold text-ink-900 tnum"><AnimatedNumber value={sensors.length} /></div>
          <div className="text-xs text-ink-400 mt-1">{selectedZone.name}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-risk-lowBg text-risk-low"><CheckCircle2 size={18} /></div>
            <span className="text-sm font-medium text-ink-500">Online</span>
          </div>
          <div className="text-3xl font-bold text-risk-low tnum"><AnimatedNumber value={online} /></div>
          <div className="text-xs text-ink-400 mt-1">All systems normal</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-risk-highBg text-risk-high"><AlertTriangle size={18} /></div>
            <span className="text-sm font-medium text-ink-500">Warning</span>
          </div>
          <div className="text-3xl font-bold text-risk-high tnum"><AnimatedNumber value={warning} /></div>
          <div className="text-xs text-ink-400 mt-1">Requires attention</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-risk-critBg text-risk-crit"><XCircle size={18} /></div>
            <span className="text-sm font-medium text-ink-500">Offline</span>
          </div>
          <div className="text-3xl font-bold text-risk-crit tnum"><AnimatedNumber value={offline} /></div>
          <div className="text-xs text-ink-400 mt-1">Connection lost</div>
        </Card>
      </div>

      {/* Sensor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sensors.map((s) => {
          const meta = SENSOR_TYPES.find((t) => t.type === s.type)!;
          const statusColor = s.status === 'online' ? '#22A06B' : s.status === 'warning' ? '#F97316' : '#DC2626';
          const statusBg = s.status === 'online' ? 'bg-risk-lowBg' : s.status === 'warning' ? 'bg-risk-highBg' : 'bg-risk-critBg';
          const statusText = s.status === 'online' ? 'text-risk-low' : s.status === 'warning' ? 'text-risk-high' : 'text-risk-crit';
          const StatusIcon = s.status === 'online' ? CheckCircle2 : s.status === 'warning' ? AlertTriangle : XCircle;

          return (
            <Card key={s.id} hover className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-alt" style={{ color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink-900">{meta.label}</div>
                    <div className="text-[11px] text-ink-500">{s.id}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${statusBg} ${statusText}`}>
                  <StatusIcon size={12} />
                  {s.status}
                </span>
              </div>

              {/* Reading */}
              <div className="p-3.5 rounded-xl bg-surface-base border border-line mb-3">
                <div className="text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1">Current Reading</div>
                <div className="text-3xl font-bold text-ink-900 tnum">{s.reading}<span className="text-sm text-ink-500 ml-1">{s.unit}</span></div>
              </div>

              {/* Trend */}
              <div className="mb-3">
                <div className="text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1.5">12-Point Trend</div>
                <Sparkline data={s.trend} color={meta.color} width={260} height={36} />
              </div>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-surface-base border border-line">
                  <Signal size={14} className="mx-auto mb-1" style={{ color: statusColor }} />
                  <div className="text-xs font-bold text-ink-900 tnum">{s.signal}%</div>
                  <div className="text-[9px] text-ink-400">Signal</div>
                </div>
                <div className="p-2 rounded-lg bg-surface-base border border-line">
                  <Battery size={14} className="mx-auto mb-1" style={{ color: s.battery > 50 ? '#22A06B' : s.battery > 20 ? '#EAB308' : '#DC2626' }} />
                  <div className="text-xs font-bold text-ink-900 tnum">{s.battery}%</div>
                  <div className="text-[9px] text-ink-400">Battery</div>
                </div>
                <div className="p-2 rounded-lg bg-surface-base border border-line">
                  <Wifi size={14} className="mx-auto mb-1 text-brand-500" />
                  <div className="text-xs font-bold text-ink-900">{s.lastUpdated}</div>
                  <div className="text-[9px] text-ink-400">Updated</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Sensor network map */}
      <Card className="p-6">
        <SectionHeader title="Sensor Network Overview" subtitle={selectedZone.name} icon={<Cpu size={18} />} badge={<SimTag text="Simulated" />} />
        <div className="relative w-full h-48 rounded-xl bg-surface-base border border-line overflow-hidden topo-dense">
          <svg viewBox="0 0 400 180" className="w-full h-full">
            {/* Connection lines */}
            {sensors.map((_, i) => {
              const x1 = 60 + i * 70;
              const y1 = 90 + Math.sin(i) * 20;
              const x2 = 60 + ((i + 1) % sensors.length) * 70;
              const y2 = 90 + Math.sin((i + 1) % sensors.length) * 20;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#20A39E" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />;
            })}
            {/* Sensor nodes */}
            {sensors.map((s, i) => {
              const x = 60 + i * 70;
              const y = 90 + Math.sin(i) * 20;
              const color = s.status === 'online' ? '#22A06B' : s.status === 'warning' ? '#F97316' : '#DC2626';
              return (
                <g key={s.id}>
                  {s.status !== 'offline' && (
                    <circle cx={x} cy={y} r="10" fill={color} opacity="0.15">
                      <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={x} cy={y} r="6" fill={color} stroke="white" strokeWidth="2" />
                  <text x={x} y={y + 25} fontSize="8" fill="#64798A" textAnchor="middle" fontWeight="600">{s.id.split('-')[2]}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </Card>
    </div>
  );
}
