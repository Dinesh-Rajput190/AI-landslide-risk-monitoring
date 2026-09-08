import { useState, useRef, useEffect } from 'react';
import { useApp, ALL_ZONES } from '../store';
import { Brain, Send, X, Sparkles, AlertTriangle, MapPin, CloudRain, ShieldCheck, Route } from 'lucide-react';
import { RISK_META } from '../types';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const SUGGESTED = [
  'What is the current risk?',
  'Why is the risk high?',
  'What should I do now?',
  'Where is the nearest safe zone?',
  'How can I report an emergency?',
  'Which route should I avoid?',
  'What happens if rainfall increases?',
  'Which locations need priority?',
];

export function AIAssistant() {
  const { selectedZone, alerts, incidents, setView, selectZone } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hello! I am the BhooShanket Prototype Assistant. I can answer questions about the current risk situation. How can I help you?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();
    const z = selectedZone;
    const m = RISK_META[z.risk];
    const criticalZones = ALL_ZONES.filter((zz) => zz.risk === 'critical');
    const highZones = ALL_ZONES.filter((zz) => zz.risk === 'high');

    if (q.includes('current risk') || q.includes('risk level') || q.includes('what is the risk')) {
      return `The current risk at ${z.name} (${z.district}, ${z.state}) is ${m.label.toUpperCase()} with an AI landslide probability of ${z.probability}%. Key factors: Rainfall ${z.rainfall}mm, Soil Moisture ${z.soilMoisture}%, Slope Movement ${z.slopeMovement.toFixed(1)}mm/day. (Prototype AI response)`;
    }

    if (q.includes('why') && (q.includes('high') || q.includes('risk'))) {
      return `The risk is ${m.label.toLowerCase()} at ${z.name} because:\n• Rainfall: ${z.rainfall}mm (${z.rainfall > 50 ? 'Heavy' : 'Moderate'})\n• Soil Moisture: ${z.soilMoisture}% (${z.soilMoisture > 75 ? 'Near saturation' : 'Moderate'})\n• Slope Movement: ${z.slopeMovement.toFixed(1)}mm/day (${z.slopeMovement > 5 ? 'Active movement' : 'Stable'})\n• Weather: ${z.weather}\n\nThe AI weighted model combines these factors: Rainfall 35%, Soil Moisture 25%, Slope Movement 20%, Slope Angle 10%, Weather 10%. (Demo AI Analysis)`;
    }

    if (q.includes('what should') || q.includes('do now') || q.includes('action')) {
      if (z.risk === 'critical') return `For CRITICAL risk at ${z.name}:\n1. Evacuate immediately to the nearest safe zone\n2. Avoid vulnerable slope areas\n3. Follow authority evacuation instructions\n4. Call 1077 (NDRF) if you need rescue\n5. Do not return until authorities declare the area safe.\n(Prototype Safety Guidance)`;
      if (z.risk === 'high') return `For HIGH risk at ${z.name}:\n1. Avoid travelling through vulnerable slope areas\n2. Monitor emergency alerts closely\n3. Keep emergency contacts ready\n4. Prepare to move to safer locations\n5. Follow authority instructions.\n(Prototype Safety Guidance)`;
      return `Risk at ${z.name} is currently ${m.label}. Stay informed, monitor weather updates, and keep emergency contacts available. (Prototype Safety Guidance)`;
    }

    if (q.includes('safe zone') || q.includes('nearest safe') || q.includes('shelter')) {
      const sz = z.safeZones[0];
      return `The nearest safe zone to ${z.name} is "${sz.name}" (${sz.type.replace('-', ' ')}) at ${sz.distance.toFixed(1)}km distance. Capacity: ${sz.capacity} people, Availability: ${sz.availability}%. You can view all safe zones in the Safe Zone Finder. (Prototype Data)`;
    }

    if (q.includes('report') || q.includes('emergency') || q.includes('help')) {
      return `To report an emergency:\n1. Go to Citizen Safety from the sidebar\n2. Click "I Need Help"\n3. Fill the emergency request form (name, phone, location, type)\n4. Submit — your request will appear in the Authority Response Dashboard\n\nYou can also call: Police 100, Ambulance 108, NDRF 1077. (Prototype Citizen Portal)`;
    }

    if (q.includes('route') || q.includes('avoid') || q.includes('travel')) {
      const avoidZones = [...criticalZones, ...highZones].slice(0, 3).map((zz) => zz.name).join(', ');
      return `You should avoid these high-risk and critical zones: ${avoidZones}. Use the Safe Route Finder to get a route that prefers low-risk areas and avoids high-risk zones. The safest route is visualized on the map with green markers. (Prototype Route Simulation)`;
    }

    if (q.includes('rainfall') && q.includes('increase')) {
      return `If rainfall increases at ${z.name}:\n• Current rainfall: ${z.rainfall}mm\n• If it reaches 60mm+, soil saturation will exceed 85%, pushing risk to CRITICAL\n• The AI model weights rainfall at 35% — the highest factor\n• Alerts will automatically escalate from Watch to Warning to Critical\n• Emergency response teams will be deployed\n(Prototype AI Scenario Analysis)`;
    }

    if (q.includes('priority') || q.includes('which location') || q.includes('attention')) {
      const priority = [...criticalZones, ...highZones].slice(0, 5);
      return `Locations needing priority attention:\n${priority.map((p, i) => `${i + 1}. ${p.name} — ${RISK_META[p.risk].label} (${p.probability}%)`).join('\n')}\n\nThese zones have active alerts and require immediate monitoring or response. (Prototype Intelligence)`;
    }

    if (q.includes('alert') || q.includes('warning')) {
      return `There are currently ${alerts.length} active alerts: ${alerts.filter(a => a.risk === 'critical').length} critical, ${alerts.filter(a => a.risk === 'high').length} high, ${alerts.filter(a => a.risk === 'medium').length} medium. View all alerts in the Alert Center. (Prototype Alert System)`;
    }

    if (q.includes('incident') || q.includes('response')) {
      return `There are ${incidents.length} tracked incidents: ${incidents.filter(i => i.status !== 'resolved').length} active, ${incidents.filter(i => i.status === 'resolved').length} resolved. View the Authority Response System for incident management. (Prototype IMS)`;
    }

    if (q.includes('sensor')) {
      return `${z.name} has ${z.sensors.length} sensors: ${z.sensors.filter(s => s.status === 'online').length} online, ${z.sensors.filter(s => s.status === 'warning').length} warning, ${z.sensors.filter(s => s.status === 'offline').length} offline. View the Sensor Monitoring page for details. (Prototype IoT Data)`;
    }

    return `I can help with questions about current risk, safety guidance, safe zones, emergency reporting, routes to avoid, and priority locations. Try asking "What is the current risk?" or "Which locations need priority?". (BhooShanket Prototype Assistant)`;
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = generateResponse(text);
      setMessages((prev) => [...prev, { role: 'ai', text: response }]);
      setTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-400 text-white font-semibold text-sm shadow-float hover:shadow-cardHover transition-all hover:scale-105 group"
        >
          <Brain size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Safety Assistant</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-risk-crit animate-pulse-soft" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 max-h-[600px] bg-surface-card rounded-2xl border border-line shadow-float flex flex-col animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-gradient-to-r from-brand-50 to-teal-50">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-400 text-white">
                <Brain size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-ink-900">BhooShanket Assistant</div>
                <div className="text-[10px] text-ink-500 flex items-center gap-1">
                  <Sparkles size={10} className="text-teal-400" /> Prototype Assistant
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-900 p-1">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: 360 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-brand-500 text-white rounded-br-sm'
                    : 'bg-surface-alt text-ink-700 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-surface-alt px-4 py-3 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-ink-300 animate-pulse-soft" />
                    <span className="w-2 h-2 rounded-full bg-ink-300 animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
                    <span className="w-2 h-2 rounded-full bg-ink-300 animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTED.slice(0, 4).map((s) => (
                <button key={s} onClick={() => send(s)} className="text-[11px] px-2.5 py-1.5 rounded-lg bg-surface-alt text-ink-700 font-medium hover:bg-brand-50 hover:text-brand-600 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-line">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder="Ask about risk, safety, alerts..."
                className="flex-1 px-3 py-2.5 rounded-lg border border-line bg-surface-base text-sm text-ink-900 placeholder:text-ink-300"
              />
              <button onClick={() => send(input)} disabled={!input.trim()} className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 transition-colors shrink-0">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
