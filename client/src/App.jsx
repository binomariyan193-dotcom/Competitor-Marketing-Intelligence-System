import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Competitors from './pages/Competitors';
import CompetitorDetail from './pages/CompetitorDetail';
import IngestionHub from './pages/IngestionHub';
import AlertsPage from './pages/AlertsPage';
import Analytics from './pages/Analytics';
import AIStrategist from './pages/AIStrategist';

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400 text-xs font-semibold">
        Initializing Intelligence Workspace...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/competitors" element={<Competitors />} />
          <Route path="/competitors/:id" element={<CompetitorDetail />} />
          <Route path="/intelligence/ingest" element={<IngestionHub />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-strategist" element={<AIStrategist />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <footer className="glass-panel border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Competitor Marketing Intelligence System &copy; 2026 | Powered by Google Gemini API (`@google/genai`) & Supabase PostgreSQL
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}
