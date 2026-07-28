import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Globe, 
  ExternalLink, 
  Sparkles, 
  Radio, 
  DollarSign, 
  ArrowLeft, 
  PlusCircle
} from 'lucide-react';
import BattlecardView from '../components/BattlecardView';
import { getCompetitorByIdApi, generateBattlecardApi } from '../services/api';

export default function CompetitorDetail() {
  const { id } = useParams();
  const [competitor, setCompetitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('battlecard');

  const fetchCompetitorDetails = async () => {
    setLoading(true);
    try {
      const res = await getCompetitorByIdApi(id);
      if (res.success && res.data) {
        setCompetitor(res.data);
      }
    } catch {
      // Local fallback
      setCompetitor({
        id,
        name: 'CyberScale Corp',
        domain: 'https://cyberscale.io',
        industry: 'Enterprise SaaS',
        tier: 'primary',
        notes: 'Aggressive pricing shift observed in Q2. Target key segment.',
        created_at: new Date().toISOString(),
        pricing_logs: [
          { id: 'p1', plan_name: 'Pro Tier', price: 199.00, billing_cycle: 'monthly', features: ['Unlimited Seats', '24/7 API'], is_promotional: true, logged_at: new Date().toISOString() },
          { id: 'p2', plan_name: 'Enterprise Ultra', price: 599.00, billing_cycle: 'monthly', features: ['Dedicated SLA', 'Custom AI Models'], is_promotional: false, logged_at: new Date().toISOString() }
        ],
        intelligence_signals: [
          { id: 's1', domain_category: 'pricing', source_url: 'https://cyberscale.io/pricing', raw_data: { plan_name: 'Pro Tier', old_price: 299, new_price: 199 }, captured_at: new Date().toISOString() },
          { id: 's2', domain_category: 'seo', source_url: 'https://cyberscale.io/ai', raw_data: { target_keyword: 'Autonomous AI Agent Platform', current_rank: 2, previous_rank: 14 }, captured_at: new Date().toISOString() }
        ],
        ai_insights: [
          {
            id: 'i1',
            summary: 'CyberScale Corp is slashing Pro prices by 33% while boosting organic search volume across AI agent keywords.',
            threat_level: 'high',
            strengths: ['High SERP rank velocity', 'Subsidized promotional tiers', 'Broad feature bundling'],
            weaknesses: ['Reduced margin buffer', 'Complex onboarding workflow', 'Potential legacy account churn'],
            actionable_counter_strategies: [
              'Launch targeted Google Search ad campaign highlighting zero-downtime SLA stability.',
              'Offer price-match guarantee + 3 months free dedicated onboarding for migrating CyberScale clients.'
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitorDetails();
  }, [id]);

  const handleRunBattlecard = async () => {
    setGenerating(true);
    try {
      const res = await generateBattlecardApi({
        competitorId: competitor.id,
        competitorName: competitor.name,
        domain: competitor.domain,
        signals: competitor.intelligence_signals,
        pricingHistory: competitor.pricing_logs
      });

      if (res.success && res.data) {
        setCompetitor(prev => ({
          ...prev,
          ai_insights: [res.data, ...(prev.ai_insights || [])]
        }));
        setActiveTab('battlecard');
      }
    } catch (err) {
      alert('Battlecard generation error: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500 text-xs">Loading competitor deep dive...</div>;
  }

  if (!competitor) {
    return <div className="text-center py-20 text-rose-400 text-xs">Competitor profile not found.</div>;
  }

  const latestBattlecard = competitor.ai_insights?.[0];

  return (
    <div className="space-y-6">
      
      {/* Back Link */}
      <Link to="/competitors" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 font-semibold transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </Link>

      {/* Profile Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30">
              {competitor.tier} Tier
            </span>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
              {competitor.industry}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white">{competitor.name}</h1>
          <a
            href={competitor.domain}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{competitor.domain}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/intelligence/ingest"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-800 flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            <span>Log Signal</span>
          </Link>
          <button
            onClick={handleRunBattlecard}
            disabled={generating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'Synthesizing Battlecard...' : 'Run Gemini Battlecard'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold gap-4">
        <button
          onClick={() => setActiveTab('battlecard')}
          className={`pb-3 transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'battlecard'
              ? 'border-indigo-500 text-indigo-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>AI Battlecard & Threats</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-3 transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'pricing'
              ? 'border-indigo-500 text-indigo-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Pricing Logs ({competitor.pricing_logs?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('signals')}
          className={`pb-3 transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'signals'
              ? 'border-indigo-500 text-indigo-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-indigo-400" />
          <span>Captured Signals ({competitor.intelligence_signals?.length || 0})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'battlecard' && (
        latestBattlecard ? (
          <BattlecardView battlecard={latestBattlecard} competitorName={competitor.name} />
        ) : (
          <div className="glass-panel p-10 rounded-2xl text-center text-slate-400 space-y-3">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
            <p className="text-sm font-bold text-white">No AI Battlecard Generated Yet</p>
            <button
              onClick={handleRunBattlecard}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md"
            >
              Generate Battlecard Now
            </button>
          </div>
        )
      )}

      {activeTab === 'pricing' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Pricing Movement Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Plan Name</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Cycle</th>
                  <th className="py-2.5 px-3">Promotional</th>
                  <th className="py-2.5 px-3">Included Features</th>
                  <th className="py-2.5 px-3">Logged Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {competitor.pricing_logs?.map(p => (
                  <tr key={p.id}>
                    <td className="py-3 px-3 font-bold text-white">{p.plan_name}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-400">${p.price} {p.currency}</td>
                    <td className="py-3 px-3 text-slate-300 capitalize">{p.billing_cycle}</td>
                    <td className="py-3 px-3">
                      {p.is_promotional ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded">PROMO</span>
                      ) : (
                        <span className="text-slate-500">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {Array.isArray(p.features) ? p.features.join(', ') : p.features}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(p.logged_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'signals' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Raw Market Signal Stream</h3>
          <div className="space-y-3">
            {competitor.intelligence_signals?.map(sig => (
              <div key={sig.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300">
                    {sig.domain_category}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(sig.captured_at).toLocaleString()}
                  </span>
                </div>
                {sig.source_url && (
                  <p className="text-[11px] text-indigo-400 truncate">Source: {sig.source_url}</p>
                )}
                <pre className="p-2 rounded bg-slate-950 text-[11px] text-slate-300 overflow-x-auto">
                  {JSON.stringify(sig.raw_data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
