import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  MapPin, 
  Building2, 
  Package, 
  ArrowLeft, 
  Phone,
  ShieldCheck,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export const DeliveryTracker = ({ orderId, onBack }) => {
  const { orders } = useAppData();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
        Order not found.
      </div>
    );
  }

  const steps = order.trackingSteps || [
    { stage: "Order Confirmed", time: "09:30 AM", done: true },
    { stage: "Vendor Preparing", time: "Pending", done: false },
    { stage: "Ready for Pickup", time: "Pending", done: false },
    { stage: "Picked Up", time: "Pending", done: false },
    { stage: "In Transit", time: "Pending", done: false },
    { stage: "Delivered", time: "Pending", done: false }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Back to Orders"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#102A43]">Order Tracking</h2>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                #{order.id}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Live telematics & simulated status updates (SAP TM Dispatch Ready)
            </p>
          </div>
        </div>

        <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${
          order.status === 'Delivered'
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            : order.status.includes('Recovered')
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            : order.status.includes('Shortage')
            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
            : 'bg-blue-100 text-blue-800 border border-blue-300'
        }`}>
          {order.status}
        </span>
      </div>

      {/* Joule AI Autonomous Recovery Banner (if recovered) */}
      {order.recoveryPlan && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-emerald-500/10 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold">Autonomous Supply Chain Recovery Active</div>
            <div className="text-[11px] text-emerald-800 mt-0.5">
              Originally placed with <strong>{order.recoveryPlan.originalVendor}</strong>. Joule AI autonomously transferred stock fulfillment to <strong>{order.vendorName}</strong> with 24-hour delivery intact.
            </div>
          </div>
        </div>
      )}

      {/* Stepper Tracking Visual */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-[#102A43] uppercase tracking-wider text-xs">
          Simulated Milestone Progress
        </h3>

        <div className="relative">
          {/* Stepper Connector Bar */}
          <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${(steps.filter((s) => s.done).length / steps.length) * 100}%`
              }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10 text-xs">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-sm ${
                  step.done
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}>
                  {step.done ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                </div>

                <div>
                  <h4 className={`font-bold text-[11px] sm:text-xs leading-tight ${
                    step.done ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {step.stage}
                  </h4>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center italic pt-4 border-t border-slate-100">
          Status events simulated from logistics fleet telematics. No actual GPS tracking claimed.
        </p>
      </div>

      {/* Transport Partner & Destination Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Assigned Transport Fleet Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              Assigned Transport Fleet
            </span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-1.5">
            <h4 className="font-extrabold text-base text-[#102A43]">
              {order.assignedTransport?.companyName || 'Bhopal Swift Logistics'}
            </h4>
            <div className="text-slate-600 font-medium">
              Vehicle: <strong>{order.assignedTransport?.vehicleType}</strong> ({order.assignedTransport?.registrationNo})
            </div>
            <div className="text-slate-500">
              Driver / Captain: <strong>{order.assignedTransport?.driverName}</strong> • {order.assignedTransport?.contact}
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-800">
            <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-bold">
              ETA: {order.assignedTransport?.eta || 'Guaranteed within 24 Hours'}
            </span>
          </div>
        </div>

        {/* Jobsite Destination & Materials Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              Destination & Consignment
            </span>
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px]">Site Address:</span>
            <p className="font-semibold text-slate-800">
              {order.deliveryAddress?.flat}, {order.deliveryAddress?.locality}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <span className="text-slate-400 block text-[11px]">Consignment Items:</span>
            {order.items?.map((it, i) => (
              <div key={i} className="flex justify-between font-bold text-slate-800">
                <span>{it.quantity}x {it.productName}</span>
                <span>{formatCurrency(it.total)}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between font-extrabold text-[#102A43] text-sm">
            <span>Total Landed Amount:</span>
            <span className="text-blue-700">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
