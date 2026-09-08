import { useApp, ALL_ZONES, STATES } from '../store';
import { Card, SectionHeader, SimTag, AreaChart, BarChart, Sparkline, AnimatedNumber, RiskBadge } from '../components/ui';
import { BarChart3, TrendingUp, CloudRain, Activity, AlertTriangle, Clock, Target, Gauge, Mountain, Cpu } from 'lucide-react';
import { RISK_META } from '../types';
import type { RiskLevel } from '../types';

export function Analytics() {
  const { alerts, incidents, tasks, selectedZone } = useApp();

  // State-wise risk data
  const stateRisk = STATES.map((s) => {
    const avgProb = s.zones.reduce((acc, z) => acc + z.probability, 0) / s.zones.length;
    return { state: s.name, risk: avgProb, zones: s.zones.length };
  }).sort((a, b) => b.risk - a.risk);

  // Alert history (14-day simulated)
  const alertHistory = Array.from({ length: 14 }, (_, i) => {
    const base = 5 + Math.sin(i * 0.4) * 3;
    return Math.max(0, Math.round(base + (i > 8 ? i - 8 : 0)));
  });

  // Rainfall trend across all zones (12 points)
  const rainfallTrend = Array.from({ length: 12 }, (_, i) => {
    return Math.round(30 + Math.sin(i * 0.5) * 15 + Math.cos(i * 0.3) * 10 + i * 1.5);
  });

  // Risk trend
  const riskTrend = Array.from({ length: 12 }, (_, i) => {
    return Math.round(45 + Math.sin(i * 0.4) * 12 + i * 1.8);
  });

  // Incident statistics
  const incidentStats = {
    total: incidents.length,
    active: incidents.filter((i) => i.status !== 'resolved').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
    critical: incidents.filter((i) => i.priority === 'critical').length,
  };

  // Response time (simulated, in minutes)
  const responseTimes = [12, 18, 8, 25, 15, 10, 20, 14, 22, 16, 11, 19];

  // Prediction accuracy trend
  const accuracyTrend = [82, 84, 85, 86, 87, 88, 88, 89, 90, 91, 91, 92];

  // Landslide frequency by month
  const landslideFreq = [2, 1, 3, 5, 8, 12, 15, 18, 14, 9, 5, 3];

  // Infrastructure exposure
  const infraData = [
    { label: 'Roads at Risk', value: 47, color: '#F97316' },
    { label: 'Buildings at Risk', value: 128, color: '#DC2626' },
    { label: 'Schools at Risk', value: 12, color: '#EAB308' },
    { label: 'Hospitals at Risk', value: 4, color: '#DC2626' },
    { label: 'Power Lines at Risk', value: 23, color: '#F97316' },
    { label: 'Water Sources at Risk', value: 8, color: '#1976B9' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Intelligence Analytics</h1>
          <p className="text-sm text-ink-500 mt-1">Comprehensive disaster intelligence visualizations</p>
        </div>
        <SimTag text="Demo Analytics" />
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Prediction Accuracy', val: 92, suffix: '%', icon: <Target size={18} />, color: '#22A06B', trend: accuracyTrend },
          { label: 'Avg Response Time', val: 15, suffix: ' min', icon: <Clock size={18} />, color: '#1976B9', trend: responseTimes },
          { label: 'Total Incidents', val: incidentStats.total, suffix: '', icon: <AlertTriangle size={18} />, color: '#F97316', trend: alertHistory },
          { label: 'Sensors Active', val: 85, suffix: '%', icon: <Cpu size={18} />, color: '#20A39E', trend: [80, 82, 83, 84, 85, 85, 85, 85, 85, 85, 85, 85] },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                {kpi.icon}
              </div>
              <Sparkline data={kpi.trend} color={kpi.color} width={80} height={24} />
            </div>
            <div className="text-2xl font-bold text-ink-900 tnum">
              <AnimatedNumber value={kpi.val} suffix={kpi.suffix} />
            </div>
            <div className="text-xs text-ink-500 mt-1">{kpi.label}</div>
          </Card>
        ))}
      </div>

      {/* Rainfall & Risk Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionHeader title="Rainfall Trend" subtitle="Regional average — 12 intervals" icon={<CloudRain size={18} />} />
          <AreaChart
            series={[{ name: 'Rainfall (mm)', data: rainfallTrend, color: '#1976B9' }]}
            height={180}
            labels={['12h', '10h', '8h', '6h', '4h', '2h', 'Now']}
            maxVal={100}
          />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-ink-900 tnum">{Math.max(...rainfallTrend)}mm</div>
              <div className="text-[10px] text-ink-500">Peak</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-ink-900 tnum">{(rainfallTrend.reduce((a, b) => a + b, 0) / rainfallTrend.length).toFixed(0)}mm</div>
              <div className="text-[10px] text-ink-500">Average</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-risk-low tnum">↑ 18%</div>
              <div className="text-[10px] text-ink-500">Trend</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Risk Score Trend" subtitle="Regional average probability" icon={<TrendingUp size={18} />} />
          <AreaChart
            series={[{ name: 'Risk %', data: riskTrend, color: '#F97316' }]}
            height={180}
            labels={['12h', '10h', '8h', '6h', '4h', '2h', 'Now']}
            maxVal={100}
          />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-ink-900 tnum">{Math.max(...riskTrend)}%</div>
              <div className="text-[10px] text-ink-500">Peak Risk</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-ink-900 tnum">{(riskTrend.reduce((a, b) => a + b, 0) / riskTrend.length).toFixed(0)}%</div>
              <div className="text-[10px] text-ink-500">Average</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-risk-high tnum">↑ Rising</div>
              <div className="text-[10px] text-ink-500">Trend</div>
            </div>
          </div>
        </Card>
      </div>

      {/* State-wise Risk & Alert History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionHeader title="State-Wise Risk Distribution" subtitle="Average risk score by state" icon={<BarChart3 size={18} />} />
          <div className="space-y-3">
            {stateRisk.map((s) => {
              const level: RiskLevel = s.risk >= 76 ? 'critical' : s.risk >= 56 ? 'high' : s.risk >= 31 ? 'medium' : 'low';
              const m = RISK_META[level];
              return (
                <div key={s.state}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-ink-700">{s.state}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tnum" style={{ color: m.color }}>{s.risk.toFixed(0)}%</span>
                      <span className="text-[10px] text-ink-400">({s.zones} zones)</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full bg-surface-alt overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.risk}%`, background: m.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Alert History" subtitle="14-day alert frequency" icon={<AlertTriangle size={18} />} />
          <BarChart
            data={alertHistory}
            color="#DC2626"
            height={160}
            labels={Array.from({ length: 14 }, (_, i) => `${14 - i}d`).filter((_, i) => i % 2 === 0)}
            maxVal={20}
          />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-ink-900 tnum">{alertHistory.reduce((a, b) => a + b, 0)}</div>
              <div className="text-[10px] text-ink-500">Total Alerts</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-risk-crit tnum">{alertHistory.filter(v => v > 8).length}</div>
              <div className="text-[10px] text-ink-500">High-Alert Days</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-ink-900 tnum">{(alertHistory.reduce((a, b) => a + b, 0) / 14).toFixed(1)}</div>
              <div className="text-[10px] text-ink-500">Daily Average</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Sensor Readings Multi-Chart & Response Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionHeader title="Sensor Readings Trend" subtitle={selectedZone.name} icon={<Activity size={18} />} />
          <AreaChart
            series={[
              { name: 'Rainfall', data: selectedZone.sensors[0].trend, color: '#55B9E6' },
              { name: 'Soil Moisture', data: selectedZone.sensors[1].trend, color: '#20A39E' },
              { name: 'Slope Movement', data: selectedZone.sensors[2].trend.map(v => v * 10), color: '#F97316' },
            ]}
            height={180}
            labels={['12h', '10h', '8h', '6h', '4h', '2h', 'Now']}
            maxVal={100}
          />
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-2"><span className="w-3 h-1.5 rounded-full" style={{ background: '#55B9E6' }} /><span className="text-xs text-ink-500">Rainfall</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-1.5 rounded-full" style={{ background: '#20A39E' }} /><span className="text-xs text-ink-500">Soil Moisture</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-1.5 rounded-full" style={{ background: '#F97316' }} /><span className="text-xs text-ink-500">Slope (×10)</span></div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Response Time Analysis" subtitle="Minutes from alert to deployment" icon={<Clock size={18} />} />
          <BarChart
            data={responseTimes}
            color="#1976B9"
            height={160}
            labels={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
            maxVal={30}
          />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-risk-low tnum">{Math.min(...responseTimes)}m</div>
              <div className="text-[10px] text-ink-500">Best</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-ink-900 tnum">{(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(0)}m</div>
              <div className="text-[10px] text-ink-500">Average</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-risk-high tnum">{Math.max(...responseTimes)}m</div>
              <div className="text-[10px] text-ink-500">Worst</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Prediction Accuracy & Landslide Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionHeader title="Prediction Accuracy Trend" subtitle="AI model accuracy over 12 intervals" icon={<Target size={18} />} />
          <AreaChart
            series={[{ name: 'Accuracy %', data: accuracyTrend, color: '#22A06B' }]}
            height={160}
            labels={['12h', '10h', '8h', '6h', '4h', '2h', 'Now']}
            maxVal={100}
          />
          <div className="p-3 rounded-lg bg-risk-lowBg border border-risk-low/20 mt-4 flex items-center justify-between">
            <span className="text-sm text-ink-700">Current Model Accuracy</span>
            <span className="text-lg font-bold text-risk-low tnum">92%</span>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Landslide Frequency" subtitle="Historical events by month" icon={<Mountain size={18} />} />
          <BarChart
            data={landslideFreq}
            color="#20A39E"
            height={160}
            labels={['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']}
            maxVal={20}
          />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-ink-900 tnum">{landslideFreq.reduce((a, b) => a + b, 0)}</div>
              <div className="text-[10px] text-ink-500">Total/Year</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-risk-high tnum">{Math.max(...landslideFreq)}</div>
              <div className="text-[10px] text-ink-500">Peak Month</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-lg font-bold text-ink-900 tnum">Jul-Aug</div>
              <div className="text-[10px] text-ink-500">Monsoon Season</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Infrastructure Exposure */}
      <Card className="p-6">
        <SectionHeader title="Infrastructure Exposure Analysis" subtitle="Critical infrastructure at risk across NER" icon={<Gauge size={18} />} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {infraData.map((inf) => (
            <div key={inf.label} className="p-4 rounded-xl bg-surface-base border border-line">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-ink-500">{inf.label}</span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: inf.color }} />
              </div>
              <div className="text-2xl font-bold tnum" style={{ color: inf.color }}>{inf.value}</div>
              <div className="mt-2 h-1.5 rounded-full bg-surface-alt overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(inf.value / 130) * 100}%`, background: inf.color }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
