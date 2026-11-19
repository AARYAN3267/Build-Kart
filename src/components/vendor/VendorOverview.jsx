import React from 'react';
import { 
  Package, 
  Layers, 
  AlertTriangle, 
  XCircle, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Truck,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export const VendorOverview = ({ setActiveTab, openAddProduct }) => {
  const { products, orders, transportPartners, triggerVendorFailure } = useAppData();
  const { currentUser } = useAuth();

  const vendorId = currentUser?.id || '3267';
  const vendorProducts = products.filter((p) => p.vendorId === vendorId);
  const vendorOrders = orders.filter((o) => o.vendorId === vendorId);

  // Compute metrics
  const totalStockUnits = vendorProducts.reduce((sum, p) => sum + (p.availableQuantity || 0), 0);
  const lowStockCount = vendorProducts.filter((p) => p.availableQuantity > 0 && p.availableQuantity <= p.reorderLevel).length;
  const outOfStockCount = vendorProducts.filter((p) => p.availableQuantity <= 0).length;

  const newOrdersCount = vendorOrders.filter((o) => o.status === 'Confirmed').length;
  const pendingOrdersCount = vendorOrders.filter((o) => o.status === 'Confirmed' || o.status === 'Preparing' || o.status === 'Ready for Pickup').length;
  const completedOrdersCount = vendorOrders.filter((o) => o.status === 'Delivered').length;
  const totalRevenue = vendorOrders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Recharts Chart Data
  const revenueChartData = [
    { day: "Mon", revenue: 42000 },
    { day: "Tue", revenue: 58000 },
    { day: "Wed", revenue: 39000 },
    { day: "Thu", revenue: 84000 },
    { day: "Fri", revenue: 72000 },
    { day: "Sat", revenue: 95000 },
    { day: "Sun", revenue: totalRevenue > 100000 ? 64000 : 49200 }
  ];

  const recentOrders = vendorOrders.slice(0, 5);
  const lowStockItems = vendorProducts.filter((p) => p.availableQuantity <= p.reorderLevel);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Hackathon Spotlight Action */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#102A43] text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Authorized Supplier Portal
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
              Bhopal MP Nagar Zone II
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser?.name || 'Ramesh Sharma'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {currentUser?.shopName || 'Sharma Cement Traders'} is currently operating with 24-Hour Jobsite Dispatch active.
          </p>
        </div>

        {/* Spotlight Hackathon Simulation Button */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => triggerVendorFailure("ORD-BK-8821")}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-900/30 transition-all flex items-center gap-2 border border-white/20 hover:scale-105 active:scale-95"
            title="Triggers the centerpiece Autonomous Supply Chain Recovery workflow on Order ORD-BK-8821"
          >
            <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
            <span>SIMULATE VENDOR FAILURE</span>
          </button>

          <button
            onClick={openAddProduct}
            className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 8 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total Products */}
        <div 
          onClick={() => setActiveTab('products')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Products</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#102A43]">{vendorProducts.length}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Active catalog listings</span>
        </div>

        {/* Available Stock */}
        <div 
          onClick={() => setActiveTab('inventory')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Available Stock</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{totalStockUnits.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Physical units ready</span>
        </div>

        {/* Low Stock Items */}
        <div 
          onClick={() => setActiveTab('inventory')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{lowStockCount}</div>
          <span className="text-[11px] text-amber-700 mt-0.5 block">Near reorder limit</span>
        </div>

        {/* Out of Stock Items */}
        <div 
          onClick={() => setActiveTab('inventory')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Out of Stock</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600">{outOfStockCount}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Require procurement</span>
        </div>

        {/* New Orders */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">New Orders</span>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#102A43]">{newOrdersCount}</div>
          <span className="text-[11px] text-blue-600 font-medium mt-0.5 block">Awaiting confirmation</span>
        </div>

        {/* Pending Orders */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700">{pendingOrdersCount}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">In preparation/dispatch</span>
        </div>

        {/* Completed Orders */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Completed Orders</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{completedOrdersCount}</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">Successfully delivered</span>
        </div>

        {/* Total Revenue */}
        <div 
          onClick={() => setActiveTab('analytics')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#102A43]">{formatCurrency(totalRevenue)}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Bhopal region gross</span>
        </div>

      </div>

      {/* Middle Row: Revenue Chart & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#102A43]">Weekly Revenue & Order Velocity</h3>
              <p className="text-xs text-slate-400">Simulated SAP Analytics Cloud CDS View aggregation</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +18.4% vs last week
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(val) => [formatCurrency(val), "Revenue"]}
                  contentStyle={{ backgroundColor: '#102A43', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts & Performance (1 col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[#102A43]">Stock Alerts</h3>
              <button 
                onClick={() => setActiveTab('inventory')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {lowStockItems.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium text-center">
                  All inventory healthy above safety threshold.
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <div className="text-[11px] text-slate-500">Reorder limit: {item.reorderLevel} units</div>
                    </div>
                    <span className="font-extrabold text-amber-700 bg-white px-2 py-1 rounded border border-amber-300">
                      {item.availableQuantity} left
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Vendor SLA & Reliability
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Fulfillment Success Rate</span>
                <span className="font-bold text-emerald-600">98.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Average Turnaround (Pack to Dispatch)</span>
                <span className="font-bold text-slate-800">42 mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Customer Rating</span>
                <span className="font-bold text-blue-600">★ 4.8 / 5.0 (142 reviews)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Recent Incoming Orders */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-[#102A43]">Recent Jobsite Orders</h3>
            <p className="text-xs text-slate-400">Incoming contractor demand for materials across Bhopal</p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Incoming</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Commodities</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Address</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">{ord.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{ord.customerName}</td>
                  <td className="py-3 px-3 text-slate-600 truncate max-w-xs">
                    {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900">{formatCurrency(ord.totalAmount)}</td>
                  <td className="py-3 px-3 text-slate-500 truncate max-w-[150px]">{ord.deliveryAddress?.locality}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
