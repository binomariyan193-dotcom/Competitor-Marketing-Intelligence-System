import { supabase, isSupabaseConfigured, localDb } from '../config/db.js';

export async function getAlerts(req, res) {
  try {
    const userId = req.user.id;
    const { unreadOnly, severity } = req.query;

    if (isSupabaseConfigured) {
      let query = supabase
        .from('alerts')
        .select(`
          *,
          competitors(id, name, domain, tier)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (unreadOnly === 'true') {
        query = query.eq('is_read', false);
      }
      if (severity) {
        query = query.eq('severity', severity);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // Local DB fallback
    let alerts = localDb.alerts.filter(a => a.user_id === userId || !a.user_id);
    if (unreadOnly === 'true') {
      alerts = alerts.filter(a => !a.is_read);
    }
    if (severity) {
      alerts = alerts.filter(a => a.severity === severity);
    }

    const data = alerts.map(a => {
      const comp = localDb.competitors.find(c => c.id === a.competitor_id);
      return {
        ...a,
        competitors: comp ? { id: comp.id, name: comp.name, domain: comp.domain, tier: comp.tier } : null
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function markAlertRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // Local DB fallback
    const alert = localDb.alerts.find(a => a.id === id);
    if (alert) {
      alert.is_read = true;
    }

    return res.status(200).json({ success: true, message: 'Alert marked as read', data: alert });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function createAlert(req, res) {
  try {
    const userId = req.user.id;
    const { competitor_id, severity, title, message } = req.body;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('alerts')
        .insert([{
          user_id: userId,
          competitor_id,
          severity,
          title,
          message,
          is_read: false
        }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    const newAlert = {
      id: `alt-${Date.now()}`,
      user_id: userId,
      competitor_id,
      severity,
      title,
      message,
      is_read: false,
      created_at: new Date().toISOString()
    };
    localDb.alerts.unshift(newAlert);

    return res.status(201).json({ success: true, data: newAlert });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
