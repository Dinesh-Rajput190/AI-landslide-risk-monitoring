import { useApp } from '../store';
import { Card, SectionHeader, SimTag, RiskBadge, Donut, Sparkline, AreaChart } from '../components/ui';
import { LocationSelector } from '../components/LocationSelector';
import { CloudRain, Droplets, Mountain, Wind, Brain, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { RISK_META } from '../types';

export function RiskIntelligence() {
  const { selectedZone } = useApp();
  const m = RISK_META[selectedZone.risk];

  const factors = [
    { label: 'Rainfall', value: selectedZone.rainfall, unit: 'mm', max: 100, icon: <CloudRain size={18} />, desc: selectedZone.rainfall > 50 ? 'Heavy rainfall increasing slope pressure' : 'Moderate rainfall levels' },
    { label: 'Soil Moisture', value: selectedZone.soilMoisture, unit: '%', max: 100, icon: <Droplets size={18} />, desc: selectedZone.soilMoisture > 75 ? 'Soil near saturation point' : 'Soil within normal range' },
    { label: 'Slope Movement', value: selectedZone.slopeMovement, unit: 'mm/day', max: 12, icon: <Mountain size={18} />, desc: selectedZone.slopeMovement > 5 ? 'Detectable ground movement' : 'Stable slope conditions' },
    { label: 'Wind Speed', value: selectedZone.windSpeed, unit: 'km/h', max: 50, icon: <Wind size={18} />, desc: selectedZone.windSpeed > 30 ? 'Strong winds detected' : 'Calm to moderate winds' },
  ];

  const factorColor = (val: number, thresholds: [number, number]) => {
    if (val >= thresholds[1]) return '#F97316';
    if (val >= thresholds[0]) return '#EAB308';
    return '#22A06B';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Landslide Risk Intelligence</h1>
          <p className="text-sm text-ink-500 mt-1">Comprehensive risk assessment for selected monitoring zone</p>
        </div>
        <div className="flex items-center gap-3">
          <LocationSelector compact />
          <SimTag text="Simulation Mode" />
        </div>
      </div>

      {/* Main risk display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk gauge */}
        <Card className="p-6 text-center topo-dense">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-1">Current Landslide Risk</div>
          <div className="text-sm font-medium text-ink-900 mb-4">{selectedZone.name}</div>
          <div className="flex flex-col items-center">
            <div className="relative my-2">
              <Donut value={selectedZone.probability} size={200} stroke={18} color={m.color} label={`${selectedZone.probability}%`} sublabel="" />
            </div>
            <div className={`mt-2 px-5 py-2 rounded-full font-bold text-sm uppercase tracking-wide ${m.bg} ${m.text}`}>
              {m.label} Risk
            </div>
            <div className="text-xs text-ink-500 mt-3">Last updated: {selectedZone.lastUpdated}</div>
          </div>
        </Card>

        {/* Risk factors */}
        <Card className="lg:col-span-2 p-6">
          <SectionHeader title="Risk Factors" subtitle="Live environmental indicators" icon={<AlertTriangle size={18} />} badge={<SimTag text="Live" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {factors.map((f) => {
              const thresholds: [number, number] = f.label === 'Slope Movement' ? [2, 5] : f.label === 'Wind Speed' ? [20, 35] : [50, 75];
              const color = factorColor(f.value, thresholds);
              return (
                <div key={f.label} className="p-4 rounded-xl bg-surface-base border border-line hover:border-brand-200 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface-card border border-line" style={{ color }}>
                        {f.icon}
                      </div>
                      <span className="text-sm font-semibold text-ink-700">{f.label}</span>
                    </div>
                    <span className="text-lg font-bold tnum" style={{ color }}>{f.value}<span className="text-xs text-ink-500 ml-0.5">{f.unit}</span></span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-alt overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (f.value / f.max) * 100)}%`, background: color }} />
                  </div>
                  <p className="text-[11px] text-ink-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* AI Insight + Why it matters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-brand-50/50 to-teal-50/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white text-brand-500">
              <Brain size={20} />
            </div>
            <div>
              <h3 className="font-bold text-ink-900">AI Insight</h3>
              <SimTag text="Demo AI Analysis" />
            </div>
          </div>
          <p className="text-sm text-ink-700 leading-relaxed">
            {selectedZone.risk === 'critical'
              ? `Critical: ${selectedZone.rainfall}mm of torrential rainfall has pushed soil moisture to ${selectedZone.soilMoisture}%, creating severe slope instability. Slope movement of ${selectedZone.slopeMovement.toFixed(1)}mm/day indicates active ground deformation. Immediate evacuation and emergency response are essential.`
              : selectedZone.risk === 'high'
              ? `Persistent rainfall (${selectedZone.rainfall}mm) and increasing soil saturation (${selectedZone.soilMoisture}%) are contributing to elevated slope instability. Slope movement at ${selectedZone.slopeMovement.toFixed(1)}mm/day suggests progressive weakening. Enhanced monitoring and preparedness actions are advised.`
              : selectedZone.risk === 'medium'
              ? `Moderate environmental stress detected. Rainfall at ${selectedZone.rainfall}mm is gradually increasing soil moisture to ${selectedZone.soilMoisture}%. While not critical, conditions warrant continued monitoring and awareness.`
              : `Environmental conditions are stable. Rainfall at ${selectedZone.rainfall}mm and soil moisture at ${selectedZone.soilMoisture}% are within safe parameters. No immediate landslide risk detected.`}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-alt text-teal-500">
              <Eye size={20} />
            </div>
            <div>
              <h3 className="font-bold text-ink-900">Why This Matters</h3>
              <span className="text-xs text-ink-500">Understanding the risk in simple terms</span>
            </div>
          </div>
          <div className="space-y-3 text-sm text-ink-700">
            <p>
              <span className="font-semibold text-ink-900">What's happening:</span> {selectedZone.weather.toLowerCase()} in {selectedZone.district} is causing water to seep into the hill soil, making it heavier and less stable.
            </p>
            <p>
              <span className="font-semibold text-ink-900">What could happen:</span>{' '}
              {selectedZone.risk === 'critical' || selectedZone.risk === 'high'
                ? 'The saturated soil on the slope could slide downhill, potentially affecting roads, homes, and people in the path.'
                : 'The slope is currently stable, but continued rain could gradually increase the risk over time.'}
            </p>
            <p>
              <span className="font-semibold text-ink-900">What to do:</span>{' '}
              {selectedZone.risk === 'critical'
                ? 'Avoid the area immediately. Follow evacuation orders. Move to higher ground.'
                : selectedZone.risk === 'high'
                ? 'Stay alert. Avoid traveling through vulnerable slope areas. Keep emergency contacts ready.'
                : 'Stay informed. Monitor weather updates and alerts from authorities.'}
            </p>
          </div>
        </Card>
      </div>

      {/* Historical risk trend */}
      <Card className="p-6">
        <SectionHeader title="Historical Risk Trend" subtitle="14-day probability history" icon={<TrendingUp size={18} />} badge={<RiskBadge level={selectedZone.risk} />} />
        <AreaChart
          series={[{ name: 'Risk %', data: selectedZone.historicalRisk, color: m.color }]}
          height={180}
          labels={['14d', '12d', '10d', '8d', '6d', '4d', '2d', 'Now']}
          maxVal={100}
        />
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: '14-Day Min', val: Math.min(...selectedZone.historicalRisk).toFixed(0), color: '#22A06B' },
            { label: '14-Day Max', val: Math.max(...selectedZone.historicalRisk).toFixed(0), color: '#F97316' },
            { label: 'Average', val: (selectedZone.historicalRisk.reduce((a, b) => a + b, 0) / selectedZone.historicalRisk.length).toFixed(0), color: '#1976B9' },
            { label: 'Trend', val: '↑ Rising', color: '#F97316' },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-lg bg-surface-base border border-line">
              <div className="text-xl font-bold tnum" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[10px] font-semibold uppercase text-ink-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weather snapshot */}
      <Card className="p-6">
        <SectionHeader title="Environmental Snapshot" subtitle={selectedZone.name} icon={<CloudRain size={18} />} />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Temperature', val: `${selectedZone.temperature}°C`, icon: <CloudRain size={16} />, color: '#1976B9' },
            { label: 'Humidity', val: `${selectedZone.humidity}%`, icon: <Droplets size={16} />, color: '#20A39E' },
            { label: 'Rainfall', val: `${selectedZone.rainfall}mm`, icon: <CloudRain size={16} />, color: '#55B9E6' },
            { label: '24h Rain', val: `${selectedZone.rainfall24h.toFixed(0)}mm`, icon: <CloudRain size={16} />, color: '#1976B9' },
            { label: '72h Rain', val: `${selectedZone.rainfall72h.toFixed(0)}mm`, icon: <CloudRain size={16} />, color: '#1565A0' },
            { label: 'Wind', val: `${selectedZone.windSpeed}km/h`, icon: <Wind size={16} />, color: '#20A39E' },
          ].map((e) => (
            <div key={e.label} className="p-3.5 rounded-xl bg-surface-base border border-line text-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-card border border-line mx-auto mb-2" style={{ color: e.color }}>
                {e.icon}
              </div>
              <div className="text-base font-bold text-ink-900 tnum">{e.val}</div>
              <div className="text-[10px] font-semibold uppercase text-ink-500 mt-0.5">{e.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
