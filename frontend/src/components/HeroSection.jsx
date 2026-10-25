import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Activity, 
  ShieldCheck, 
  Gauge, 
  Cpu, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  Wrench, 
  Car,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function HeroSection({ onBookClick, onTrackClick, setActiveTab }) {
  const serviceCards = [
    {
      title: "Comprehensive Engine Diagnostics",
      type: "ENGINE_DIAGNOSTICS",
      desc: "Full ECU telemetry scan, dyno performance curve validation, boost-leak smoke testing & timing calibration.",
      icon: Cpu,
      color: "from-blue-500/20 to-cyan-500/10",
      accent: "text-neon-sky",
      badge: "Level 4 Telemetry"
    },
    {
      title: "Precision Brake Systems",
      type: "BRAKE_REPAIR",
      desc: "Brembo / AP Racing carbon-ceramic rotor inspection, micro-micrometer runout analysis, synthetic fluid flush.",
      icon: Gauge,
      color: "from-rose-500/20 to-red-500/10",
      accent: "text-rose-400",
      badge: "Motorsport Spec"
    },
    {
      title: "Synthetic Oil & Formula Lubrication",
      type: "OIL_CHANGE",
      desc: "Full Motul 300V / Liqui-Moly synthetic oil infusion, magnetic plug sediment review & OEM filter seals.",
      icon: Zap,
      color: "from-amber-500/20 to-yellow-500/10",
      accent: "text-amber-400",
      badge: "High-RPM Grade"
    },
    {
      title: "Concierge Multi-Stage Detailing",
      type: "FULL_DETAILING",
      desc: "Rotary paint depth measuring, multi-stage ceramic correction, Graphene 9H quartz cure, leather hydration.",
      icon: Sparkles,
      color: "from-purple-500/20 to-indigo-500/10",
      accent: "text-purple-400",
      badge: "Showroom Mirror"
    }
  ];

  return (
    <div className="relative overflow-hidden pb-24">
      {/* Background Glows & Carbon Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-neon-sky/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-silver/10 rounded-full blur-[160px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"></div>
      </div>

      {/* Hero Section Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20">
        
        {/* Top Eyebrow Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-neon-sky animate-ping"></span>
            <span className="text-xs uppercase font-mono tracking-widest text-slate-300 font-semibold">
              High-Precision Exotic &amp; Luxury Automotive Care
            </span>
          </div>
        </motion.div>

        {/* Hero Title & Subtitle */}
        <div className="text-center mt-8 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.1]"
          >
            ENGINEERED FOR <br className="hidden sm:inline" />
            <span className="silver-gradient-text">PERFECTION.</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-sky via-white to-slate-400">
              TRACKED LIVE.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto"
          >
            The next generation of luxury vehicle servicing. Schedule bespoke maintenance slots, observe real-time mechanic repair telemetry, and review itemized digital invoices with absolute transparency.
          </motion.p>

          {/* Call-To-Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onBookClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-xl shadow-white/5 hover:shadow-neon-sky/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              <Calendar className="w-4 h-4 text-slate-900 group-hover:rotate-12 transition-transform" />
              <span>Book Service Slot</span>
              <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onTrackClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gunmetal-850/90 hover:bg-gunmetal-800 text-white font-bold text-sm tracking-wider uppercase border border-slate-700/80 hover:border-slate-500 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              <Activity className="w-4 h-4 text-neon-sky group-hover:animate-pulse" />
              <span>Track Repair Live</span>
              <span className="w-2 h-2 rounded-full bg-neon-sky"></span>
            </button>
          </motion.div>
        </div>

        {/* Animated Automotive Telemetry & Wireframe Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative mx-auto max-w-5xl rounded-3xl p-1 bg-gradient-to-b from-slate-700/50 via-slate-800/20 to-transparent shadow-2xl"
        >
          <div className="relative rounded-[23px] bg-gunmetal-950/90 border border-slate-800/80 p-6 sm:p-8 backdrop-blur-2xl overflow-hidden">
            
            {/* Top Bar of Telemetry HUD */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    BAY 01 : PORSCHE 911 GT3 TOURING
                  </h3>
                  <p className="text-xs font-mono text-slate-400">VIN: WP0AC2A98NS294 • STAGE: REPAIRS IN PROGRESS</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 font-mono text-xs text-slate-300">
                <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-neon-sky">
                  ECU LINK: 100% ONLINE
                </span>
                <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-amber-400">
                  EST: 3:00 PM
                </span>
              </div>
            </div>

            {/* Automotive Visual with HUD Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8 items-center">
              
              {/* Left HUD Column */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gunmetal-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>BRAKE PAD REMAINING</span>
                    <span className="text-neon-sky font-mono font-bold">98% (NEW)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-neon-sky h-full rounded-full w-[98%]"></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gunmetal-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>ENGINE OIL VISCOSITY</span>
                    <span className="text-emerald-400 font-mono font-bold">OPTIMAL 0W-40</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[100%]"></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gunmetal-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>TIRE TEMPERATURE</span>
                    <span className="text-amber-400 font-mono font-bold">24°C / 32 PSI</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full w-[85%]"></div>
                  </div>
                </div>
              </div>

              {/* Center Floating Supercar Silhouette & Diagnostics Node */}
              <div className="relative flex flex-col items-center justify-center p-6 min-h-[220px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-neon-sky/20 animate-ping opacity-20"></div>
                  <div className="w-64 h-64 rounded-full border border-slate-700/40"></div>
                </div>

                {/* Animated Car Icon / Graphic */}
                <motion.div 
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative z-10 text-center"
                >
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-slate-800 via-gunmetal-850 to-slate-700 border border-slate-600 flex items-center justify-center shadow-2xl shadow-neon-sky/15">
                    <Car className="w-12 h-12 text-slate-200" />
                  </div>
                  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-neon-sky/10 border border-neon-sky/30 text-neon-sky text-[11px] font-mono font-semibold">
                    REAL-TIME TELEMETRY ACTIVE
                  </span>
                </motion.div>
              </div>

              {/* Right HUD Column - Master Tech Status Feed */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gunmetal-900/60 border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-slate-300">LEAD TECHNICIAN</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-white">Marcus Vance</p>
                  <p className="text-xs text-slate-400 mt-0.5">ASE Master Certified L1 Advanced Specialist</p>
                </div>

                <div className="p-4 rounded-xl bg-gunmetal-900/60 border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-neon-sky" />
                    <span className="font-semibold text-slate-300">CURRENT OPERATION</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed font-mono">
                    "Rotors torqued to OEM 140 Nm. AP Racing brake fluid pressure bled. Staging for chassis alignment."
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Milestone Strip */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Multi-point pre-service check completed</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-slate-300 font-mono">Live Slot: 09:00 AM - 11:00 AM</span>
                <button
                  onClick={onTrackClick}
                  className="text-neon-sky hover:underline font-semibold flex items-center space-x-1"
                >
                  <span>Open Full Tracker</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
          {[
            { label: "Precision Quality Rating", value: "99.8%", detail: "Over 3,500 Services" },
            { label: "Turnaround Time", value: "< 24 Hrs", detail: "Standard Concierge" },
            { label: "Master Techs", value: "100%", detail: "ASE & Factory Trained" },
            { label: "Itemized Transparency", value: "0 Hidden Fees", detail: "Digital Invoice Verification" },
          ].map((stat, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-gunmetal-850/60 border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-display font-black text-white">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">{stat.label}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{stat.detail}</p>
            </div>
          ))}
        </div>

        {/* Service Packages Overview */}
        <div className="mt-24 max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              SPECIALIZED SERVICE TIERS
            </h2>
            <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
              Select any package to jump directly into our interactive booking slot configurator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {serviceCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  onClick={onBookClick}
                  className="p-6 rounded-2xl bg-gunmetal-850/80 border border-slate-800 hover:border-slate-600 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${card.accent}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="mt-5 text-base font-bold text-white group-hover:text-neon-sky transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                    <span>Configure Slot</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-neon-sky group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
