import React from 'react';
import { 
  Wrench, 
  Car, 
  Calendar, 
  Activity, 
  Receipt, 
  ShieldCheck, 
  UserCheck, 
  Radio, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { DEMO_USERS } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, currentUser, setCurrentUser }) {
  const switchRole = (roleKey) => {
    const user = DEMO_USERS[roleKey];
    setCurrentUser(user);
    localStorage.setItem('apex_user', JSON.stringify(user));
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gunmetal-900/85 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Automotive Emblem */}
          <div 
            onClick={() => setActiveTab('hero')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 via-gunmetal-850 to-slate-900 p-[1px] shadow-lg shadow-black/60 group-hover:shadow-neon-blue/20 transition-all duration-300">
              <div className="w-full h-full bg-gunmetal-950 rounded-[11px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Wrench className="w-5 h-5 text-slate-300 group-hover:text-neon-blue transition-colors duration-300 transform group-hover:rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-xl tracking-wider text-white">
                  APEX <span className="text-neon-sky">MOTORWERKS</span>
                </span>
                <span className="text-[10px] tracking-widest font-mono uppercase bg-slate-800/90 text-silver px-2 py-0.5 rounded border border-slate-700">
                  GT SUITE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Bespoke Garage &amp; Telemetry Management
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-gunmetal-950/70 p-1.5 rounded-2xl border border-slate-800/70">
            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'hero'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md border border-slate-600/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Car className="w-4 h-4 text-silver" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('booking')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'booking'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md border border-slate-600/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Calendar className="w-4 h-4 text-neon-sky" />
              <span>Book Service</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all relative ${
                activeTab === 'tracker'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md border border-slate-600/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Activity className="w-4 h-4 text-neon-blue" />
              <span>Live Tracker</span>
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveTab('bill')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'bill'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md border border-slate-600/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Receipt className="w-4 h-4 text-neon-amber" />
              <span>Digital Bill</span>
            </button>

            <button
              onClick={() => setActiveTab('workshop')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'workshop'
                  ? 'bg-gradient-to-r from-amber-950/60 to-slate-800 text-amber-300 shadow-md border border-amber-600/50'
                  : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Mechanic Bay</span>
            </button>
          </nav>

          {/* Quick Demo Role Switcher & Live Ping */}
          <div className="flex items-center space-x-3">
            
            {/* Live Backend Indicator */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>REST API: 8080</span>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-gunmetal-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => switchRole('customer')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  currentUser.role === 'CUSTOMER'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View as Alexander Sterling (Customer)"
              >
                Owner
              </button>
              <button
                onClick={() => switchRole('mechanic')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  currentUser.role === 'MECHANIC'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View as Marcus Vance (Lead Tech)"
              >
                Tech
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-neon-sky/20 text-neon-sky border border-neon-sky/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View as Victoria Chen (Director)"
              >
                Admin
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
