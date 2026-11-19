import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Truck, 
  Sparkles,
  ChevronRight,
  Package
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export const VendorOrders = () => {
  const { orders, updateOrderStatus, triggerVendorFailure } = useAppData();
  const { currentUser } = useAuth();

  const vendorId = currentUser?.id || '3267';
  const vendorOrders = orders.filter((o) => o.vendorId === vendorId);

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = vendorOrders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return o.status === filterStatus;
  });

  const handleAction = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleReportShortage = (orderId) => {
    // Triggers the central Autonomous Joule AI Recovery Workflow!
    triggerVendorFailure(orderId);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#102A43]">Incoming Jobsite Orders</h2>
          <p className="text-xs text-slate-500">
            Fulfill incoming customer requests, assign transport stages, or report stock variances.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['ALL', 'Confirmed', 'Preparing', 'Ready for Pickup', 'In Transit', 'Delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition text-xs ${
                filterStatus === status
                  ? 'bg-[#102A43] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No orders found under this filter.
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className={`bg-white rounded-2xl border transition overflow-hidden shadow-sm ${
                ord.status.includes('Shortage')
                  ? 'border-amber-400 ring-2 ring-amber-400/20'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              {/* Order Header */}
              <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-sm text-blue-700">
                    #{ord.id}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{formatDateTime(ord.orderDate)}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {ord.customerName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Target Delivery:</span>
                  <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border">
                    {formatDateTime(ord.deliveryDeadline)}
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ord.status === 'Confirmed'
                      ? 'bg-blue-100 text-blue-800'
                      : ord.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ord.status.includes('Shortage')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              </div>

              {/* Order Body Details */}
              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-xs">
                
                {/* Commodities in Order */}
                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ordered Commodities & Quantities
                  </span>
                  <div className="space-y-1.5">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="font-bold text-slate-800">
                          {item.quantity} x {item.productName}
                          <span className="text-slate-400 font-normal ml-2">({item.unit})</span>
                        </div>
                        <span className="font-extrabold text-slate-900">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Location & Phone */}
                <div className="lg:w-72 p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Jobsite Destination
                  </span>
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{ord.deliveryAddress?.flat}, {ord.deliveryAddress?.locality}, {ord.deliveryAddress?.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ord.customerPhone}</span>
                  </div>
                  <div className="pt-1 text-slate-900 font-extrabold flex justify-between">
                    <span>Order Total:</span>
                    <span className="text-blue-700 text-sm">{formatCurrency(ord.totalAmount)}</span>
                  </div>
                </div>

                {/* Actions Pipeline */}
                <div className="flex flex-wrap lg:flex-col items-center gap-2 lg:w-48">
                  {ord.status === 'Confirmed' && (
                    <>
                      <button
                        onClick={() => handleAction(ord.id, 'Preparing')}
                        className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                      >
                        Start Preparing
                      </button>

                      {/* THE CRITICAL SHORTAGE BUTTON */}
                      <button
                        onClick={() => handleReportShortage(ord.id)}
                        className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs transition flex items-center justify-center gap-1.5"
                        title="Simulate vendor stock breach and trigger Joule AI recovery"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Report Stock Shortage</span>
                      </button>
                    </>
                  )}

                  {ord.status === 'Preparing' && (
                    <button
                      onClick={() => handleAction(ord.id, 'Ready for Pickup')}
                      className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      Ready for Pickup
                    </button>
                  )}

                  {ord.status === 'Ready for Pickup' && (
                    <button
                      onClick={() => handleAction(ord.id, 'In Transit')}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Handover to Transit</span>
                    </button>
                  )}

                  {ord.status === 'In Transit' && (
                    <button
                      onClick={() => handleAction(ord.id, 'Delivered')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Confirm Delivery</span>
                    </button>
                  )}

                  {ord.status === 'Delivered' && (
                    <span className="w-full py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs text-center flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Fulfilled
                    </span>
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
