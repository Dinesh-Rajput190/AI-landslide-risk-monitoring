export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type Language = 'en' | 'hi';

export type ViewKey =
  | 'dashboard'
  | 'risk'
  | 'weather'
  | 'map'
  | 'ai'
  | 'sensors'
  | 'alerts'
  | 'comms'
  | 'contacts'
  | 'response'
  | 'rescue'
  | 'citizen'
  | 'safezones'
  | 'saferoutes'
  | 'precautions'
  | 'energy'
  | 'analytics'
  | 'field'
  | 'offline'
  | 'why';

export interface StateInfo {
  name: string;
  districts: string[];
  zones: ZoneInfo[];
  center: { x: number; y: number };
}

export interface ZoneInfo {
  name: string;
  district: string;
  state: string;
  risk: RiskLevel;
  probability: number;
  rainfall: number;
  soilMoisture: number;
  slopeMovement: number;
  slopeAngle: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weather: string;
  rainfall24h: number;
  rainfall72h: number;
  sensors: SensorInfo[];
  safeZones: SafeZone[];
  lastUpdated: string;
  historicalRisk: number[];
  x: number;
  y: number;
}

export interface SensorInfo {
  id: string;
  type: 'rain' | 'soil' | 'slope' | 'temp' | 'humidity';
  reading: number;
  unit: string;
  status: 'online' | 'warning' | 'offline';
  signal: number;
  battery: number;
  lastUpdated: string;
  trend: number[];
}

export interface SafeZone {
  name: string;
  type: 'shelter' | 'assembly' | 'low-risk';
  distance: number;
  capacity: number;
  availability: number;
  risk: RiskLevel;
  x: number;
  y: number;
}

export interface AlertInfo {
  id: string;
  location: string;
  district: string;
  state: string;
  risk: RiskLevel;
  probability: number;
  detectedTime: string;
  factors: string[];
  action: string;
  status: 'new' | 'acknowledged' | 'review' | 'escalated';
}

export interface IncidentInfo {
  id: string;
  location: string;
  district: string;
  risk: RiskLevel;
  status: 'monitoring' | 'review' | 'deployed' | 'evacuation' | 'resolved';
  authority: string;
  team: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: string;
}

export interface RescueTask {
  id: string;
  team: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  task: string;
  progress: number;
  eta: string;
  status: 'assigned' | 'in-progress' | 'completed';
}

export interface EmergencyRequest {
  id: string;
  name: string;
  phone: string;
  location: string;
  type: string;
  note: string;
  time: string;
  status: 'pending' | 'dispatched' | 'resolved';
}

export const RISK_META: Record<RiskLevel, { label: string; color: string; bg: string; text: string; border: string }> = {
  low: { label: 'Low', color: '#22A06B', bg: 'bg-risk-lowBg', text: 'text-risk-low', border: 'border-risk-low/30' },
  medium: { label: 'Medium', color: '#EAB308', bg: 'bg-risk-medBg', text: 'text-risk-med', border: 'border-risk-med/30' },
  high: { label: 'High', color: '#F97316', bg: 'bg-risk-highBg', text: 'text-risk-high', border: 'border-risk-high/30' },
  critical: { label: 'Critical', color: '#DC2626', bg: 'bg-risk-critBg', text: 'text-risk-crit', border: 'border-risk-crit/30' },
};

export const RISK_ORDER: RiskLevel[] = ['low', 'medium', 'high', 'critical'];
