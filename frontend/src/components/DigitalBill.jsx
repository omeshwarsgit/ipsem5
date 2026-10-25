import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Receipt, 
  CreditCard, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Car, 
  Wrench, 
  AlertCircle, 
  Lock, 
  FileCheck,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { billingService, bookingService } from '../services/api';

export default function DigitalBill({ bookingId, currentUser, onNavigateWorkshop }) {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [cardName, setCardName] = useState("Alexander Sterling");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("892");

  useEffect(() => {
    loadBill();
  }, [bookingId]);

  const loadBill = async () => {
    setLoading(true);
    setError(null);
    try {
      // Default to bookingId or fallback to 3 (which was seeded with a bill in DataInitializer)
      const targetId = bookingId || 3;
      const data = await billingService.getByBooking(targetId);
      setBill(data);
    } catch (err) {
      console.warn("Could not load bill directly for booking", err);
      setError("No finalized digital invoice has been published for this booking yet.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!bill) return;
    setPaying(true);
    try {
      const updated = await billingService.pay(bill.id);
      setBill(updated);
      setShowPaymentModal(false);

      // Trigger celebratory payment confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#10B981', '#38BDF8', '#FFFFFF', '#F59E0B']
      });
    } catch (err) {
      console.error(err);
      alert("Payment simulation error. Please retry.");
    } finally {
      setPaying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter items into parts vs labor
  const partsItems = bill?.items ? bill.items.filter(i => i.type === 'PART') : [];
  const laborItems = bill?.items ? bill.items.filter(i => i.type === 'LABOR') : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Bar with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-neon-amber mb-2">
            <span>OFFICIAL DIGITAL STATEMENT &amp; LEDGER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            ITEMIZED DIGITAL BILL
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            100% itemized parts and certified labor transparency with cryptographically verifiable receipts.
          </p>
        </div>

        {bill && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition-all"
            >
              <Printer className="w-4 h-4 text-silver" />
              <span>Print / PDF</span>
            </button>

            {bill.paymentStatus === 'UNPAID' ? (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
              >
                <CreditCard className="w-4 h-4 text-black" />
                <span>Pay Now (${bill.grandTotal})</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-400 font-mono text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>PAID IN FULL</span>
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-2 border-slate-700 border-t-neon-amber rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-mono mt-4">Generating itemized ledger statement...</p>
        </div>
      ) : error || !bill ? (
        <div className="p-12 text-center rounded-3xl bg-gunmetal-950 border border-slate-800 mt-8">
          <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">Invoice Not Yet Published</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            The service is currently being handled by our technicians. Once the mechanic finalizes parts and labor in the workshop bay, an itemized invoice will appear here.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                // Load the pre-seeded bill (booking 3)
                billingService.getByBooking(3).then(setBill);
                setError(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              View Sample Finished Invoice (Audi RS6)
            </button>
            {onNavigateWorkshop && (
              <button
                onClick={onNavigateWorkshop}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30"
              >
                Go to Mechanic Bay to Publish Bill
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Printable & Sleek Digital Invoice Card */
        <div className="mt-8 bg-gunmetal-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none">
          
          {/* PAID STAMP WATERMARK */}
          {bill.paymentStatus === 'PAID' && (
            <div className="absolute top-12 right-12 pointer-events-none transform rotate-12 opacity-85 select-none print:opacity-100">
              <div className="px-6 py-2 border-4 border-emerald-500 text-emerald-500 rounded-2xl font-mono font-black text-2xl tracking-widest uppercase bg-emerald-500/10 backdrop-blur-sm shadow-xl shadow-emerald-500/20">
                PAID • CONFIRMED
              </div>
              <span className="block text-[10px] text-emerald-400 font-mono text-center mt-1">
                REF: APX-PAY-{bill.id}9842
              </span>
            </div>
          )}

          {/* Brushed Silver Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-800 via-slate-850 to-gunmetal-850 border border-slate-700/80 mb-8 print:bg-gray-100 print:text-black">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  APEX MOTORWERKS OFFICIAL INVOICE
                </span>
                <h3 className="text-2xl font-display font-black text-white print:text-black mt-0.5">
                  STATEMENT #{bill.id}0029-X
                </h3>
                <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
                  Issued: {new Date(bill.generatedAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">PAYMENT STATUS</span>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full font-mono text-xs font-bold ${
                  bill.paymentStatus === 'PAID'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {bill.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Client & Vehicle Meta Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-800 print:border-gray-300 text-xs">
            
            {/* Customer Details */}
            <div className="p-4 rounded-xl bg-gunmetal-900 border border-slate-800/80 print:bg-gray-50 print:border-gray-200">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">CLIENT PROFILE</span>
              <p className="text-sm font-bold text-white print:text-black">
                {bill.booking?.customer?.name || "Alexander Sterling"}
              </p>
              <p className="text-slate-400 print:text-gray-600 mt-0.5">
                {bill.booking?.customer?.email || "customer@apexgarage.com"}
              </p>
              <p className="text-slate-400 print:text-gray-600 mt-0.5">
                {bill.booking?.customer?.phone || "+1 (555) 782-4910"}
              </p>
            </div>

            {/* Automobile Details */}
            <div className="p-4 rounded-xl bg-gunmetal-900 border border-slate-800/80 print:bg-gray-50 print:border-gray-200">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">SERVICED VEHICLE</span>
              <p className="text-sm font-bold text-white print:text-black">
                {bill.booking?.vehicle?.year} {bill.booking?.vehicle?.make} {bill.booking?.vehicle?.model}
              </p>
              <p className="text-slate-400 print:text-gray-600 mt-0.5 font-mono">
                License Plate: <span className="text-neon-sky font-semibold">{bill.booking?.vehicle?.licensePlate}</span>
              </p>
              <p className="text-slate-400 print:text-gray-600 mt-0.5">
                Intake Service: {bill.booking?.serviceType?.replace('_', ' ') || "FULL DETAILING"}
              </p>
            </div>

          </div>

          {/* SPLIT TABLE 1: PARTS & SPARES */}
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-neon-sky"></span>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 print:text-black">
                TABLE A : OEM PARTS &amp; CONSUMABLES
              </h4>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-gray-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-gunmetal-900/90 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800 print:bg-gray-100 print:text-gray-700">
                  <tr>
                    <th className="py-3 px-4">Item Description</th>
                    <th className="py-3 px-4 text-center">Category</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                  {partsItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-white font-medium print:text-black">{item.description}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-neon-sky">
                          OEM PART
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-300 print:text-black">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400 print:text-gray-700">${Number(item.unitPrice).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white print:text-black">${Number(item.totalPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                  {partsItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-500 font-mono">No physical parts charged for this service.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="text-right mt-2 font-mono text-xs text-slate-400">
              Subtotal Parts: <span className="font-bold text-white print:text-black">${Number(bill.totalPartsCost || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* SPLIT TABLE 2: LABOR & DIAGNOSTICS */}
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 print:text-black">
                TABLE B : CERTIFIED LABOR &amp; TELEMETRY DIAGNOSTICS
              </h4>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-gray-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-gunmetal-900/90 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800 print:bg-gray-100 print:text-gray-700">
                  <tr>
                    <th className="py-3 px-4">Service / Operation Description</th>
                    <th className="py-3 px-4 text-center">Category</th>
                    <th className="py-3 px-4 text-center">Hours / Units</th>
                    <th className="py-3 px-4 text-right">Hourly Rate</th>
                    <th className="py-3 px-4 text-right">Labor Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                  {laborItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-white font-medium print:text-black">{item.description}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-400">
                          LABOR
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-300 print:text-black">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400 print:text-gray-700">${Number(item.unitPrice).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white print:text-black">${Number(item.totalPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right mt-2 font-mono text-xs text-slate-400">
              Subtotal Labor: <span className="font-bold text-white print:text-black">${Number(bill.totalLaborCost || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* FINANCIAL SUMMARY TOTALS */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex justify-end">
            <div className="w-full max-w-sm space-y-3 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total OEM Parts &amp; Fluids:</span>
                <span className="text-white print:text-black">${Number(bill.totalPartsCost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Certified Labor:</span>
                <span className="text-white print:text-black">${Number(bill.totalLaborCost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated State Tax (8.5%):</span>
                <span className="text-white print:text-black">${Number(bill.tax || 0).toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-700/80 flex justify-between items-center text-sm">
                <span className="font-bold text-white uppercase tracking-wider print:text-black">Grand Total:</span>
                <span className="text-2xl font-display font-extrabold text-white print:text-black">
                  ${Number(bill.grandTotal || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-6 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>Apex Motorwerks LLC • 100 Automotive Blvd • ASE Certified Master Shop</span>
            <span>All repair telemetry stored on tamper-evident digital ledger</span>
          </div>

        </div>
      )}

      {/* SIMULATED SECURE CARD PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentModal && bill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gunmetal-950 border border-slate-700 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">256-Bit Encrypted Checkout</h3>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-mono"
                >
                  ESC
                </button>
              </div>

              <div className="my-5 p-4 rounded-2xl bg-gunmetal-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Total Amount Due</span>
                  <p className="text-2xl font-display font-extrabold text-white">${bill.grandTotal}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-neon-sky font-semibold">
                    INVOICE #{bill.id}0029
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-neon-sky"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Credit / Debit Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-neon-sky font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Expiration</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-neon-sky font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">CVC Code</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-neon-sky font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified by Stripe Sandbox</span>
                </span>

                <button
                  disabled={paying}
                  onClick={handlePayNow}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  {paying ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Complete Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
