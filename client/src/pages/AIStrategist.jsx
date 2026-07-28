import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Building2, Globe, Send, ShieldAlert, Cpu } from 'lucide-react';
import BattlecardView from '../components/BattlecardView';
import { getCompetitorsApi, generateBattlecardApi } from '../services/api';

export default function AIStrategist() {
  const [searchParams] = useSearchParams();
  const initialCompId = searchParams.get('competitorId') || '';

  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState(initialCompId);
  const [customName, setCustomName] = useState('CyberScale Corp');
  const [customDomain, setCustomDomain] = useState('https://cyberscale.io');
  
  const [battlecard, setBattlecard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        const res = await getCompetitorsApi();
        if (res.success && Array.isArray(res.data)) {
          setCompetitors(res.data);
          if (!initialCompId && res.data.length > 0) {
            setSelectedCompetitorId(res.data[0].id);
          }
        }
      } catch {
        setCompetitors([
          { id: '11111111-1111-1111-1111-111111111111', name: 'CyberScale Corp', domain: 'https://cyberscale.io' },
          { id: '22222222-2222-2222-2222-222222222222', name: 'Novus Dynamics', domain: 'https://novusdynamics.com' },
          { id: '33333333-3333-3333-3333-333333333333', name: 'Vanguard AI', domain: 'https://vanguard.ai' }
        ]);
      }
    };
    fetchCompetitors();
  }, [initialCompId]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const targetComp = competitors.find(c => c.id === selectedCompetitorId);
    const competitorName = targetComp ? targetComp.name : customName;
    const domain = targetComp ? targetComp.domain : customDomain;

    try {
      const res = await generateBattlecardApi({
        competitorId: selectedCompetitorId || undefined,
        competitorName,
        domain
      });

      if (res.success && res.data) {
        setBattlecard(res.data);
      } else {
        setError(res.error || 'Battlecard generation failed');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with Gemini AI Strategist backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/40 inline-flex items-center gap-1.5 mb-2">
            <Cpu className="w-3.5 h-3.5" /> Google Gemini API (`gemini-2.5-flash`)
          </span>
          <h1 className="text-2xl font-extrabold text-white">AI Battlecard & Counter-Strategy Studio</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthesize market signals, pricing deltas, and SEO velocity into dynamic counter-marketing battlecards.
          </p>
        </div>
      </div>

      {/* Generator Control Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" /> Target Competitor Parameters
        </h3>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Tracked Competitor</label>
              <select
                value={selectedCompetitorId}
                onChange={(e) => setSelectedCompetitorId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Custom Brand Input --</option>
                {competitors.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.domain})</option>
                ))}
              </select>
            </div>

            {!selectedCompetitorId && (
              <>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Brand Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Domain URL</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </>
            )}

          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Consulting Gemini AI Strategist Engine...' : 'Run Gemini Battlecard Analysis'}</span>
          </button>
        </form>
      </div>

      {/* Generated Battlecard Output */}
      {battlecard && (
        <BattlecardView 
          battlecard={battlecard} 
          competitorName={competitors.find(c => c.id === selectedCompetitorId)?.name || customName} 
        />
      )}

    </div>
  );
}
