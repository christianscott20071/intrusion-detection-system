
import React, { useState } from 'react';
import { 
  Shield, 
  Settings as SettingsIcon, 
  Cpu, 
  Bell, 
  Network, 
  BrainCircuit, 
  Database, 
  Trash2, 
  AlertTriangle,
  ChevronRight,
  Zap,
  Info,
  Globe,
  Lock,
  Eye,
  Activity,
  UserCheck
} from 'lucide-react';
import { TendrilCard } from './TendrilCard';

export const SettingsTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Detection');
  
  // Detection State
  const [signatureEnabled, setSignatureEnabled] = useState(true);
  const [anomalyEnabled, setAnomalyEnabled] = useState(true);
  const [heuristicEnabled, setHeuristicEnabled] = useState(false);
  const [sensitivity, setSensitivity] = useState(75);

  // Alerting State
  const [severityAlerts, setSeverityAlerts] = useState({
    CRITICAL: true,
    HIGH: true,
    MEDIUM: true,
    LOW: false
  });
  const [notificationRules, setNotificationRules] = useState({
    Email: false,
    Webhook: true,
    Slack: true
  });
  const [autoDismiss, setAutoDismiss] = useState(true);

  // Network State
  const [monitoredInterfaces, setMonitoredInterfaces] = useState({
    'eth0 (WAN)': true,
    'eth1 (LAN)': true,
    'wlan0': false
  });
  const [trustedSubnets, setTrustedSubnets] = useState('10.0.0.0/24, 192.168.1.0/24');

  // AI State
  const [aiVerbosity, setAiVerbosity] = useState('Detailed');
  const [autoAnnotate, setAutoAnnotate] = useState(true);
  const [confidenceCheck, setConfidenceCheck] = useState(true);

  // System State
  const [retentionPolicy, setRetentionPolicy] = useState('30 Days');

  const navItems = [
    { id: 'Detection', icon: Cpu, label: 'Detection' },
    { id: 'Alerting', icon: Bell, label: 'Alerts' },
    { id: 'Network', icon: Network, label: 'Network' },
    { id: 'AI', icon: BrainCircuit, label: 'AI Inference' },
    { id: 'System', icon: Database, label: 'System' },
  ];

  const Switch = ({ enabled, onChange }: { enabled: boolean, onChange: (val: boolean) => void }) => (
    <div 
      onClick={() => onChange(!enabled)}
      className={`w-12 lg:w-14 h-7 lg:h-8 rounded-full p-1 cursor-pointer transition-all duration-300 relative shrink-0
        ${enabled ? 'bg-black shadow-[0_0_10px_rgba(0,0,0,0.1)]' : 'bg-slate-200'}`}
    >
      <div className={`w-5 lg:w-6 h-5 lg:h-6 bg-white rounded-full transition-all duration-300 shadow-sm
        ${enabled ? 'translate-x-5 lg:translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  );

  const StatusButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-4 lg:px-6 py-2 lg:py-3 text-[9px] lg:text-[10px] font-black uppercase tracking-widest border-2 transition-all rounded-lg
        ${active 
          ? 'bg-black text-white border-black shadow-lg scale-105' 
          : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-auto lg:h-[calc(100vh-280px)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sidebar Navigation - Removed fixed overflow that caused useless scrollbars on desktop */}
      <div className="w-full lg:w-64 xl:w-80 flex flex-row lg:flex-col gap-2 lg:gap-3 overflow-x-auto lg:overflow-x-visible no-scrollbar lg:pt-16 pb-2 lg:pb-0 shrink-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center gap-3 lg:gap-5 p-3 lg:p-5 rounded-xl lg:rounded-2xl transition-all text-left border-2 shrink-0
              ${activeSection === item.id 
                ? 'bg-black text-white border-black shadow-xl scale-[1.02]' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-black'}`}
          >
            <item.icon size={18} className={activeSection === item.id ? 'text-emerald-400' : ''} />
            <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em]">{item.label}</span>
            {activeSection === item.id && <ChevronRight size={14} className="ml-auto opacity-50 hidden lg:block" />}
          </button>
        ))}

        <div className="hidden lg:block mt-auto p-6 xl:p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center mb-10">
          <p className="text-[8px] xl:text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2 xl:mb-4">Revision</p>
          <p className="mono text-[9px] xl:text-[10px] font-bold text-slate-400">v0.0.0-STABLE</p>
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[500px] lg:min-h-0">
        <TendrilCard edges={0} className="min-h-full">
          <div className="max-w-4xl mx-auto py-6 lg:py-10 space-y-10 lg:space-y-16">
            
            {/* Detection Engine Section */}
            {activeSection === 'Detection' && (
              <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-500">
                <header className="space-y-1 lg:space-y-2">
                  <h2 className="text-xl lg:text-2xl font-black text-black tracking-tight uppercase">Architecture</h2>
                  <p className="text-[12px] lg:text-sm text-slate-400">Configure core heuristics and matching sensitivity.</p>
                </header>

                <div className="space-y-6 lg:space-y-8">
                  <div className="grid grid-cols-1 gap-4 lg:gap-6">
                    <div className="flex items-center justify-between p-6 lg:p-8 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-black/10 transition-colors">
                      <div className="space-y-1">
                        <h4 className="text-[12px] lg:text-sm font-black text-black uppercase tracking-wide">Signature-based</h4>
                        <p className="text-[11px] lg:text-xs text-slate-500 max-w-xs lg:max-w-md leading-relaxed">Match against 45k+ known threat patterns.</p>
                      </div>
                      <Switch enabled={signatureEnabled} onChange={setSignatureEnabled} />
                    </div>
                    <div className="flex items-center justify-between p-6 lg:p-8 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-black/10 transition-colors">
                      <div className="space-y-1">
                        <h4 className="text-[12px] lg:text-sm font-black text-black uppercase tracking-wide">Anomaly Engine</h4>
                        <p className="text-[11px] lg:text-xs text-slate-500 max-w-xs lg:max-w-md leading-relaxed">Uses baseline modeling to detect volume deviations.</p>
                      </div>
                      <Switch enabled={anomalyEnabled} onChange={setAnomalyEnabled} />
                    </div>
                  </div>

                  <div className="p-6 lg:p-10 border-2 border-slate-100 rounded-3xl space-y-6 lg:space-y-8">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <h4 className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Sensitivity</h4>
                        <p className="text-3xl lg:text-4xl font-black mono text-black">{sensitivity}%</p>
                      </div>
                      <div className="hidden md:flex items-center gap-2 text-[9px] lg:text-[10px] font-black text-amber-500 uppercase tracking-widest px-3 lg:px-4 py-1.5 lg:py-2 bg-amber-50 rounded-lg">
                        <AlertTriangle size={14} /> Higher values risk false positives
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={sensitivity}
                      onChange={(e) => setSensitivity(parseInt(e.target.value))}
                      className="w-full h-1.5 lg:h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Alerting Preferences */}
            {activeSection === 'Alerting' && (
              <div className="space-y-10 lg:space-y-12 animate-in fade-in duration-500">
                <header className="space-y-1 lg:space-y-2">
                  <h2 className="text-xl lg:text-2xl font-black text-black tracking-tight uppercase">Alerting</h2>
                  <p className="text-[12px] lg:text-sm text-slate-400">Control triggers and manage alert fatigue.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="p-6 lg:p-8 bg-white border-2 border-slate-100 rounded-2xl lg:rounded-3xl space-y-4 lg:space-y-6">
                    <h4 className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Shield size={14} /> Severity
                    </h4>
                      <div className="space-y-3 lg:space-y-4">
                      {Object.entries(severityAlerts).map(([level, val]) => (
                        <div key={level} className="flex items-center justify-between">
                          <span className="text-[10px] lg:text-xs font-bold text-slate-600 uppercase tracking-widest">{level}</span>
                          <Switch 
                            enabled={val as boolean} 
                            onChange={(v) => setSeverityAlerts(prev => ({ ...prev, [level]: v }))} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 lg:p-8 bg-white border-2 border-slate-100 rounded-2xl lg:rounded-3xl space-y-4 lg:space-y-6">
                    <h4 className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Globe size={14} /> Channels
                    </h4>
                    <div className="space-y-3 lg:space-y-4">
                      {Object.entries(notificationRules).map(([chan, val]) => (
                        <div key={chan} className="flex items-center justify-between">
                          <span className="text-[10px] lg:text-xs font-bold text-slate-600 uppercase tracking-widest">{chan}</span>
                          <Switch 
                            enabled={val as boolean} 
                            onChange={(v) => setNotificationRules(prev => ({ ...prev, [chan]: v }))} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Network Configuration */}
            {activeSection === 'Network' && (
              <div className="space-y-10 lg:space-y-12 animate-in fade-in duration-500">
                <header className="space-y-1 lg:space-y-2">
                  <h2 className="text-xl lg:text-2xl font-black text-black tracking-tight uppercase">Topology</h2>
                  <p className="text-[12px] lg:text-sm text-slate-400">Define boundaries and monitored interfaces.</p>
                </header>

                <div className="space-y-6 lg:space-y-8">
                  <div className="p-6 lg:p-8 bg-white border-2 border-slate-100 rounded-3xl space-y-4 lg:space-y-6">
                    <h4 className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">Interfaces</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                      {Object.entries(monitoredInterfaces).map(([iface, val]) => (
                        <div key={iface} className="p-3 lg:p-4 border border-slate-100 rounded-xl flex items-center justify-between bg-slate-50">
                          <span className="mono text-[10px] lg:text-[11px] font-bold truncate pr-2">{iface}</span>
                          <Switch 
                            enabled={val as boolean} 
                            onChange={(v) => setMonitoredInterfaces(prev => ({ ...prev, [iface]: v }))} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 lg:p-8 bg-white border-2 border-slate-100 rounded-3xl space-y-4 lg:space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <UserCheck size={14} /> Trusted IP Ranges
                      </h4>
                    </div>
                    <textarea 
                      value={trustedSubnets}
                      onChange={(e) => setTrustedSubnets(e.target.value)}
                      className="w-full h-24 lg:h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 lg:p-6 mono text-[10px] lg:text-[11px] focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AI & Inference */}
            {activeSection === 'AI' && (
              <div className="space-y-10 lg:space-y-12 animate-in fade-in duration-500">
                <header className="space-y-1 lg:space-y-2">
                  <h2 className="text-xl lg:text-2xl font-black text-black tracking-tight uppercase">Inference</h2>
                  <p className="text-[12px] lg:text-sm text-slate-400">Calibrate reporting style and depth.</p>
                </header>

                <div className="space-y-8 lg:space-y-10">
                  <div className="relative group">
                    <div className="absolute -inset-1 energy-gradient opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative bg-black p-6 lg:p-10 rounded-2xl lg:rounded-3xl text-white">
                      <div className="flex items-center gap-3 lg:gap-4 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-white/50 mb-6 lg:mb-8">
                        <BrainCircuit size={16} className="text-emerald-400" /> Explanation Verbosity
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                        {['Concise', 'Detailed', 'Technical'].map(v => (
                          <button
                            key={v}
                            onClick={() => setAiVerbosity(v)}
                            className={`p-4 lg:p-6 rounded-xl lg:rounded-2xl border-2 transition-all text-left
                              ${aiVerbosity === v 
                                ? 'border-emerald-400 bg-emerald-400/10 text-white shadow-[0_0_20px_rgba(52,211,153,0.1)]' 
                                : 'border-white/10 hover:border-white/30 text-white/40'}`}
                          >
                            <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest block mb-1 lg:mb-2">{v}</span>
                            <p className="text-[10px] lg:text-[11px] opacity-60 leading-tight">
                              {v === 'Concise' && "Fast summaries for triage."}
                              {v === 'Detailed' && "Context-aware forensic breakdown."}
                              {v === 'Technical' && "Raw packet analysis mapping."}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System & UI */}
            {activeSection === 'System' && (
              <div className="space-y-10 lg:space-y-12 animate-in fade-in duration-500">
                <header className="space-y-1 lg:space-y-2">
                  <h2 className="text-xl lg:text-2xl font-black text-black tracking-tight uppercase">System</h2>
                  <p className="text-[12px] lg:text-sm text-slate-400">Storage and high-impact operations.</p>
                </header>

                <div className="space-y-8 lg:space-y-12">
                  <div className="p-6 lg:p-10 bg-white border-2 border-slate-100 rounded-3xl space-y-6 lg:space-y-8">
                    <div className="space-y-1">
                      <h4 className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">Retention</h4>
                      <p className="text-[11px] lg:text-xs text-slate-400">Archive security logs before purging.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:gap-3">
                      {['30 Days', '90 Days', 'Indefinite'].map(policy => (
                        <StatusButton 
                          key={policy} 
                          label={policy} 
                          active={retentionPolicy === policy} 
                          onClick={() => setRetentionPolicy(policy)} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </TendrilCard>
      </div>
    </div>
  );
};
