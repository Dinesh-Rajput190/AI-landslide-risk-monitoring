import { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Card, SectionHeader, SimTag, RiskBadge, Progress, BarChart, Donut } from '../components/ui';
import { LocationSelector } from '../components/LocationSelector';
import {
  Brain, CloudRain, Droplets, Mountain, Wind, Thermometer, Play, Cpu,
  Activity, GitBranch, Zap, ArrowRight, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { AI_FACTORS } from '../data';
import { RISK_META } from '../types';
import type { RiskLevel } from '../types';

const PIPELINE = [
  { label: 'Environmental Data', icon: <CloudRain size={16} /> },
  { label: 'Data Processing', icon: <Cpu size={16} /> },
  { label: 'Feature Analysis', icon: <Activity size={16} /> },
  { label: 'AI Risk Engine', icon: <Brain size={16} /> },
  { label: 'Landslide Probability', icon: <Zap size={16} /> },
  { label: 'Early Warning Decision', icon: <AlertTriangle size={16} /> },
];

export function AIPrediction() {
  const { selectedZone } = useApp();

  const [inputs, setInputs] = useState({
    rainfall: selectedZone.rainfall,
    soilMoisture: selectedZone.soilMoisture,
    slopeMovement: selectedZone.slopeMovement,
    slopeAngle: selectedZone.slopeAngle,
    temperature: selectedZone.temperature,
    humidity: selectedZone.humidity,
    weather: selectedZone.weather,
  });

  // Sync when zone changes
  useEffect(() => {
    setInputs({
      rainfall: selectedZone.rainfall,
      soilMoisture: selectedZone.soilMoisture,
      slopeMovement: selectedZone.slopeMovement,
      slopeAngle: selectedZone.slopeAngle,
      temperature: selectedZone.temperature,
      humidity: selectedZone.humidity,
      weather: selectedZone.weather,
    });
  }, [selectedZone]);

  const [running, setRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [result, setResult] = useState<{ probability: number; level: RiskLevel } | null>(null);

  const runAnalysis = () => {
    setRunning(true);
    setResult(null);
    setPipelineStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= PIPELINE.length) {
        clearInterval(interval);
        // Calculate weighted risk
        const normRain = Math.min(1, inputs.rainfall / 80);
        const normSoil = Math.min(1, inputs.soilMoisture / 100);
        const normSlope = Math.min(1, inputs.slopeMovement / 12);
        const normAngle = Math.min(1, inputs.slopeAngle / 45);
        const normWeather = inputs.weather === 'Torrential Rain' ? 1 : inputs.weather === 'Heavy Rain' ? 0.7 : inputs.weather === 'Moderate Rain' ? 0.4 : 0.15;

        const prob =
          normRain * 0.35 +
          normSoil * 0.25 +
          normSlope * 0.20 +
          normAngle * 0.10 +
          normWeather * 0.10;

        const probability = Math.round(prob * 100);
        const level: RiskLevel = probability >= 80 ? 'critical' : probability >= 60 ? 'high' : probability >= 35 ? 'medium' : 'low';

        setResult({ probability, level });
        setRunning(false);
        setPipelineStep(-1);
      } else {
        setPipelineStep(step);
      }
    }, 450);
  };

  const contributions = result
    ? [
        { label: 'Rainfall', weight: 35, value: Math.min(1, inputs.rainfall / 80) * 35, color: '#1976B9' },
        { label: 'Soil Moisture', weight: 25, value: Math.min(1, inputs.soilMoisture / 100) * 25, color: '#20A39E' },
        { label: 'Slope Movement', weight: 20, value: Math.min(1, inputs.slopeMovement / 12) * 20, color: '#F97316' },
        { label: 'Slope Angle', weight: 10, value: Math.min(1, inputs.slopeAngle / 45) * 10, color: '#55B9E6' },
        { label: 'Weather Condition', weight: 10, value: (inputs.weather === 'Torrential Rain' ? 1 : inputs.weather === 'Heavy Rain' ? 0.7 : inputs.weather === 'Moderate Rain' ? 0.4 : 0.15) * 10, color: '#EAB308' },
      ]
    : [];

  const inputConfigs = [
    { key: 'rainfall', label: 'Rainfall Intensity', unit: 'mm', min: 0, max: 100, step: 1, icon: <CloudRain size={16} /> },
    { key: 'soilMoisture', label: 'Soil Moisture', unit: '%', min: 0, max: 100, step: 1, icon: <Droplets size={16} /> },
    { key: 'slopeMovement', label: 'Slope Movement', unit: 'mm/day', min: 0, max: 12, step: 0.1, icon: <Mountain size={16} /> },
    { key: 'slopeAngle', label: 'Slope Angle', unit: '°', min: 0, max: 45, step: 1, icon: <Mountain size={16} /> },
    { key: 'temperature', label: 'Temperature', unit: '°C', min: 0, max: 40, step: 1, icon: <Thermometer size={16} /> },
    { key: 'humidity', label: 'Humidity', unit: '%', min: 0, max: 100, step: 1, icon: <Droplets size={16} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">AI Landslide Risk Prediction Engine</h1>
          <p className="text-sm text-ink-500 mt-1">Transparent weighted risk model · Prototype AI simulation</p>
        </div>
        <div className="flex items-center gap-3">
          <LocationSelector compact />
          <SimTag text="Prototype AI" />
        </div>
      </div>

      {/* Pipeline */}
      <Card className="p-6">
        <SectionHeader title="AI Processing Pipeline" subtitle="From environmental data to early warning" icon={<GitBranch size={18} />} badge={<SimTag text="Transparent Model" />} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          {PIPELINE.map((p, i) => {
            const active = running && pipelineStep === i;
            const done = running && pipelineStep > i;
            return (
              <div key={p.label} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                  active ? 'bg-brand-500 text-white border-brand-500 scale-105 shadow-float' :
                  done ? 'bg-teal-50 text-teal-600 border-teal-200' :
                  'bg-surface-base text-ink-500 border-line'
                }`}>
                  <span className={active ? 'animate-pulse-soft' : ''}>{p.icon}</span>
                  <span className="text-xs font-semibold">{p.label}</span>
                  {done && <CheckCircle2 size={14} className="text-teal-500" />}
                </div>
                {i < PIPELINE.length - 1 && <ArrowRight size={16} className="text-ink-300" />}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input controls */}
        <Card className="p-6">
          <SectionHeader title="Input Parameters" subtitle="Adjust environmental factors" icon={<Cpu size={18} />} />
          <div className="space-y-4">
            {inputConfigs.map((cfg) => (
              <div key={cfg.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-500">{cfg.icon}</span>
                    <span className="text-sm font-medium text-ink-700">{cfg.label}</span>
                  </div>
                  <span className="text-sm font-bold text-ink-900 tnum">
                    {typeof inputs[cfg.key as keyof typeof inputs] === 'number'
                      ? (inputs[cfg.key as keyof typeof inputs] as number).toFixed(cfg.step < 1 ? 1 : 0)
                      : inputs[cfg.key as keyof typeof inputs]}
                    <span className="text-xs text-ink-500 ml-0.5">{cfg.unit}</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={cfg.min}
                  max={cfg.max}
                  step={cfg.step}
                  value={inputs[cfg.key as keyof typeof inputs] as number}
                  onChange={(e) => setInputs({ ...inputs, [cfg.key]: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            ))}
            {/* Weather select */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-brand-500"><Wind size={16} /></span>
                <span className="text-sm font-medium text-ink-700">Weather Condition</span>
              </div>
              <select
                value={inputs.weather}
                onChange={(e) => setInputs({ ...inputs, weather: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface-base text-sm text-ink-900 font-medium"
              >
                <option>Light Cloud</option>
                <option>Moderate Rain</option>
                <option>Heavy Rain</option>
                <option>Torrential Rain</option>
              </select>
            </div>
          </div>

          <button
            onClick={runAnalysis}
            disabled={running}
            className="w-full mt-5 py-3.5 rounded-xl bg-brand-500 text-white font-semibold text-sm shadow-float hover:bg-brand-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Play size={18} />
            {running ? 'Running AI Analysis...' : 'Run AI Analysis'}
          </button>
        </Card>

        {/* Output */}
        <Card className="p-6">
          <SectionHeader title="AI Prediction Output" subtitle="Landslide probability result" icon={<Brain size={18} />} badge={<SimTag text="Demo AI" />} />

          {!result && !running && (
            <div className="flex flex-col items-center justify-center h-72 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-alt text-ink-300 mb-3">
                <Brain size={28} />
              </div>
              <p className="text-sm text-ink-500">Adjust parameters and run analysis to see prediction.</p>
            </div>
          )}

          {running && (
            <div className="flex flex-col items-center justify-center h-72">
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-surface-alt" />
                <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
              </div>
              <p className="text-sm font-semibold text-ink-700">Processing pipeline step {pipelineStep + 1}...</p>
            </div>
          )}

          {result && !running && (
            <div className="animate-fade-up">
              {/* Result gauge */}
              <div className="flex flex-col items-center mb-6">
                <Donut value={result.probability} size={180} stroke={16} color={RISK_META[result.level].color} label={`${result.probability}%`} sublabel="" />
                <div className={`mt-4 px-5 py-2 rounded-full font-bold text-sm uppercase tracking-wide ${RISK_META[result.level].bg} ${RISK_META[result.level].text}`}>
                  {RISK_META[result.level].label} Risk
                </div>
              </div>

              {/* Warning decision */}
              <div className={`p-4 rounded-xl border ${RISK_META[result.level].border} ${RISK_META[result.level].bg} mb-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={18} style={{ color: RISK_META[result.level].color }} />
                  <span className="font-bold text-ink-900">Early Warning Decision</span>
                </div>
                <p className="text-sm text-ink-700">
                  {result.level === 'critical'
                    ? 'RED ALERT: Immediate evacuation required. Deploy emergency response teams.'
                    : result.level === 'high'
                    ? 'ORANGE ALERT: Activate emergency preparedness. Issue public warning.'
                    : result.level === 'medium'
                    ? 'YELLOW ALERT: Enhanced monitoring. Inform local authorities.'
                    : 'GREEN: No immediate action required. Continue routine monitoring.'}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Factor contributions */}
      {result && (
        <Card className="p-6 animate-fade-up">
          <SectionHeader title="Why Did the AI Predict This?" subtitle="Factor contribution breakdown" icon={<Activity size={18} />} badge={<SimTag text="Transparent Weighted Model" />} />

          {/* Weights display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3">Risk Contribution Model</div>
              <div className="space-y-3">
                {AI_FACTORS.map((f, i) => (
                  <div key={f.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-ink-700">{f.label}</span>
                      <span className="text-xs font-bold text-ink-900">{f.weight}% weight</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 rounded-full bg-surface-alt overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${contributions[i].value.toFixed(1)}%`, background: contributions[i].color }} />
                      </div>
                      <span className="text-xs font-bold tnum text-ink-700 w-12 text-right">{contributions[i].value.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3">Contribution Chart</div>
              <BarChart
                data={contributions.map((c) => c.value)}
                labels={contributions.map((c) => c.label.split(' ')[0])}
                color={RISK_META[result.level].color}
                height={160}
                maxVal={35}
              />
              <div className="mt-4 p-3 rounded-lg bg-surface-base border border-line">
                <div className="text-xs text-ink-500 mb-1">Total Weighted Score</div>
                <div className="text-2xl font-bold tnum" style={{ color: RISK_META[result.level].color }}>
                  {contributions.reduce((a, b) => a + b.value, 0).toFixed(1)} / 100
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
