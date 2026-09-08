import { useApp } from '../store';
import { Card, SectionHeader, SimTag, AreaChart, BarChart, Sparkline, AnimatedNumber } from '../components/ui';
import { StateDistrictZoneSelector } from '../components/LocationSelector';
import { CloudRain, Droplets, Wind, Thermometer, CloudDrizzle, TrendingUp, Eye, Gauge } from 'lucide-react';

export function WeatherIntelligence() {
  const { selectedZone } = useApp();

  const forecast24 = Array.from({ length: 24 }, (_, i) => {
    const base = selectedZone.rainfall;
    const wave = Math.sin(i * 0.5) * 8 + Math.cos(i * 0.3) * 5;
    return Math.max(0, base + wave - i * 0.3);
  });

  const forecast72 = Array.from({ length: 12 }, (_, i) => {
    const base = selectedZone.rainfall * 0.8;
    return Math.max(0, base + Math.sin(i * 0.6) * 12 + (i > 6 ? -i * 2 : i * 1.5));
  });

  const tempTrend = Array.from({ length: 12 }, (_, i) => {
    return selectedZone.temperature + Math.sin(i * 0.4) * 3 - i * 0.2;
  });

  const humidityTrend = Array.from({ length: 12 }, (_, i) => {
    return selectedZone.humidity + Math.cos(i * 0.5) * 6 - i * 0.5;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Weather Intelligence</h1>
          <p className="text-sm text-ink-500 mt-1">Real-time environmental monitoring and rainfall forecast</p>
        </div>
        <SimTag text="Simulated Environmental Data" />
      </div>

      {/* Location selector */}
      <Card className="p-4">
        <StateDistrictZoneSelector />
      </Card>

      {/* Current weather hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center topo-dense">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-1">Current Weather</div>
          <div className="text-sm font-medium text-ink-900 mb-4">{selectedZone.name}</div>
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-3">
            <div className="absolute inset-0 rounded-full bg-brand-50 animate-breathe" />
            <div className="relative text-brand-500">
              {selectedZone.rainfall > 50 ? <CloudDrizzle size={56} /> : <CloudRain size={56} />}
            </div>
          </div>
          <div className="text-3xl font-bold text-ink-900 tnum">{selectedZone.temperature}°C</div>
          <div className="text-sm text-ink-500 mt-1">{selectedZone.weather}</div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <span className="text-ink-500">Feels like: <span className="font-semibold text-ink-900">{selectedZone.temperature - 2}°C</span></span>
            <span className="text-ink-300">·</span>
            <span className="text-ink-500">Visibility: <span className="font-semibold text-ink-900">{selectedZone.rainfall > 50 ? '2 km' : '8 km'}</span></span>
          </div>
        </Card>

        {/* Weather metrics */}
        <Card className="lg:col-span-2 p-6">
          <SectionHeader title="Environmental Metrics" subtitle="Live readings from IoT sensors" icon={<Gauge size={18} />} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Temperature', val: selectedZone.temperature, unit: '°C', icon: <Thermometer size={18} />, color: '#1976B9', trend: tempTrend },
              { label: 'Humidity', val: selectedZone.humidity, unit: '%', icon: <Droplets size={18} />, color: '#20A39E', trend: humidityTrend },
              { label: 'Rainfall Intensity', val: selectedZone.rainfall, unit: 'mm', icon: <CloudRain size={18} />, color: '#55B9E6', trend: forecast24.slice(0, 12) },
              { label: 'Wind Speed', val: selectedZone.windSpeed, unit: 'km/h', icon: <Wind size={18} />, color: '#20A39E', trend: [6, 8, 10, 12, 14, 12, 10, 8, 10, 12, 14, selectedZone.windSpeed] },
              { label: '24h Rainfall', val: selectedZone.rainfall24h.toFixed(0), unit: 'mm', icon: <CloudDrizzle size={18} />, color: '#1565A0', trend: forecast24.slice(0, 12) },
              { label: '72h Rainfall', val: selectedZone.rainfall72h.toFixed(0), unit: 'mm', icon: <CloudRain size={18} />, color: '#1976B9', trend: forecast72 },
            ].map((m) => (
              <div key={m.label} className="p-4 rounded-xl bg-surface-base border border-line">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span style={{ color: m.color }}>{m.icon}</span>
                    <span className="text-xs font-semibold text-ink-500">{m.label}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-ink-900 tnum">
                  <AnimatedNumber value={parseFloat(String(m.val))} /> <span className="text-sm text-ink-500">{m.unit}</span>
                </div>
                <div className="mt-2">
                  <Sparkline data={m.trend} color={m.color} width={180} height={24} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Rainfall forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionHeader title="24-Hour Rainfall Forecast" subtitle="Hourly projection (mm)" icon={<CloudRain size={18} />} badge={<SimTag text="Simulated" />} />
          <BarChart
            data={forecast24}
            color="#55B9E6"
            height={140}
            maxVal={Math.max(...forecast24, 80)}
            labels={['0h', '4h', '8h', '12h', '16h', '20h', '24h']}
          />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-sm font-bold text-ink-900 tnum">{Math.max(...forecast24).toFixed(0)}mm</div>
              <div className="text-[10px] text-ink-500">Peak Hour</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-sm font-bold text-ink-900 tnum">{(forecast24.reduce((a, b) => a + b, 0) / 24).toFixed(0)}mm</div>
              <div className="text-[10px] text-ink-500">Average</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-surface-base border border-line">
              <div className="text-sm font-bold text-ink-900 tnum">{forecast24.filter(v => v > 30).length}h</div>
              <div className="text-[10px] text-ink-500">Heavy Rain Hours</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="72-Hour Rainfall Trend" subtitle="6-hour intervals" icon={<TrendingUp size={18} />} badge={<SimTag text="Forecast" />} />
          <AreaChart
            series={[
              { name: 'Rainfall', data: forecast72, color: '#1976B9' },
              { name: 'Soil Moisture', data: humidityTrend, color: '#20A39E' },
            ]}
            height={140}
            labels={['0h', '12h', '24h', '36h', '48h', '60h', '72h']}
          />
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1.5 rounded-full bg-brand-500" />
              <span className="text-xs text-ink-500">Rainfall (mm)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1.5 rounded-full bg-teal-400" />
              <span className="text-xs text-ink-500">Humidity (%)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Weather trend multi-chart */}
      <Card className="p-6">
        <SectionHeader title="Weather Trend Analysis" subtitle="12-hour multi-parameter trend" icon={<Eye size={18} />} />
        <AreaChart
          series={[
            { name: 'Temperature', data: tempTrend, color: '#1976B9' },
            { name: 'Humidity', data: humidityTrend, color: '#20A39E' },
          ]}
          height={200}
          labels={['12h', '10h', '8h', '6h', '4h', '2h', 'Now']}
          maxVal={100}
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 rounded-lg bg-surface-base border border-line">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-ink-500">Temperature</span>
              <span className="w-3 h-1.5 rounded-full bg-brand-500" />
            </div>
            <div className="text-lg font-bold text-ink-900 tnum">{selectedZone.temperature}°C</div>
            <div className="text-[10px] text-ink-400">Range: {Math.min(...tempTrend).toFixed(0)}°C - {Math.max(...tempTrend).toFixed(0)}°C</div>
          </div>
          <div className="p-3 rounded-lg bg-surface-base border border-line">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-ink-500">Humidity</span>
              <span className="w-3 h-1.5 rounded-full bg-teal-400" />
            </div>
            <div className="text-lg font-bold text-ink-900 tnum">{selectedZone.humidity}%</div>
            <div className="text-[10px] text-ink-400">Range: {Math.min(...humidityTrend).toFixed(0)}% - {Math.max(...humidityTrend).toFixed(0)}%</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
