import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Car, 
  Wrench, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  Gauge, 
  Cpu, 
  Sparkles, 
  Check, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { vehicleService, bookingService } from '../services/api';

export default function BookingWizard({ currentUser, onBookingCreated, onNavigateTracker }) {
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState('BRAKE_REPAIR');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState("09:00 AM - 11:00 AM");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  // New vehicle form state
  const [newMake, setNewMake] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newYear, setNewYear] = useState(2024);
  const [newPlate, setNewPlate] = useState("");
  const [addVehicleError, setAddVehicleError] = useState("");

  useEffect(() => {
    loadVehicles();
  }, [currentUser]);

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.getByUser(currentUser.id || 1);
      setVehicles(data);
      if (data && data.length > 0 && !selectedVehicle) {
        setSelectedVehicle(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!newMake || !newModel || !newPlate) {
      setAddVehicleError("Please fill in all vehicle parameters.");
      return;
    }
    setAddVehicleError("");
    try {
      const created = await vehicleService.addVehicle({
        ownerId: currentUser.id || 1,
        make: newMake,
        model: newModel,
        year: parseInt(newYear),
        licensePlate: newPlate.toUpperCase(),
      });
      setVehicles([...vehicles, created]);
      setSelectedVehicle(created);
      setShowAddVehicleModal(false);
      setNewMake("");
      setNewModel("");
      setNewPlate("");
    } catch (err) {
      setAddVehicleError(err.response?.data?.message || "Failed to register vehicle. License plate must be unique.");
    }
  };

  const servicePackages = [
    {
      type: "GENERAL_MAINTENANCE",
      title: "General Maintenance",
      price: "$180",
      estTime: "1.5 - 2 Hours",
      icon: Wrench,
      desc: "Full 60-point multi-system inspection, fluid top-offs, belt check, battery load test, and tire pressures.",
    },
    {
      type: "OIL_CHANGE",
      title: "Synthetic Oil & Filter",
      price: "$140",
      estTime: "1 Hour",
      icon: Zap,
      desc: "Formula Motul 300V / Liqui-Moly high-shear oil, OEM magnetic drain ring, and high-efficiency filtration.",
    },
    {
      type: "BRAKE_REPAIR",
      title: "Performance Brake System",
      price: "$350",
      estTime: "2 - 3 Hours",
      icon: Gauge,
      desc: "Brembo / AP Racing pad calibration, carbon-ceramic rotor inspection, micro-dial runout scan & DOT 5.1 flush.",
    },
    {
      type: "ENGINE_DIAGNOSTICS",
      title: "Engine Diagnostics & Dyno",
      price: "$220",
      estTime: "2 Hours",
      icon: Cpu,
      desc: "OBD-II CAN-bus telemetry logging, ignition timing analysis, AFR sensor check, boost leak smoke test.",
    },
    {
      type: "FULL_DETAILING",
      title: "Concierge Full Detailing",
      price: "$450",
      estTime: "4 - 5 Hours",
      icon: Sparkles,
      desc: "Paint depth gauge readings, multi-stage rotary correction, 9H graphene ceramic curing & interior alcantara care.",
    },
  ];

  const timeSlots = [
    { slot: "09:00 AM - 11:00 AM", label: "Morning Priority Bay", badge: "Fast Track" },
    { slot: "11:30 AM - 01:30 PM", label: "Midday Inspection", badge: "Express" },
    { slot: "02:00 PM - 04:00 PM", label: "Afternoon Telemetry", badge: "Comprehensive" },
    { slot: "04:30 PM - 06:30 PM", label: "Evening Check-In", badge: "Overnight Bay" },
  ];

  const handleSubmitBooking = async () => {
    if (!selectedVehicle) {
      alert("Please select or add a vehicle.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerId: currentUser.id || 1,
        vehicleId: selectedVehicle.id,
        serviceType: selectedService,
        preferredDate: preferredDate,
        timeSlot: timeSlot,
        notes: notes || `Customer requested ${selectedService.replace('_', ' ')} for ${selectedVehicle.make} ${selectedVehicle.model}.`,
      };

      const result = await bookingService.create(payload);
      setSuccessBooking(result);
      if (onBookingCreated) {
        onBookingCreated(result);
      }

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00D2FF', '#C0C0C0', '#FFFFFF', '#F59E0B']
      });

    } catch (err) {
      console.error(err);
      alert("Error confirming booking. Check backend connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-neon-sky mb-3">
          <span>STEP {step} OF 3</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          SERVICE SLOT CONFIGURATOR
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Reserve bespoke garage time with our factory-trained master technicians.
        </p>

        {/* Progress Stepper Pills */}
        <div className="flex items-center justify-center space-x-3 mt-6">
          {[
            { num: 1, label: "Select Vehicle" },
            { num: 2, label: "Choose Package" },
            { num: 3, label: "Schedule Slot" },
          ].map((s) => (
            <div 
              key={s.num} 
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                step === s.num
                  ? 'bg-slate-700/80 border-slate-500 text-white shadow-md'
                  : step > s.num
                  ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-400'
                  : 'bg-gunmetal-950 border-slate-800 text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step > s.num ? 'bg-emerald-500 text-black' : step === s.num ? 'bg-neon-sky text-black' : 'bg-slate-800 text-slate-400'
              }`}>
                {step > s.num ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* STEP 1: Select Vehicle */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Select Vehicle From Garage</h3>
                <p className="text-xs text-slate-400 mt-1">Choose the automobile registered under Alexander Sterling's profile.</p>
              </div>

              <button
                onClick={() => setShowAddVehicleModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4 text-neon-sky" />
                <span>Add Vehicle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {vehicles.map((veh) => {
                const isSelected = selectedVehicle && selectedVehicle.id === veh.id;
                return (
                  <div
                    key={veh.id}
                    onClick={() => setSelectedVehicle(veh)}
                    className={`p-5 rounded-2xl cursor-pointer border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-slate-800 to-gunmetal-850 border-neon-sky/60 shadow-lg shadow-neon-sky/10'
                        : 'bg-gunmetal-900/80 border-slate-800 hover:border-slate-700 hover:bg-gunmetal-850'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-neon-sky text-black flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                        <Car className="w-5 h-5 text-silver" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                          {veh.year} MODEL
                        </span>
                        <h4 className="text-base font-bold text-white leading-tight">
                          {veh.make} {veh.model}
                        </h4>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">LICENSE PLATE</span>
                      <span className="text-xs font-mono font-bold bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700 text-slate-200">
                        {veh.licensePlate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 1 Actions */}
            <div className="pt-8 border-t border-slate-800/80 flex justify-end">
              <button
                disabled={!selectedVehicle}
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 hover:from-white hover:to-slate-200 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                <span>Continue To Services</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Choose Service Package */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-white">Select Service Package</h3>
              <p className="text-xs text-slate-400 mt-1">
                Customized for: <span className="text-white font-semibold">{selectedVehicle?.make} {selectedVehicle?.model} ({selectedVehicle?.licensePlate})</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicePackages.map((pkg) => {
                const Icon = pkg.icon;
                const isSelected = selectedService === pkg.type;
                return (
                  <div
                    key={pkg.type}
                    onClick={() => setSelectedService(pkg.type)}
                    className={`p-5 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-slate-800/90 to-gunmetal-850 border-neon-sky/60 shadow-lg shadow-neon-sky/10'
                        : 'bg-gunmetal-900/80 border-slate-800 hover:border-slate-700 hover:bg-gunmetal-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${
                            isSelected ? 'text-neon-sky' : 'text-slate-400'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white">{pkg.title}</h4>
                            <span className="text-[11px] font-mono text-slate-400">{pkg.estTime}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-display font-extrabold text-white">{pkg.price}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">EST BASE</span>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-slate-400 leading-relaxed font-normal">
                        {pkg.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Includes OEM Diagnostics</span>
                      <span className={`font-semibold ${isSelected ? 'text-neon-sky' : 'text-slate-400'}`}>
                        {isSelected ? 'Selected' : 'Select Tier'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 2 Actions */}
            <div className="pt-8 border-t border-slate-800/80 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs tracking-wider flex items-center space-x-2 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 hover:from-white hover:to-slate-200 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all"
              >
                <span>Continue To Schedule</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Schedule Date & Time Slot Grid */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-white">Select Date &amp; Time Window</h3>
              <p className="text-xs text-slate-400 mt-1">Choose your preferred check-in slot for garage intake.</p>
            </div>

            {/* Date Picker Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gunmetal-900 border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Service Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={preferredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-sky font-mono"
                  />
                </div>
              </div>

              {/* Booking Summary Mini Card */}
              <div className="md:col-span-2 p-4 rounded-2xl bg-gunmetal-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-neon-sky uppercase">Intake Summary</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {selectedVehicle?.make} {selectedVehicle?.model} • {selectedService.replace('_', ' ')}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Plate: {selectedVehicle?.licensePlate} • Customer: Alexander Sterling</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400 block">Status Upon Booking:</span>
                  <span className="inline-block px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-xs font-bold mt-1">
                    CONFIRMED
                  </span>
                </div>
              </div>
            </div>

            {/* Time Slot Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Available Garage Time Slots
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {timeSlots.map((ts, idx) => {
                  const isSelected = timeSlot === ts.slot;
                  return (
                    <div
                      key={idx}
                      onClick={() => setTimeSlot(ts.slot)}
                      className={`p-4 rounded-xl cursor-pointer border transition-all text-center relative ${
                        isSelected
                          ? 'bg-slate-800 border-neon-sky text-white shadow-md shadow-neon-sky/10'
                          : 'bg-gunmetal-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 inline-block mb-1.5">
                        {ts.badge}
                      </span>
                      <p className="text-sm font-bold tracking-tight text-white">{ts.slot}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{ts.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes / Special Requests */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Special Requests or Technical Symptoms (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Inspect vibration above 90 MPH, flush brake fluid with Motul 660, check ceramic coating curing state..."
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-neon-sky leading-relaxed"
              ></textarea>
            </div>

            {/* Step 3 Actions */}
            <div className="pt-8 border-t border-slate-800/80 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs tracking-wider flex items-center space-x-2 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                disabled={loading}
                onClick={handleSubmitBooking}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:scale-[1.01] active:scale-[0.99] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-xl shadow-white/5 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Confirm &amp; Dispatch Reservation</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      <AnimatePresence>
        {successBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gunmetal-950 border border-slate-700 max-w-lg w-full rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-display font-bold text-white">
                RESERVATION CONFIRMED
              </h3>
              <p className="text-slate-400 text-xs mt-2">
                Booking Reference <span className="font-mono text-neon-sky">#APX-BK-00{successBooking.id}</span> has been dispatched to Master Technician bay intake.
              </p>

              <div className="my-6 p-4 rounded-xl bg-gunmetal-900 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Automobile:</span>
                  <span className="font-bold text-white">{selectedVehicle?.make} {selectedVehicle?.model} ({selectedVehicle?.licensePlate})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Package:</span>
                  <span className="font-bold text-white">{selectedService.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reserved Date:</span>
                  <span className="font-bold text-white">{preferredDate} ({timeSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Bay:</span>
                  <span className="font-bold text-emerald-400">Bay 01 (Marcus Vance, Lead Tech)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSuccessBooking(null);
                    setStep(1);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs tracking-wide transition-all"
                >
                  Book Another
                </button>
                <button
                  onClick={() => {
                    setSuccessBooking(null);
                    if (onNavigateTracker) onNavigateTracker(successBooking.id);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-neon-sky text-black font-bold text-xs tracking-wider uppercase shadow-lg shadow-neon-sky/20 hover:bg-cyan-300 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Track Repair Live</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD VEHICLE MODAL */}
      <AnimatePresence>
        {showAddVehicleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gunmetal-950 border border-slate-700 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Car className="w-5 h-5 text-neon-sky" />
                  <h3 className="text-lg font-bold text-white">Register New Vehicle</h3>
                </div>
                <button 
                  onClick={() => setShowAddVehicleModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-mono"
                >
                  ESC
                </button>
              </div>

              {addVehicleError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addVehicleError}</span>
                </div>
              )}

              <form onSubmit={handleAddVehicle} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Make (Brand)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Porsche, BMW, Mercedes-AMG, Audi"
                    value={newMake}
                    onChange={(e) => setNewMake(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-neon-sky"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 911 GT3 RS, M4 Competition, RS7"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-neon-sky"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Model Year</label>
                    <input
                      type="number"
                      required
                      min={1990}
                      max={2026}
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-neon-sky font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">License Plate</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. APX-GT911"
                      value={newPlate}
                      onChange={(e) => setNewPlate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-neon-sky font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddVehicleModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-neon-sky text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-300 transition-all"
                  >
                    Save Vehicle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
