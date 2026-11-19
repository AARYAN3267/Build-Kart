import React, { useState } from 'react';
import { Tag, Save, CheckCircle2, TrendingDown, Percent, Layers, Power } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export const VendorPricing = () => {
  const { products, updateProductPrice } = useAppData();
  const { currentUser } = useAuth();

  const vendorId = currentUser?.id || '3267';
  const vendorProducts = products.filter((p) => p.vendorId === vendorId);

  const [pricingState, setPricingState] = useState(() => {
    const map = {};
    vendorProducts.forEach((p) => {
      map[p.id] = {
        sellingPrice: p.sellingPrice,
        discountPrice: p.discountPrice,
        bulkPrice: p.bulkPrice || p.discountPrice,
        bulkMinQty: p.bulkMinQty || 20,
        available: p.available
      };
    });
    return map;
  });

  const [saveSuccess, setSaveSuccess] = useState('');

  const handleChange = (productId, field, value) => {
    setPricingState((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  const handleSaveRow = (productId, productName) => {
    const item = pricingState[productId];
    if (item) {
      updateProductPrice(productId, item);
      setSaveSuccess(`Updated pricing for ${productName}. Synced with client price comparison engine!`);
      setTimeout(() => setSaveSuccess(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#102A43]">Pricing & Commercial Tiers</h2>
          <p className="text-xs text-slate-500">
            Set retail prices, contractor discounts, bulk order volume breaks, and catalog visibility.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Pricing Cards List */}
      <div className="space-y-4">
        {vendorProducts.map((p) => {
          const rowState = pricingState[p.id] || {
            sellingPrice: p.sellingPrice,
            discountPrice: p.discountPrice,
            bulkPrice: p.bulkPrice,
            bulkMinQty: p.bulkMinQty,
            available: p.available
          };

          const discountPercent = Math.round(
            ((rowState.sellingPrice - rowState.discountPrice) / rowState.sellingPrice) * 100
          );

          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border transition bg-white shadow-sm ${
                !rowState.available ? 'opacity-60 bg-slate-50 border-slate-200' : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Product Identity */}
                <div className="flex items-center gap-3 min-w-[240px]">
                  <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover border" />
                  <div>
                    <h4 className="font-bold text-sm text-[#102A43]">{p.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">SKU: {p.sku} • {p.unit}</p>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold mt-1 inline-block">
                      {p.category}
                    </span>
                  </div>
                </div>

                {/* Input Fields Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs flex-1 max-w-2xl">
                  {/* MRP / Selling Price */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      MRP / Base (₹)
                    </label>
                    <input
                      type="number"
                      value={rowState.sellingPrice}
                      onChange={(e) => handleChange(p.id, 'sellingPrice', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Discount / Final Retail Price */}
                  <div>
                    <label className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                      Discounted Price (₹)
                    </label>
                    <input
                      type="number"
                      value={rowState.discountPrice}
                      onChange={(e) => handleChange(p.id, 'discountPrice', e.target.value)}
                      className="w-full px-3 py-1.5 border border-emerald-400 rounded-lg font-extrabold text-emerald-800 bg-emerald-50/40 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Bulk Tier Price */}
                  <div>
                    <label className="text-[10px] font-bold text-blue-700 uppercase block mb-1">
                      Bulk Price (₹)
                    </label>
                    <input
                      type="number"
                      value={rowState.bulkPrice}
                      onChange={(e) => handleChange(p.id, 'bulkPrice', e.target.value)}
                      className="w-full px-3 py-1.5 border border-blue-400 rounded-lg font-bold text-blue-800 bg-blue-50/40 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Bulk Min Order Qty */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Bulk MOQ (Units)
                    </label>
                    <input
                      type="number"
                      value={rowState.bulkMinQty}
                      onChange={(e) => handleChange(p.id, 'bulkMinQty', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Status Toggle & Save Action */}
                <div className="flex items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end">
                  <button
                    type="button"
                    onClick={() => handleChange(p.id, 'available', !rowState.available)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      rowState.available
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-rose-50 text-rose-700 border border-rose-300'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{rowState.available ? 'Active' : 'Disabled'}</span>
                  </button>

                  <button
                    onClick={() => handleSaveRow(p.id, p.name)}
                    className="px-4 py-2 bg-[#102A43] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
