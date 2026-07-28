import { supabase, isSupabaseConfigured, localDb } from '../config/db.js';
import { ai, GEMINI_MODEL } from '../config/gemini.js';

export async function ingestSignal(req, res) {
  try {
    const userId = req.user.id;
    const { competitor_id, domain_category, source_url, raw_data } = req.body;

    let insertedSignal;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('intelligence_signals')
        .insert([{
          competitor_id,
          user_id: userId,
          domain_category,
          source_url: source_url || '',
          raw_data
        }])
        .select()
        .single();

      if (error) throw error;
      insertedSignal = data;

      // If domain_category is pricing, automatically populate pricing_logs
      if (domain_category === 'pricing' && raw_data.plan_name && raw_data.price !== undefined) {
        await supabase.from('pricing_logs').insert([{
          competitor_id,
          plan_name: raw_data.plan_name,
          price: Number(raw_data.price),
          currency: raw_data.currency || 'USD',
          billing_cycle: raw_data.billing_cycle || 'monthly',
          features: Array.isArray(raw_data.features) ? raw_data.features : [],
          is_promotional: Boolean(raw_data.is_promotional)
        }]);
      }
    } else {
      // Local DB fallback
      insertedSignal = {
        id: `sig-${Date.now()}`,
        competitor_id,
        user_id: userId,
        domain_category,
        source_url: source_url || '',
        raw_data,
        captured_at: new Date().toISOString()
      };
      localDb.intelligence_signals.unshift(insertedSignal);

      if (domain_category === 'pricing' && raw_data.plan_name && raw_data.price !== undefined) {
        localDb.pricing_logs.unshift({
          id: `p-${Date.now()}`,
          competitor_id,
          plan_name: raw_data.plan_name,
          price: Number(raw_data.price),
          currency: raw_data.currency || 'USD',
          billing_cycle: raw_data.billing_cycle || 'monthly',
          features: Array.isArray(raw_data.features) ? raw_data.features : [],
          is_promotional: Boolean(raw_data.is_promotional),
          logged_at: new Date().toISOString()
        });
      }
    }

    // Automated Anomaly / Alert Check
    let triggeredAlert = null;
    try {
      const competitorName = localDb.competitors.find(c => c.id === competitor_id)?.name || 'Tracked Competitor';

      if (ai) {
        const prompt = `Analyze this newly ingested marketing signal for competitor '${competitorName}':
Category: ${domain_category}
Raw Signal Payload: ${JSON.stringify(raw_data)}

Determine if this signal represents a notable market shift or threat requiring an immediate alert.
`;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            systemInstruction: "You are MarketIntel-AI. Analyze market signals for threats.",
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                requires_alert: { type: "BOOLEAN" },
                severity: { type: "STRING", enum: ["low", "medium", "high", "critical"] },
                alert_title: { type: "STRING" },
                alert_message: { type: "STRING" }
              },
              required: ["requires_alert", "severity", "alert_title", "alert_message"]
            }
          }
        });

        const result = JSON.parse(response.text);
        if (result.requires_alert) {
          triggeredAlert = {
            id: `alt-${Date.now()}`,
            user_id: userId,
            competitor_id,
            severity: result.severity,
            title: result.alert_title,
            message: result.alert_message,
            is_read: false,
            created_at: new Date().toISOString()
          };

          if (isSupabaseConfigured) {
            await supabase.from('alerts').insert([{
              user_id: userId,
              competitor_id,
              severity: result.severity,
              title: result.alert_title,
              message: result.alert_message,
              is_read: false
            }]);
          } else {
            localDb.alerts.unshift(triggeredAlert);
          }
        }
      } else {
        // Simple heuristic alert trigger for fallback mode
        if (domain_category === 'pricing' && raw_data.is_promotional) {
          triggeredAlert = {
            id: `alt-${Date.now()}`,
            user_id: userId,
            competitor_id,
            severity: 'high',
            title: `Promotional Pricing Shift: ${competitorName}`,
            message: `${competitorName} introduced a promotional tier '${raw_data.plan_name}' at $${raw_data.price}.`,
            is_read: false,
            created_at: new Date().toISOString()
          };
          if (!isSupabaseConfigured) localDb.alerts.unshift(triggeredAlert);
        } else if (domain_category === 'seo' && raw_data.current_rank && raw_data.current_rank <= 3) {
          triggeredAlert = {
            id: `alt-${Date.now()}`,
            user_id: userId,
            competitor_id,
            severity: 'medium',
            title: `High SERP Rank Achieved: ${competitorName}`,
            message: `${competitorName} reached position #${raw_data.current_rank} for key term '${raw_data.target_keyword || 'SEO Target'}'.`,
            is_read: false,
            created_at: new Date().toISOString()
          };
          if (!isSupabaseConfigured) localDb.alerts.unshift(triggeredAlert);
        }
      }
    } catch (err) {
      console.error("Alert evaluation warning:", err.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Intelligence signal ingested successfully',
      data: insertedSignal,
      alert_triggered: triggeredAlert
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
