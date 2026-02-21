
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Database, 
  Filter, 
  FileText, 
  ShieldCheck, 
  ShieldX, 
  ShieldAlert,
  ArrowRight,
  Info,
  Download,
  Terminal,
  Clock,
  ChevronRight
} from 'lucide-react';
import { LogEntry, LogAction } from '../types';

const MOCK_LOGS: LogEntry[] = [
  {
    id: 'LOG-88021',
    timestamp: '2024-05-20 14:45:12.001',
    source: '192.168.1.104',
    destination: '45.122.1.99',
    protocol: 'HTTPS/TLS',
    action: 'ALLOW',
    bytes: 14202,
    tag: 'Standard Outbound',
    details: {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Cipher': 'ECDHE-RSA-AES256-GCM-SHA384' },
      score: 0.02
    },
    aiSummary: 'Standard encrypted web traffic originating from internal workstation. Behavior matches historical baseline.'
  },
  {
    id: 'LOG-88022',
    timestamp: '2024-05-20 14:45:11.850',
    source: '10.0.5.21',
    destination: '192.168.1.1',
    protocol: 'ICMP',
    action: 'BLOCK',
    bytes: 64,
    tag: 'Rate Limit Exceeded',
    details: {
      ruleId: 'RULE-ICMP-FLOOD-01',
      headers: { 'Type': '8 (Echo Request)', 'Sequence': '15521' },
      score: 0.94
    },
    aiSummary: 'Connection blocked due to exceeding SYN rate threshold on the primary gateway. Likely automated scan or localized DDoS attempt.'
  },
  {
    id: 'LOG-88023',
    timestamp: '2024-05-20 14:45:10.421',
    source: '185.22.41.102',
    destination: '10.0.0.4',
    protocol: 'SSH',
    action: 'ALERT',
    bytes: 2048,
    tag: 'Brute Force Signature',
    details: {
      ruleId: 'SIG-AUTH-FAILED',
      headers: { 'Port': '22', 'Auth-Method': 'Password' },
      score: 0.88
    },
    aiSummary: 'Foreign IP attempting SSH authentication on internal asset. Alert triggered due to multiple failed handshakes within 60s.'
  },
  {
    id: 'LOG-88024',
    timestamp: '2024-05-20 14:45:09.112',
    source: '192.168.1.55',
    destination: '8.8.8.8',
    protocol: 'DNS',
    action: 'ALLOW',
    bytes: 128,
    details: {
      headers: { 'Query': 'api.internal.corp', 'Type': 'A' }
    },
    aiSummary: 'Routine DNS resolution request. No anomalies detected.'
  }
];

export const LogsTab: React.FC = () => {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter(log => {
      const matchesAction = filterAction === 'ALL' || log.action === filterAction;
      const matchesSearch = log.source.includes(searchQuery) || log.destination.includes(searchQuery) || log.id.includes(searchQuery);
      return matchesAction && matchesSearch;
    });
  }, [searchQuery, filterAction]);

  const selectedLog = useMemo(() => MOCK_LOGS.find(l => l.id === selectedLogId), [selectedLogId]);

  return (
    <div className="flex flex-col lg:flex-row gap-1 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 h-auto lg:h-[calc(100vh-280px)] shadow-2xl">
      {/* Table Section */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden min-h-[500px] lg:min-h-0">
        {/* Header / Search Area */}
        <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-10">
          <div className="flex items-center gap-4 text-slate-400 shrink-0 self-start">
            <Database size={18} className="text-black" />
            <h2 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-black">Network Logs</h2>
          </div>
          
          <div className="flex-1 w-full max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input 
              type="text" 
              placeholder="Source or Destination..."
              className="w-full bg-slate-50 border border-slate-200 py-2.5 lg:py-3 pl-10 lg:pl-12 pr-6 rounded-lg mono text-[10px] lg:text-[11px] focus:outline-none focus:ring-1 focus:ring-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-start md:self-center overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {['ALL', 'BLOCK', 'ALERT', 'ALLOW'].map(act => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-3 lg:px-4 py-1.5 lg:py-2 text-[8px] lg:text-[9px] font-black uppercase tracking-widest border transition-all rounded
                  ${filterAction === act ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-200 hover:border-black hover:text-black'}`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="border-b border-slate-200">
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">ID</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">Origin</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">Endpoint</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">Proto</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Bytes</th>
              </tr>
            </thead>
            <tbody className="mono text-[10px] lg:text-[11px] font-medium divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id} 
                  onClick={() => setSelectedLogId(log.id)}
                  className={`cursor-pointer transition-all hover:bg-slate-50 group
                    ${selectedLogId === log.id ? 'bg-slate-100 border-l-[4px] border-l-black shadow-inner' : 'border-l-[4px] border-l-transparent'}`}
                >
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-400 font-bold">{log.id}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 font-bold">{log.source}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 opacity-70">{log.destination}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4"><span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[8px]">{log.protocol}</span></td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="flex items-center gap-1.5 lg:gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${log.action === 'BLOCK' ? 'bg-rose-500' : log.action === 'ALERT' ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
                      <span className={`font-black tracking-widest text-[9px] lg:text-[10px] ${log.action === 'BLOCK' ? 'text-rose-600' : log.action === 'ALERT' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-right tabular-nums">{(log.bytes / 1024).toFixed(1)} KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 lg:p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">
           <div className="flex items-center gap-3 lg:gap-4">
              <span>Loaded: {filteredLogs.length}</span>
              <span className="opacity-30">|</span>
              <span className="hidden sm:inline">Buffer Status: Optimal</span>
           </div>
           <button className="flex items-center gap-1.5 hover:text-black transition-colors">
              <Download size={12} /> Export
           </button>
        </div>
      </div>

      {/* Detail Inspector Section - Reduced width on smaller lg monitors */}
      <div className="w-full lg:w-[400px] xl:w-[480px] bg-[#fafafa] border-l-0 lg:border-l-2 border-slate-200 flex flex-col shrink-0 min-h-[500px] lg:min-h-0">
        {selectedLog ? (
          <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-[12px] lg:text-sm font-black uppercase tracking-widest flex items-center gap-2 lg:gap-3">
                  <Terminal size={16} /> Packet Inspector
                </h3>
                <p className="text-[9px] lg:text-[10px] font-black text-slate-400">ID: {selectedLog.id}</p>
              </div>
              <button 
                onClick={() => setSelectedLogId(null)}
                className="text-slate-300 hover:text-black transition-colors lg:hidden"
              >
                <ChevronRight size={20} className="rotate-90" />
              </button>
            </div>

            {/* AI Summary Block */}
            <div className="p-4 lg:p-6 bg-white border border-slate-200 rounded-xl shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
               <div className="flex items-center gap-2 lg:gap-3 text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-slate-400 mb-3 lg:mb-4">
                  <Info size={12} /> System Inference
               </div>
               <p className="text-[11px] lg:text-[12px] font-medium leading-relaxed text-slate-700 italic">
                  "{selectedLog.aiSummary}"
               </p>
            </div>

            {/* Header / Technical Breakdown */}
            <div className="space-y-4 lg:space-y-6">
               <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Context</h4>
               <div className="space-y-3 lg:space-y-4">
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="p-3 lg:p-4 bg-white border border-slate-100 rounded-lg">
                       <span className="text-[8px] lg:text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Risk</span>
                       <span className="mono text-base lg:text-lg font-black">{selectedLog.details.score?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="p-3 lg:p-4 bg-white border border-slate-100 rounded-lg">
                       <span className="text-[8px] lg:text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Rule</span>
                       <span className="mono text-[10px] lg:text-xs font-bold block truncate">{selectedLog.details.ruleId || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-3">
                    <span className="text-[8px] lg:text-[9px] font-black text-slate-300 uppercase tracking-widest block">Metadata</span>
                    <div className="bg-slate-900 rounded-lg p-4 lg:p-6 mono text-[9px] lg:text-[10px] space-y-1 lg:space-y-2 overflow-x-auto">
                      {Object.entries(selectedLog.details.headers).map(([key, val]) => (
                        <div key={key} className="flex gap-2 lg:gap-4">
                          <span className="text-slate-500 w-20 lg:w-24 shrink-0 truncate">{key}:</span>
                          <span className="text-emerald-400/80 truncate">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-3 lg:space-y-4 pb-4">
              <button className="w-full py-3 lg:py-4 bg-black text-white text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] rounded-lg hover:bg-slate-800 transition-colors shadow-lg active:scale-95">
                Apply Block
              </button>
              <button className="w-full py-3 lg:py-4 border-2 border-slate-200 text-slate-400 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] rounded-lg hover:border-black hover:text-black transition-all">
                Audit Report
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 p-10">
            <FileText size={48} className="mb-4 lg:mb-6 text-slate-200" />
            <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Selection</p>
          </div>
        )}
      </div>
    </div>
  );
};
