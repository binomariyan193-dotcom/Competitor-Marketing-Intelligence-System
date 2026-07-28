# Competitor Marketing Intelligence System

A full-stack, digital competitive intelligence platform built with **React.js**, **Node.js/Express**, **Supabase PostgreSQL**, and **Google Gemini API** (`@google/genai`).

---

## 🌟 Key Features

1. **Multi-Domain Market Signal Ingestion**:
   - **Website Content Tracking**: Extracted text changes, landing page rewrites, CTA shifts.
   - **SEO & Search Intelligence**: Rank jump trackers, keyword search volume, SERP intent.
   - **Social Media & Content Campaigns**: Post content, engagement metrics, campaign hashtags.
   - **Pricing & Promotion Intelligence**: Plan tier adjustments, promotional discount flags, included feature lists.
   - **Digital Advertising Trends**: Ad network monitoring, copy variations, target audience shifts.

2. **Gemini AI Strategic Engine (`@google/genai`)**:
   - Automated Battlecard Generation using `gemini-2.5-flash` with JSON Schema enforcement.
   - Strategic SWOT Analysis (Strengths, Weaknesses/Exploits).
   - Actionable Counter-Marketing Campaign Recommendations.
   - Anomaly & Threat Detection Engine.

3. **Supabase PostgreSQL & Row-Level Security (RLS)**:
   - Full DDL schema for `profiles`, `competitors`, `intelligence_signals`, `pricing_logs`, `ai_insights`, `alerts`.
   - Data isolation via Supabase RLS policies.

4. **Interactive Dashboard & Telemetry**:
   - Competitor Price Delta chart over time (Recharts).
   - Real-time Threat Alerts feed with severity filtering (Critical, High, Medium, Low).
   - SEO SERP rank shift grid with rank movement deltas.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18 or higher
- **npm** or **yarn**

---

### Step 1: Install Dependencies

#### Backend (`server/`)
```bash
cd server
npm install
```

#### Frontend (`client/`)
```bash
cd ../client
npm install
```

---

### Step 2: Environment Setup

#### Server `.env` (`server/.env`)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=super_secret_jwt_key_market_intel_2026
CLIENT_URL=http://localhost:5173
```

#### Client `.env` (`client/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

### Step 3: Supabase Database Migration
Execute `server/schema.sql` in the **Supabase SQL Editor** to establish all PostgreSQL tables, indexes, and Row-Level Security (RLS) policies.

---

### Step 4: Run Application

#### Terminal 1 - Backend Server
```bash
cd server
npm run dev
# Server runs at http://localhost:5000
```

#### Terminal 2 - Frontend Client
```bash
cd client
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new user profile | No |
| `POST` | `/api/v1/auth/login` | Authenticate user & issue JWT | No |
| `GET` | `/api/v1/competitors` | Fetch all tracked competitors | Yes |
| `POST` | `/api/v1/competitors` | Add competitor profile (Zod validated) | Yes |
| `GET` | `/api/v1/competitors/:id` | Fetch competitor deep dive details | Yes |
| `POST` | `/api/v1/signals/ingest` | Ingest intelligence signal | Yes |
| `POST` | `/api/v1/ai/generate-battlecard` | Call Gemini API for strategic battlecard | Yes |
| `POST` | `/api/v1/ai/analyze-anomaly` | Analyze anomaly risk score | Yes |
| `GET` | `/api/v1/alerts` | Fetch market threat feed | Yes |
| `PATCH` | `/api/v1/alerts/:id/read` | Mark threat alert as read | Yes |
| `GET` | `/api/v1/analytics/overview` | Aggregated dashboard telemetry | Yes |
