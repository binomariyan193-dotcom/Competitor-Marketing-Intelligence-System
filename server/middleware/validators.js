import { z } from 'zod';

export const CompetitorSchema = z.object({
  name: z.string().min(2, "Competitor name must be at least 2 characters"),
  domain: z.string().url("Must provide a valid domain URL (e.g., https://competitor.com)"),
  industry: z.string().min(2, "Industry is required"),
  tier: z.enum(['primary', 'secondary', 'emerging']),
  notes: z.string().optional().default('')
});

export const SignalIngestionSchema = z.object({
  competitor_id: z.string().uuid("Invalid UUID format for competitor_id"),
  domain_category: z.enum(['website', 'seo', 'social', 'pricing', 'advertising']),
  source_url: z.string().url().optional().or(z.literal('')),
  raw_data: z.record(z.any(), { message: "Raw data must be a valid JSON object" })
});

export const PricingLogSchema = z.object({
  competitor_id: z.string().uuid("Invalid UUID format for competitor_id"),
  plan_name: z.string().min(1, "Plan name is required"),
  price: z.number().positive("Price must be a positive number"),
  currency: z.string().length(3).default("USD"),
  billing_cycle: z.enum(['monthly', 'annually', 'one_time']),
  features: z.array(z.string()).default([]),
  is_promotional: z.boolean().default(false)
});

export const AuthRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Full name is required"),
  company_name: z.string().optional()
});

export const AuthLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
