import { useApp, ALL_ZONES } from '../store';
import { Card, SectionHeader, SimTag, AnimatedNumber, RiskBadge, LiveDot, Sparkline, Donut } from '../components/ui';
import { LocationSelector } from '../components/LocationSelector';
import {
  Bell, AlertTriangle, MapPin, Cpu, TrendingUp, TrendingDown, CloudRain,
  Droplets, Mountain, Wind, Brain, ArrowRight, Activity, ShieldAlert,
} from 'lucide-react';
import { RISK_META } from '../types';
import type { RiskLevel } from '../types';

export function Dashboard() {
  const { alerts, selectedZone, selectZone, setView, incidents, tasks } = useApp();

  const criticalZones = ALL_ZONES.filter((z) => z.risk === 'critical').length;
  const highZones = ALL_ZONES.filter((z) => z.risk === 'high').length;
  const totalSensors = ALL_ZONES.reduce((acc, z) => acc + z.sensors.length, 0);
  const activeAlerts = alerts.filter((a) => a.status !== 'acknowledged').length;

  const metrics = [
    {
      label: 'Active Alerts',
      value: activeAlerts,
      icon: <Bell size={20} />,
      color: '#DC2626',
      bg: 'bg-risk-critBg',
      trend: '+3',
      trendUp: true,
      sub: '2 critical · 4 high',
      spark: [2, 3, 2, 4, 5, 4, 6, 7],
      sparkColor: '#DC2626',
    },
    {
      label: 'Critical Zones',
      value: criticalZones,
      icon: <AlertTriangle size={20} />,
      color: '#DC2626',
      bg: 'bg-risk-critBg',
      trend: '+1',
      trendUp: true,
      sub: 'Cherrapunji · Tawang · Gangtok',
      spark: [1, 1, 2, 2, 3, 2, 3, 3],
      sparkColor: '#F97316',
    },
    {
      label: 'High-Risk Locations',
      value: highZones,
      icon: <MapPin size={20} />,
      color: '#F97316',
      bg: 'bg-risk-highBg',
      trend: '+2',
      trendUp: true,
      sub: 'Across 4 states',
      spark: [3, 4, 3, 5, 4, 5, 6, 5],
      sparkColor: '#F97316',
    },
    {
      label: 'Connected Sensors',
      value: totalSensors,
      icon: <Cpu size={20} />,
      color: '#20A39E',
      bg: 'bg-teal-50',
      trend: '100%',
      trendUp: true,
      sub: '14 online · 3 warning',
      spark: [82, 84, 85, 85, 85, 85, 85, 85],
      sparkColor: '#20A39E',
    },
  ];

  const topAlerts = [...alerts].sort((a, b) => {
    const order: Record<RiskLevel, number> = { critical: 3, high: 2, medium: 1, low: 0 };
    return order[b.risk] - order[a.risk];
  }).slice(0, 5);

  const zoneRisk = selectedZone.probability;
  const riskColor = RISK_META[selectedZone.risk].color;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink-900">Command Center Overview</h1>
            <LiveDot label="Live Monitoring" />
          </div>
          <p className="text-sm text-ink-500 mt-1">Real-time disaster intelligence across North Eastern India</p>
        </div>
        <div className="flex items-center gap-3">
          <LocationSelector compact />
          <SimTag text="Simulation Mode" />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} hover className="p-5 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${m.bg}`} style={{ color: m.color }}>
                {m.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${m.trendUp ? 'text-risk-crit' : 'text-risk-low'}`}>
                {m.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {m.trend}
              </div>
            </div>
            <div className="text-3xl font-bold text-ink-900 tnum">
              <AnimatedNumber value={m.value} />
            </div>
            <div className="text-sm font-medium text-ink-500 mt-1">{m.label}</div>
            <div className="text-xs text-ink-400 mt-2">{m.sub}</div>
            <div className="mt-3 -mb-1">
              <Sparkline data={m.spark} color={m.sparkColor} width={200} height={28} />
            </div>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Risk Intelligence */}
        <Card className="lg:col-span-2 p-6 topo-dense">
          <SectionHeader
            title="Current Landslide Risk"
            subtitle={selectedZone.name}
            icon={<AlertTriangle size={18} />}
            badge={<RiskBadge level={selectedZone.risk} />}
            right={<button onClick={() => setView('risk')} className="text-sm text-brand-500 font-medium flex items-center gap-1 hover:text-brand-600">Details <ArrowRight size={14} /></button>}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Risk gauge */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative">
                <Donut value={zoneRisk} size={180} stroke={16} color={riskColor} label={`${zoneRisk}%`} sublabel="Landslide Risk" />
                <div className="absolute -inset-2 rounded-full pointer-events-none" style={{ boxShadow: `inset 0 0 30px ${riskColor}15` }} />
              </div>
              <div className={`mt-4 px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wide ${RISK_META[selectedZone.risk].bg} ${RISK_META[selectedZone.risk].text}`}>
                {RISK_META[selectedZone.risk].label} Risk
              </div>
            </div>

            {/* Risk factors */}
            <div className="space-y-3">
              {[
                { label: 'Rainfall', value: `${selectedZone.rainfall} mm`, level: selectedZone.rainfall > 50 ? 'HIGH' : selectedZone.rainfall > 25 ? 'ELEVATED' : 'NORMAL', color: selectedZone.rainfall > 50 ? '#F97316' : selectedZone.rainfall > 25 ? '#EAB308' : '#22A06B', icon: <CloudRain size={16} /> },
                { label: 'Soil Moisture', value: `${selectedZone.soilMoisture}%`, level: selectedZone.soilMoisture > 75 ? 'HIGH' : selectedZone.soilMoisture > 50 ? 'ELEVATED' : 'NORMAL', color: selectedZone.soilMoisture > 75 ? '#F97316' : selectedZone.soilMoisture > 50 ? '#EAB308' : '#22A06B', icon: <Droplets size={16} /> },
                { label: 'Slope Movement', value: `${selectedZone.slopeMovement.toFixed(1)} mm/day`, level: selectedZone.slopeMovement > 5 ? 'ELEVATED' : 'NORMAL', color: selectedZone.slopeMovement > 5 ? '#F97316' : '#22A06B', icon: <Mountain size={16} /> },
                { label: 'Weather Condition', value: selectedZone.weather, level: selectedZone.weather, color: selectedZone.rainfall > 50 ? '#F97316' : '#1976B9', icon: <Wind size={16} /> },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface-card border border-line" style={{ color: f.color }}>
                      {f.icon}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-ink-500">{f.label}</div>
                      <div className="text-sm font-bold text-ink-900">{f.value}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full" style={{ color: f.color, background: `${f.color}15` }}>
                    {f.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-brand-50 to-teal-50 border border-brand-100">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-brand-500 shrink-0">
                <Brain size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink-900">AI Insight</span>
                  <SimTag text="Demo AI" />
                </div>
                <p className="text-sm text-ink-700 mt-1 leading-relaxed">
                  {selectedZone.risk === 'critical'
                    ? 'Critical rainfall and severe soil saturation are creating dangerous slope instability. Immediate evacuation recommended.'
                    : selectedZone.risk === 'high'
                    ? 'Persistent rainfall and increasing soil saturation are contributing to elevated slope instability. Enhanced monitoring advised.'
                    : selectedZone.risk === 'medium'
                    ? 'Moderate rainfall is gradually increasing soil moisture. Monitor conditions and maintain sensor vigilance.'
                    : 'Environmental conditions are stable. No immediate landslide risk detected at this location.'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Alerts */}
        <Card className="p-5">
          <SectionHeader
            title="Priority Alerts"
            subtitle={`${topAlerts.length} active`}
            icon={<Bell size={18} />}
            right={<button onClick={() => setView('alerts')} className="text-sm text-brand-500 font-medium flex items-center gap-1 hover:text-brand-600">All <ArrowRight size={14} /></button>}
          />
          <div className="space-y-3">
            {topAlerts.map((a) => (
              <div key={a.id} className={`p-3 rounded-lg border ${RISK_META[a.risk].border} ${RISK_META[a.risk].bg} hover:shadow-card transition-all cursor-pointer`} onClick={() => setView('alerts')}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-ink-900 truncate">{a.location}</div>
                    <div className="text-[11px] text-ink-500">{a.district} · {a.state}</div>
                  </div>
                  <RiskBadge level={a.risk} size="sm" />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-ink-500">AI: <span className="font-bold text-ink-900">{a.probability}%</span></span>
                  <span className="text-[10px] text-ink-400">·</span>
                  <span className="text-[10px] text-ink-500">{a.detectedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom grid: Incidents + Sensors + Zone list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incidents */}
        <Card className="p-5">
          <SectionHeader title="Active Incidents" subtitle={`${incidents.length} tracked`} icon={<ShieldAlert size={18} />} right={<button onClick={() => setView('response')} className="text-sm text-brand-500 font-medium hover:text-brand-600">Manage</button>} />
          <div className="space-y-2.5">
            {incidents.slice(0, 4).map((inc) => (
              <div key={inc.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line hover:border-brand-200 transition-colors">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-900 truncate">{inc.location}</div>
                  <div className="text-[11px] text-ink-500">{inc.team} · {inc.lastUpdated}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <RiskBadge level={inc.risk} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sensor Health */}
        <Card className="p-5">
          <SectionHeader title="Sensor Network" subtitle={selectedZone.name} icon={<Cpu size={18} />} right={<button onClick={() => setView('sensors')} className="text-sm text-brand-500 font-medium hover:text-brand-600">Monitor</button>} />
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg bg-risk-lowBg">
              <div className="text-2xl font-bold text-risk-low tnum">{selectedZone.sensors.filter(s => s.status === 'online').length}</div>
              <div className="text-[10px] font-semibold uppercase text-risk-low">Online</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-risk-highBg">
              <div className="text-2xl font-bold text-risk-high tnum">{selectedZone.sensors.filter(s => s.status === 'warning').length}</div>
              <div className="text-[10px] font-semibold uppercase text-risk-high">Warning</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-risk-critBg">
              <div className="text-2xl font-bold text-risk-crit tnum">{selectedZone.sensors.filter(s => s.status === 'offline').length}</div>
              <div className="text-[10px] font-semibold uppercase text-risk-crit">Offline</div>
            </div>
          </div>
          <div className="space-y-2">
            {selectedZone.sensors.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-xs">
                <span className="text-ink-700 font-medium">{s.id}</span>
                <div className="flex items-center gap-2">
                  <span className="text-ink-900 font-bold tnum">{s.reading}{s.unit}</span>
                  <span className="w-2 h-2 rounded-full" style={{ background: s.status === 'online' ? '#22A06B' : s.status === 'warning' ? '#F97316' : '#DC2626' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Zone Risk List */}
        <Card className="p-5">
          <SectionHeader title="Monitoring Zones" subtitle="All NE India" icon={<MapPin size={18} />} right={<button onClick={() => setView('map')} className="text-sm text-brand-500 font-medium hover:text-brand-600">Map</button>} />
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {ALL_ZONES.sort((a, b) => b.probability - a.probability).map((z) => (
              <button
                key={z.name}
                onClick={() => selectZone(z.name)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-left ${selectedZone.name === z.name ? 'bg-brand-50 border-brand-200' : 'bg-surface-base border-line hover:border-brand-200'}`}
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-900 truncate">{z.name}</div>
                  <div className="text-[11px] text-ink-500">{z.state}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold tnum" style={{ color: RISK_META[z.risk].color }}>{z.probability}%</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: RISK_META[z.risk].color }} />
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Rescue tasks preview */}
      <Card className="p-5">
        <SectionHeader title="Rescue Operations" subtitle={`${tasks.length} active tasks`} icon={<Activity size={18} />} right={<button onClick={() => setView('rescue')} className="text-sm text-brand-500 font-medium hover:text-brand-600">All Tasks</button>} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {tasks.slice(0, 6).map((t) => (
            <div key={t.id} className="p-3.5 rounded-lg bg-surface-base border border-line">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-ink-900">{t.team}</span>
                <RiskBadge level={t.priority} size="sm" />
              </div>
              <p className="text-xs text-ink-500 mb-3 line-clamp-2">{t.task}</p>
              <div className="flex items-center justify-between text-[11px] text-ink-500">
                <span>ETA: <span className="font-semibold text-ink-900">{t.eta}</span></span>
                <span className="font-semibold text-brand-500">{t.progress}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-surface-alt overflow-hidden">
                <div className="h-full rounded-full bg-brand-500 transition-all duration-700" style={{ width: `${t.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
