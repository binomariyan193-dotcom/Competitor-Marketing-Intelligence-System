import { supabase, isSupabaseConfigured, localDb } from '../config/db.js';

export async function getAnalyticsOverview(req, res) {
  try {
    const userId = req.user.id;

    let competitorsCount = 0;
    let signalsCount = 0;
    let unreadAlertsCount = 0;
    let criticalThreatsCount = 0;
    let recentSignals = [];
    let pricingHistory = [];
    let domainDistribution = { website: 0, seo: 0, social: 0, pricing: 0, advertising: 0 };
    let seoKeywords = [];

    if (isSupabaseConfigured) {
      const [
        { count: compCount },
        { count: sigCount, data: fetchedSigs },
        { count: unreadCount },
        { count: critCount },
        { data: fetchedPricing }
      ] = await Promise.all([
        supabase.from('competitors').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('intelligence_signals').select('*').eq('user_id', userId).order('captured_at', { ascending: false }).limit(20),
        supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_read', false),
        supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('severity', 'critical'),
        supabase.from('pricing_logs').select(`*, competitors(name)`).order('logged_at', { ascending: true })
      ]);

      competitorsCount = compCount || 0;
      signalsCount = sigCount || (fetchedSigs?.length || 0);
      unreadAlertsCount = unreadCount || 0;
      criticalThreatsCount = critCount || 0;
      recentSignals = fetchedSigs || [];
      pricingHistory = fetchedPricing || [];
    } else {
      competitorsCount = localDb.competitors.length;
      signalsCount = localDb.intelligence_signals.length;
      unreadAlertsCount = localDb.alerts.filter(a => !a.is_read).length;
      criticalThreatsCount = localDb.alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;
      recentSignals = localDb.intelligence_signals.slice(0, 10);
      pricingHistory = localDb.pricing_logs.map(p => {
        const comp = localDb.competitors.find(c => c.id === p.competitor_id);
        return { ...p, competitor_name: comp?.name || 'Competitor' };
      });
    }

    // Compute domain category counts
    recentSignals.forEach(sig => {
      if (domainDistribution[sig.domain_category] !== undefined) {
        domainDistribution[sig.domain_category]++;
      }
    });

    // Extract SEO Keyword performance samples
    seoKeywords = [
      { id: 1, competitor: 'CyberScale Corp', keyword: 'Autonomous AI Agent Platform', rank: 2, prevRank: 14, delta: +12, volume: '45,000/mo', intent: 'Commercial' },
      { id: 2, competitor: 'CyberScale Corp', keyword: 'Enterprise Marketing Automation', rank: 4, prevRank: 8, delta: +4, volume: '60,000/mo', intent: 'Transactional' },
      { id: 3, competitor: 'Novus Dynamics', keyword: 'Cloud Infrastructure Monitoring', rank: 1, prevRank: 1, delta: 0, volume: '110,000/mo', intent: 'Informational' },
      { id: 4, competitor: 'Vanguard AI', keyword: 'AI Battlecard Generator', rank: 3, prevRank: 19, delta: +16, volume: '22,000/mo', intent: 'Commercial' },
      { id: 5, competitor: 'Novus Dynamics', keyword: 'Kubernetes Telemetry Suite', rank: 6, prevRank: 3, delta: -3, volume: '18,500/mo', intent: 'Technical' }
    ];

    // Build timeline charts for Pricing Delta Comparison
    const timelineData = [
      { date: 'Jan 2026', CyberScale: 299, Novus: 149, Vanguard: 199 },
      { date: 'Feb 2026', CyberScale: 299, Novus: 149, Vanguard: 189 },
      { date: 'Mar 2026', CyberScale: 279, Novus: 159, Vanguard: 179 },
      { date: 'Apr 2026', CyberScale: 249, Novus: 159, Vanguard: 169 },
      { date: 'May 2026', CyberScale: 219, Novus: 159, Vanguard: 159 },
      { date: 'Jun 2026', CyberScale: 199, Novus: 149, Vanguard: 149 }
    ];

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalCompetitors: competitorsCount,
          totalSignals: signalsCount,
          unreadAlerts: unreadAlertsCount,
          criticalThreats: criticalThreatsCount
        },
        domainDistribution,
        timelineData,
        seoKeywords,
        pricingHistory,
        recentSignals
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
