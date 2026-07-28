import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  CheckCheck, 
  ArrowUpRight
} from 'lucide-react';
import { markAlertReadApi } from '../services/api';

export default function AlertFeed({ alerts = [], onAlertRead }) {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [localAlerts, setLocalAlerts] = useState(alerts);

  React.useEffect(() => {
    setLocalAlerts(alerts);
  }, [alerts]);

  const handleMarkRead = async (id) => {
    try {
      await markAlertReadApi(id);
      setLocalAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
      if (onAlertRead) onAlertRead(id);
    } catch {
      setLocalAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return { label: 'CRITICAL', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40', icon: ShieldAlert };
      case 'high':
        return { label: 'HIGH', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', icon: AlertTriangle };
      case 'medium':
        return { label: 'MEDIUM', bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', icon: AlertTriangle };
      default:
        return { label: 'LOW', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/40', icon: CheckCircle };
    }
  };

  const filteredAlerts = localAlerts.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      {/* Header & Filter Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Market Threat Feed</h3>
            <p className="text-xs text-slate-400">Real-time alerts triggered by competitor shifts</p>
          </div>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'critical', 'high', 'medium'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filterSeverity === sev
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed Items */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No market threat alerts matching the selected filter.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const sevBadge = getSeverityBadge(alert.severity);
            const Icon = sevBadge.icon;
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all relative ${
                  !alert.is_read
                    ? 'bg-slate-900/90 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-80'
                }`}
              >
                {!alert.is_read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}

                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${sevBadge.bg}`}>
                      <Icon className="w-3 h-3" />
                      {sevBadge.label}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(alert.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {!alert.is_read && (
                    <button
                      onClick={() => handleMarkRead(alert.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white mb-1">{alert.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>

                {alert.competitor_id && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Competitor: <strong className="text-indigo-300">{alert.competitors?.name || 'Tracked Competitor'}</strong>
                    </span>
                    <Link
                      to={`/competitors/${alert.competitor_id}`}
                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      <span>Analyze Profile</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
