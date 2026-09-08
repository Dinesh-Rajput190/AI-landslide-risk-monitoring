import { useState } from 'react';
import {
  Mountain, LayoutDashboard, AlertTriangle, CloudRain, Map as MapIcon, Brain, Cpu, Bell,
  Radio, Phone, ShieldCheck, Users, MapPin, Route, BookOpen, Zap, BarChart3,
  ChevronRight, Globe, Bell as BellIcon, User, X, Menu, Search, Crosshair, WifiOff, Sparkles,
} from 'lucide-react';
import { useApp } from '../store';
import type { ViewKey, Language } from '../types';
import { LiveDot, SimTag } from './ui';

const NAV_GROUPS: { group: string; items: { key: ViewKey; label: string; icon: React.ReactNode }[] }[] = [
  {
    group: 'Command',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { key: 'risk', label: 'Risk Intelligence', icon: <AlertTriangle size={18} /> },
      { key: 'map', label: 'Risk Map', icon: <MapIcon size={18} /> },
      { key: 'weather', label: 'Weather', icon: <CloudRain size={18} /> },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      { key: 'ai', label: 'AI Prediction', icon: <Brain size={18} /> },
      { key: 'sensors', label: 'Sensors', icon: <Cpu size={18} /> },
    ],
  },
  {
    group: 'Emergency',
    items: [
      { key: 'alerts', label: 'Alert Center', icon: <Bell size={18} /> },
      { key: 'comms', label: 'Communication', icon: <Radio size={18} /> },
      { key: 'contacts', label: 'Contacts', icon: <Phone size={18} /> },
      { key: 'response', label: 'Response', icon: <ShieldCheck size={18} /> },
      { key: 'rescue', label: 'Rescue Ops', icon: <Users size={18} /> },
    ],
  },
  {
    group: 'Citizen',
    items: [
      { key: 'citizen', label: 'Citizen Safety', icon: <ShieldCheck size={18} /> },
      { key: 'safezones', label: 'Safe Zones', icon: <MapPin size={18} /> },
      { key: 'saferoutes', label: 'Safe Routes', icon: <Route size={18} /> },
      { key: 'precautions', label: 'Precautions', icon: <BookOpen size={18} /> },
    ],
  },
  {
    group: 'System',
    items: [
      { key: 'energy', label: 'Energy Control', icon: <Zap size={18} /> },
      { key: 'field', label: 'Field Verification', icon: <Crosshair size={18} /> },
      { key: 'offline', label: 'Offline Sync', icon: <WifiOff size={18} /> },
      { key: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
      { key: 'why', label: 'Why BhooShanket?', icon: <Sparkles size={18} /> },
    ],
  },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { view, setView } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-ink-900/20 z-40 lg:hidden" onClick={onClose} />}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-surface-card border-r border-line z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-line shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-teal-400 text-white">
              <Mountain size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold text-ink-900 text-sm leading-tight">BhooShanket AI</div>
              <div className="text-[9px] font-semibold uppercase tracking-widest text-teal-500">Command Center</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-ink-400 hover:text-ink-900">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV_GROUPS.map((g) => (
            <div key={g.group}>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-400">{g.group}</div>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const active = view === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => { setView(item.key); onClose(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        active
                          ? 'bg-brand-50 text-brand-600'
                          : 'text-ink-500 hover:bg-surface-alt hover:text-ink-900'
                      }`}
                    >
                      <span className={`shrink-0 transition-colors ${active ? 'text-brand-500' : 'text-ink-400 group-hover:text-ink-700'}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {active && <ChevronRight size={14} className="text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-line shrink-0">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface-alt">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse-soft" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Simulation Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Header({ onMenu }: { onMenu: () => void }) {
  const { clock, language, setLanguage, alerts, selectedZone } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const hours = clock.getHours();
  const greeting = hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : hours < 21 ? 'Good Evening' : 'Good Night';

  const newAlerts = alerts.filter((a) => a.status === 'new' || a.risk === 'critical').length;

  const timeStr = clock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = clock.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="sticky top-0 z-30 bg-surface-base/90 backdrop-blur-md border-b border-line">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 h-16">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onMenu} className="lg:hidden text-ink-500 hover:text-ink-900">
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base lg:text-lg font-bold text-ink-900 truncate">{greeting}, Authority</h1>
              <LiveDot label="Live" />
            </div>
            <p className="text-xs text-ink-500 hidden sm:block">BhooShanket AI Command Center · {selectedZone.name}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Clock */}
          <div className="hidden md:flex flex-col items-end px-3 py-1.5 rounded-lg bg-surface-card border border-line">
            <span className="text-sm font-bold text-ink-900 tnum leading-tight">{timeStr}</span>
            <span className="text-[10px] text-ink-500">{dateStr}</span>
          </div>

          {/* Sim tag */}
          <div className="hidden lg:block">
            <SimTag text="Simulation Mode" />
          </div>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setShowLang(!showLang)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-card border border-line text-sm text-ink-700 hover:bg-surface-alt transition-colors"
            >
              <Globe size={16} className="text-brand-500" />
              <span className="font-medium">{language === 'en' ? 'EN' : 'हिं'}</span>
            </button>
            {showLang && (
              <div className="absolute right-0 mt-2 w-36 bg-surface-card border border-line rounded-xl shadow-float py-1.5 z-50 animate-slide-up">
                {([
                  { key: 'en' as Language, label: 'English' },
                  { key: 'hi' as Language, label: 'हिंदी (Hindi)' },
                ]).map((l) => (
                  <button
                    key={l.key}
                    onClick={() => { setLanguage(l.key); setShowLang(false); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-alt ${language === l.key ? 'text-brand-600 font-semibold' : 'text-ink-700'}`}
                  >
                    {l.label}
                  </button>
                ))}
                <div className="border-t border-line my-1.5" />
                <div className="px-3 py-1.5 text-[10px] text-ink-400 font-medium">More NE languages soon</div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-surface-card border border-line text-ink-700 hover:bg-surface-alt transition-colors"
            >
              <BellIcon size={18} />
              {newAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-risk-crit text-white text-[9px] font-bold flex items-center justify-center" style={{ width: 18, height: 18 }}>
                  {newAlerts}
                </span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-card border border-line rounded-xl shadow-float z-50 animate-slide-up overflow-hidden">
                <div className="px-4 py-3 border-b border-line flex items-center justify-between">
                  <span className="font-bold text-sm text-ink-900">Notifications</span>
                  <SimTag text="Demo" />
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {alerts.slice(0, 5).map((a) => (
                    <div key={a.id} className="px-4 py-3 border-b border-line/50 hover:bg-surface-alt/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: a.risk === 'critical' ? '#DC2626' : a.risk === 'high' ? '#F97316' : '#EAB308' }} />
                        <span className="text-xs font-semibold text-ink-900">{a.location}</span>
                      </div>
                      <p className="text-xs text-ink-500">{a.action}</p>
                      <span className="text-[10px] text-ink-400 mt-1 block">{a.detectedTime} · {a.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-surface-card border border-line">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-teal-400 text-white flex items-center justify-center text-xs font-bold">
              SA
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-xs font-semibold text-ink-900">State Authority</div>
              <div className="text-[10px] text-ink-500">SDMA Operator</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
