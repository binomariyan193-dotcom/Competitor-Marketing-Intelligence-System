import { supabase, isSupabaseConfigured, localDb } from '../config/db.js';

export async function getCompetitors(req, res) {
  try {
    const userId = req.user.id;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('competitors')
        .select(`
          *,
          intelligence_signals(id, domain_category, captured_at),
          pricing_logs(id, plan_name, price, currency, logged_at),
          ai_insights(id, threat_level, summary, generated_at)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // Local DB fallback
    const competitors = localDb.competitors.map(comp => {
      const signals = localDb.intelligence_signals.filter(s => s.competitor_id === comp.id);
      const pricing = localDb.pricing_logs.filter(p => p.competitor_id === comp.id);
      const insights = localDb.ai_insights.filter(i => i.competitor_id === comp.id);
      return {
        ...comp,
        intelligence_signals: signals,
        pricing_logs: pricing,
        ai_insights: insights
      };
    });

    return res.status(200).json({ success: true, data: competitors });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getCompetitorById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isSupabaseConfigured) {
      const { data: competitor, error: compErr } = await supabase
        .from('competitors')
        .select('*')
        .eq('id', id)
        .single();

      if (compErr || !competitor) {
        return res.status(404).json({ success: false, error: 'Competitor not found' });
      }

      const [{ data: signals }, { data: pricing }, { data: insights }, { data: alerts }] = await Promise.all([
        supabase.from('intelligence_signals').select('*').eq('competitor_id', id).order('captured_at', { ascending: false }),
        supabase.from('pricing_logs').select('*').eq('competitor_id', id).order('logged_at', { ascending: false }),
        supabase.from('ai_insights').select('*').eq('competitor_id', id).order('generated_at', { ascending: false }),
        supabase.from('alerts').select('*').eq('competitor_id', id).order('created_at', { ascending: false })
      ]);

      return res.status(200).json({
        success: true,
        data: {
          ...competitor,
          intelligence_signals: signals || [],
          pricing_logs: pricing || [],
          ai_insights: insights || [],
          alerts: alerts || []
        }
      });
    }

    // Local DB fallback
    const competitor = localDb.competitors.find(c => c.id === id);
    if (!competitor) {
      return res.status(404).json({ success: false, error: 'Competitor not found' });
    }

    const signals = localDb.intelligence_signals.filter(s => s.competitor_id === id);
    const pricing = localDb.pricing_logs.filter(p => p.competitor_id === id);
    const insights = localDb.ai_insights.filter(i => i.competitor_id === id);
    const alerts = localDb.alerts.filter(a => a.competitor_id === id);

    return res.status(200).json({
      success: true,
      data: {
        ...competitor,
        intelligence_signals: signals,
        pricing_logs: pricing,
        ai_insights: insights,
        alerts
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function createCompetitor(req, res) {
  try {
    const userId = req.user.id;
    const { name, domain, industry, tier, notes } = req.body;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('competitors')
        .insert([{ user_id: userId, name, domain, industry, tier, notes }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    // Local DB fallback
    const newComp = {
      id: `c-${Date.now()}`,
      user_id: userId,
      name,
      domain,
      industry,
      tier,
      notes: notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localDb.competitors.unshift(newComp);

    return res.status(201).json({ success: true, data: newComp });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateCompetitor(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, domain, industry, tier, notes } = req.body;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('competitors')
        .update({ name, domain, industry, tier, notes, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // Local DB fallback
    const index = localDb.competitors.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Competitor not found' });
    }

    localDb.competitors[index] = {
      ...localDb.competitors[index],
      name,
      domain,
      industry,
      tier,
      notes: notes || '',
      updated_at: new Date().toISOString()
    };

    return res.status(200).json({ success: true, data: localDb.competitors[index] });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteCompetitor(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('competitors')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Competitor deleted successfully' });
    }

    // Local DB fallback
    localDb.competitors = localDb.competitors.filter(c => c.id !== id);
    localDb.intelligence_signals = localDb.intelligence_signals.filter(s => s.competitor_id !== id);
    localDb.pricing_logs = localDb.pricing_logs.filter(p => p.competitor_id !== id);
    localDb.ai_insights = localDb.ai_insights.filter(i => i.competitor_id !== id);
    localDb.alerts = localDb.alerts.filter(a => a.competitor_id !== id);

    return res.status(200).json({ success: true, message: 'Competitor deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
