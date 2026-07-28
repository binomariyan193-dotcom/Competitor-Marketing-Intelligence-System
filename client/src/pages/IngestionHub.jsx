import React, { useState, useEffect } from 'react';
import { Radio, Sparkles, CheckCircle2 } from 'lucide-react';
import SignalIngestModal from '../components/SignalIngestModal';
import { getCompetitorsApi } from '../services/api';

export default function IngestionHub() {
  const [competitors, setCompetitors] = useState([]);
  const [recentSignal, setRecentSignal] = useState(null);

  useEffect(() => {
    const fetchComps = async () => {
      try {
        const res = await getCompetitorsApi();
        if (res.success && Array.isArray(res.data)) {
          setCompetitors(res.data);
        }
      } catch {
        setCompetitors([
          { id: '11111111-1111-1111-1111-111111111111', name: 'CyberScale Corp', domain: 'https://cyberscale.io' },
          { id: '22222222-2222-2222-2222-222222222222', name: 'Novus Dynamics', domain: 'https://novusdynamics.com' },
          { id: '33333333-3333-3333-3333-333333333333', name: 'Vanguard AI', domain: 'https://vanguard.ai' }
        ]);
      }
    };
    fetchComps();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/40 inline-flex items-center gap-1.5 mb-2">
            <Radio className="w-3.5 h-3.5" /> Signal Telemetry Receiver
          </span>
          <h1 className="text-2xl font-extrabold text-white">Multi-Domain Intelligence Ingestion Hub</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Log website modifications, SEO keyword jumps, ad copy, pricing shifts, and social campaigns.
          </p>
        </div>
      </div>

      {/* Main Signal Ingestion Component */}
      <SignalIngestModal 
        competitors={competitors} 
        onSignalIngested={(newSignal) => setRecentSignal(newSignal)} 
      />

      {/* Confirmation Card */}
      {recentSignal && (
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-bold">Latest Ingested Signal Processed</p>
              <p className="text-[11px] text-slate-400">
                Domain Category: <strong className="text-white uppercase">{recentSignal.domain_category}</strong> | ID: {recentSignal.id}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-purple-400 font-semibold">
            <Sparkles className="w-4 h-4" /> AI Telemetry Updated
          </span>
        </div>
      )}

    </div>
  );
}
