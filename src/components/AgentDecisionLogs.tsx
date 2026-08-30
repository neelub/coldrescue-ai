import React, { useState } from 'react';
import { 
  History, 
  Cpu, 
  ThermometerSnowflake, 
  Database, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Code2, 
  Terminal, 
  Sparkles,
  Copy,
  Check,
  Search
} from 'lucide-react';
import { AgentDecisionLog } from '../types';
import { INITIAL_AGENT_DECISION_LOGS } from '../data/coldChainMockData';

interface AgentDecisionLogsProps {
  logs?: AgentDecisionLog[];
}

export const AgentDecisionLogs: React.FC<AgentDecisionLogsProps> = ({ 
  logs: initialLogs = INITIAL_AGENT_DECISION_LOGS 
}) => {
  const [logs, setLogs] = useState<AgentDecisionLog[]>(initialLogs);
  const [selectedAgent, setSelectedAgent] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(initialLogs[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const getAgentIcon = (agentName: string) => {
    switch (agentName) {
      case 'Cold Sentinel':
        return <ThermometerSnowflake className="w-4 h-4 text-emerald-400" />;
      case 'Logistics GIS Analyst':
        return <Database className="w-4 h-4 text-blue-400" />;
      case 'Economic & Loss Arbiter':
        return <DollarSign className="w-4 h-4 text-amber-400" />;
      case 'Dataplex Compliance Auditor':
        return <ShieldCheck className="w-4 h-4 text-teal-400" />;
      case 'Master Dispatcher':
        return <Zap className="w-4 h-4 text-rose-400" />;
      default:
        return <Cpu className="w-4 h-4 text-purple-400" />;
    }
  };

  const getAgentBadgeColor = (agentName: string) => {
    switch (agentName) {
      case 'Cold Sentinel':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
      case 'Logistics GIS Analyst':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/30';
      case 'Economic & Loss Arbiter':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/30';
      case 'Dataplex Compliance Auditor':
        return 'bg-teal-950/80 text-teal-300 border-teal-500/30';
      case 'Master Dispatcher':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/30';
      default:
        return 'bg-purple-950/80 text-purple-300 border-purple-500/30';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesAgent = selectedAgent === 'ALL' || log.agentName === selectedAgent;
    const matchesSearch = 
      log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.metadata.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAgent && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const handleCopy = (log: AgentDecisionLog) => {
    const textToCopy = `[${log.timestamp} - ${log.timeOffset}] ${log.agentName} (${log.actionType}):\n${log.summary}\n\nDetails: ${log.details}\nService: ${log.metadata.service}\nConfidence: ${(log.confidenceScore * 100).toFixed(0)}%`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateNewDecision = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const newId = `ADL-${Math.floor(1100 + Math.random() * 900)}`;
      const now = new Date();
      const timestampStr = now.toISOString().substring(11, 19) + ' UTC';
      
      const newLog: AgentDecisionLog = {
        id: newId,
        timestamp: timestampStr,
        timeOffset: `T+00:${Math.floor(25 + Math.random() * 20)}s`,
        agentName: 'Master Dispatcher',
        actionType: 'DISPATCH_EXECUTION',
        summary: 'Pushed real-time dock confirmation handshake to Mountain Pure receiver gateway.',
        details: `Receiver API confirmed dock reservation at bay #3. Arrival telematics synchronized with truck speed (64 mph). Safe pallet containment active for Zone B and Zone C.`,
        confidenceScore: 0.99,
        status: 'COMPLETED',
        metadata: {
          service: 'Google Cloud Pub/Sub • Cloud Run Webhook • In-Cab Telematics',
          payloadKey: 'DockHandshake',
          payloadValue: 'DOCK_BAY_RESERVED_ACK',
          codeSnippet: `// Receiver Gateway Handshake Confirmation\nconst res = await receiverGateway.confirmDock({\n  facilityId: "OFF-01",\n  bay: "3",\n  estimatedIntakeLbs: 8000,\n  estArrival: "${timestampStr}"\n});`,
          tags: ['Receiver Handshake', 'Live Telematics', 'Zero Disruption'],
        },
      };

      setLogs((prev) => [newLog, ...prev]);
      setExpandedLogId(newId);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
      {/* Header with Title & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-950/80 border border-purple-500/30 rounded-xl text-purple-400 shadow-inner">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100 tracking-tight">
                Gemini Multi-Agent Decision Logs
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-purple-950 text-purple-300 border border-purple-500/40 rounded-full">
                Chronological Audit
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live verifiable trace of autonomous cognitive actions, spatial lookups, policy audits, and dispatch orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleSimulateNewDecision}
            disabled={isSimulating}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md shadow-emerald-950/40 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Orchestrating...' : 'Trigger Decision Replay'}
          </button>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">Total Autonomous Actions</span>
          <span className="text-lg font-extrabold text-slate-100 mt-0.5 block">{logs.length} Steps</span>
          <span className="text-[10px] text-emerald-400 font-mono">100% Autonomous</span>
        </div>
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">Mean Decision Latency</span>
          <span className="text-lg font-extrabold text-purple-400 mt-0.5 block">2.4 Seconds</span>
          <span className="text-[10px] text-slate-400 font-mono">End-to-End Consensus</span>
        </div>
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">Regulatory Compliance</span>
          <span className="text-lg font-extrabold text-teal-400 mt-0.5 block">FSMA Grade-B</span>
          <span className="text-[10px] text-teal-400 font-mono">100% Policy Passed</span>
        </div>
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">Economic Swing Created</span>
          <span className="text-lg font-extrabold text-emerald-400 mt-0.5 block">+$29,705</span>
          <span className="text-[10px] text-emerald-400 font-mono">Net vs Landfill Total Loss</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Agent Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs scrollbar-thin">
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {['ALL', 'Cold Sentinel', 'Logistics GIS Analyst', 'Economic & Loss Arbiter', 'Dataplex Compliance Auditor', 'Master Dispatcher'].map((agent) => (
            <button
              key={agent}
              onClick={() => setSelectedAgent(agent)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                selectedAgent === agent
                  ? 'bg-slate-100 text-slate-900 font-bold shadow'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {agent === 'ALL' ? 'All 5 Agents' : agent}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search decisions, services, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Chronological Decision Timeline */}
      <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
        {filteredLogs.map((log, index) => {
          const isExpanded = expandedLogId === log.id;
          return (
            <div 
              key={log.id} 
              className={`relative pl-12 transition rounded-xl border ${
                isExpanded 
                  ? 'bg-slate-900/90 border-slate-700 shadow-lg ring-1 ring-purple-500/20' 
                  : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800/80'
              }`}
            >
              {/* Timeline Marker Icon */}
              <div className="absolute left-4 top-4.5 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow">
                {getAgentIcon(log.agentName)}
              </div>

              {/* Collapsed / Summary Bar */}
              <div 
                onClick={() => toggleExpand(log.id)}
                className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getAgentBadgeColor(log.agentName)} flex items-center gap-1`}>
                      {log.agentName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {log.timestamp}
                    </span>
                    <span className="px-1.5 py-0.2 text-[9px] font-mono bg-slate-800 text-purple-300 rounded border border-slate-700">
                      {log.timeOffset}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 ml-auto sm:ml-0">
                      <CheckCircle2 className="w-3 h-3" />
                      {(log.confidenceScore * 100).toFixed(0)}% Conf
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200 leading-snug">
                    {log.summary}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(log);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition"
                    title="Copy Decision Step"
                  >
                    {copiedId === log.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(log.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details Pane */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3">
                  {/* Detailed Description */}
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Reasoning & Deliberation Details
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {log.details}
                    </p>
                  </div>

                  {/* Code Snippet / Mathematical Model if present */}
                  {log.metadata.codeSnippet && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Code2 className="w-3 h-3 text-purple-400" />
                          Algorithmic Execution Payload
                        </span>
                        <span className="text-slate-500">{log.metadata.service}</span>
                      </div>
                      <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed shadow-inner">
                        <code>{log.metadata.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Metadata and Tag Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-400 font-mono text-[10px]">
                        Service: <span className="text-slate-200">{log.metadata.service}</span>
                      </span>
                      {log.metadata.payloadKey && (
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">
                          {log.metadata.payloadKey}: <strong className="text-emerald-300">{log.metadata.payloadValue}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {log.metadata.tags?.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded text-[9px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center bg-slate-900/30 rounded-xl border border-slate-800/80">
            <p className="text-xs text-slate-400">No decision logs found matching your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
