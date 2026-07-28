-- SUPABASE CLOUD POSTGRESQL INITIAL MIGRATION (001_initial_schema.sql)

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  company_name TEXT,
  role TEXT DEFAULT 'analyst',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMPETITORS TABLE
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  industry TEXT,
  tier TEXT CHECK (tier IN ('primary', 'secondary', 'emerging')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INTELLIGENCE SIGNALS TABLE
CREATE TABLE IF NOT EXISTS public.intelligence_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  domain_category TEXT NOT NULL CHECK (domain_category IN ('website', 'seo', 'social', 'pricing', 'advertising')),
  source_url TEXT,
  raw_data JSONB NOT NULL,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COMPETITOR PRICING LOGS
CREATE TABLE IF NOT EXISTS public.pricing_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annually', 'one_time')),
  features JSONB DEFAULT '[]'::jsonb,
  is_promotional BOOLEAN DEFAULT false,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI GENERATED BATTLECARDS & INSIGHTS
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  threat_level TEXT CHECK (threat_level IN ('low', 'medium', 'high', 'critical')),
  actionable_counter_strategies TEXT[] DEFAULT '{}',
  raw_llm_response JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SYSTEM ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES public.competitors(id) ON DELETE CASCADE,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_competitors_user ON public.competitors(user_id);
CREATE INDEX IF NOT EXISTS idx_signals_competitor ON public.intelligence_signals(competitor_id);
CREATE INDEX IF NOT EXISTS idx_pricing_competitor ON public.pricing_logs(competitor_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_read ON public.alerts(user_id, is_read);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- POLICIES FOR COMPETITORS
DROP POLICY IF EXISTS "Users manage own competitors" ON public.competitors;
CREATE POLICY "Users manage own competitors" ON public.competitors FOR ALL USING (auth.uid() = user_id);

-- POLICIES FOR INTELLIGENCE SIGNALS
DROP POLICY IF EXISTS "Users manage own signals" ON public.intelligence_signals;
CREATE POLICY "Users manage own signals" ON public.intelligence_signals FOR ALL USING (auth.uid() = user_id);

-- POLICIES FOR PRICING LOGS
DROP POLICY IF EXISTS "Users view competitor pricing" ON public.pricing_logs;
CREATE POLICY "Users view competitor pricing" ON public.pricing_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.competitors WHERE public.competitors.id = public.pricing_logs.competitor_id AND public.competitors.user_id = auth.uid())
);

-- POLICIES FOR AI INSIGHTS
DROP POLICY IF EXISTS "Users manage own insights" ON public.ai_insights;
CREATE POLICY "Users manage own insights" ON public.ai_insights FOR ALL USING (auth.uid() = user_id);

-- POLICIES FOR ALERTS
DROP POLICY IF EXISTS "Users manage own alerts" ON public.alerts;
CREATE POLICY "Users manage own alerts" ON public.alerts FOR ALL USING (auth.uid() = user_id);

-- 8. SEED DATA (Demo User, Competitors, Pricing, Signals & Alerts)

-- Step 8A: Seed auth.users first to satisfy foreign key constraint profiles_id_fkey
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'analyst@marketintel.ai',
  '$2a$10$7EqJtq98hPqEX7fNZaFWoO9tJ7x0J6z1iW/1n4x8J8k/6O7Z1l9e2',
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo Analyst","company_name":"Apex Strategy Inc","role":"analyst"}',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Step 8B: Seed public.profiles
INSERT INTO public.profiles (id, full_name, company_name, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Analyst', 'Apex Strategy Inc', 'Chief Intelligence Officer')
ON CONFLICT (id) DO NOTHING;

-- Step 8C: Seed Competitors
INSERT INTO public.competitors (id, user_id, name, domain, industry, tier, notes)
VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'CyberScale Corp', 'https://cyberscale.io', 'Enterprise SaaS', 'primary', 'Aggressive pricing shift observed in Q2.'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'Novus Dynamics', 'https://novusdynamics.com', 'Cloud Infrastructure', 'secondary', 'Developer-first marketing campaigns.'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'Vanguard AI', 'https://vanguard.ai', 'Generative AI Tools', 'emerging', 'High organic growth on LinkedIn.')
ON CONFLICT (id) DO NOTHING;

-- Step 8D: Seed Pricing Logs
INSERT INTO public.pricing_logs (id, competitor_id, plan_name, price, currency, billing_cycle, features, is_promotional)
VALUES
  ('f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Pro Tier', 199.00, 'USD', 'monthly', '["Unlimited seats", "AI battlecards", "24/7 API sync"]'::jsonb, true),
  ('f2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Pro Tier', 299.00, 'USD', 'monthly', '["Unlimited seats", "24/7 API sync"]'::jsonb, false),
  ('f3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Growth Plan', 149.00, 'USD', 'monthly', '["5 Team Seats", "Custom Reports"]'::jsonb, false)
ON CONFLICT (id) DO NOTHING;

-- Step 8E: Seed System Alerts
INSERT INTO public.alerts (id, user_id, competitor_id, severity, title, message, is_read)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'high', 'Aggressive Price Drop Detected', 'CyberScale Corp lowered Pro Tier pricing from $299/mo to $199/mo.', false),
  ('a2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'medium', 'New Social Ad Blitz Launched', 'Vanguard AI launched video campaign on LinkedIn.', false),
  ('a3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'critical', 'SEO Surge: Top 3 SERP Rank', 'CyberScale Corp jumped to #2 for "Autonomous AI Agent Platform".', true)
ON CONFLICT (id) DO NOTHING;
