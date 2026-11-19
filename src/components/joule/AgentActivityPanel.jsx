import React, { useState } from 'react';
import { 
  Bot, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Sparkles,
  Zap,
  Cpu
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export const AgentActivityPanel = ({ compact = false }) => {
  const { agents } = useAppData();
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">
            <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" /> Processing
          </span>
        );
      case 'Approval Required':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300 animate-bounce">
            <AlertCircle className="w-3 h-3 text-purple-600" /> Approval Required
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-600" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
            <Clock className="w-3 h-3 text-slate-500" /> Waiting
          </span>
        );
    }
  };

  const filteredAgents = agents.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-slate-50/80 hover:bg-slate-100/80 cursor-pointer transition flex items-center justify-between border-b border-slate-200"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#102A43]">
                Joule Multi-Agent Mesh
              </span>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                7 Autonomous Agents
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Autonomous supply chain telemetry & execution graph</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </div>

      {/* Expandable Agent Timeline & Status Cards */}
      {isExpanded && (
        <div className="p-4 sm:p-5">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 text-xs">
            {['ALL', 'Completed', 'Processing', 'Approval Required', 'Waiting'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 rounded-lg font-medium transition text-[11px] whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Agents List */}
          <div className="space-y-3">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <h4 className="font-bold text-xs text-[#102A43]">{agent.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">({agent.role})</span>
                  </div>
                  <div>{getStatusBadge(agent.status)}</div>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2">
                  <span className="font-semibold text-slate-900 block text-[11px] mb-0.5">Current Task:</span>
                  <p className="leading-relaxed text-slate-600 text-[11px]">{agent.lastTask}</p>
                </div>

                {agent.result && (
                  <div className="text-[11px] flex items-start gap-1.5 text-emerald-800 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Telemetry Result:</strong> {agent.result}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2.5 pt-1.5 border-t border-slate-100">
                  <span>Execution Latency: {agent.executionMs}ms</span>
                  <span>Activity: {agent.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
