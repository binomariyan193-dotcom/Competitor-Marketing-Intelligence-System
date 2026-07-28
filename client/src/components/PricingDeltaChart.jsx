import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export default function PricingDeltaChart({ data }) {
  const chartData = data || [
    { date: 'Jan 2026', CyberScale: 299, Novus: 149, Vanguard: 199 },
    { date: 'Feb 2026', CyberScale: 299, Novus: 149, Vanguard: 189 },
    { date: 'Mar 2026', CyberScale: 279, Novus: 159, Vanguard: 179 },
    { date: 'Apr 2026', CyberScale: 249, Novus: 159, Vanguard: 169 },
    { date: 'May 2026', CyberScale: 219, Novus: 159, Vanguard: 159 },
    { date: 'Jun 2026', CyberScale: 199, Novus: 149, Vanguard: 149 }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Competitor Price Delta Tracker</h3>
          <p className="text-xs text-slate-400">Pro & Enterprise tier movements ($ USD / month)</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          6-Month Shift
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Line type="monotone" dataKey="CyberScale" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Novus" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Vanguard" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
