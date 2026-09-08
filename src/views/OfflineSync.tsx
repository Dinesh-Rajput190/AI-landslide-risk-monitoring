import { useApp } from '../store';
import { Card, SectionHeader, SimTag, LiveDot } from '../components/ui';
import { Wifi, WifiOff, RefreshCw, Cloud, CloudOff, CheckCircle2, Clock, AlertTriangle, Database, Bell } from 'lucide-react';

export function OfflineSync() {
  const { alerts, emergencyRequests, incidents } = useApp();

  const pendingReports = 3;
  const queuedAlerts = alerts.filter((a) => a.status === 'new').length;
  const lastSynced = '2 minutes ago';
  const syncStatus = 'online';

  const pendingItems = [
    { id: 'PR-01', type: 'Field Report', location: 'Cherrapunji Ridge', time: '5m ago', status: 'pending' },
    { id: 'PR-02', type: 'Field Report', location: 'Tawang Pass', time: '12m ago', status: 'pending' },
    { id: 'PR-03', type: 'Sensor Data', location: 'Gangtok Zone', time: '18m ago', status: 'pending' },
  ];

  const queuedItems = alerts.filter((a) => a.status === 'new').slice(0, 4).map((a) => ({
    id: a.id,
    type: 'Emergency Alert',
    location: a.location,
    time: a.detectedTime,
    status: 'queued',
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Offline Sync & Low-Network Mode</h1>
          <p className="text-sm text-ink-500 mt-1">Resilient data sync for remote mountainous regions</p>
        </div>
        <div className="flex items-center gap-3">
          {syncStatus === 'online' ? <LiveDot label="Online" /> : <SimTag text="Offline Mode" />}
          <SimTag text="Prototype Sync" />
        </div>
      </div>

      {/* Sync status hero */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-risk-lowBg text-risk-low"><Wifi size={18} /></div>
            <span className="text-sm font-medium text-ink-500">Network Status</span>
          </div>
          <div className="text-xl font-bold text-risk-low">Online</div>
          <div className="text-xs text-ink-400 mt-1">All systems connected</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-500"><Clock size={18} /></div>
            <span className="text-sm font-medium text-ink-500">Last Synced</span>
          </div>
          <div className="text-xl font-bold text-ink-900">{lastSynced}</div>
          <div className="text-xs text-ink-400 mt-1">Auto-sync every 30s</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-risk-highBg text-risk-high"><RefreshCw size={18} /></div>
            <span className="text-sm font-medium text-ink-500">Pending Reports</span>
          </div>
          <div className="text-xl font-bold text-risk-high tnum">{pendingReports}</div>
          <div className="text-xs text-ink-400 mt-1">Awaiting sync</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-risk-critBg text-risk-crit"><Bell size={18} /></div>
            <span className="text-sm font-medium text-ink-500">Queued Alerts</span>
          </div>
          <div className="text-xl font-bold text-risk-crit tnum">{queuedAlerts}</div>
          <div className="text-xs text-ink-400 mt-1">Priority dispatch</div>
        </Card>
      </div>

      {/* Sync mechanism */}
      <Card className="p-6">
        <SectionHeader title="How Offline Sync Works" subtitle="Resilient architecture for low-connectivity mountain regions" icon={<Cloud size={18} />} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: <Database size={18} />, title: 'Local Cache', desc: 'Sensor data and field reports stored locally on device when network is unavailable', color: '#1976B9' },
            { icon: <WifiOff size={18} />, title: 'Offline Mode', desc: 'System continues monitoring and alerting using cached data and local AI inference', color: '#F97316' },
            { icon: <RefreshCw size={18} />, title: 'Auto-Sync', desc: 'When connectivity resumes, all pending data automatically syncs to central server', color: '#20A39E' },
            { icon: <Bell size={18} />, title: 'Priority Queue', desc: 'Critical alerts are queued and dispatched immediately upon reconnection', color: '#DC2626' },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-base border border-line">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-3" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
              <h4 className="text-sm font-bold text-ink-900 mb-1">{s.title}</h4>
              <p className="text-xs text-ink-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending & Queued */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionHeader title="Pending Reports" subtitle="Field reports awaiting sync" icon={<Clock size={18} />} />
          <div className="space-y-2">
            {pendingItems.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-risk-highBg text-risk-high"><RefreshCw size={14} /></div>
                  <div>
                    <div className="text-sm font-semibold text-ink-900">{p.type}</div>
                    <div className="text-[11px] text-ink-500">{p.location} · {p.time}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase text-risk-high bg-risk-highBg px-2 py-1 rounded-full">Pending</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 rounded-xl bg-brand-50 text-brand-600 font-semibold text-sm hover:bg-brand-100 flex items-center justify-center gap-2">
            <RefreshCw size={16} /> Simulate Sync Now
          </button>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Queued Alerts" subtitle="Priority alert dispatch queue" icon={<Bell size={18} />} />
          <div className="space-y-2">
            {queuedItems.length > 0 ? queuedItems.map((q) => (
              <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-line">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-risk-critBg text-risk-crit"><AlertTriangle size={14} /></div>
                  <div>
                    <div className="text-sm font-semibold text-ink-900">{q.location}</div>
                    <div className="text-[11px] text-ink-500">{q.id} · {q.time}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase text-risk-crit bg-risk-critBg px-2 py-1 rounded-full">Queued</span>
              </div>
            )) : (
              <div className="text-center py-8 text-sm text-ink-400">No queued alerts — all dispatched</div>
            )}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-risk-lowBg border border-risk-low/20 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-risk-low" />
            <span className="text-xs text-ink-700">All critical alerts will auto-dispatch on reconnection</span>
          </div>
        </Card>
      </div>

      {/* Offline simulation toggle */}
      <Card className="p-6">
        <SectionHeader title="Network Simulation" subtitle="Test offline behavior" icon={<WifiOff size={18} />} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-risk-lowBg border border-risk-low/20 flex items-center gap-3">
            <Wifi size={24} className="text-risk-low" />
            <div>
              <div className="text-sm font-bold text-ink-900">Online</div>
              <div className="text-xs text-ink-500">Full connectivity — real-time sync</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-base border border-line flex items-center gap-3 cursor-pointer hover:border-brand-200">
            <CloudOff size={24} className="text-ink-400" />
            <div>
              <div className="text-sm font-bold text-ink-900">Low Network</div>
              <div className="text-xs text-ink-500">Intermittent — batched sync every 5 min</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-base border border-line flex items-center gap-3 cursor-pointer hover:border-brand-200">
            <WifiOff size={24} className="text-ink-400" />
            <div>
              <div className="text-sm font-bold text-ink-900">Offline</div>
              <div className="text-xs text-ink-500">No network — local cache only</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
