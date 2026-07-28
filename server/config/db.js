import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'demo_key';

export const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_URL !== 'https://demo.supabase.co' &&
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  process.env.SUPABASE_SERVICE_ROLE_KEY !== 'demo_service_role_key'
);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

// In-Memory fallback store for high-reliability local execution when database is not connected
export const localDb = {
  profiles: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      full_name: 'Demo Analyst',
      company_name: 'Apex Strategy Inc',
      role: 'Chief Intelligence Officer',
      created_at: new Date().toISOString()
    }
  ],
  competitors: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      user_id: '00000000-0000-0000-0000-000000000001',
      name: 'CyberScale Corp',
      domain: 'https://cyberscale.io',
      industry: 'Enterprise SaaS',
      tier: 'primary',
      notes: 'Aggressive pricing shift observed in Q2. Target key segment.',
      created_at: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      user_id: '00000000-0000-0000-0000-000000000001',
      name: 'Novus Dynamics',
      domain: 'https://novusdynamics.com',
      industry: 'Cloud Infrastructure',
      tier: 'secondary',
      notes: 'Focusing on developer-first marketing campaigns and open-source tooling.',
      created_at: new Date(Date.now() - 14 * 86400000).toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      user_id: '00000000-0000-0000-0000-000000000001',
      name: 'Vanguard AI',
      domain: 'https://vanguard.ai',
      industry: 'Generative AI Tools',
      tier: 'emerging',
      notes: 'High organic growth on LinkedIn. Scaling ad spend rapidly.',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ],
  intelligence_signals: [
    {
      id: 's1111111-1111-1111-1111-111111111111',
      competitor_id: '11111111-1111-1111-1111-111111111111',
      user_id: '00000000-0000-0000-0000-000000000001',
      domain_category: 'pricing',
      source_url: 'https://cyberscale.io/pricing',
      raw_data: { plan_name: 'Enterprise Pro', old_price: 299, new_price: 199, discount_flag: true },
      captured_at: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 's2222222-2222-2222-2222-222222222222',
      competitor_id: '11111111-1111-1111-1111-111111111111',
      user_id: '00000000-0000-0000-0000-000000000001',
      domain_category: 'seo',
      source_url: 'https://cyberscale.io/features/ai-agent',
      raw_data: { target_keyword: 'Autonomous AI Agent Platform', current_rank: 2, previous_rank: 14, search_volume: 45000 },
      captured_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 's3333333-3333-3333-3333-333333333333',
      competitor_id: '33333333-3333-3333-3333-333333333333',
      user_id: '00000000-0000-0000-0000-000000000001',
      domain_category: 'advertising',
      source_url: 'https://linkedin.com/ads/vanguard',
      raw_data: { ad_network: 'LinkedIn', headline: 'Replace Your Marketing Ops with AI', visual_type: 'Video Demo', target_demographics: 'VP Marketing' },
      captured_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ],
  pricing_logs: [
    {
      id: 'p1111111-1111-1111-1111-111111111111',
      competitor_id: '11111111-1111-1111-1111-111111111111',
      plan_name: 'Pro Tier',
      price: 199.00,
      currency: 'USD',
      billing_cycle: 'monthly',
      features: ['Unlimited seats', 'AI battlecards', '24/7 API sync'],
      is_promotional: true,
      logged_at: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'p2222222-2222-2222-2222-222222222222',
      competitor_id: '11111111-1111-1111-1111-111111111111',
      plan_name: 'Pro Tier',
      price: 299.00,
      currency: 'USD',
      billing_cycle: 'monthly',
      features: ['Unlimited seats', '24/7 API sync'],
      is_promotional: false,
      logged_at: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
      id: 'p3333333-3333-3333-3333-333333333333',
      competitor_id: '22222222-2222-2222-2222-222222222222',
      plan_name: 'Growth Plan',
      price: 149.00,
      currency: 'USD',
      billing_cycle: 'monthly',
      features: ['5 Team Seats', 'Custom Reports'],
      is_promotional: false,
      logged_at: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ],
  ai_insights: [
    {
      id: 'i1111111-1111-1111-1111-111111111111',
      competitor_id: '11111111-1111-1111-1111-111111111111',
      user_id: '00000000-0000-0000-0000-000000000001',
      summary: 'CyberScale Corp slashed Pro prices by 33% to capture mid-market accounts while aggressively ranking for "Autonomous AI Agent Platform" keywords.',
      strengths: ['High SERP velocity', 'Aggressive pricing undercut', 'Strong enterprise compliance badges'],
      weaknesses: ['Reduced margin buffer', 'Uncertain SLA on new AI agent features', 'User churn on legacy tier'],
      threat_level: 'high',
      actionable_counter_strategies: [
        'Launch targeted Google Search ad campaign highlighting zero-downtime SLA stability.',
        'Offer price-match guarantee + 3 months free dedicated onboarding for migrating CyberScale clients.',
        'Publish comparison landing page directly targeting "Autonomous AI Agent Platform" SEO intent.'
      ],
      raw_llm_response: {},
      generated_at: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ],
  alerts: [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      user_id: '00000000-0000-0000-0000-000000000001',
      competitor_id: '11111111-1111-1111-1111-111111111111',
      severity: 'high',
      title: 'Aggressive Price Drop Detected',
      message: 'CyberScale Corp lowered Pro Tier pricing from $299/mo to $199/mo (33% discount). Potential market share grab.',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'a2222222-2222-2222-2222-222222222222',
      user_id: '00000000-0000-0000-0000-000000000001',
      competitor_id: '33333333-3333-3333-3333-333333333333',
      severity: 'medium',
      title: 'New Social Ad Blitz Launched',
      message: 'Vanguard AI launched a multi-channel video campaign on LinkedIn targeting VP of Marketing roles.',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'a3333333-3333-3333-3333-333333333333',
      user_id: '00000000-0000-0000-0000-000000000001',
      competitor_id: '11111111-1111-1111-1111-111111111111',
      severity: 'critical',
      title: 'SEO Surge: Top 3 SERP Position Gained',
      message: 'CyberScale Corp jumped from #14 to #2 for high-intent keyword "Autonomous AI Agent Platform".',
      is_read: true,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]
};
