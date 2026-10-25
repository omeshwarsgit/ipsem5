import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Car, 
  Receipt, 
  AlertCircle, 
  ChevronRight, 
  ShieldCheck, 
  Cpu, 
  Search, 
  Radio,
  FileText,
  UserCheck
} from 'lucide-react';
import { bookingService } from '../services/api';

export default function RepairTracker({ currentUser, onNavigateBill, initialBookingId }) {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // 5 Milestones as defined in specification:
  // Booking Confirmed -> Inspection -> Repairs In Progress -> Quality Check -> Ready for Pickup
  const MILESTONES = [
    {
      id: "CONFIRMED",
      title: "Booking Confirmed",
      subtitle: "Intake Bay Scheduled",
      description: "Vehicle booked and scheduled for check-in at Apex Garage Service Bay.",
    },
    {
      id: "INSPECTION",
      title: "Inspection & Diagnostics",
      subtitle: "Multi-Point Telemetry",
      description: "OBD-II CAN scan, fluid testing, micrometer rotor check, and technician evaluation.",
    },
    {
      id: "IN_PROGRESS",
      title: "Repairs In Progress",
      subtitle: "Active Bay Execution",
      description: "OEM parts installation, precision component torquing, and fluid flush operations.",
    },
    {
      id: "QUALITY_CHECK",
      title: "Quality Check & Dyno",
      subtitle: "Road Test Verification",
      description: "Dynamometer power run, boost leak verification, and secondary senior inspector audit.",
    },
    {
      id: "READY_FOR_PICKUP",
      title: "Ready for Pickup",
      subtitle: "Concierge Handover Staged",
      description: "Detailing complete, vehicle parked in executive delivery bay with digital invoice ready.",
    },
  ];

  useEffect(() => {
    loadBookings();
  }, [currentUser]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      let data = [];
      if (currentUser.role === 'CUSTOMER') {
        data = await bookingService.getByCustomer(currentUser.id || 1);
      } else {
        data = await bookingService.getAll();
      }
      setBookings(data);
      if (data && data.length > 0) {
        if (initialBookingId) {
          const match = data.find(b => b.id === Number(initialBookingId));
          setSelectedBooking(match || data[0]);
        } else {
          setSelectedBooking(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to map booking status to milestone index (0 to 4)
  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 0;
      case 'INSPECTION':
        return 1;
      case 'IN_PROGRESS':
        return 2;
      case 'QUALITY_CHECK':
        return 3;
      case 'READY_FOR_PICKUP':
      case 'COMPLETED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIndex = selectedBooking ? getStepIndex(selectedBooking.status) : 2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Tracker Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-neon-blue mb-2">
            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></span>
            <span>LIVE GARAGE TELEMETRY &amp; STATUS ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            ACTIVE SERVICE TRACKER
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time step-by-step progress tracking with direct mechanic field reports.
          </p>
        </div>

        {/* Vehicle Selection Chips */}
        {bookings.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Switch Vehicle:</span>
            {bookings.map((b) => {
              const isSelected = selectedBooking && selectedBooking.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-slate-700 border-neon-sky text-white shadow-md'
                      : 'bg-gunmetal-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {b.vehicle?.make} {b.vehicle?.model}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-2 border-slate-700 border-t-neon-sky rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-mono mt-4">Streaming live repair telemetry...</p>
        </div>
      ) : !selectedBooking ? (
        <div className="p-12 text-center rounded-3xl bg-gunmetal-950 border border-slate-800 mt-8">
          <Car className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No Active Service Bookings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Schedule a service booking using our interactive wizard to monitor live technician milestones.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          
          {/* Top Vehicle & Status Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Vehicle Specs */}
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-gunmetal-900 border border-slate-700 flex items-center justify-center text-slate-200 shadow-xl">
                  <Car className="w-8 h-8 text-silver" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold">
                      {selectedBooking.vehicle?.licensePlate}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ID: #{selectedBooking.id}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mt-1">
                    {selectedBooking.vehicle?.year} {selectedBooking.vehicle?.make} {selectedBooking.vehicle?.model}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Package: <span className="text-neon-sky font-semibold">{selectedBooking.serviceType.replace('_', ' ')}</span> • Date: {selectedBooking.preferredDate} ({selectedBooking.timeSlot})
                  </p>
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80">
                  <span className="text-[10px] text-slate-400 font-mono block">CURRENT STAGE</span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-neon-sky animate-ping"></span>
                    <span className="text-sm font-bold font-mono text-white">
                      {selectedBooking.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateBill(selectedBooking.id)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-slate-800 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs tracking-wider flex items-center space-x-2 transition-all shadow-md"
                >
                  <Receipt className="w-4 h-4 text-amber-400" />
                  <span>Itemized Digital Bill</span>
                </button>
              </div>

            </div>
          </div>

          {/* INTERACTIVE 5-STEP MILESTONE STEPPER */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-8">
              REPAIR MILESTONE PROGRESSION
            </h4>

            {/* Stepper Bar Container */}
            <div className="relative">
              
              {/* Background Connecting Line */}
              <div className="hidden lg:block absolute top-7 left-12 right-12 h-1 bg-slate-800 -z-0">
                <div 
                  className="h-full bg-gradient-to-r from-neon-blue via-neon-sky to-emerald-400 transition-all duration-700"
                  style={{ width: `${(currentStepIndex / (MILESTONES.length - 1)) * 100}%` }}
                ></div>
              </div>

              {/* Steps Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
                {MILESTONES.map((milestone, idx) => {
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const isPending = idx > currentStepIndex;

                  return (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex flex-col p-5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-b from-slate-800 to-gunmetal-900 border-neon-sky/60 shadow-xl shadow-neon-sky/15'
                          : isCompleted
                          ? 'bg-gunmetal-900/60 border-emerald-500/30'
                          : 'bg-gunmetal-950/60 border-slate-800/80 opacity-60'
                      }`}
                    >
                      {/* Step Indicator Circle */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                            : isCurrent
                            ? 'bg-neon-sky text-black shadow-lg shadow-neon-sky/40 animate-pulse-glow'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                          ) : (
                            <span className="font-mono">{idx + 1}</span>
                          )}
                        </div>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                          isCompleted
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : isCurrent
                            ? 'bg-neon-sky/15 text-neon-sky border border-neon-sky/30'
                            : 'bg-slate-900 text-slate-500'
                        }`}>
                          {isCompleted ? 'COMPLETE' : isCurrent ? 'ACTIVE' : 'QUEUED'}
                        </span>
                      </div>

                      {/* Step Details */}
                      <h5 className={`text-sm font-bold tracking-tight ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                        {milestone.title}
                      </h5>
                      <span className="text-[11px] font-mono text-slate-400 mt-0.5">{milestone.subtitle}</span>
                      <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                        {milestone.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Telemetry Details & Mechanic Live Log Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Mechanic Field Log Feed */}
            <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Technician Operational Notes</h4>
                    <p className="text-xs text-slate-400">Live communication dispatched from garage workstation.</p>
                  </div>
                </div>

                <span className="text-xs font-mono text-slate-400">
                  Updated: Today
                </span>
              </div>

              {/* Notes content */}
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-gunmetal-900 border border-slate-800/80 flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                  <div className="text-xs leading-relaxed text-slate-300">
                    <span className="font-mono text-neon-sky font-semibold block mb-1">
                      [BAY 01 DISPATCH LOG - MARCUS VANCE, MASTER TECH]
                    </span>
                    <p className="whitespace-pre-line font-mono text-slate-300 text-xs">
                      {selectedBooking.notes || "Vehicle booked into system. Scheduled for master technician intake inspection."}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gunmetal-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>All services backed by Apex 24-Month / 24,000-Mile Guarantee</span>
                  </div>
                  <span className="font-mono text-slate-500">ISO 9001 Garage</span>
                </div>
              </div>
            </div>

            {/* Garage Bay Specifications */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white mb-4">Garage Assignment</h4>
                
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-gunmetal-900 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Assigned Master Tech</span>
                    <p className="text-sm font-bold text-white mt-0.5">Marcus Vance</p>
                    <p className="text-xs text-slate-400">L1 Advanced Engine Performance Certified</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gunmetal-900 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Service Bay</span>
                    <p className="text-sm font-bold text-neon-sky mt-0.5 font-mono">EXECUTIVE BAY 02</p>
                    <p className="text-xs text-slate-400">High-Lift Hydraulic &amp; Laser Alignment Rig</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gunmetal-900 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Handover</span>
                    <p className="text-sm font-bold text-amber-400 mt-0.5 font-mono">
                      {selectedBooking.status === 'READY_FOR_PICKUP' || selectedBooking.status === 'COMPLETED' ? 'READY NOW' : 'Same-Day by 5:30 PM'}
                    </p>
                    <p className="text-xs text-slate-400">Concierge lounge valet ready</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onNavigateBill(selectedBooking.id)}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2"
                >
                  <Receipt className="w-4 h-4 text-neon-sky" />
                  <span>View Bill &amp; Invoices</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
