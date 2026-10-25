import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Activity, 
  Receipt, 
  Car, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { bookingService, billingService } from '../services/api';

export default function MechanicPortal({ currentUser, onStatusUpdated, onBillPublished }) {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Status update form
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Bill creation form
  const [showBillCreator, setShowBillCreator] = useState(false);
  const [billItems, setBillItems] = useState([
    { description: 'Synthetic Motor Oil 0W-40 (8L)', type: 'PART', quantity: 1, unitPrice: 140 },
    { description: 'Master Diagnostic & Telemetry Scan', type: 'LABOR', quantity: 2, unitPrice: 95 },
  ]);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemType, setNewItemType] = useState('PART');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(50);
  const [publishingBill, setPublishingBill] = useState(false);

  useEffect(() => {
    loadAllBookings();
  }, []);

  const loadAllBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAll();
      setAllBookings(data);
      if (data && data.length > 0) {
        setSelectedBooking(data[0]);
        setNewStatus(data[0].status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setUpdatingStatus(true);
    try {
      const updated = await bookingService.updateStatus(selectedBooking.id, newStatus, technicianNotes);
      setAllBookings(allBookings.map(b => b.id === updated.id ? updated : b));
      setSelectedBooking(updated);
      setTechnicianNotes('');
      if (onStatusUpdated) onStatusUpdated(updated);
      alert(`Booking #${updated.id} status updated to ${newStatus}! Check Live Tracker.`);
    } catch (err) {
      console.error(err);
      alert('Error updating status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddBillItem = (e) => {
    e.preventDefault();
    if (!newItemDesc || newItemPrice <= 0) return;
    setBillItems([
      ...billItems,
      {
        description: newItemDesc,
        type: newItemType,
        quantity: parseInt(newItemQty),
        unitPrice: parseFloat(newItemPrice),
      }
    ]);
    setNewItemDesc('');
    setNewItemPrice(50);
  };

  const handleRemoveBillItem = (index) => {
    setBillItems(billItems.filter((_, idx) => idx !== index));
  };

  const handlePublishBill = async () => {
    if (!selectedBooking || billItems.length === 0) return;
    setPublishingBill(true);
    try {
      const payload = {
        bookingId: selectedBooking.id,
        taxRate: 0.085,
        items: billItems,
      };
      const created = await billingService.create(payload);
      setShowBillCreator(false);
      if (onBillPublished) onBillPublished(created);
      alert(`Itemized Bill published for Booking #${selectedBooking.id}! Switch to "Digital Bill" tab to view.`);
    } catch (err) {
      console.error(err);
      alert('Error publishing bill. Check backend logs.');
    } finally {
      setPublishingBill(false);
    }
  };

  const STATUS_OPTIONS = [
    { value: 'CONFIRMED', label: 'Booking Confirmed' },
    { value: 'INSPECTION', label: 'Inspection & Diagnostics' },
    { value: 'IN_PROGRESS', label: 'Repairs In Progress' },
    { value: 'QUALITY_CHECK', label: 'Quality Check & Road Test' },
    { value: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400 mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>TECHNICIAN WORKSHOP BAY CONTROL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            MECHANIC WORKBENCH
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Logged in as: <span className="text-white font-semibold">{currentUser.name}</span> ({currentUser.role}). Update milestones and dispatch itemized bills.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowBillCreator(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all"
          >
            <Receipt className="w-4 h-4 text-black" />
            <span>Publish Itemized Bill</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-2 border-slate-700 border-t-amber-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-mono mt-4">Loading active workshop bookings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          {/* Left Column: List of All Workshop Bookings */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              GARAGE VEHICLE QUEUE ({allBookings.length})
            </h3>

            <div className="space-y-3">
              {allBookings.map((b) => {
                const isSelected = selectedBooking && selectedBooking.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedBooking(b);
                      setNewStatus(b.status);
                    }}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-b from-slate-800 to-gunmetal-900 border-amber-400/60 shadow-lg shadow-amber-500/10'
                        : 'bg-gunmetal-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-400">BOOKING #{b.id}</span>
                      <span className="font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-neon-sky text-[10px] font-bold">
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">
                      {b.vehicle?.year} {b.vehicle?.make} {b.vehicle?.model}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      Plate: {b.vehicle?.licensePlate} • Owner: {b.customer?.name}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{b.serviceType.replace(/_/g, ' ')}</span>
                      <span>{b.preferredDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Booking Control & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {selectedBooking ? (
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-neon-sky uppercase">WORKBENCH INTAKE #{selectedBooking.id}</span>
                    <h3 className="text-2xl font-display font-bold text-white mt-1">
                      {selectedBooking.vehicle?.make} {selectedBooking.vehicle?.model} ({selectedBooking.vehicle?.licensePlate})
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                    {selectedBooking.status}
                  </span>
                </div>

                {/* Form to update status and add notes */}
                <form onSubmit={handleUpdateStatus} className="mt-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Advance Milestone Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 font-mono"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} ({opt.value})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Append Technician Field Notes (Dispatched to Customer Live Tracker)
                    </label>
                    <textarea
                      rows={3}
                      value={technicianNotes}
                      onChange={(e) => setTechnicianNotes(e.target.value)}
                      placeholder="e.g. Master Tech Marcus: Completed diagnostic run. Calipers torqued to factory spec. Ready for dyno verification."
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 font-mono"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-xs text-slate-400">
                      Changes immediately sync with Spring Boot REST API
                    </span>
                    <button
                      type="submit"
                      disabled={updatingStatus}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                      {updatingStatus ? (
                        <span>Updating...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-black" />
                          <span>Push Milestone Update</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Existing notes history */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-400 mb-3">
                    CURRENT DISPATCH NOTES IN RECORD
                  </h4>
                  <div className="p-4 rounded-xl bg-gunmetal-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed">
                    {selectedBooking.notes || "No notes logged yet."}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">Select a vehicle from the queue to manage.</div>
            )}
          </div>

        </div>
      )}

      {/* PUBLISH BILL CREATOR MODAL */}
      <AnimatePresence>
        {showBillCreator && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gunmetal-950 border border-slate-700 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">
                    Publish Final Bill for Booking #{selectedBooking.id}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowBillCreator(false)}
                  className="text-slate-400 hover:text-white text-xs font-mono"
                >
                  ESC
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Automobile: {selectedBooking.vehicle?.make} {selectedBooking.vehicle?.model} ({selectedBooking.vehicle?.licensePlate})
              </p>

              {/* Add item form */}
              <form onSubmit={handleAddBillItem} className="mt-5 p-4 rounded-2xl bg-gunmetal-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Add Line Item (Part or Labor)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Description (e.g. Synthetic Oil)"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="sm:col-span-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    <option value="PART">PART</option>
                    <option value="LABOR">LABOR</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Qty"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Unit Price ($):</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
              </form>

              {/* Current Items List */}
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Itemized Line Items ({billItems.length})
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {billItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{item.description}</span>
                        <span className="ml-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-neon-sky">
                          {item.type}
                        </span>
                        <span className="ml-2 text-slate-400 font-mono">
                          {item.quantity} × ${Number(item.unitPrice).toFixed(2)} = ${(item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveBillItem(idx)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publish Button */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBillCreator(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  disabled={publishingBill || billItems.length === 0}
                  onClick={handlePublishBill}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  {publishingBill ? <span>Publishing...</span> : <span>Publish Final Invoice</span>}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
