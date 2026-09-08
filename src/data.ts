import type { StateInfo, ZoneInfo, SensorInfo, AlertInfo, IncidentInfo, RescueTask, RiskLevel } from './types';

function makeSensors(zoneName: string, risk: RiskLevel): SensorInfo[] {
  const baseStatus: Record<RiskLevel, ('online' | 'warning' | 'offline')[]> = {
    low: ['online', 'online', 'online', 'online', 'online'],
    medium: ['online', 'warning', 'online', 'online', 'online'],
    high: ['warning', 'warning', 'online', 'online', 'warning'],
    critical: ['warning', 'warning', 'warning', 'online', 'offline'],
  };
  const statuses = baseStatus[risk];
  const types: SensorInfo['type'][] = ['rain', 'soil', 'slope', 'temp', 'humidity'];
  const units = ['mm', '%', 'mm/day', '°C', '%'];
  const baseReadings: Record<RiskLevel, number[]> = {
    low: [8, 32, 0.4, 24, 55],
    medium: [22, 58, 1.8, 22, 72],
    high: [45, 78, 4.2, 20, 85],
    critical: [68, 92, 8.5, 19, 94],
  };
  const readings = baseReadings[risk];
  const prefix = zoneName.substring(0, 3).toUpperCase();

  return types.map((type, i) => {
    const trend = Array.from({ length: 12 }, (_, k) => {
      const noise = (Math.sin(k * 0.7 + i) + 1) * 0.5;
      const drift = risk === 'critical' ? k * 0.8 : risk === 'high' ? k * 0.4 : k * 0.1;
      return Math.max(0, readings[i] - 5 + noise * 8 + drift);
    });
    return {
      id: `BS-${prefix}-${type.toUpperCase().padEnd(2, '0')}`,
      type,
      reading: Math.round(readings[i] * 10) / 10,
      unit: units[i],
      status: statuses[i],
      signal: statuses[i] === 'offline' ? 0 : 60 + Math.round(Math.random() * 38),
      battery: 40 + Math.round(Math.random() * 58),
      lastUpdated: `${1 + Math.floor(Math.random() * 4)}m ago`,
      trend,
    };
  });
}

function makeSafeZones(risk: RiskLevel, x: number, y: number) {
  const zones = [
    { name: 'Govt Primary School Shelter', type: 'shelter' as const, capacity: 320 },
    { name: 'Community Hall Assembly', type: 'assembly' as const, capacity: 180 },
    { name: 'Higher Ground — Ridge Point', type: 'low-risk' as const, capacity: 500 },
  ];
  return zones.map((z, i) => ({
    ...z,
    distance: 1.2 + i * 0.8 + Math.random() * 0.5,
    availability: risk === 'critical' ? 45 + i * 10 : 70 + i * 8,
    risk: 'low' as RiskLevel,
    x: x + (i - 1) * 8,
    y: y + (i - 1) * 6,
  }));
}

function riskProb(r: RiskLevel): number {
  return { low: 18, medium: 42, high: 68, critical: 86 }[r] + Math.floor(Math.random() * 8);
}

function makeZone(
  name: string,
  district: string,
  state: string,
  risk: RiskLevel,
  x: number,
  y: number
): ZoneInfo {
  const prob = riskProb(risk);
  const rainfall: Record<RiskLevel, number> = { low: 12, medium: 28, high: 52, critical: 78 };
  const soil: Record<RiskLevel, number> = { low: 35, medium: 58, high: 79, critical: 93 };
  const slope: Record<RiskLevel, number> = { low: 0.5, medium: 2.1, high: 4.8, critical: 9.2 };
  const weatherMap: Record<RiskLevel, string> = {
    low: 'Light Cloud',
    medium: 'Moderate Rain',
    high: 'Heavy Rain',
    critical: 'Torrential Rain',
  };
  const hist = Array.from({ length: 14 }, (_, i) => {
    const base = prob - 15 + i * 1.2;
    return Math.max(8, Math.min(95, base + (Math.random() - 0.5) * 12));
  });
  return {
    name,
    district,
    state,
    risk,
    probability: prob,
    rainfall: rainfall[risk] + Math.floor(Math.random() * 6),
    soilMoisture: soil[risk] + Math.floor(Math.random() * 5),
    slopeMovement: slope[risk] + Math.random() * 1.5,
    slopeAngle: 18 + Math.floor(Math.random() * 22),
    temperature: 16 + Math.floor(Math.random() * 10),
    humidity: 55 + Math.floor(Math.random() * 38),
    windSpeed: 6 + Math.floor(Math.random() * 22),
    weather: weatherMap[risk],
    rainfall24h: rainfall[risk] * 2.2 + Math.floor(Math.random() * 10),
    rainfall72h: rainfall[risk] * 5.8 + Math.floor(Math.random() * 20),
    sensors: makeSensors(name, risk),
    safeZones: makeSafeZones(risk, x, y),
    lastUpdated: `${1 + Math.floor(Math.random() * 5)}m ago`,
    historicalRisk: hist,
    x,
    y,
  };
}

export const STATES: StateInfo[] = [
  {
    name: 'Assam',
    center: { x: 62, y: 38 },
    districts: ['Guwahati', 'Dibrugarh', 'Silchar', 'Tezpur'],
    zones: [
      makeZone('Guwahati Hill Sector', 'Guwahati', 'Assam', 'high', 58, 36),
      makeZone('Dibrugarh Slope Zone', 'Dibrugarh', 'Assam', 'medium', 72, 32),
      makeZone('Silchar Valley Monitor', 'Silchar', 'Assam', 'low', 54, 44),
    ],
  },
  {
    name: 'Arunachal Pradesh',
    center: { x: 68, y: 18 },
    districts: ['Itanagar', 'Tawang', 'Ziro'],
    zones: [
      makeZone('Tawang Ridge Monitor', 'Tawang', 'Arunachal Pradesh', 'critical', 60, 12),
      makeZone('Itanagar Slope Watch', 'Itanagar', 'Arunachal Pradesh', 'high', 72, 22),
      makeZone('Ziro Valley Zone', 'Ziro', 'Arunachal Pradesh', 'medium', 66, 28),
    ],
  },
  {
    name: 'Meghalaya',
    center: { x: 52, y: 40 },
    districts: ['Shillong', 'Cherrapunji', 'Tura'],
    zones: [
      makeZone('Shillong Monitoring Zone', 'Shillong', 'Meghalaya', 'high', 50, 40),
      makeZone('Cherrapunji Ridge Alert', 'Cherrapunji', 'Meghalaya', 'critical', 46, 44),
      makeZone('Tura Hill Sector', 'Tura', 'Meghalaya', 'medium', 44, 36),
    ],
  },
  {
    name: 'Manipur',
    center: { x: 80, y: 52 },
    districts: ['Imphal', 'Ukhrul', 'Churachandpur'],
    zones: [
      makeZone('Imphal East Slope', 'Imphal', 'Manipur', 'medium', 80, 50),
      makeZone('Ukhrul Ridge Monitor', 'Ukhrul', 'Manipur', 'high', 84, 46),
    ],
  },
  {
    name: 'Mizoram',
    center: { x: 82, y: 64 },
    districts: ['Aizawl', 'Lunglei', 'Champhai'],
    zones: [
      makeZone('Aizawl Hill Watch', 'Aizawl', 'Mizoram', 'high', 82, 62),
      makeZone('Lunglei Slope Zone', 'Lunglei', 'Mizoram', 'medium', 80, 68),
    ],
  },
  {
    name: 'Nagaland',
    center: { x: 78, y: 42 },
    districts: ['Kohima', 'Dimapur', 'Mokokchung'],
    zones: [
      makeZone('Kohima Ridge Alert', 'Kohima', 'Nagaland', 'high', 78, 40),
      makeZone('Dimapur Valley Zone', 'Dimapur', 'Nagaland', 'low', 76, 46),
    ],
  },
  {
    name: 'Sikkim',
    center: { x: 38, y: 20 },
    districts: ['Gangtok', 'Namchi', 'Geyzing'],
    zones: [
      makeZone('Gangtok Slope Monitor', 'Gangtok', 'Sikkim', 'critical', 36, 18),
      makeZone('Namchi Ridge Watch', 'Namchi', 'Sikkim', 'medium', 40, 24),
    ],
  },
  {
    name: 'Tripura',
    center: { x: 74, y: 60 },
    districts: ['Agartala', 'Dhalai', 'Kailashahar'],
    zones: [
      makeZone('Agartala Hill Sector', 'Agartala', 'Tripura', 'medium', 74, 60),
      makeZone('Dhalai Slope Zone', 'Dhalai', 'Tripura', 'high', 76, 56),
    ],
  },
];

export const ALL_ZONES: ZoneInfo[] = STATES.flatMap((s) => s.zones);

export function getZone(name: string): ZoneInfo {
  return ALL_ZONES.find((z) => z.name === name) ?? ALL_ZONES[0];
}

export const INITIAL_ALERTS: AlertInfo[] = [
  {
    id: 'ALT-2026-091',
    location: 'Cherrapunji Ridge Alert',
    district: 'Cherrapunji',
    state: 'Meghalaya',
    risk: 'critical',
    probability: 91,
    detectedTime: '8m ago',
    factors: ['Torrential Rainfall', 'Soil Saturation 93%', 'Slope Movement 9.2mm/day'],
    action: 'Immediate evacuation of vulnerable slopes. Deploy NDRF team.',
    status: 'new',
  },
  {
    id: 'ALT-2026-088',
    location: 'Tawang Ridge Monitor',
    district: 'Tawang',
    state: 'Arunachal Pradesh',
    risk: 'critical',
    probability: 87,
    detectedTime: '14m ago',
    factors: ['Heavy Snowmelt', 'Slope Movement 8.5mm/day', 'Soil Saturation 92%'],
    action: 'Restrict movement on Tawang pass. Issue red alert to district admin.',
    status: 'acknowledged',
  },
  {
    id: 'ALT-2026-084',
    location: 'Gangtok Slope Monitor',
    district: 'Gangtok',
    state: 'Sikkim',
    risk: 'critical',
    probability: 84,
    detectedTime: '22m ago',
    factors: ['Persistent Rainfall 68mm', 'Slope Angle 38°', 'Soil Moisture 91%'],
    action: 'Activate evacuation plan. Coordinate with Sikkim SDMA.',
    status: 'review',
  },
  {
    id: 'ALT-2026-079',
    location: 'Shillong Monitoring Zone',
    district: 'Shillong',
    state: 'Meghalaya',
    risk: 'high',
    probability: 72,
    detectedTime: '35m ago',
    factors: ['Heavy Rainfall 52mm', 'Soil Saturation 79%'],
    action: 'Issue orange alert. Monitor slope movement sensors closely.',
    status: 'acknowledged',
  },
  {
    id: 'ALT-2026-075',
    location: 'Aizawl Hill Watch',
    district: 'Aizawl',
    state: 'Mizoram',
    risk: 'high',
    probability: 69,
    detectedTime: '48m ago',
    factors: ['Rainfall Intensity Increasing', 'Soil Moisture 78%'],
    action: 'Prepare shelters. Notify district emergency authority.',
    status: 'escalated',
  },
  {
    id: 'ALT-2026-070',
    location: 'Kohima Ridge Alert',
    district: 'Kohima',
    state: 'Nagaland',
    risk: 'high',
    probability: 66,
    detectedTime: '1h ago',
    factors: ['Slope Movement 4.5mm/day', 'Rainfall 48mm'],
    action: 'Deploy monitoring team. Restrict heavy vehicle movement.',
    status: 'review',
  },
  {
    id: 'ALT-2026-065',
    location: 'Ukhrul Ridge Monitor',
    district: 'Ukhrul',
    state: 'Manipur',
    risk: 'medium',
    probability: 45,
    detectedTime: '2h ago',
    factors: ['Moderate Rainfall', 'Soil Moisture 58%'],
    action: 'Continue monitoring. Inform local authority.',
    status: 'acknowledged',
  },
];

export const INITIAL_INCIDENTS: IncidentInfo[] = [
  {
    id: 'INC-001',
    location: 'Cherrapunji Ridge Alert',
    district: 'Cherrapunji',
    risk: 'critical',
    status: 'review',
    authority: 'Meghalaya SDMA',
    team: 'NDRF Team-04',
    priority: 'critical',
    lastUpdated: '5m ago',
  },
  {
    id: 'INC-002',
    location: 'Tawang Ridge Monitor',
    district: 'Tawang',
    risk: 'critical',
    status: 'deployed',
    authority: 'Arunachal SDMA',
    team: 'NDRF Team-07',
    priority: 'critical',
    lastUpdated: '12m ago',
  },
  {
    id: 'INC-003',
    location: 'Shillong Monitoring Zone',
    district: 'Shillong',
    risk: 'high',
    status: 'monitoring',
    authority: 'Meghalaya SDMA',
    team: 'State DRF Team-02',
    priority: 'high',
    lastUpdated: '20m ago',
  },
  {
    id: 'INC-004',
    location: 'Aizawl Hill Watch',
    district: 'Aizawl',
    risk: 'high',
    status: 'deployed',
    authority: 'Mizoram SDMA',
    team: 'NDRF Team-11',
    priority: 'high',
    lastUpdated: '30m ago',
  },
  {
    id: 'INC-005',
    location: 'Guwahati Hill Sector',
    district: 'Guwahati',
    risk: 'high',
    status: 'monitoring',
    authority: 'Assam SDMA',
    team: 'State DRF Team-01',
    priority: 'high',
    lastUpdated: '45m ago',
  },
];

export const INITIAL_TASKS: RescueTask[] = [
  {
    id: 'TSK-01',
    team: 'NDRF Team-04',
    location: 'Cherrapunji Ridge',
    priority: 'critical',
    task: 'Inspect affected slope area and assess stability',
    progress: 65,
    eta: '25 min',
    status: 'in-progress',
  },
  {
    id: 'TSK-02',
    team: 'NDRF Team-07',
    location: 'Tawang Pass',
    priority: 'critical',
    task: 'Assist citizen evacuation from vulnerable zones',
    progress: 40,
    eta: '45 min',
    status: 'in-progress',
  },
  {
    id: 'TSK-03',
    team: 'State DRF Team-02',
    location: 'Shillong Hill Sector',
    priority: 'high',
    task: 'Verify sensor condition and report readings',
    progress: 100,
    eta: 'Complete',
    status: 'completed',
  },
  {
    id: 'TSK-04',
    team: 'NDRF Team-11',
    location: 'Aizawl East Slope',
    priority: 'high',
    task: 'Secure high-risk route and set up barricades',
    progress: 20,
    eta: '60 min',
    status: 'in-progress',
  },
  {
    id: 'TSK-05',
    team: 'State DRF Team-01',
    location: 'Guwahati Hill Sector',
    priority: 'high',
    task: 'Coordinate with local police for area lockdown',
    progress: 0,
    eta: '90 min',
    status: 'assigned',
  },
];

export const EMERGENCY_CONTACTS = [
  { service: 'Police', number: '100', region: 'All North Eastern States', available: true, icon: 'shield' },
  { service: 'Ambulance', number: '108', region: 'All North Eastern States', available: true, icon: 'ambulance' },
  { service: 'Fire and Rescue', number: '101', region: 'All North Eastern States', available: true, icon: 'flame' },
  { service: 'NDRF Command', number: '1077', region: 'National Disaster Response Force', available: true, icon: 'helmet' },
  { service: 'SDMA Helpline', number: '1070', region: 'State Disaster Management Authority', available: true, icon: 'phone' },
  { service: 'Mountain Rescue Unit', number: '1903', region: 'Arunachal & Sikkim', available: false, icon: 'mountain' },
];

export const AI_FACTORS = [
  { key: 'rainfall', label: 'Rainfall Intensity', weight: 35, unit: 'mm', max: 100 },
  { key: 'soilMoisture', label: 'Soil Moisture', weight: 25, unit: '%', max: 100 },
  { key: 'slopeMovement', label: 'Slope Movement', weight: 20, unit: 'mm/day', max: 12 },
  { key: 'slopeAngle', label: 'Slope Angle', weight: 10, unit: '°', max: 45 },
  { key: 'weather', label: 'Weather Condition', weight: 10, unit: '', max: 100 },
];
