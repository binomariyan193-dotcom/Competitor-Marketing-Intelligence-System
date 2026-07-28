import React, { useState, useEffect } from 'react';
import { Bell, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import AlertFeed from '../components/AlertFeed';
import { getAlertsApi } from '../services/api';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await getAlertsApi();
      if (res.success && Array.isArray(res.data)) {
        setAlerts(res.data);
      }
    } catch {
      setAlerts([
        {
          id: 'a1',
          severity: 'high',
          title: 'Aggressive Price Drop Detected',
          message: 'CyberScale Corp lowered Pro Tier pricing from $299/mo to $199/mo (33% discount). Potential market share grab.',
          is_read: false,
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          competitors: { name: 'CyberScale Corp', domain: 'https://cyberscale.io' }
        },
        {
          id: 'a2',
          severity: 'medium',
          title: 'New Social Ad Blitz Launched',
          message: 'Vanguard AI launched a multi-channel video campaign on LinkedIn targeting VP of Marketing roles.',
          is_read: false,
          created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
          competitors: { name: 'Vanguard AI', domain: 'https://vanguard.ai' }
        },
        {
          id: 'a3',
          severity: 'critical',
          title: 'SEO Surge: Top 3 SERP Position Gained',
          message: 'CyberScale Corp jumped from #14 to #2 for high-intent keyword "Autonomous AI Agent Platform".',
          is_read: true,
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          competitors: { name: 'CyberScale Corp', domain: 'https://cyberscale.io' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800/40 inline-flex items-center gap-1.5 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Threat Alert Center
          </span>
          <h1 className="text-2xl font-extrabold text-white">Market Threat Alerts</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated alerts triggered by Gemini AI analysis of competitor pricing drops, SERP surges, and campaign blitzen.
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Alert Feed Component */}
      <AlertFeed alerts={alerts} onAlertRead={() => fetchAlerts()} />

    </div>
  );
}
