import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Shield, Radio, Sparkles, Trash2, ArrowRight } from 'lucide-react';

export default function CompetitorCard({ competitor, onDelete }) {
  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'primary':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'secondary':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'emerging':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  const signalCount = competitor.intelligence_signals?.length || 0;
  const pricingCount = competitor.pricing_logs?.length || 0;
  const latestInsight = competitor.ai_insights?.[0];

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getTierColor(competitor.tier)}`}>
              {competitor.tier || 'Tracked'} Tier
            </span>
            <h3 className="text-lg font-bold text-white mt-1.5 group-hover:text-indigo-300 transition-colors">
              {competitor.name}
            </h3>
            <a
              href={competitor.domain}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400 mt-0.5 transition-colors"
            >
              <span>{competitor.domain.replace(/^https?:\/\//, '')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            onClick={() => onDelete && onDelete(competitor.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete competitor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Industry Tag & Notes */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-800/40">
            {competitor.industry || 'Market Intelligence'}
          </span>
          {competitor.notes && (
            <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 italic">
              "{competitor.notes}"
            </p>
          )}
        </div>

        {/* Activity & Signals Stat Chips */}
        <div className="grid grid-cols-2 gap-2 my-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Signals Logged</p>
              <p className="font-bold text-slate-200">{signalCount} Captured</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Pricing Logs</p>
              <p className="font-bold text-slate-200">{pricingCount} Records</p>
            </div>
          </div>
        </div>

        {/* Latest AI Threat Insight Banner */}
        {latestInsight && (
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Threat Assessment
              </span>
              <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                latestInsight.threat_level === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                latestInsight.threat_level === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {latestInsight.threat_level} Threat
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
              {latestInsight.summary}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
        <Link
          to={`/competitors/${competitor.id}`}
          className="flex-1 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold text-center transition-all duration-150 flex items-center justify-center gap-1.5 border border-indigo-500/30"
        >
          <span>Deep Dive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to={`/ai-strategist?competitorId=${competitor.id}`}
          className="py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-semibold transition-all duration-150 border border-purple-500/30"
          title="Run Gemini Battlecard Analysis"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
