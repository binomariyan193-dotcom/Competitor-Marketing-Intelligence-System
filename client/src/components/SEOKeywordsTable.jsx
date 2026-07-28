import React from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function SEOKeywordsTable({ keywords = [] }) {
  const sampleKeywords = keywords.length > 0 ? keywords : [
    { id: 1, competitor: 'CyberScale Corp', keyword: 'Autonomous AI Agent Platform', rank: 2, prevRank: 14, delta: 12, volume: '45,000/mo', intent: 'Commercial' },
    { id: 2, competitor: 'CyberScale Corp', keyword: 'Enterprise Marketing Automation', rank: 4, prevRank: 8, delta: 4, volume: '60,000/mo', intent: 'Transactional' },
    { id: 3, competitor: 'Novus Dynamics', keyword: 'Cloud Infrastructure Monitoring', rank: 1, prevRank: 1, delta: 0, volume: '110,000/mo', intent: 'Informational' },
    { id: 4, competitor: 'Vanguard AI', keyword: 'AI Battlecard Generator', rank: 3, prevRank: 19, delta: 16, volume: '22,000/mo', intent: 'Commercial' },
    { id: 5, competitor: 'Novus Dynamics', keyword: 'Kubernetes Telemetry Suite', rank: 6, prevRank: 3, delta: -3, volume: '18,500/mo', intent: 'Technical' }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">SEO & SERP Ranking Shifts</h3>
            <p className="text-xs text-slate-400">High-intent search keyword rank movements</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
              <th className="py-2.5 px-3">Competitor</th>
              <th className="py-2.5 px-3">Target Keyword</th>
              <th className="py-2.5 px-3 text-center">Rank</th>
              <th className="py-2.5 px-3 text-center">Δ Movement</th>
              <th className="py-2.5 px-3">Search Vol</th>
              <th className="py-2.5 px-3">Intent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sampleKeywords.map(row => (
              <tr key={row.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-200">{row.competitor}</td>
                <td className="py-3 px-3 text-indigo-300 font-medium">{row.keyword}</td>
                <td className="py-3 px-3 text-center font-bold text-white">#{row.rank}</td>
                <td className="py-3 px-3 text-center">
                  {row.delta > 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <ArrowUpRight className="w-3 h-3" /> +{row.delta}
                    </span>
                  ) : row.delta < 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                      <ArrowDownRight className="w-3 h-3" /> {row.delta}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded-full">
                      <Minus className="w-3 h-3" /> 0
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-slate-300">{row.volume}</td>
                <td className="py-3 px-3">
                  <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                    {row.intent}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
