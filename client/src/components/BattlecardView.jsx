import React from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Target
} from 'lucide-react';

export default function BattlecardView({ battlecard, competitorName }) {
  if (!battlecard) return null;

  const getThreatBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return { label: 'CRITICAL THREAT', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40', icon: ShieldAlert };
      case 'high':
        return { label: 'HIGH THREAT', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', icon: AlertTriangle };
      case 'medium':
        return { label: 'MEDIUM THREAT', bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', icon: TrendingUp };
      default:
        return { label: 'LOW THREAT', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', icon: CheckCircle2 };
    }
  };

  const threat = getThreatBadge(battlecard.threat_level);
  const ThreatIcon = threat.icon;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-6">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
            Gemini-Powered AI Battlecard
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {competitorName ? `${competitorName} Battlecard` : 'Competitive Intelligence Battlecard'}
          </h2>
        </div>

        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${threat.bg}`}>
          <ThreatIcon className="w-4 h-4" />
          <span>{threat.label}</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Executive Strategic Synthesis
        </h4>
        <p className="text-sm text-slate-200 leading-relaxed">
          {battlecard.summary}
        </p>
      </div>

      {/* Strengths vs Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Competitor Strengths */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-emerald-500/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Identified Competitor Strengths
          </h4>
          <ul className="space-y-2">
            {battlecard.strengths?.map((strength, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Competitor Weaknesses & Exploits */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-rose-500/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400" /> Vulnerabilities & Exploits
          </h4>
          <ul className="space-y-2">
            {battlecard.weaknesses?.map((weakness, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Actionable Counter-Marketing Strategies */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-purple-950/40 p-5 rounded-2xl border border-indigo-500/30 space-y-4">
        <h4 className="text-sm font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" /> Recommended Counter-Marketing Campaigns
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {battlecard.actionable_counter_strategies?.map((strategy, index) => (
            <div 
              key={index}
              className="bg-slate-900/90 p-3.5 rounded-xl border border-indigo-500/20 flex items-start gap-3 hover:border-indigo-400/40 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-400/30 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {strategy}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
