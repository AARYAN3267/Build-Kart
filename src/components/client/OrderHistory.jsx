import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  MapPin, 
  Truck, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export const OrderHistory = ({ onTrackOrder }) => {
  const { orders, setRecoveryModalOpen, triggerVendorFailure } = useAppData();
  const { currentUser } = useAuth();

  const clientId = currentUser?.id || '1004';
  const clientOrders = orders.filter((o) => o.customerId === clientId || o.customerName === currentUser?.name);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#102A43]">My Jobsite Orders</h2>
          <p className="text-xs text-slate-500">
            Track materials delivery progress and view dispatch history across Bhopal
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {clientOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No orders placed yet. Add items to your cart to order materials.
          </div>
        ) : (
          clientOrders.map((ord) => (
            <div
              key={ord.id}
              className={`bg-white rounded-2xl border transition shadow-sm overflow-hidden ${
                ord.status.includes('Shortage')
                  ? 'border-amber-400 ring-2 ring-amber-400/20'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              {/* Header Bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-blue-700">#{ord.id}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{formatDateTime(ord.orderDate)}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-slate-800">Supplier: {ord.vendorName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ord.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ord.status.includes('Recovered')
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : ord.status.includes('Shortage')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs">
                
                {/* Commodities List */}
                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ordered Materials
                  </span>
                  <div className="space-y-1">
                    {ord.items?.map((it, i) => (
                      <div key={i} className="flex justify-between font-bold text-slate-800">
                        <span>{it.quantity}x {it.productName} ({it.unit})</span>
                        <span>{formatCurrency(it.total)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-slate-500 flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Delivering to: {ord.deliveryAddress?.flat}, {ord.deliveryAddress?.locality}</span>
                  </div>
                </div>

                {/* Pricing & Tracking Button */}
                <div className="md:border-l md:border-slate-100 md:pl-6 space-y-3 flex-shrink-0">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total Landed Amount</span>
                    <span className="text-lg font-black text-[#102A43]">{formatCurrency(ord.totalAmount)}</span>
                    <span className="text-[10px] text-emerald-600 block font-medium">Incl. GST & Direct Freight</span>
                  </div>

                  {ord.status.includes('Shortage') ? (
                    <button
                      onClick={() => {
                        triggerVendorFailure(ord.id);
                        setRecoveryModalOpen(true);
                      }}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 animate-pulse"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Choose Alternative Supplier</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onTrackOrder?.(ord.id)}
                      className="w-full px-4 py-2 bg-[#102A43] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Delivery</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
