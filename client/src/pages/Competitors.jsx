import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  Globe, 
  Building2, 
  Tag, 
  AlertCircle
} from 'lucide-react';
import CompetitorCard from '../components/CompetitorCard';
import { getCompetitorsApi, createCompetitorApi, deleteCompetitorApi } from '../services/api';

export default function Competitors() {
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    industry: 'Enterprise SaaS',
    tier: 'primary',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchCompetitors = async () => {
    setLoading(true);
    try {
      const res = await getCompetitorsApi();
      if (res.success && Array.isArray(res.data)) {
        setCompetitors(res.data);
      }
    } catch {
      // Local fallback
      setCompetitors([
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'CyberScale Corp',
          domain: 'https://cyberscale.io',
          industry: 'Enterprise SaaS',
          tier: 'primary',
          notes: 'Aggressive pricing shift observed in Q2. Target key segment.',
          intelligence_signals: [1, 2, 3],
          pricing_logs: [1, 2],
          ai_insights: [{ summary: 'CyberScale Corp lowered Pro pricing by 33% and leaped to #2 rank for AI Agent terms.', threat_level: 'high' }]
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'Novus Dynamics',
          domain: 'https://novusdynamics.com',
          industry: 'Cloud Infrastructure',
          tier: 'secondary',
          notes: 'Focusing on developer-first marketing campaigns and open-source tooling.',
          intelligence_signals: [1],
          pricing_logs: [1]
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          name: 'Vanguard AI',
          domain: 'https://vanguard.ai',
          industry: 'Generative AI Tools',
          tier: 'emerging',
          notes: 'High organic growth on LinkedIn. Scaling ad spend rapidly.',
          intelligence_signals: [1, 2],
          pricing_logs: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');

    try {
      let formattedDomain = formData.domain;
      if (!/^https?:\/\//i.test(formattedDomain)) {
        formattedDomain = 'https://' + formattedDomain;
      }

      const res = await createCompetitorApi({
        ...formData,
        domain: formattedDomain
      });

      if (res.success) {
        setShowAddModal(false);
        setFormData({ name: '', domain: '', industry: 'Enterprise SaaS', tier: 'primary', notes: '' });
        fetchCompetitors();
      } else {
        setModalError(res.error || 'Failed to create competitor');
      }
    } catch (err) {
      setModalError(err.message || 'Error creating competitor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this competitor and all tracked signals?')) return;
    try {
      await deleteCompetitorApi(id);
      setCompetitors(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filteredCompetitors = competitors.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'all' || c.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Competitor Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage tracked competitor profiles, domains, tier designations, and telemetry logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Competitor</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search competitor name or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Tier Badges */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'primary', 'secondary', 'emerging'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedTier === t
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Competitors */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-xs">
          Loading competitor profiles...
        </div>
      ) : filteredCompetitors.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-300">No Competitors Found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Add Competitor" to start tracking website, pricing, SEO, and social signals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitors.map(comp => (
            <CompetitorCard key={comp.id} competitor={comp} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Add Competitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl w-full max-w-lg p-6 border border-slate-800 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Track New Competitor</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Competitor Brand Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. CyberScale Corp"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Domain URL</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="https://cyberscale.io"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Industry Sector</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Enterprise SaaS"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Competitor Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="primary">Primary Competitor</option>
                    <option value="secondary">Secondary Competitor</option>
                    <option value="emerging">Emerging Player</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Strategy Notes & Positioning</label>
                <textarea
                  rows="3"
                  placeholder="Key notes regarding their market positioning, core product, or aggressive tactics..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all mt-2"
              >
                {submitting ? 'Creating Competitor Profile...' : 'Save & Start Tracking'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
