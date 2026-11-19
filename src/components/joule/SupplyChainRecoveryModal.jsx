import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  X, 
  Clock, 
  TrendingDown,
  UserCheck,
  ExternalLink,
  Info
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export const SupplyChainRecoveryModal = () => {
  const { 
    recoveryIncident, 
    recoveryModalOpen, 
    setRecoveryModalOpen, 
    approveRecoveryPlan, 
    rejectRecoveryPlan 
  } = useAppData();

  const { role, switchRole } = useAuth();
  const navigate = useNavigate();

  const [selectedAltIndex, setSelectedAltIndex] = useState(0);
  const [showAlternativePicker, setShowAlternativePicker] = useState(false);

  if (!recoveryModalOpen || !recoveryIncident) return null;

  const plan = recoveryIncident;
  const currentAlternative = plan.candidateAlternatives?.[selectedAltIndex] || plan.recommendedAlternative;

  // Handler for Vendor to switch to Client account to experience the approval flow
  const handleSwitchToClient = async () => {
    setRecoveryModalOpen(false);
    await switchRole('client');
    navigate('/client');
    setTimeout(() => {
      setRecoveryModalOpen(true);
    }, 400);
  };

  // -------------------------------------------------------------
  // 1. VENDOR VIEW: Informative & Governance Compliant
  // (Vendor reported failure; vendor CANNOT choose on behalf of client)
  // -------------------------------------------------------------
  if (role === 'vendor') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
          
          {/* Header */}
          <div className="bg-[#102A43] text-white p-6 relative">
            <button
              onClick={() => setRecoveryModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Supplier Stock Shortage Reported</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Order #{plan.orderId} Transferred to Recovery
            </h2>
            <p className="text-slate-300 text-xs mt-1">
              You have notified the customer that your yard cannot fulfill this order.
            </p>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-7 space-y-5 text-xs">
            
            {/* Governance Principle Banner */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-blue-950">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Customer Decision Governance</span>
              </div>
              <p className="leading-relaxed">
                As a supplier, you can only report fulfillment inability. <strong>The final alternative vendor must be chosen and approved by the customer (Rahul Verma)</strong>. BuildKart AI protects buyers by never silently modifying order pricing, specifications, or suppliers without client authorization.
              </p>
            </div>

            {/* What Joule AI Found for the Customer */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-xs">Joule AI Autonomous Discovery Status</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Transmitted to Client
                </span>
              </div>

              <div className="text-slate-600 space-y-1 text-xs">
                <div>• Shortage: <strong>{plan.affectedQuantity} {plan.affectedItem?.unit}</strong> of {plan.affectedItem?.name}</div>
                <div>• Discovered Alternatives: <strong>{plan.candidateAlternatives?.length || 1} verified Bhopal suppliers</strong></div>
                <div>• Top Recommended Match: <strong>{plan.recommendedAlternative?.vendor.name}</strong> ({plan.recommendedAlternative?.availableStock} bags ready)</div>
                <div>• Client Notification: <strong>Dispatched to Rahul Verma (Arera Colony)</strong></div>
              </div>
            </div>

            {/* Actions for Vendor & Hackathon Demo Switcher */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setRecoveryModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Close & Return to Dashboard
              </button>

              <button
                type="button"
                onClick={handleSwitchToClient}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold shadow-md flex items-center justify-center gap-2"
                title="Switch to the Client account to see how the customer selects and approves the alternative"
              >
                <UserCheck className="w-4 h-4" />
                <span>Switch to Client Account to Choose & Approve</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. CLIENT VIEW: The Customer makes the ultimate decision!
  // (Customer approves, selects another vendor, or rejects)
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#102A43] text-white p-6 sm:p-7 relative">
          <button
            onClick={() => setRecoveryModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Customer Action Required • Supply Chain Recovery</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Choose Your Alternative Supplier
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Your vendor reported that they cannot fulfill Order #{plan.orderId}. Joule AI has found alternative Bhopal suppliers to keep your 24-hour jobsite delivery on schedule.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Failure Alert Notice */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Vendor Stock Shortage
                  </span>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    Order #{plan.orderId}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {plan.failedVendorName} cannot deliver {plan.affectedQuantity} {plan.affectedItem?.unit || 'units'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Reason: <span className="italic">{plan.failureReason}</span>
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-amber-200 sm:pl-4 flex-shrink-0 text-xs">
              <span className="text-slate-400 block text-[11px]">Affected Item</span>
              <span className="font-bold text-slate-800 block">{plan.affectedItem?.name}</span>
              <span className="font-semibold text-rose-600">Shortfall: {plan.affectedQuantity} Bags</span>
            </div>
          </div>

          {/* AI Autonomous Pipeline Progress Steps */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Joule Multi-Agent Resolution Pipeline
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <div className="font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Stock Audit
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Shortage verified</div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <div className="font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Geo Discovery
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">{plan.candidateAlternatives?.length || 0} vendors found</div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <div className="font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Spec Match
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">100% IS:1489 PPC</div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <div className="font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Logistics Match
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Truck pre-matched</div>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 animate-pulse">
                <div className="font-bold flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-purple-600" /> Client Choice
                </div>
                <div className="text-[10px] text-purple-700 mt-0.5">Your Decision</div>
              </div>
            </div>
          </div>

          {/* Recommended Alternative Comparison Card */}
          {currentAlternative ? (
            <div className="border-2 border-emerald-500 rounded-2xl p-5 sm:p-6 bg-white relative shadow-lg">
              <div className="absolute -top-3.5 left-6 bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> AI Recommended Best Alternative
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#102A43]">
                      {currentAlternative.vendor.name}
                    </h3>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {currentAlternative.vendor.locality} ({currentAlternative.distanceKm} km)
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      ★ {currentAlternative.vendorRating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Commodity: <strong className="text-slate-700">{currentAlternative.product.name}</strong>
                  </p>
                </div>

                <div className="sm:text-right">
                  <div className="text-xs text-slate-400">Revised Unit Price</div>
                  <div className="text-2xl font-black text-[#102A43] flex items-center sm:justify-end gap-1.5">
                    {formatCurrency(currentAlternative.unitPrice)}
                    <span className="text-xs font-normal text-slate-500">/ bag</span>
                  </div>
                  {currentAlternative.priceDiffPerUnit <= 0 ? (
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center sm:justify-end gap-1">
                      <TrendingDown className="w-3 h-3" /> Save {formatCurrency(Math.abs(currentAlternative.priceDiffPerUnit))} / bag
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-600">
                      +{formatCurrency(currentAlternative.priceDiffPerUnit)} / bag
                    </span>
                  )}
                </div>
              </div>

              {/* Comparison Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Available Inventory</span>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {currentAlternative.availableStock} Bags
                  </span>
                  <span className="text-[10px] text-slate-500 block">Sufficient for 100 bag order</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Delivery SLA</span>
                  <span className="font-extrabold text-slate-800 text-sm">
                    &lt; 24 Hours
                  </span>
                  <span className="text-[10px] text-emerald-600 block font-medium">Guaranteed On-Time</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Assigned Transport</span>
                  <span className="font-extrabold text-slate-800 text-sm truncate block">
                    {currentAlternative.transportPartner.companyName}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {currentAlternative.transportPartner.vehicleType}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Total Net Order</span>
                  <span className="font-extrabold text-[#102A43] text-sm">
                    {formatCurrency(currentAlternative.totalAmount)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">+ GST & Delivery</span>
                </div>
              </div>

              {/* Quality & Brand Guarantee Notice */}
              <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>
                  <strong>Client Protection Guarantee:</strong> You maintain 100% control. Only upon your explicit approval will this order be transferred to {currentAlternative.vendor.name}.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-sm">
              No alternative suppliers currently meet the 100-bag volume criteria.
            </div>
          )}

          {/* Alternative Candidates Drawer (if customer clicks Choose Another Vendor) */}
          {showAlternativePicker && plan.candidateAlternatives?.length > 1 && (
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-700">
                Select an alternative candidate discovered by Joule:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.candidateAlternatives.map((alt, idx) => (
                  <div
                    key={alt.vendor.id}
                    onClick={() => {
                      setSelectedAltIndex(idx);
                      setShowAlternativePicker(false);
                    }}
                    className={`p-3 rounded-xl bg-white border cursor-pointer transition ${
                      selectedAltIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-slate-900">{alt.vendor.name}</span>
                      <span className="text-[11px] font-bold text-blue-700">{formatCurrency(alt.unitPrice)}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {alt.vendor.locality} • {alt.distanceKm} km away • {alt.availableStock} in stock
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mandatory Three Customer Action Options */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setShowAlternativePicker(!showAlternativePicker)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
            >
              {showAlternativePicker ? "Hide Candidates" : "Choose Another Vendor"}
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={rejectRecoveryPlan}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
              >
                Reject Alternative
              </button>

              <button
                onClick={() => approveRecoveryPlan(currentAlternative)}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Alternative</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
