
export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type LogAction = 'ALLOW' | 'BLOCK' | 'ALERT';

export interface NetworkMetrics {
  latency: number;
  packetLoss: number;
  uptime: number;
  threatLevel: ThreatLevel;
}

export interface TrafficData {
  time: string;
  inbound: number;
  outbound: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: string;
  severity: ThreatLevel;
  source: string;
  destination: string;
  description: string;
  method: 'Signature' | 'Anomaly' | 'Heuristic';
  confidence: number;
  rawPayload?: string;
  aiExplanation?: string;
  hits?: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  action: LogAction;
  bytes: number;
  tag?: string;
  details: {
    ruleId?: string;
    score?: number;
    headers: Record<string, string>;
  };
  aiSummary?: string;
}

export interface RiskyIP {
  ip: string;
  hits: number;
  riskScore: number;
  location: string;
}
