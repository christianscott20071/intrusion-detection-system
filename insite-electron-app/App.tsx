import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Activity,
  History,
  Settings as SettingsIcon,
  ShieldAlert,
  Cpu,
  Radar,
  PowerOff,
  Zap,
  Server,
  AlertTriangle,
  Terminal,
  Loader2,
  CheckCircle2,
  Info,
  MousePointer2,
  LocateFixed,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ShieldCheck,
  ZapOff,
  X,
  Layers,
  HardDrive,
  Dna,
  Coins
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Label
} from 'recharts';
import { Logo } from './components/Logo';
import { TendrilCard } from './components/TendrilCard';
import { AlertsTab } from './components/AlertsTab';
import { LogsTab } from './components/LogsTab';
import { SettingsTab } from './components/SettingsTab';
import { NetworkMetrics, TrafficData, RiskyIP } from './types';

const INITIAL_DATA_COUNT = 150;
const MAX_DATA_BUFFER = 1000;
const VIEWPORT_WIDTH = 40; 

const MOCK_IPS: RiskyIP[] = [
  { ip: '185.22.41.102', hits: 1452, riskScore: 88, location: 'Moscow, RU' },
  { ip: '92.111.45.3', hits: 820, riskScore: 65, location: 'Shenzhen, CN' },
  { ip: '103.2.1.9', hits: 112, riskScore: 42, location: 'Frankfurt, DE' },
  { ip: '202.10.45.122', hits: 45, riskScore: 78, location: 'Seoul, KR' },
  { ip: '194.12.8.210', hits: 320, riskScore: 55, location: 'London, UK' },
  { ip: '45.1.22.9', hits: 12, riskScore: 30, location: 'Tokyo, JP' },
];

interface Packet {
  id: string;
  protocol: string;
  src: string;
  dst: string;
  size: number;
  flag: 'SAFE' | 'WARN' | 'BLOCK';
  hex: string;
}

const ActivationCircuitry: React.FC = () => {
  return (
    <svg className="circuit-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff7ad" />
          <stop offset="100%" stopColor="#ffa9f9" />
        </linearGradient>
        <radialGradient id="fadeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="white" />
          <stop offset="85%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id="pulseMask">
           <rect x="0" y="0" width="100%" height="100%" fill="url(#fadeGradient)" />
        </mask>
      </defs>
      <path d="M120,0 L120,300 L180,360 L180,900" className="circuit-path" />
      <path d="M120,0 L120,300 L180,360 L180,900" className="energy-pulse animate-pulse-flow" />
      <path d="M400,0 L400,200 L450,250 L1000,250 L1050,200 L1050,0" className="circuit-path" />
      <path d="M400,0 L400,200 L450,250 L1000,250 L1050,200 L1050,0" className="energy-pulse animate-pulse-flow" style={{ animationDelay: '0.2s' }} />
      <path d="M520,300 L520,800 L560,840" className="circuit-path" />
      <path d="M520,300 L520,800 L560,840" className="energy-pulse animate-pulse-flow" style={{ animationDelay: '0.4s' }} />
      <circle cx="180" cy="850" r="4" fill="#cbd5e1" opacity="0.3" />
    </svg>
  );
};

const AuditOverlay: React.FC<{ progress: number, logs: string[], onComplete: () => void }> = ({ progress, logs, onComplete }) => {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-slate-200">
        <div className="h-2 energy-gradient w-full relative">
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
        <div className="p-12 space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase">System Audit in Progress</h2>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Insite Core Integrity Verification</p>
            </div>
            <div className="text-6xl font-black mono tracking-tighter">
              {progress}%
            </div>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
            <div className="h-full energy-gradient transition-all duration-300 ease-out relative" style={{ width: `${progress}%` }}>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[sweep-anim_1.5s_infinite]"></div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-8 h-64 overflow-y-auto mono text-[11px] space-y-2 shadow-inner border border-slate-800">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 animate-in slide-in-from-left-2 duration-300">
                <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                <span className={log?.includes('COMPLETE') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>{log}</span>
              </div>
            ))}
          </div>
          {progress === 100 && (
            <div className="flex justify-center pt-4 animate-in zoom-in duration-500">
              <button onClick={onComplete} className="px-12 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                <CheckCircle2 size={16} /> Finalize Audit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DiagnosticsOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-6 lg:p-12 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-5xl w-full bg-white rounded-[30px] lg:rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 lg:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div className="space-y-1">
             <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tighter">System Diagnostics</h2>
             <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Hardware / Software Subsystem Health v4.0.2</p>
           </div>
           <button onClick={onClose} className="p-3 lg:p-4 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-black">
             <X size={20} />
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          <div className="space-y-8 lg:space-y-10">
            <h3 className="text-[11px] lg:text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
              <Cpu size={14} className="text-black" /> Resource Utilization
            </h3>
            <div className="space-y-6 lg:space-y-8">
              {[
                { label: 'Compute Engine', val: 24, icon: Cpu },
                { label: 'Memory Pool', val: 68, icon: Layers },
                { label: 'Packet Buffer', val: 42, icon: HardDrive }
              ].map(res => (
                <div key={res.label} className="space-y-2 lg:space-y-3">
                  <div className="flex justify-between items-center text-[10px] lg:text-[11px] font-black uppercase tracking-wider">
                    <span className="flex items-center gap-2"><res.icon size={12} className="opacity-40" /> {res.label}</span>
                    <span className="mono">{res.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-black" style={{ width: `${res.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 lg:space-y-10">
            <h3 className="text-[11px] lg:text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
              <Dna size={14} className="text-black" /> Subsystem Health
            </h3>
            <div className="space-y-3 lg:space-y-4">
              {[
                { name: 'AI Inference Engine', status: 'ACTIVE' },
                { name: 'Kernel Traffic Hook', status: 'ACTIVE' },
                { name: 'Forensic DB Sync', status: 'ACTIVE' },
                { name: 'Anomaly Processor', status: 'CALIBRATING' },
                { name: 'Tap Interface', status: 'SECURE' }
              ].map(sub => (
                <div key={sub.name} className="flex items-center justify-between p-3 lg:p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] lg:text-[11px] font-bold text-slate-700">{sub.name}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'ACTIVE' || sub.status === 'SECURE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'}`}></div>
                    <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-slate-400">{sub.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 lg:space-y-10">
            <h3 className="text-[11px] lg:text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
              <Coins size={14} className="text-black" /> Forensics Economics
            </h3>
            <div className="p-6 lg:p-8 bg-slate-900 rounded-2xl lg:rounded-3xl text-white space-y-4 lg:space-y-6">
              <div className="space-y-1">
                <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-white/40">Estimated AI Overhead</span>
                <p className="text-2xl lg:text-3xl font-black mono">$0.42 / Hr</p>
              </div>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex justify-between text-[9px] lg:text-[10px] font-black uppercase text-white/60">
                  <span>Token Velocity</span>
                  <span className="text-emerald-400">Normal</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full energy-gradient" style={{ width: '30%' }}></div>
                </div>
              </div>
              <button className="w-full py-3 lg:py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all">
                Optimize Engine
              </button>
            </div>
            <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 leading-relaxed italic">
              "System is currently operating under the Community Forensics model. Upgrade to Enterprise for unlimited deep-packet AI analysis."
            </p>
          </div>
        </div>
        
        <div className="p-6 lg:p-10 bg-slate-50 border-t border-slate-100 text-center">
           <button onClick={onClose} className="px-8 lg:px-10 py-3 lg:py-4 bg-black text-white text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] rounded-xl hover:scale-105 active:scale-95 transition-all">
             Close Diagnostics
           </button>
        </div>
      </div>
    </div>
  );
};







const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [trafficMode, setTrafficMode] = useState<'Flow' | 'Packets'>('Flow');
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isVigilanceActive, setIsVigilanceActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [selectedVectorIP, setSelectedVectorIP] = useState<RiskyIP | null>(null);
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    latency: 12,
    //packetLoss: 0.10,
    nodeEfficiency: 99.79,
    threatLevel: 'LOW',
    continuity: 100.0
  });

  const [packetsSeen, setPacketsSeen] = useState<number>(0);
  const [fullTrafficData, setFullTrafficData] = useState<TrafficData[]>(() => {
    const now = Date.now();
    return Array.from({ length: INITIAL_DATA_COUNT }, (_, i) => ({
      time: new Date(now - (INITIAL_DATA_COUNT - i) * 1000).toLocaleTimeString([], { hour12: false }),
      inbound: Math.floor(Math.random() * 400) + 100,
      outbound: Math.floor(Math.random() * 200) + 50,
    }));
  });
  
  const [viewport, setViewport] = useState({ start: INITIAL_DATA_COUNT - VIEWPORT_WIDTH, end: INITIAL_DATA_COUNT });
  const [isPanning, setIsPanning] = useState(false);
  const [isLiveFollowing, setIsLiveFollowing] = useState(true);
  const panStartRef = useRef(0);
  const chartRef = useRef<HTMLDivElement>(null);

  const startAudit = () => {
    if (!isVigilanceActive) return;
    setIsAuditing(true);
    setAuditProgress(0);
    setAuditLogs(['Initializing System Audit v0.0...', 'Acquiring kernel hooks...']);
  };
  useEffect(() => {
  if (!isVigilanceActive) return;

  const interval = setInterval(async () => {
    const res = await fetch("http://localhost:8080/api/metrics/nodeEfficiency");
    const data = await res.json();

    setMetrics(m => ({
      ...m,
      nodeEfficiency: m.nodeEfficiency * 0.7 + data.nodeEfficiency * 0.3
    }));
  }, 500);

  return () => clearInterval(interval);
}, [isVigilanceActive]);

  useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const res = await fetch('http://localhost:8080/api/metrics/continuity');
      const data = await res.json();

      setMetrics(prev => ({
        ...prev,
        continuity: data.continuity
      }));
    } catch (e) {
      console.error(e);
    }
  }, 1000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
  const interval = setInterval(() => {
    fetch('http://localhost:8080/api/metrics/packets')
      .then(res => res.json())
      .then(data => {
        setPacketsSeen(data.packetsSeen);
      })
      .catch(() => {});
  }, 1000);

  return () => clearInterval(interval);
}, []);

  
   

  useEffect(() => {
    if (isAuditing && auditProgress < 100) {
      const timer = setTimeout(() => {
        setAuditProgress(prev => {
          const next = Math.min(prev + Math.floor(Math.random() * 15) + 5, 100);
          const steps = ['Analyzing Traffic...', 'Validating Perimeter...', 'Scanning Entropy...', 'Verifying Handshakes...', 'Audit Complete.'];
          const logIdx = Math.min(Math.floor((next / 100) * steps.length), steps.length - 1);
          const nextLog = steps[logIdx];
          if (nextLog) {
            setAuditLogs(logs => logs[logs.length-1] !== nextLog ? [...logs, nextLog] : logs);
          }
          return next;
        });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isAuditing, auditProgress]);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;

    const handleWheelNative = (e: WheelEvent) => {
      if (trafficMode !== 'Flow') return;
      e.preventDefault();
      
      const zoomIntensity = 0.08;
      const delta = e.deltaY > 0 ? 1 : -1;
      
      setViewport(prev => {
        const currentRange = prev.end - prev.start;
        const newRange = Math.max(10, Math.min(MAX_DATA_BUFFER, currentRange * (1 + delta * zoomIntensity)));
        setIsLiveFollowing(false);
        const mid = (prev.start + prev.end) / 2;
        const nextStart = Math.max(0, mid - newRange / 2);
        const nextEnd = Math.min(fullTrafficData.length, mid + newRange / 2);
        return { start: nextStart, end: nextEnd };
      });
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelNative);
  }, [trafficMode, fullTrafficData.length]);
useEffect(() => {
  if (!isVigilanceActive) return;

  const interval = setInterval(async () => {

    try {
      const res = await fetch("http://localhost:8080/api/metrics/responseDelay");
      const data = await res.json();


      setMetrics(m => ({
        ...m,
        latency: m.latency * 0.7 + data.responseDelay * 0.3
      }));
    } catch (e) {
      console.error(e);
    }
  }, 500);

  return () => {
    clearInterval(interval);
  };
}, [isVigilanceActive]);

 useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const res = await fetch('http://localhost:8080/api/metrics/traffic');
      console.log("poopy pants")
      const data = await res.json();

      const now = new Date().toLocaleTimeString([], { hour12: false });

      setFullTrafficData(prev => {
        const next = [
          ...prev,
          {
            time: now,
            inbound: data.inboundPps ?? 0,
            outbound: data.outboundPps ?? 0
          }
        ];

        return next.length > MAX_DATA_BUFFER ? next.slice(1) : next;
      });

    } catch (e) {
      console.error('traffic poll failed', e);
    }
  }, 1000);

  return () => clearInterval(interval);
}, []);
useEffect(() => {
  if (!isVigilanceActive || trafficMode !== 'Packets') return;

  const poll = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/metrics/packets');
      const data = await res.json();

      setPackets(
        data.map((p: any, i: number) => ({
          id: `${Date.now()}-${i}`,
          protocol: p.proto,
          src: p.srcIP,
          dst: p.dstIP,
          size: p.size,
          hex: p.hex
        }))
      );
    } catch (e) {
      console.error('packet stream failed', e);
    }
  };

  poll();
  const id = setInterval(poll, 500);

  return () => clearInterval(id);
}, [isVigilanceActive, trafficMode]);

useEffect(() => {
  if (!isLiveFollowing) return;

  const len = fullTrafficData.length;

  setViewport({
    start: Math.max(0, len - VIEWPORT_WIDTH),
    end: len
  });
}, [fullTrafficData.length, isLiveFollowing]);


  const displayedTrafficData = useMemo(() => {
    return fullTrafficData.slice(
      Math.max(0, Math.floor(viewport.start)), 
      Math.min(fullTrafficData.length, Math.ceil(viewport.end))
    );
  }, [fullTrafficData, viewport]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (trafficMode !== 'Flow') return;
    setIsPanning(true);
    setIsLiveFollowing(false);
    panStartRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStartRef.current;
    panStartRef.current = e.clientX;
    const range = viewport.end - viewport.start;
    const pixelToData = range / (chartRef.current?.clientWidth || 1000);
    const dataShift = dx * pixelToData;
    
    setViewport(prev => {
      const nextStart = Math.max(0, prev.start - dataShift);
      const nextEnd = Math.min(fullTrafficData.length, prev.end - dataShift);
      if (nextEnd >= fullTrafficData.length) setIsLiveFollowing(true);
      return { start: nextStart, end: nextEnd };
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  const jumpToAlerts = (ip: string) => { setActiveTab('Alerts'); };
  const jumpToLogs = (ip: string) => { setActiveTab('Logs'); };

  return (
    <div className={`min-h-screen transition-all duration-1000 flex flex-col font-sans ${!isVigilanceActive ? 'vigilance-off' : ''}`}>
      
      {isTransitioning && (
        <>
          <div className="wake-overlay animate-wake-flash" />
          <div className="wake-wave trigger-sweep" />
          <ActivationCircuitry />
        </>
      )}

      {isAuditing && <AuditOverlay progress={auditProgress} logs={auditLogs} onComplete={() => setIsAuditing(false)} />}
      {isDiagnosticsOpen && <DiagnosticsOverlay onClose={() => setIsDiagnosticsOpen(false)} />}

      <header className="sticky top-0 z-50 w-full h-24 lg:h-28 energy-gradient border-b border-black/10 flex items-center px-6 lg:px-12 shadow-[0_5px_30px_rgba(255,169,249,0.15)] overflow-x-auto no-scrollbar">
        <div 
          onClick={() => setActiveTab('Dashboard')}
          className="flex items-center gap-4 lg:gap-6 cursor-pointer group hover:scale-[1.02] transition-transform duration-300 shrink-0"
        >
          <Logo active={isVigilanceActive} />
          <div className="h-6 sm:h-7 lg:h-8 flex items-center">
             <img 
               src="assets/insite_word_design.png" 
               alt="Insite" 
               className={`h-full w-auto object-contain transition-all duration-700 ${isVigilanceActive ? 'brightness-100' : 'brightness-50 grayscale opacity-60'}`} 
             />
          </div>
        </div>
        <nav className="ml-8 xl:ml-24 flex gap-2 lg:gap-4 h-full items-center shrink-0">
          {[{ name: 'Dashboard', icon: Activity }, { name: 'Alerts', icon: ShieldAlert }, { name: 'Logs', icon: History }, { name: 'Settings', icon: SettingsIcon }].map((tab) => (
            <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`px-4 lg:px-8 h-full text-[11px] lg:text-[13px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] transition-all relative flex items-center gap-2 lg:gap-3 group ${activeTab === tab.name ? 'text-black bg-white/20' : 'text-black/50 hover:text-black hover:bg-white/10'}`}>
              <tab.icon size={14} className={activeTab === tab.name && isVigilanceActive ? 'animate-pulse' : ''} />
              {tab.name}
              {activeTab === tab.name && <div className={`absolute bottom-0 left-0 w-full h-[4px] lg:h-[6px] ${isVigilanceActive ? 'bg-black' : 'bg-slate-900'}`}></div>}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4 lg:gap-8 shrink-0">
          <button onClick={() => { if (!isVigilanceActive) { setIsTransitioning(true); setTimeout(() => setIsVigilanceActive(true), 500); setTimeout(() => setIsTransitioning(false), 3500); } else { setIsVigilanceActive(false); } }} className={`flex items-center gap-3 lg:gap-5 px-5 lg:px-8 py-3 lg:py-4 rounded-full border-2 transition-all duration-500 backdrop-blur-md group active:scale-95 ${isVigilanceActive ? 'bg-black/5 border-black/10 hover:bg-black/10 shadow-inner' : 'standby-btn-static scale-105 lg:scale-110'}`}>
            <div className={`w-2.5 lg:w-3.5 h-2.5 lg:h-3.5 rounded-full transition-all duration-500 ${!isVigilanceActive ? 'bg-amber-600 shadow-[0_0_10px_#d97706]' : metrics.latency > 45 ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-pulse'}`}></div>
            <span className="text-[11px] lg:text-[13px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] transition-colors text-black">{isVigilanceActive ? 'Online' : 'Enable'}</span>
            {isVigilanceActive ? <Zap size={12} className="text-black ml-1 animate-bounce" /> : <PowerOff size={14} className="text-black ml-1" />}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-screen-2xl w-full mx-auto p-6 lg:p-12 pb-6 lg:pb-8 relative z-10 overflow-hidden flex flex-col">
        {activeTab === 'Dashboard' && (
          <div className="space-y-10 lg:space-y-14 animate-in fade-in duration-700 flex-1 overflow-y-auto no-scrollbar">
            <section>
              <TendrilCard title="Network Health & Infrastructure" edges={3} active={isVigilanceActive}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-16 py-4 lg:py-6">
                  <div className="space-y-2 lg:space-y-4">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Activity size={12} /> Response Delay</span>
                    <p className={`text-5xl lg:text-7xl font-black mono tracking-tighter transition-colors ${isVigilanceActive ? 'text-black' : 'text-slate-900'}`}>{isVigilanceActive ? metrics.latency.toFixed(0) : '--'}<span className="text-xl lg:text-2xl opacity-20 ml-2">ms</span></p>
                    <div className="h-2 w-full bg-slate-100 relative mt-2 lg:mt-4 rounded-full overflow-hidden">
                      <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${
                            isVigilanceActive ? 'bg-black shadow-[0_0_8px_black]' : 'bg-slate-400'
                          }`}
                          style={{
                            width: isVigilanceActive
                              ? `${Math.min(Math.max(metrics.latency, 0), 60) / 60 * 100}%`
                              : '0%',
                          }}
                        ></div>
                    </div>
                  </div>
                  <div className="space-y-2 lg:space-y-4">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Server size={12} /> Continuity</span>
                    <p className={`text-5xl lg:text-7xl font-black mono tracking-tighter transition-colors ${isVigilanceActive ? 'text-black' : 'text-slate-900'}`}>{isVigilanceActive ? (metrics.continuity).toFixed(1) : '--'}<span className="text-xl lg:text-2xl opacity-20 ml-2">%</span></p>
                    <div className="h-2 w-full bg-slate-100 mt-2 lg:mt-4 rounded-full overflow-hidden">
  <div
    className={`h-full rounded-full transition-all duration-500 ease-out ${
      isVigilanceActive ? 'energy-gradient' : 'bg-slate-400'
    }`}
    style={{
      width: isVigilanceActive
        ? `${Math.min(Math.max(metrics.continuity, 0), 100)}%`
        : '0%',
    }}
  />
</div>
              </div>
                  <div className="space-y-2 lg:space-y-4">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Cpu size={12} /> Node Efficiency</span>
                    <p className={`text-5xl lg:text-7xl font-black mono tracking-tighter transition-colors ${isVigilanceActive ? 'text-black' : 'text-slate-900'}`}>{isVigilanceActive ? metrics.nodeEfficiency.toFixed(1) : '--'}<span className="text-xl lg:text-2xl opacity-20 ml-2">%</span></p>
                   <div className="h-2 w-full bg-slate-100 overflow-hidden relative mt-2 lg:mt-4 rounded-full">
                    <div
                      className={`h-full transition-[width] duration-700 ease-out ${
                        isVigilanceActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-400'
                      }`}
                      style={{
                        width: isVigilanceActive
                          ? `${Math.min(Math.max(metrics.nodeEfficiency, 0), 100)}%`
                          : '0%',
                      }}
                    />
                  </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-6 lg:p-10 flex flex-col items-center justify-center rounded-2xl shadow-inner group hover:bg-slate-100 transition-colors">
                    <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 lg:mb-4">Posture</span>
                    <p className={`text-2xl lg:text-4xl font-black tracking-tighter uppercase transition-colors ${!isVigilanceActive ? 'text-slate-700' : metrics.threatLevel === 'LOW' ? 'text-emerald-500 group-hover:text-emerald-600' : 'text-rose-500'}`}>{isVigilanceActive ? `${metrics.threatLevel} RISK` : 'OFFLINE'}</p>
                  </div>
                </div>
              </TendrilCard>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 lg:gap-20">
              <div className="xl:col-span-2">
                <TendrilCard title="Active Traffic Stream" edges={3} active={isVigilanceActive}>
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 lg:mb-12 px-2 gap-6">
                    <div className="flex gap-2 lg:gap-4 p-1 lg:p-1.5 bg-slate-50 rounded-xl border border-slate-200 w-full md:w-auto overflow-hidden">
                      {(['Flow', 'Packets'] as const).map(mode => (
                        <button key={mode} onClick={() => setTrafficMode(mode)} disabled={!isVigilanceActive} className={`flex-1 md:flex-none px-6 lg:px-10 py-2.5 lg:py-3 text-[10px] lg:text-[12px] font-black uppercase tracking-[0.2em] transition-all rounded-lg ${trafficMode === mode && isVigilanceActive ? 'bg-white text-black shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                          {mode}
                        </button>
                      ))}
                    </div>
                    {trafficMode === 'Flow' && isVigilanceActive && (
                      <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 lg:gap-12 w-full md:w-auto">
                        <div className="flex items-center gap-4 lg:gap-8 text-[9px] lg:text-[11px] font-black uppercase text-slate-400">
                          <div className="flex items-center gap-2 lg:gap-3"><div className="w-4 lg:w-5 h-1 bg-black rounded-full"></div> Inbound</div>
                          <div className="flex items-center gap-2 lg:gap-3"><div className="w-4 lg:w-5 h-1 border-t-2 border-dashed border-slate-400"></div> Outbound</div>
                        </div>
                        <button 
                          onClick={() => setIsLiveFollowing(!isLiveFollowing)} 
                          className={`flex items-center gap-3 lg:gap-5 px-6 lg:px-10 py-3 lg:py-4 rounded-full border-2 transition-all duration-300 group scale-100 lg:scale-110 shadow-lg active:scale-95
                            ${isLiveFollowing 
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-200' 
                              : 'bg-white border-slate-300 text-slate-400 hover:text-black hover:border-black shadow-none'}`}
                        >
                          <LocateFixed size={16} className={isLiveFollowing ? 'animate-pulse' : ''} />
                          <span className="text-[11px] lg:text-[13px] font-black uppercase tracking-[0.1em] lg:tracking-[0.2em]">{isLiveFollowing ? 'Live Active' : 'Enable Live'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div 
                    ref={chartRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`h-[400px] lg:h-[520px] w-full bg-white rounded-xl border border-slate-100 relative overflow-hidden flex flex-col transition-all duration-1000 ${isPanning ? 'cursor-grabbing' : 'cursor-crosshair'}`}
                  >
                    {!isVigilanceActive ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400"><Radar size={64} className="mb-4 lg:mb-6 opacity-20" /><p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.5em]">Standby</p></div>
                    ) : trafficMode === 'Flow' ? (
                      <div className="flex-1 p-4 lg:p-6 pb-2 relative flex flex-col">
                        <div className="hidden lg:flex absolute top-6 right-8 gap-3 lg:gap-5 pointer-events-none z-20 scale-90 lg:scale-100">
                        </div>

                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={displayedTrafficData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
                              <defs>
                                <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#000" stopOpacity={0.05}/><stop offset="95%" stopColor="#000" stopOpacity={0}/></linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} interval="preserveStartEnd" minTickGap={30}>
                                <Label value="System Time" offset={-20} position="insideBottom" className="text-[8px] font-black uppercase tracking-[0.2em] fill-slate-300" />
                              </XAxis>
                              <YAxis
                                scale="log"
                                domain={[1, dataMax => dataMax * 1.3]}
                                allowDataOverflow
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 9, fill: '#94a3b8' }}
                              >
                                <Label
                                  value="Transfer Rate (Packets/sec)"
                                  angle={-90}
                                  position="insideLeft"
                                  offset={0}
                                  style={{ textAnchor: 'middle' }}
                                  className="text-[8px] font-black uppercase tracking-[0.2em] fill-slate-300"
                                />
                              </YAxis>

                              <Tooltip isAnimationActive={false} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '9px', fontFamily: 'monospace' }} />
                              <Area type="monotone" dataKey="inbound" stroke="#000" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInbound)" isAnimationActive={false} />
                              <Area type="monotone" dataKey="outbound" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="6 6" fill="none" isAnimationActive={false} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col overflow-hidden bg-white font-mono p-4 lg:p-10">
                        <div className="grid grid-cols-6 border-b border-slate-100 pb-2 lg:pb-4 mb-4 text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest"><span>Proto</span><span className="col-span-2">Source</span><span>Target</span><span>Size</span><span>Hex</span></div>
                        <div className="flex-1 overflow-y-auto space-y-2 lg:space-y-3 custom-scrollbar">
                          {packets.map((p) => (<div key={p.id} className="grid grid-cols-6 text-[10px] lg:text-[12px] items-center py-2 border-b border-slate-50 opacity-80"><span>{p.protocol}</span><span className="col-span-2 truncate pr-2">{p.src}</span><span className="truncate pr-2">{p.dst}</span><span>{p.size}b</span><span className="opacity-30 truncate">{p.hex}</span></div>))}
                        </div>
                      </div>
                    )}
                  </div>
                </TendrilCard>
              </div>

              <div className="flex flex-col gap-10 lg:h-full">
                <TendrilCard title="Traffic Vectors" edges={3} active={isVigilanceActive} className="flex-1">
                  <div className="flex flex-col h-full bg-white relative">
                    <div className="flex-1 p-4 lg:p-6 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner overflow-hidden flex flex-col min-h-[300px]">
                      <h4 className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 lg:mb-6 flex items-center gap-2">
                        <Radar size={14} className={isVigilanceActive ? 'text-black' : 'text-slate-600'} /> 
                        {selectedVectorIP ? 'Vector Analysis' : 'Watch'}
                      </h4>
                      
                      {selectedVectorIP ? (
                        <div className="flex-1 flex flex-col space-y-4 lg:space-y-8 animate-in slide-in-from-right duration-300">
                          <button onClick={() => setSelectedVectorIP(null)} className="flex items-center gap-2 text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
                            <ChevronLeft size={14} /> Return
                          </button>
                          <div className="space-y-1 lg:space-y-3">
                             <div className="text-xl lg:text-3xl font-black mono tracking-tight text-black truncate">{selectedVectorIP.ip}</div>
                             <div className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 truncate">
                               <Info size={12} /> {selectedVectorIP.location}
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 lg:gap-5">
                            <div className="p-3 lg:p-5 bg-white border border-slate-200 rounded-xl lg:rounded-2xl shadow-sm">
                              <div className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase mb-1 lg:mb-2 tracking-widest">Risk</div>
                              <div className={`text-xl lg:text-2xl font-black ${selectedVectorIP.riskScore > 70 ? 'text-rose-500' : 'text-amber-500'}`}>{selectedVectorIP.riskScore}%</div>
                            </div>
                            <div className="p-3 lg:p-5 bg-white border border-slate-200 rounded-xl lg:rounded-2xl shadow-sm">
                              <div className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase mb-1 lg:mb-2 tracking-widest">Hits</div>
                              <div className="text-xl lg:text-2xl font-black text-black">{selectedVectorIP.hits}</div>
                            </div>
                          </div>
                          <div className="space-y-3 lg:space-y-4 pt-4 lg:pt-6 border-t border-slate-200">
                             <button onClick={() => jumpToAlerts(selectedVectorIP.ip)} className="w-full flex items-center justify-between p-3 lg:p-5 bg-white border-2 border-slate-100 rounded-xl lg:rounded-2xl text-[10px] lg:text-[12px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all group active:scale-95">
                               Alerts <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                             </button>
                             <button onClick={() => jumpToLogs(selectedVectorIP.ip)} className="w-full flex items-center justify-between p-3 lg:p-5 bg-white border-2 border-slate-100 rounded-xl lg:rounded-2xl text-[10px] lg:text-[12px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all group active:scale-95">
                               Logs <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                             </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                          {MOCK_IPS.map((node) => (
                            <div key={node.ip} onClick={() => setSelectedVectorIP(node)} className={`flex flex-col group transition-all p-3 lg:p-5 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white cursor-pointer active:scale-95 ${!isVigilanceActive ? 'opacity-80 pointer-events-none' : ''}`}>
                              <div className="flex justify-between items-center mb-2 lg:mb-4">
                                <span className={`text-sm lg:text-base font-black mono transition-colors ${isVigilanceActive ? 'text-black' : 'text-slate-900'}`}>{node.ip}</span>
                                <span className={`text-[9px] lg:text-[11px] font-black px-3 lg:px-5 py-1 lg:py-2 rounded-full border transition-all ${!isVigilanceActive ? 'bg-slate-200 border-slate-400 text-slate-600' : node.riskScore > 70 ? 'bg-rose-500 text-white border-rose-400' : node.riskScore > 40 ? 'bg-amber-500 text-white border-amber-400' : 'bg-emerald-500 text-white border-emerald-400'}`}>{isVigilanceActive ? `${node.riskScore}%` : '--%'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-[9px] font-black uppercase text-slate-400 tracking-[0.1em]">{node.location}</div>
                                <div className="text-[9px] font-black uppercase text-slate-300 group-hover:text-black transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1">View <ArrowRight size={10} /></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TendrilCard>

                <TendrilCard title="System Control" edges={3} active={isVigilanceActive}>
                  <div className="space-y-4 lg:space-y-8">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex flex-col">
                        <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit</span>
                        <div className="flex items-center gap-2">
                           {metrics.threatLevel === 'LOW' ? (
                             <ShieldCheck size={14} className="text-emerald-500" />
                           ) : (
                             <ZapOff size={14} className="text-amber-500" />
                           )}
                           <span className={`text-[10px] lg:text-[11px] font-black uppercase ${metrics.threatLevel === 'LOW' ? 'text-emerald-600' : 'text-amber-600'}`}>{metrics.threatLevel === 'LOW' ? 'Verified' : 'Recommended'}</span>
                        </div>
                      </div>
                      <div className="h-8 lg:h-10 w-[1px] lg:w-[2px] bg-slate-100"></div>
                      <div className="flex flex-col text-right">
                         <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI</span>
                         <span className="text-[10px] lg:text-[11px] font-black text-black mono">0.14ms</span>
                      </div>
                    </div>
                    <button onClick={startAudit} className={`w-full py-6 lg:py-8 text-[12px] lg:text-[14px] font-black uppercase tracking-[0.4em] lg:tracking-[0.6em] flex items-center justify-center gap-4 lg:gap-8 transition-all shadow-xl rounded-2xl lg:rounded-3xl group overflow-hidden relative active:scale-[0.98] border-2
                        ${isVigilanceActive 
                          ? 'bg-black text-white border-black hover:bg-slate-900' 
                          : 'bg-slate-200 text-slate-700 border-slate-400 shadow-none'}`}>
                      <Terminal size={20} className={isVigilanceActive ? 'animate-pulse' : ''} /> 
                      Engage Audit
                    </button>
                  </div>
                </TendrilCard>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'Alerts' && <AlertsTab />}
        {activeTab === 'Logs' && <LogsTab />}
        {activeTab === 'Settings' && <SettingsTab />}
      </main>

      <footer className="w-full bg-white border-t border-slate-200 py-6 lg:py-10 px-6 lg:px-20 mt-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] lg:text-[12px] font-black uppercase tracking-[0.3em] lg:tracking-[0.5em] text-slate-400">
        <div className="flex items-center gap-8 lg:gap-20">
          <div className={`flex items-center gap-4 lg:gap-6 transition-opacity ${!isVigilanceActive ? 'opacity-80' : ''}`}>
            <div className={`w-2.5 lg:w-3.5 h-2.5 lg:h-3.5 rounded-full transition-all duration-1000 ${isVigilanceActive ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-slate-400'}`}></div>
            <span className={isVigilanceActive ? 'text-black' : 'text-slate-900'}>{isVigilanceActive ? 'Perimeter: SECURE' : 'Perimeter: STANDBY'}</span>
          </div>
        </div>
        <div className="flex items-center gap-8 lg:gap-16">
          <span onClick={() => setIsDiagnosticsOpen(true)} className="hover:text-black cursor-pointer transition-all hover:scale-105 active:scale-95">Diagnostics</span>
          <div className="hidden sm:block px-6 lg:px-10 py-3 lg:py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 shadow-inner mono">SID_884_INSITE</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
