import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Share2, 
  DollarSign, 
  Megaphone, 
  Send, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { ingestSignalApi } from '../services/api';

export default function SignalIngestModal({ competitors = [], onSignalIngested }) {
  const [selectedCategory, setSelectedCategory] = useState('seo');
  const [competitorId, setCompetitorId] = useState(competitors[0]?.id || '');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Dynamic Domain Fields State
  const [seoData, setSeoData] = useState({ target_keyword: '', current_rank: 1, previous_rank: 10, search_volume: 25000 });
  const [pricingData, setPricingData] = useState({ plan_name: 'Pro Tier', price: 199, currency: 'USD', billing_cycle: 'monthly', features: 'Unlimited Seats, AI Insights, 24/7 API', is_promotional: false });
  const [adData, setAdData] = useState({ ad_network: 'LinkedIn', headline: '', visual_type: 'Video Demo', target_demographics: 'VP Marketing', cta_text: 'Get Free Trial' });
  const [socialData, setSocialData] = useState({ platform: 'LinkedIn', post_content: '', likes: 350, shares: 45, comments: 22, campaign_hashtag: '#AIAutomation' });
  const [websiteData, setWebsiteData] = useState({ shift_type: 'Feature launch', summary_text: '' });

  const categories = [
    { id: 'seo', name: 'SEO & Search', icon: Search, desc: 'Rank jumps & keyword shifts' },
    { id: 'pricing', name: 'Pricing & Plans', icon: DollarSign, desc: 'Tier changes & promotions' },
    { id: 'advertising', name: 'Digital Ads', icon: Megaphone, desc: 'Ad campaigns & creative' },
    { id: 'social', name: 'Social Campaigns', icon: Share2, desc: 'Viral posts & engagement' },
    { id: 'website', name: 'Website Updates', icon: Globe, desc: 'Copy rewrites & landing pages' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    let raw_data = {};
    if (selectedCategory === 'seo') raw_data = seoData;
    else if (selectedCategory === 'pricing') {
      raw_data = {
        ...pricingData,
        price: Number(pricingData.price),
        features: typeof pricingData.features === 'string' ? pricingData.features.split(',').map(f => f.trim()) : pricingData.features
      };
    }
    else if (selectedCategory === 'advertising') raw_data = adData;
    else if (selectedCategory === 'social') raw_data = socialData;
    else if (selectedCategory === 'website') raw_data = websiteData;

    try {
      const payload = {
        competitor_id: competitorId || competitors[0]?.id,
        domain_category: selectedCategory,
        source_url: sourceUrl || undefined,
        raw_data
      };

      const res = await ingestSignalApi(payload);

      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Signal successfully ingested into Supabase intelligence store!',
          alert: res.alert_triggered
        });
        if (onSignalIngested) onSignalIngested(res.data);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Ingestion failed' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Signal ingestion failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      {/* Category Tabs */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          1. Select Intelligence Signal Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                <p className="text-xs font-bold leading-none">{cat.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{cat.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Competitor & Source URL selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Competitor</label>
            <select
              value={competitorId}
              onChange={(e) => setCompetitorId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">-- Select Competitor --</option>
              {competitors.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.domain})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Source URL (Optional)</label>
            <input
              type="url"
              placeholder="https://competitor.com/pricing"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Dynamic Category Forms */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            2. Enter {categories.find(c => c.id === selectedCategory)?.name} Signal Telemetry
          </h4>

          {selectedCategory === 'seo' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise AI Marketing"
                  value={seoData.target_keyword}
                  onChange={(e) => setSeoData({ ...seoData, target_keyword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Search Volume / Mo</label>
                <input
                  type="number"
                  value={seoData.search_volume}
                  onChange={(e) => setSeoData({ ...seoData, search_volume: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Current Rank</label>
                <input
                  type="number"
                  min="1"
                  value={seoData.current_rank}
                  onChange={(e) => setSeoData({ ...seoData, current_rank: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Previous Rank</label>
                <input
                  type="number"
                  min="1"
                  value={seoData.previous_rank}
                  onChange={(e) => setSeoData({ ...seoData, previous_rank: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          )}

          {selectedCategory === 'pricing' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. Growth Tier"
                  value={pricingData.plan_name}
                  onChange={(e) => setPricingData({ ...pricingData, plan_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Price Amount ($)</label>
                <input
                  type="number"
                  value={pricingData.price}
                  onChange={(e) => setPricingData({ ...pricingData, price: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Billing Cycle</label>
                <select
                  value={pricingData.billing_cycle}
                  onChange={(e) => setPricingData({ ...pricingData, billing_cycle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="annually">Annually</option>
                  <option value="one_time">One Time</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="promo"
                  checked={pricingData.is_promotional}
                  onChange={(e) => setPricingData({ ...pricingData, is_promotional: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-500"
                />
                <label htmlFor="promo" className="text-slate-300 font-semibold cursor-pointer">Promotional / Discount Flag</label>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Included Features (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="API Access, 24/7 Support, Custom Models"
                  value={pricingData.features}
                  onChange={(e) => setPricingData({ ...pricingData, features: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          )}

          {selectedCategory === 'advertising' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Ad Network</label>
                <select
                  value={adData.ad_network}
                  onChange={(e) => setAdData({ ...adData, ad_network: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  <option value="Google">Google Search/Display</option>
                  <option value="LinkedIn">LinkedIn Ads</option>
                  <option value="Meta">Meta (Facebook/IG)</option>
                  <option value="YouTube">YouTube Video</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Visual Format</label>
                <input
                  type="text"
                  placeholder="e.g. Carousel, Video Demo"
                  value={adData.visual_type}
                  onChange={(e) => setAdData({ ...adData, visual_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Ad Headline / Copy</label>
                <input
                  type="text"
                  placeholder="e.g. Cut Your Marketing Ops Costs in Half"
                  value={adData.headline}
                  onChange={(e) => setAdData({ ...adData, headline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
            </div>
          )}

          {selectedCategory === 'social' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Platform</label>
                <input
                  type="text"
                  value={socialData.platform}
                  onChange={(e) => setSocialData({ ...socialData, platform: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Hashtag / Campaign</label>
                <input
                  type="text"
                  value={socialData.campaign_hashtag}
                  onChange={(e) => setSocialData({ ...socialData, campaign_hashtag: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Post Content Summary</label>
                <textarea
                  rows="2"
                  placeholder="Announcing our new generative battlecard module..."
                  value={socialData.post_content}
                  onChange={(e) => setSocialData({ ...socialData, post_content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
            </div>
          )}

          {selectedCategory === 'website' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Shift Type</label>
                <select
                  value={websiteData.shift_type}
                  onChange={(e) => setWebsiteData({ ...websiteData, shift_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  <option value="Feature launch">Feature Launch / Product Update</option>
                  <option value="Copy rewrite">Homepage / Landing Page Copy Rewrite</option>
                  <option value="CTA change">CTA / Conversion Funnel Adjustment</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Extracted Text / HTML Modification Summary</label>
                <textarea
                  rows="3"
                  placeholder="Updated primary hero headline from 'SaaS Analytics' to 'Autonomous AI Intelligence Engine'."
                  value={websiteData.summary_text}
                  onChange={(e) => setWebsiteData({ ...websiteData, summary_text: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
            </div>
          )}

        </div>

        {/* Status Alerts */}
        {feedback && (
          <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
            feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <div>
              <p className="font-bold">{feedback.message}</p>
              {feedback.alert && (
                <p className="text-[11px] text-amber-300 mt-1">
                  🚨 <strong>Automated Alert Generated:</strong> {feedback.alert.title}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? 'Ingesting & Analyzing Signal...' : 'Ingest Signal Telemetry'}</span>
        </button>

      </form>
    </div>
  );
}
