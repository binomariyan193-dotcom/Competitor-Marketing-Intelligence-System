import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Search, Radio, DollarSign, Share2, Globe } from 'lucide-react';
import PricingDeltaChart from '../components/PricingDeltaChart';
import SEOKeywordsTable from '../components/SEOKeywordsTable';
import { getAnalyticsOverviewApi } from '../services/api';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalyticsOverviewApi();
        if (res.success) setData(res.data);
      } catch {
        setData({
          timelineData: [
            { date: 'Jan 2026', CyberScale: 299, Novus: 149, Vanguard: 199 },
            { date: 'Feb 2026', CyberScale: 299, Novus: 149, Vanguard: 189 },
            { date: 'Mar 2026', CyberScale: 279, Novus: 159, Vanguard: 179 },
            { date: 'Apr 2026', CyberScale: 249, Novus: 159, Vanguard: 169 },
            { date: 'May 2026', CyberScale: 219, Novus: 159, Vanguard: 159 },
            { date: 'Jun 2026', CyberScale: 199, Novus: 149, Vanguard: 149 }
          ],
          seoKeywords: [],
          domainDistribution: { website: 4, seo: 6, social: 3, pricing: 3, advertising: 2 }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const domainDist = data?.domainDistribution || { website: 4, seo: 6, social: 3, pricing: 3, advertising: 2 };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/40 inline-flex items-center gap-1.5 mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Market Telemetry & Trends
          </span>
          <h1 className="text-2xl font-extrabold text-white">Comparative Intelligence Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-competitor analysis of pricing trajectories, search Share-of-Voice, and campaign channel signals.
          </p>
        </div>
      </div>

      {/* Signal Distribution Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">SEO Signals</p>
            <p className="text-lg font-bold text-white">{domainDist.seo} Logs</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Pricing Logs</p>
            <p className="text-lg font-bold text-white">{domainDist.pricing} Logs</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Social Posts</p>
            <p className="text-lg font-bold text-white">{domainDist.social} Logs</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Web Changes</p>
            <p className="text-lg font-bold text-white">{domainDist.website} Logs</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Ad Trends</p>
            <p className="text-lg font-bold text-white">{domainDist.advertising} Logs</p>
          </div>
        </div>

      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <PricingDeltaChart data={data?.timelineData} />
        </div>
        <div className="lg:col-span-5">
          <SEOKeywordsTable keywords={data?.seoKeywords} />
        </div>
      </div>

    </div>
  );
}
