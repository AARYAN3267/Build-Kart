import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Package
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/formatters';

export const VendorInventory = () => {
  const { products, updateStock } = useAppData();
  const { currentUser } = useAuth();

  const vendorId = currentUser?.id || '3267';
  const vendorProducts = products.filter((p) => p.vendorId === vendorId);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockInput, setStockInput] = useState('');
  const [reorderInput, setReorderInput] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  const filteredProducts = vendorProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartEdit = (product) => {
    setEditingStockId(product.id);
    setStockInput(product.availableQuantity.toString());
    setReorderInput(product.reorderLevel.toString());
  };

  const handleSaveStock = (productId) => {
    const newQty = parseInt(stockInput, 10);
    const newReorder = parseInt(reorderInput, 10);
    updateStock(productId, newQty, newReorder);
    setEditingStockId(null);
    setSuccessBanner(`Inventory updated! Changes immediately synchronized with client marketplace.`);
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  const getStockBadge = (available, reorder) => {
    if (available <= 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <XCircle className="w-3 h-3 text-rose-600" /> Out of Stock
        </span>
      );
    }
    if (available <= reorder) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-600" /> Low Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle className="w-3 h-3 text-emerald-600" /> In Stock
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#102A43]">Physical Yard Inventory Control</h2>
          <p className="text-xs text-slate-500">
            Real-time stock balance. Changes instantly feed customer search, Joule AI, and dispatch.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Synchronized Feedback Notice */}
      {successBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Commodity / Material</th>
                <th className="py-3.5 px-4">SKU Code</th>
                <th className="py-3.5 px-4">Total Physical</th>
                <th className="py-3.5 px-4">Reserved Stock</th>
                <th className="py-3.5 px-4">Available For Sale</th>
                <th className="py-3.5 px-4">Reorder Level</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const isEditing = editingStockId === p.id;
                const totalStock = (p.availableQuantity || 0) + (p.reservedQuantity || 0);

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover border" />
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.category} • {p.unit}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{p.sku}</td>
                    
                    <td className="py-3.5 px-4 font-extrabold text-slate-800">{totalStock}</td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {p.reservedQuantity || 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={stockInput}
                          onChange={(e) => setStockInput(e.target.value)}
                          className="w-20 px-2 py-1 rounded-lg border border-blue-500 font-bold text-slate-900 text-xs focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="font-extrabold text-base text-slate-900">
                          {p.availableQuantity}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={reorderInput}
                          onChange={(e) => setReorderInput(e.target.value)}
                          className="w-16 px-2 py-1 rounded-lg border border-blue-500 font-bold text-slate-900 text-xs focus:outline-none"
                        />
                      ) : (
                        <span className="font-medium text-slate-600">{p.reorderLevel}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStockBadge(p.availableQuantity, p.reorderLevel)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingStockId(null)}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-[11px]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveStock(p.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-blue-700 font-semibold text-[11px] transition"
                        >
                          Update Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
