import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ZoneInfo, AlertInfo, IncidentInfo, RescueTask, EmergencyRequest, Language, ViewKey, RiskLevel } from './types';
import { STATES, ALL_ZONES, INITIAL_ALERTS, INITIAL_INCIDENTS, INITIAL_TASKS, getZone } from './data';

interface AppState {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  selectedZoneName: string;
  selectedZone: ZoneInfo;
  selectZone: (name: string) => void;
  alerts: AlertInfo[];
  updateAlert: (id: string, patch: Partial<AlertInfo>) => void;
  incidents: IncidentInfo[];
  updateIncident: (id: string, patch: Partial<IncidentInfo>) => void;
  tasks: RescueTask[];
  updateTask: (id: string, patch: Partial<RescueTask>) => void;
  emergencyRequests: EmergencyRequest[];
  addEmergencyRequest: (req: EmergencyRequest) => void;
  updateEmergencyRequest: (id: string, patch: Partial<EmergencyRequest>) => void;
  clock: Date;
  monitoringMode: 'active' | 'energy' | 'night';
  setMonitoringMode: (m: 'active' | 'energy' | 'night') => void;
  alertPriority: boolean;
  setAlertPriority: (b: boolean) => void;
}

const Ctx = createContext<AppState | null>(null);

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used within AppProvider');
  return c;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedZoneName, setSelectedZoneName] = useState('Shillong Monitoring Zone');
  const [alerts, setAlerts] = useState<AlertInfo[]>(INITIAL_ALERTS);
  const [incidents, setIncidents] = useState<IncidentInfo[]>(INITIAL_INCIDENTS);
  const [tasks, setTasks] = useState<RescueTask[]>(INITIAL_TASKS);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [clock, setClock] = useState(new Date());
  const [monitoringMode, setMonitoringMode] = useState<'active' | 'energy' | 'night'>('active');
  const [alertPriority, setAlertPriority] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Gradually simulate sensor reading changes
  useEffect(() => {
    const t = setInterval(() => {
      setAlerts((prev) =>
        prev.map((a) => ({
          ...a,
          detectedTime: a.detectedTime,
        }))
      );
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const selectedZone = getZone(selectedZoneName);

  const selectZone = useCallback((name: string) => {
    setSelectedZoneName(name);
  }, []);

  const updateAlert = useCallback((id: string, patch: Partial<AlertInfo>) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const updateIncident = useCallback((id: string, patch: Partial<IncidentInfo>) => {
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch, lastUpdated: 'just now' } : i)));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<RescueTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const addEmergencyRequest = useCallback((req: EmergencyRequest) => {
    setEmergencyRequests((prev) => [req, ...prev]);
  }, []);

  const updateEmergencyRequest = useCallback((id: string, patch: Partial<EmergencyRequest>) => {
    setEmergencyRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  return (
    <Ctx.Provider
      value={{
        view,
        setView,
        language,
        setLanguage,
        selectedZoneName,
        selectedZone,
        selectZone,
        alerts,
        updateAlert,
        incidents,
        updateIncident,
        tasks,
        updateTask,
        emergencyRequests,
        addEmergencyRequest,
        updateEmergencyRequest,
        clock,
        monitoringMode,
        setMonitoringMode,
        alertPriority,
        setAlertPriority,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export { STATES, ALL_ZONES };
