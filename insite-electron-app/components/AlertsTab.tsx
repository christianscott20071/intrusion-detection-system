import React, { useState, useMemo, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  Clock, 
  ChevronRight, 
  BrainCircuit, 
  Activity,
  CheckCircle2,
  Zap,
  Filter,
  ArrowRightLeft
} from 'lucide-react';
import { Alert, ThreatLevel } from '../types';
import { TendrilCard } from './TendrilCard';

export const AlertsTab: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLowThreats, setShowLowThreats] = useState(false);

  const severityOrder: Record<ThreatLevel, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1
  };

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(alert => {
        if (!showLowThreats && alert.severity === 'LOW') {
          return false;
        }

        const matchesSearch =
          alert.source.includes(searchQuery) ||
          alert.type.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
      })
      .sort((a, b) => {
        const severityDiff =
          severityOrder[b.severity] - severityOrder[a.severity];

        if (severityDiff !== 0) return severityDiff;

        return ((b as any).hits ?? 0) - ((a as any).hits ?? 0);
      });

  }, [alerts, searchQuery, showLowThreats, severityOrder]);

  const selectedAlert = useMemo(() => 
    filteredAlerts.find(a => a.id === selectedAlertId) || null,
    [filteredAlerts, selectedAlertId]
  );

useEffect(() => {
  let isInitialLoad = true;

  const fetchThreats = async () => {
    if (isInitialLoad && alerts.length === 0) setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/threats');
      const data: any[] = await res.json();

      setAlerts(prevAlerts => {
        const updatedAlerts: Alert[] = [];
        const prevMap = new Map(prevAlerts.map(a => [a.id, a]));

        for (const profile of data) {
          const attackCounts = (profile.attackCounts || {}) as Record<string, number>;
          const totalScore = profile.totalScore ?? 0; // decaying totalScore from backend

          for (const [type, count] of Object.entries(attackCounts)) {
            const alertId = `${profile.ip}-${type}`;
            const prev = prevMap.get(alertId) as Alert | undefined;

            // Keep AI explanation unchanged
            let aiExplanation = prev?.aiExplanation || 'Generating AI summary...';
            const shouldCallAI = !prev || prev.severity !== prev?.severity;

            // Determine severity based on decaying score
            let derivedSeverity: ThreatLevel;
            if (totalScore > 20000) derivedSeverity = 'CRITICAL';
            else if (totalScore > 10000) derivedSeverity = 'HIGH';
            else if (totalScore > 5000) derivedSeverity = 'MEDIUM';
            else derivedSeverity = 'LOW';

            // Optional: skip tiny decayed scores
            if (!showLowThreats && derivedSeverity === 'LOW') continue;
            if (totalScore < 10) continue;

            const alert: Alert = {
              id: alertId,
              timestamp: new Date(profile.lastSeen).toLocaleTimeString(),
              type: type.replace(/_/g, ' '),
              severity: derivedSeverity,
              source: profile.ip,
              destination: 'Internal Network',
              description: `${profile.attackCounts[type]} events for ${type.replace(/_/g, ' ')}`, // raw hits for description
              method: 'Heuristic',
              confidence: 90,
              rawPayload: `${profile.attackCounts[type]} hits recorded`, // raw hits
              aiExplanation,
              hits: profile.attackCounts[type] // use raw hits for frontend sorting
            };

            updatedAlerts.push(alert);

            // AI calls remain exactly as they were
            if (shouldCallAI) {
              const alertBody = `
              ID: ${alertId}
              Severity: ${derivedSeverity}
              Type: ${type}
              Origin: ${profile.ip}
              Target: Internal Network
              Hits: ${profile.attackCounts[type]}
              `;
              fetch('http://localhost:8080/ai/analyzeAlert', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: alertBody
              })
                .then(res => res.text())
                .then(text => {
                  setAlerts(prev =>
                    prev.map(a =>
                      a.id === alertId ? { ...a, aiExplanation: text } : a
                    )
                  );
                })
                .catch(err => console.error('AI summarization failed for', alertId, err));
            }
          }
        }

        return updatedAlerts;
      });

      setSelectedAlertId(prevId => prevId || (data.length > 0 ? `${data[0].ip}-${Object.keys(data[0].attackCounts || {})[0]}` : null));
      setLoading(false);
      isInitialLoad = false;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  fetchThreats();
  const interval = setInterval(fetchThreats, 3000);
  return () => clearInterval(interval);
}, []);

  const getSeverityStyles = (severity: ThreatLevel, isSelected: boolean) => {
    switch (severity) {
      case 'CRITICAL': 
        return {
          card: isSelected ? 'border-[3px] border-black bg-slate-50' : 'border border-slate-200',
          accent: 'w-4 energy-gradient',
          text: 'text-rose-600'
        };

      case 'HIGH': 
        return {
          card: isSelected ? 'border-[3px] border-black bg-slate-50' : 'border border-slate-200',
          accent: 'w-2 bg-rose-500',
          text: 'text-rose-500'
        };

      case 'MEDIUM':
        return {
          card: isSelected ? 'border-[3px] border-black bg-slate-50' : 'border border-slate-200',
          accent: 'w-2 bg-amber-400',
          text: 'text-amber-500'
        };

      case 'LOW':
      default:
        return {
          card: isSelected ? 'border-[3px] border-black bg-slate-50' : 'border border-slate-200',
          accent: 'w-1 bg-slate-300',
          text: 'text-slate-400'
        };
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 min-h-0 h-full animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden flex-1">
      
      {/* Sidebar List */}
      <div className="flex-[1.6] flex flex-col space-y-4 lg:space-y-8 overflow-hidden min-h-[300px] lg:min-h-0">
        
        <div className="flex items-center gap-4 lg:gap-6 bg-white p-4 lg:p-5 rounded-2xl border-2 border-slate-100 shadow-sm shrink-0">
          
          <div className="flex items-center justify-between gap-6 w-full">
            
            <div className="relative flex-1">
              <Search className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH BY IP OR TYPE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 lg:pl-14 pr-4 lg:pr-6 py-3 lg:py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none text-[10px] lg:text-[11px] font-black uppercase tracking-widest mono"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
              <input
                type="checkbox"
                checked={showLowThreats}
                onChange={() => setShowLowThreats(prev => !prev)}
                className="accent-black"
              />
              Show Low Threats
            </label>

          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 lg:space-y-5 pb-10 custom-scrollbar">
          {loading && (
            <div className="text-center text-slate-400 text-xs py-4">
              Loading threats...
            </div>
          )}

          {filteredAlerts.map(alert => {
            const isSelected = selectedAlertId === alert.id;
            const styles = getSeverityStyles(alert.severity, isSelected);
            
            return (
              <div 
                key={alert.id}
                onClick={() => setSelectedAlertId(alert.id)}
                className={`group relative flex bg-white rounded-2xl overflow-hidden cursor-pointer transition-all active:scale-[0.99]
                  ${styles.card}`}
              >
                <div className={`${styles.accent} h-full absolute left-0 top-0 transition-all duration-300`}></div>
                
                <div className="flex-1 pl-8 lg:pl-12 pr-6 lg:pr-8 py-4 lg:py-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <span className={`text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] px-2 lg:px-3 py-0.5 lg:py-1 rounded-full border border-black/5 bg-slate-50 ${styles.text}`}>
                        {alert.severity}
                      </span>
                      <span className="text-slate-300 text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em]">
                        {alert.timestamp}
                      </span>
                    </div>
                    <h3 className="text-base lg:text-lg font-black text-black tracking-tight truncate max-w-[200px] lg:max-w-none">
                      {alert.type}
                    </h3>
                    <div className="flex gap-4 lg:gap-6 text-[10px] lg:text-[11px] font-bold text-slate-400 mono">
                      <span className="truncate">{alert.source}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`transition-transform duration-300 shrink-0 ${isSelected ? 'translate-x-1 text-black' : 'text-slate-200'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="flex-1 min-h-[500px] lg:min-h-0 flex flex-col relative self-stretch">
        <TendrilCard title="Analysis" className="h-full" edges={2}>
          <div className="absolute inset-0">
            {selectedAlert ? (
              <div className="h-full space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-right-6 duration-500 overflow-y-auto pr-2 pb-10 custom-scrollbar">
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex justify-between items-end">
                     <h2 className="text-xl lg:text-4xl font-black text-black tracking-tighter uppercase leading-none">
                       {selectedAlert.type}
                     </h2>
                     <span className="mono text-[10px] lg:text-[11px] font-black text-slate-300 shrink-0">
                       {selectedAlert.id}
                     </span>
                  </div>
                  <p className="text-[12px] lg:text-[14px] font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 lg:p-8 rounded-xl border border-slate-100 shadow-inner">
                    {selectedAlert.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:gap-6">
                   <div className="p-3 lg:p-5 bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_rgba(0,0,0,0.1)]">
                      <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 lg:mb-2 block">Origin</span>
                      <span className="mono font-bold text-[10px] lg:text-sm truncate block">
                        {selectedAlert.source}
                      </span>
                   </div>
                   <div className="p-3 lg:p-5 bg-white border border-slate-100 rounded-xl">
                      <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 lg:mb-2 block">Target</span>
                      <span className="mono font-bold text-[10px] lg:text-sm truncate block">
                        {selectedAlert.destination}
                      </span>
                   </div>
                </div>

                <div className="relative overflow-hidden group">
                  <div className="absolute -inset-2 energy-gradient opacity-10 blur-xl"></div>
                  <div className="relative bg-black p-6 lg:p-10 rounded-2xl text-white">
                    <div className="flex items-center gap-3 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-white/40 mb-3 lg:mb-6">
                      <BrainCircuit size={16} className="text-emerald-400" /> Insite Intelligence
                    </div>
                    <p className="text-[13px] lg:text-[15px] font-medium leading-relaxed opacity-90 italic">
                      "{selectedAlert.aiExplanation}"
                    </p>
                  </div>
                </div>

                <div className="space-y-2 lg:space-y-4">
                  <h4 className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Telemetry Payload</h4>
                  <div className="bg-slate-900 p-4 lg:p-8 rounded-xl border border-slate-800 mono text-[10px] lg:text-[11px] text-emerald-400/70 leading-relaxed overflow-x-auto whitespace-pre custom-scrollbar">
                    {selectedAlert.rawPayload}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:gap-6 pt-4 lg:pt-8 shrink-0 pb-12">
                  <button className="flex items-center justify-center gap-2 lg:gap-3 py-4 lg:py-5 bg-white border-2 border-black rounded-xl text-black font-black uppercase text-[10px] lg:text-[12px] tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                    Acknowledge
                  </button>
                  <button className="flex items-center justify-center gap-2 lg:gap-3 py-4 lg:py-5 bg-rose-600 text-white rounded-xl font-black uppercase text-[10px] lg:text-[12px] tracking-widest hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-200">
                    <ShieldAlert size={16} /> Quarantine
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 p-10">
                 <AlertTriangle size={64} className="mb-4 text-slate-300" />
                 <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.5em]">
                   Awaiting Selection
                 </p>
              </div>
            )}
          </div>
        </TendrilCard>
      </div>
    </div>
  );
};
