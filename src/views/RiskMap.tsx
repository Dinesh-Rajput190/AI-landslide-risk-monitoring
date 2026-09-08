import { useState, useMemo } from 'react';
import { useApp, ALL_ZONES, STATES } from '../store';
import { Card, SimTag, RiskBadge, Sparkline, LiveDot } from '../components/ui';
import {
  Search, MapPin, Layers, Cpu, Filter, Cloud, Mountain, Satellite,
  Shield, X, ChevronDown, Radio, Map as MapIcon,
} from 'lucide-react';
import { RISK_META } from '../types';
import type { RiskLevel, ZoneInfo } from '../types';

const LAYERS = [
  { key: 'standard', label: 'Standard', icon: <MapIcon size={14} /> },
  { key: 'terrain', label: 'Terrain', icon: <Mountain size={14} /> },
  { key: 'satellite', label: 'Satellite', icon: <Satellite size={14} /> },
  { key: 'heatmap', label: 'Risk Heatmap', icon: <Cloud size={14} /> },
  { key: 'sensors', label: 'Sensor Network', icon: <Cpu size={14} /> },
  { key: 'safezones', label: 'Safe Zones', icon: <Shield size={14} /> },
];

const LAYER_BG: Record<string, string> = {
  standard: '#F0F5F9',
  terrain: '#EEF4ED',
  satellite: '#E8EDE8',
  heatmap: '#F0F5F9',
  sensors: '#F0F5F9',
  safezones: '#F0F5F9',
};

// Simplified NE India state shapes (approximate polygons for visual effect)
const STATE_SHAPES: { name: string; points: string }[] = [
  { name: 'Sikkim', points: '32,14 44,12 46,22 42,26 34,24 30,18' },
  { name: 'Arunachal Pradesh', points: '50,8 82,6 90,16 88,24 76,26 64,22 54,18 48,14' },
  { name: 'Assam', points: '48,28 72,26 80,32 78,40 70,42 58,40 50,38 44,34' },
  { name: 'Meghalaya', points: '42,36 52,36 54,44 48,46 42,44 40,40' },
  { name: 'Nagaland', points: '74,36 82,36 84,44 78,46 74,42' },
  { name: 'Manipur', points: '76,46 86,46 84,56 78,56 74,52' },
  { name: 'Mizoram', points: '76,56 86,56 84,66 78,68 74,62' },
  { name: 'Tripura', points: '68,54 76,54 76,62 70,64 66,60' },
];

export function RiskMap() {
  const { selectZone, selectedZone } = useApp();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sensorFilter, setSensorFilter] = useState('all');
  const [layer, setLayer] = useState('standard');
  const [showLayers, setShowLayers] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [panelZone, setPanelZone] = useState<ZoneInfo | null>(null);

  const filtered = useMemo(() => {
    return ALL_ZONES.filter((z) => {
      if (stateFilter !== 'all' && z.state !== stateFilter) return false;
      if (riskFilter !== 'all' && z.risk !== riskFilter) return false;
      if (sensorFilter !== 'all') {
        const hasOffline = z.sensors.some((s) => s.status === 'offline');
        const hasWarning = z.sensors.some((s) => s.status === 'warning');
        if (sensorFilter === 'offline' && !hasOffline) return false;
        if (sensorFilter === 'warning' && !hasWarning) return false;
        if (sensorFilter === 'online' && (hasOffline || hasWarning)) return false;
      }
      if (search && !z.name.toLowerCase().includes(search.toLowerCase()) && !z.district.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [stateFilter, riskFilter, sensorFilter, search]);

  const handleMarkerClick = (z: ZoneInfo) => {
    setPanelZone(z);
    selectZone(z.name);
  };

  const showHeatmap = layer === 'heatmap';
  const showSensorLines = layer === 'sensors';
  const showSafeZones = layer === 'safezones';

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Interactive Risk Map</h1>
          <p className="text-sm text-ink-500 mt-1">North Eastern India · Geographic Intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveDot label="Live" />
          <SimTag text="Prototype Map" />
        </div>
      </div>

      {/* Toolbar */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search location or district..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-line bg-surface-base text-sm text-ink-900 placeholder:text-ink-300"
            />
          </div>

          {/* State filter */}
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-line bg-surface-card text-sm text-ink-900 font-medium">
            <option value="all">All States</option>
            {STATES.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>

          {/* Risk filter */}
          <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-line bg-surface-card text-sm text-ink-900 font-medium">
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Sensor filter */}
          <select value={sensorFilter} onChange={(e) => setSensorFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-line bg-surface-card text-sm text-ink-900 font-medium">
            <option value="all">All Sensors</option>
            <option value="online">All Online</option>
            <option value="warning">Has Warning</option>
            <option value="offline">Has Offline</option>
          </select>

          {/* Layers */}
          <div className="relative">
            <button onClick={() => setShowLayers(!showLayers)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-line bg-surface-card text-sm text-ink-900 font-medium hover:bg-surface-alt">
              <Layers size={16} className="text-brand-500" />
              Layers
              <ChevronDown size={14} className={`text-ink-400 transition-transform ${showLayers ? 'rotate-180' : ''}`} />
            </button>
            {showLayers && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-card border border-line rounded-xl shadow-float z-50 py-2 animate-slide-up">
                {LAYERS.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => { setLayer(l.key); setShowLayers(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-surface-alt ${layer === l.key ? 'text-brand-600 font-semibold' : 'text-ink-700'}`}
                  >
                    <span className={layer === l.key ? 'text-brand-500' : 'text-ink-400'}>{l.icon}</span>
                    {l.label}
                    {layer === l.key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Map + Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <Card className="lg:col-span-2 p-0 overflow-hidden relative">
          <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
            <svg viewBox="0 0 100 70" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Background */}
              <rect width="100" height="70" fill={LAYER_BG[layer]} />

              {/* Grid */}
              {layer === 'standard' && (
                <g stroke="#DCE8F0" strokeWidth="0.15">
                  {Array.from({ length: 20 }, (_, i) => <line key={`v${i}`} x1={i * 5} y1="0" x2={i * 5} y2="70" />)}
                  {Array.from({ length: 14 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 5} x2="100" y2={i * 5} />)}
                </g>
              )}

              {/* Topographic contour lines */}
              <g fill="none" stroke="#1976B9" strokeOpacity="0.08" strokeWidth="0.2">
                {Array.from({ length: 8 }, (_, i) => (
                  <path key={i} d={`M0,${20 + i * 5} Q30,${15 + i * 5} 50,${20 + i * 5} T100,${20 + i * 5}`} />
                ))}
              </g>

              {/* Rivers */}
              <path d="M30,14 Q40,28 45,38 Q50,48 48,60" fill="none" stroke="#A6CDEF" strokeWidth="0.6" strokeOpacity="0.5" />
              <path d="M55,10 Q65,20 68,32 Q72,42 76,52" fill="none" stroke="#A6CDEF" strokeWidth="0.5" strokeOpacity="0.4" />

              {/* State shapes */}
              {STATE_SHAPES.map((s) => (
                <polygon
                  key={s.name}
                  points={s.points}
                  fill={layer === 'terrain' ? '#D8E8D0' : layer === 'satellite' ? '#D0DCC8' : '#E8F0F6'}
                  stroke="#A6CDEF"
                  strokeWidth="0.25"
                  strokeOpacity="0.6"
                />
              ))}

              {/* State labels */}
              {STATES.map((s) => (
                <text key={s.name} x={s.center.x} y={s.center.y - 6} fontSize="1.8" fill="#64798A" textAnchor="middle" fontWeight="600" opacity="0.5">
                  {s.name.length > 12 ? s.name.substring(0, 10) + '…' : s.name}
                </text>
              ))}

              {/* Heatmap circles */}
              {showHeatmap && ALL_ZONES.map((z, i) => (
                <circle key={`heat-${i}`} cx={z.x} cy={z.y} r="8" fill={RISK_META[z.risk].color} opacity="0.15">
                  <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite" />
                </circle>
              ))}

              {/* Sensor network lines */}
              {showSensorLines && STATES.map((s, si) => (
                <g key={`sn-${si}`}>
                  {s.zones.map((z, zi) => {
                    const next = s.zones[zi + 1];
                    if (!next) return null;
                    return <line key={zi} x1={z.x} y1={z.y} x2={next.x} y2={next.y} stroke="#20A39E" strokeWidth="0.2" strokeOpacity="0.4" strokeDasharray="0.5 0.5" />;
                  })}
                </g>
              ))}

              {/* Safe zones */}
              {showSafeZones && ALL_ZONES.flatMap((z) => z.safeZones).map((sz, i) => (
                <g key={`sz-${i}`}>
                  <circle cx={sz.x} cy={sz.y} r="1.2" fill="#22A06B" stroke="white" strokeWidth="0.3" />
                  <circle cx={sz.x} cy={sz.y} r="2.5" fill="none" stroke="#22A06B" strokeWidth="0.15" strokeOpacity="0.4" />
                </g>
              ))}

              {/* Zone markers */}
              {filtered.map((z) => {
                const c = RISK_META[z.risk].color;
                const isCritical = z.risk === 'critical';
                const isSelected = z.name === selectedZone.name;
                return (
                  <g key={z.name} className="cursor-pointer" onClick={() => handleMarkerClick(z)}>
                    {isCritical && (
                      <>
                        <circle cx={z.x} cy={z.y} r="2.5" fill={c} opacity="0.3">
                          <animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={z.x} cy={z.y} r="3.5" fill={c} opacity="0.15">
                          <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite" begin="0.5s" />
                          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
                        </circle>
                      </>
                    )}
                    <circle cx={z.x} cy={z.y} r={isSelected ? 2 : 1.5} fill={c} stroke="white" strokeWidth="0.4" />
                    {isSelected && <circle cx={z.x} cy={z.y} r="3" fill="none" stroke={c} strokeWidth="0.3" />}
                  </g>
                );
              })}
            </svg>

            {/* Map legend */}
            <div className="absolute bottom-3 left-3 bg-surface-card/90 backdrop-blur-sm rounded-lg border border-line p-2.5 text-xs">
              <div className="font-bold text-ink-900 mb-1.5">Risk Level</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {(['low', 'medium', 'high', 'critical'] as RiskLevel[]).map((r) => (
                  <div key={r} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: RISK_META[r].color }} />
                    <span className="text-ink-700">{RISK_META[r].label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer indicator */}
            <div className="absolute top-3 right-3 bg-surface-card/90 backdrop-blur-sm rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-700 flex items-center gap-2">
              {LAYERS.find((l) => l.key === layer)?.icon}
              {LAYERS.find((l) => l.key === layer)?.label}
            </div>

            {/* Zone count */}
            <div className="absolute top-3 left-3 bg-surface-card/90 backdrop-blur-sm rounded-lg border border-line px-3 py-1.5 text-xs text-ink-500">
              <span className="font-bold text-ink-900">{filtered.length}</span> zones visible
            </div>
          </div>
        </Card>

        {/* Intelligence panel */}
        <div className="space-y-4">
          {panelZone ? (
            <Card className="p-5 animate-slide-in-right">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-ink-900">{panelZone.name}</h3>
                  <p className="text-xs text-ink-500">{panelZone.district} · {panelZone.state}</p>
                </div>
                <button onClick={() => setPanelZone(null)} className="text-ink-400 hover:text-ink-900">
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <RiskBadge level={panelZone.risk} size="lg" />
                <span className="text-xs text-ink-500">Updated {panelZone.lastUpdated}</span>
              </div>

              {/* AI probability */}
              <div className="p-4 rounded-xl bg-surface-base border border-line mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1">AI Landslide Probability</div>
                <div className="text-3xl font-bold tnum" style={{ color: RISK_META[panelZone.risk].color }}>{panelZone.probability}%</div>
                <div className="mt-2 h-2 rounded-full bg-surface-alt overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${panelZone.probability}%`, background: RISK_META[panelZone.risk].color }} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'Rainfall', val: `${panelZone.rainfall}mm` },
                  { label: 'Soil Moisture', val: `${panelZone.soilMoisture}%` },
                  { label: 'Slope Movement', val: `${panelZone.slopeMovement.toFixed(1)}mm/d` },
                  { label: 'Weather', val: panelZone.weather },
                  { label: 'Temperature', val: `${panelZone.temperature}°C` },
                  { label: 'Humidity', val: `${panelZone.humidity}%` },
                ].map((s) => (
                  <div key={s.label} className="p-2.5 rounded-lg bg-surface-base border border-line">
                    <div className="text-[10px] text-ink-500">{s.label}</div>
                    <div className="text-sm font-bold text-ink-900">{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Sensor status */}
              <div className="p-3 rounded-lg bg-surface-base border border-line mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-2">Sensor Status</div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-risk-low" />{panelZone.sensors.filter(s => s.status === 'online').length} Online</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-risk-high" />{panelZone.sensors.filter(s => s.status === 'warning').length} Warning</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-risk-crit" />{panelZone.sensors.filter(s => s.status === 'offline').length} Offline</span>
                </div>
              </div>

              {/* Historical trend */}
              <div className="p-3 rounded-lg bg-surface-base border border-line">
                <div className="text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-2">Historical Risk Trend</div>
                <Sparkline data={panelZone.historicalRisk} color={RISK_META[panelZone.risk].color} width={250} height={40} />
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-50 text-brand-500 mb-3">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-ink-900 mb-1">Select a Location</h3>
              <p className="text-sm text-ink-500">Click any marker on the map to view detailed intelligence.</p>
            </Card>
          )}

          {/* Quick zone list */}
          <Card className="p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3">Visible Zones ({filtered.length})</div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {filtered.map((z) => (
                <button
                  key={z.name}
                  onClick={() => handleMarkerClick(z)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${selectedZone.name === z.name ? 'bg-brand-50 border-brand-200' : 'bg-surface-base border-line hover:border-brand-200'}`}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink-900 truncate">{z.name}</div>
                    <div className="text-[10px] text-ink-500">{z.state}</div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: RISK_META[z.risk].color }} />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
