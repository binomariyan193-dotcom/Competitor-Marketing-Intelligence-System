import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  Radio, 
  Bell, 
  BarChart3, 
  Sparkles, 
  LogOut, 
  PlusCircle,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAlertsApi } from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUnreadAlerts = async () => {
      try {
        const res = await getAlertsApi({ unreadOnly: 'true' });
        if (res.success && Array.isArray(res.data)) {
          setUnreadCount(res.data.length);
        }
      } catch {
        setUnreadCount(2);
      }
    };

    fetchUnreadAlerts();
    const interval = setInterval(fetchUnreadAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Competitors', path: '/competitors', icon: Users },
    { name: 'Signal Hub', path: '/intelligence/ingest', icon: Radio },
    { name: 'Threat Alerts', path: '/alerts', icon: Bell, badge: unreadCount },
    { name: 'Trends & Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Strategist', path: '/ai-strategist', icon: Sparkles }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                MarketIntel<span className="text-indigo-400 font-extrabold">.AI</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-indigo-400 font-semibold -mt-1">
                Competitive Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || (link.path !== '/dashboard' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[11px] font-bold bg-rose-500/90 text-white rounded-full animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-3">
            <Link
              to="/intelligence/ingest"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20 transition-all duration-150"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Signal</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-200 leading-none">{user?.full_name || 'Analyst'}</p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{user?.role || 'Chief Strategist'}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-slate-200">{user?.full_name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
