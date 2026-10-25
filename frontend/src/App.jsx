import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BookingWizard from './components/BookingWizard';
import RepairTracker from './components/RepairTracker';
import DigitalBill from './components/DigitalBill';
import MechanicPortal from './components/MechanicPortal';
import { authService, DEMO_USERS } from './services/api';
import { ShieldCheck, Cpu, Terminal, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [trackedBookingId, setTrackedBookingId] = useState(null);

  const handleBookingCreated = (booking) => {
    setTrackedBookingId(booking.id);
  };

  const handleNavigateTracker = (bookingId) => {
    if (bookingId) {
      setTrackedBookingId(bookingId);
    }
    setActiveTab('tracker');
  };

  const handleNavigateBill = (bookingId) => {
    if (bookingId) {
      setTrackedBookingId(bookingId);
    }
    setActiveTab('bill');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gunmetal-900 text-slate-100 selection:bg-neon-sky selection:text-black">
      
      {/* Top Metallic Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      {/* Main Content Area with Smooth Page Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection 
                onBookClick={() => setActiveTab('booking')}
                onTrackClick={() => setActiveTab('tracker')}
                setActiveTab={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === 'booking' && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <BookingWizard 
                currentUser={currentUser}
                onBookingCreated={handleBookingCreated}
                onNavigateTracker={handleNavigateTracker}
              />
            </motion.div>
          )}

          {activeTab === 'tracker' && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <RepairTracker 
                currentUser={currentUser}
                initialBookingId={trackedBookingId}
                onNavigateBill={handleNavigateBill}
              />
            </motion.div>
          )}

          {activeTab === 'bill' && (
            <motion.div
              key="bill"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <DigitalBill 
                bookingId={trackedBookingId}
                currentUser={currentUser}
                onNavigateWorkshop={() => setActiveTab('workshop')}
              />
            </motion.div>
          )}

          {activeTab === 'workshop' && (
            <motion.div
              key="workshop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MechanicPortal 
                currentUser={currentUser}
                onStatusUpdated={(updated) => setTrackedBookingId(updated.id)}
                onBillPublished={(bill) => {
                  setTrackedBookingId(bill.booking?.id || bill.id);
                  setActiveTab('bill');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Luxury Footer */}
      <footer className="border-t border-slate-800/80 bg-gunmetal-950/80 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3">
              <span className="font-display font-black text-lg text-white tracking-wider">
                APEX <span className="text-neon-sky">MOTORWERKS</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400 font-mono">
                Full-Stack Spring Boot 3.3 &amp; React Architecture
              </span>
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-mono">Java 24 / Spring Boot 3 REST API</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-neon-sky"></span>
                <span className="font-mono">React 18 &amp; Framer Motion</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="font-mono">H2 / MySQL Persistence</span>
              </span>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
