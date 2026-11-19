import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Star, 
  CheckCircle, 
  Calendar,
  BarChart2,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend 
} from 'recharts';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export const VendorAnalytics = () => {
  const { products, orders } = useAppData();
  const { currentUser } = useAuth();

  const [period, setPeriod] = useState('weekly'); // daily, weekly, monthly
  const vendorId = currentUser?.id || '3267';
  const vendorOrders = orders.filter((o) => o.vendorId === vendorId);
  const vendorProducts = products.filter((p) => p.vendorId === vendorId);

  const totalRevenue = vendorOrders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Daily Sales (Last 7 Days)
  const dailyData = [
    { name: "Mon", revenue: 42000, orders: 4 },
    { name: "Tue", revenue: 58000, orders: 6 },
    { name: "Wed", revenue: 39000, orders: 3 },
    { name: "Thu", revenue: 84000, orders: 8 },
    { name: "Fri", revenue: 72000, orders: 7 },
    { name: "Sat", revenue: 95000, orders: 11 },
    { name: "Sun", revenue: totalRevenue > 100000 ? 64000 : 49200, orders: 5 }
  ];

  // Weekly Sales (Last 4 Weeks)
  const weeklyData = [
    { name: "Week 1", revenue: 185000, orders: 24 },
    { name: "Week 2", revenue: 240000, orders: 31 },
    { name: "Week 3", revenue: 310000, orders: 42 },
    { name: "Week 4", revenue: 390000, orders: 51 }
  ];

  // Monthly Sales (Past 6 Months)
  const monthlyData = [
    { name: "Jun", revenue: 620000, orders: 85 },
    { name: "Jul", revenue: 780000, orders: 110 },
    { name: "Aug", revenue: 890000, orders: 128 },
    { name: "Sep", revenue: 940000, orders: 135 },
    { name: "Oct", revenue: 1120000, orders: 154 },
    { name: "Nov", revenue: 1280000, orders: 172 }
  ];

  const currentChartData = period === 'daily' ? dailyData : period === 'weekly' ? weeklyData : monthlyData;

  // Category Distribution for PieChart
  const categoryData = [
    { name: "PPC 53 Cement", value: 55, color: "#102A43" },
    { name: "Waterproof Shield", value: 25, color: "#2563EB" },
    { name: "Rapid Setting Slag", value: 20, color: "#16A34A" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#102A43]">Store Commercial Analytics</h2>
          <p className="text-xs text-slate-500">
            Real-time revenue metrics, volume throughput, and customer satisfaction KPIs
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                period === p ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block mb-1">Gross Dispatch Revenue</span>
          <div className="text-xl sm:text-2xl font-black text-[#102A43]">{formatCurrency(totalRevenue)}</div>
          <span className="text-emerald-600 font-bold text-[11px] mt-1 inline-block">+14.2% Growth</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block mb-1">Fulfillment Success Rate</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">98.4%</div>
          <span className="text-slate-500 text-[11px] mt-1 inline-block">1 outage resolved via Joule</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block mb-1">Total Processed Orders</span>
          <div className="text-xl sm:text-2xl font-black text-blue-700">{vendorOrders.length}</div>
          <span className="text-slate-500 text-[11px] mt-1 inline-block">Bhopal contractor base</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 block mb-1">Store Rating</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600">★ 4.8 / 5.0</div>
          <span className="text-slate-500 text-[11px] mt-1 inline-block">142 verified client reviews</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Velocity Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#102A43] capitalize">{period} Sales Volume</h3>
              <p className="text-xs text-slate-400">Order revenue over selected timeframe</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentChartData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), "Revenue"]}
                  contentStyle={{ backgroundColor: '#102A43', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution (1 col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#102A43]">Product Category Share</h3>
            <p className="text-xs text-slate-400 mb-4">Revenue breakdown by product class</p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-extrabold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Best-Selling Products Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-sm text-[#102A43] mb-3">Top Performing Commodities</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Unit Price</th>
                <th className="py-2.5 px-3">Units Dispatched</th>
                <th className="py-2.5 px-3">Total Sales</th>
                <th className="py-2.5 px-3">Stock Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendorProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">#{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{p.name}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{formatCurrency(p.discountPrice)}</td>
                  <td className="py-3 px-3 font-extrabold text-blue-700">{(idx + 1) * 140} bags</td>
                  <td className="py-3 px-3 font-extrabold text-slate-900">{formatCurrency(((idx + 1) * 140) * p.discountPrice)}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      High Demand
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
