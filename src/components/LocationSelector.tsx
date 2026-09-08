import { useApp, STATES } from '../store';
import { MapPin, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LocationSelector({ compact = false }: { compact?: boolean }) {
  const { selectedZoneName, selectZone } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const groups: Record<string, { name: string; district: string; state: string }[]> = {};
  STATES.forEach((s) => {
    s.zones.forEach((z) => {
      if (!groups[s.name]) groups[s.name] = [];
      groups[s.name].push({ name: z.name, district: z.district, state: s.name });
    });
  });

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-card border border-line hover:bg-surface-alt transition-colors ${compact ? 'text-sm' : 'text-sm'}`}
      >
        <MapPin size={16} className="text-brand-500" />
        <span className="font-medium text-ink-900 truncate max-w-[200px]">{selectedZoneName}</span>
        <ChevronDown size={14} className={`text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-surface-card border border-line rounded-xl shadow-float z-50 animate-slide-up">
          <div className="px-3 py-2.5 border-b border-line sticky top-0 bg-surface-card">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-400">Select Monitoring Zone</div>
          </div>
          {Object.entries(groups).map(([state, zones]) => (
            <div key={state}>
              <div className="px-3 py-1.5 bg-surface-alt text-[10px] font-bold uppercase tracking-widest text-ink-500">{state}</div>
              {zones.map((z) => (
                <button
                  key={z.name}
                  onClick={() => { selectZone(z.name); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-brand-50 transition-colors ${selectedZoneName === z.name ? 'bg-brand-50' : ''}`}
                >
                  <div className={`text-sm ${selectedZoneName === z.name ? 'text-brand-600 font-semibold' : 'text-ink-900 font-medium'}`}>{z.name}</div>
                  <div className="text-[11px] text-ink-500">{z.district} · {z.state}</div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function StateDistrictZoneSelector() {
  const { selectedZone, selectZone } = useApp();
  const [stateName, setStateName] = useState(selectedZone.state);
  const [district, setDistrict] = useState(selectedZone.district);

  const state = STATES.find((s) => s.name === stateName) ?? STATES[0];
  const zonesInDistrict = state.zones.filter((z) => z.district === district);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1.5">State</label>
        <select
          value={stateName}
          onChange={(e) => {
            setStateName(e.target.value);
            const s = STATES.find((st) => st.name === e.target.value)!;
            setDistrict(s.districts[0]);
            selectZone(s.zones[0].name);
          }}
          className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface-card text-sm text-ink-900 font-medium"
        >
          {STATES.map((s) => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1.5">District</label>
        <select
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            const z = state.zones.find((zz) => zz.district === e.target.value);
            if (z) selectZone(z.name);
          }}
          className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface-card text-sm text-ink-900 font-medium"
        >
          {state.districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wide text-ink-500 mb-1.5">Monitoring Zone</label>
        <select
          value={selectedZone.name}
          onChange={(e) => selectZone(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface-card text-sm text-ink-900 font-medium"
        >
          {zonesInDistrict.map((z) => (
            <option key={z.name} value={z.name}>{z.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
