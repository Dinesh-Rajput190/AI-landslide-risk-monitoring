import { useState } from 'react';
import { AppProvider, useApp } from './store';
import { Landing } from './components/Landing';
import { Sidebar, Header } from './components/Layout';
import { AIAssistant } from './components/AIAssistant';
import { Dashboard } from './views/Dashboard';
import { RiskIntelligence } from './views/RiskIntelligence';
import { WeatherIntelligence } from './views/Weather';
import { RiskMap } from './views/RiskMap';
import { AIPrediction } from './views/AIPrediction';
import { Sensors } from './views/Sensors';
import { AlertCenter } from './views/AlertCenter';
import { EmergencyComms } from './views/EmergencyComms';
import { AuthorityResponse, RescueOps } from './views/Response';
import { CitizenSafety, SafeZones, SafeRoutes, Precautions } from './views/Citizen';
import { Analytics } from './views/Analytics';
import { EnergyControl } from './views/EnergyControl';
import { FieldVerification } from './views/FieldVerification';
import { OfflineSync } from './views/OfflineSync';
import { WhyBhooShanket } from './views/WhyBhooShanket';

function MainApp() {
  const { view } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard />;
      case 'risk': return <RiskIntelligence />;
      case 'weather': return <WeatherIntelligence />;
      case 'map': return <RiskMap />;
      case 'ai': return <AIPrediction />;
      case 'sensors': return <Sensors />;
      case 'alerts': return <AlertCenter />;
      case 'comms': return <EmergencyComms />;
      case 'contacts': return <EmergencyComms />;
      case 'response': return <AuthorityResponse />;
      case 'rescue': return <RescueOps />;
      case 'citizen': return <CitizenSafety />;
      case 'safezones': return <SafeZones />;
      case 'saferoutes': return <SafeRoutes />;
      case 'precautions': return <Precautions />;
      case 'energy': return <EnergyControl />;
      case 'analytics': return <Analytics />;
      case 'field': return <FieldVerification />;
      case 'offline': return <OfflineSync />;
      case 'why': return <WhyBhooShanket />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-base">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">
          {renderView()}
        </main>
        <footer className="px-6 py-4 border-t border-line text-center text-xs text-ink-400">
          BhooShanket AI — Simulation Prototype for SIH 2026 (SIH26001) · All data is simulated · Not a real emergency service
        </footer>
      </div>
      <AIAssistant />
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <Landing onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
