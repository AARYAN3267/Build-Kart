import React, { useState } from 'react';
import { X, Upload, Plus, AlertCircle, Check } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';

export const AddProductModal = ({ isOpen, onClose }) => {
  const { addProduct } = useAppData();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Cement',
    brand: '',
    description: '',
    unit: 'Piece',
    sellingPrice: '',
    discountPrice: '',
    bulkPrice: '',
    bulkMinQty: '10',
    availableQuantity: '100',
    minOrderQuantity: '1',
    specifications: '',
    gstPercentage: '18',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&auto=format&fit=crop&q=80',
    eligible24HrDelivery: true
  });

  const [imagePreview, setImagePreview] = useState(formData.image);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = [
    'Cement',
    'Steel',
    'Bricks',
    'Sand',
    'Electrical',
    'Plumbing',
    'Paint',
    'Hardware',
    'Tiles',
    'Home Improvement'
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sellingPrice || !formData.availableQuantity) {
      setError('Please fill in product name, price, and available stock.');
      return;
    }

    const newProd = {
      ...formData,
      sellingPrice: parseFloat(formData.sellingPrice),
      discountPrice: parseFloat(formData.discountPrice || formData.sellingPrice),
      bulkPrice: parseFloat(formData.bulkPrice || formData.discountPrice || formData.sellingPrice),
      bulkMinQty: parseInt(formData.bulkMinQty, 10) || 1,
      availableQuantity: parseInt(formData.availableQuantity, 10) || 0,
      reorderLevel: Math.max(10, Math.floor(parseInt(formData.availableQuantity, 10) * 0.2)),
      minOrderQuantity: parseInt(formData.minOrderQuantity, 10) || 1,
      gstPercentage: parseInt(formData.gstPercentage, 10) || 18,
      vendorId: currentUser?.id || '3267',
      vendorName: currentUser?.shopName || 'Sharma Cement Traders',
      vendorLocality: currentUser?.locality || 'MP Nagar',
      rating: 5.0,
      reviews: 0,
      available: parseInt(formData.availableQuantity, 10) > 0
    };

    addProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#102A43] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Add New Commodity / Product</h3>
            <p className="text-xs text-slate-300">Publish stock directly to BuildKart Bhopal marketplace</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. UltraTech Super Cement 50kg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. UltraTech / Havells"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Unit of Measure</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. Bag (50kg) / Coil (90m)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">GST Rate (%)</label>
              <select
                value={formData.gstPercentage}
                onChange={(e) => setFormData({ ...formData, gstPercentage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="5">5% (Sand / Stone)</option>
                <option value="12">12% (Bricks)</option>
                <option value="18">18% (Steel / Electrical / Paint)</option>
                <option value="28">28% (Cement)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="390"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Discount Price (₹)</label>
              <input
                type="number"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                placeholder="375"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Available Stock (Qty) *</label>
              <input
                type="number"
                value={formData.availableQuantity}
                onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                placeholder="250"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Bulk Order Price (₹)</label>
              <input
                type="number"
                value={formData.bulkPrice}
                onChange={(e) => setFormData({ ...formData, bulkPrice: e.target.value })}
                placeholder="360"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Bulk Min Quantity (MOQ)</label>
              <input
                type="number"
                value={formData.bulkMinQty}
                onChange={(e) => setFormData({ ...formData, bulkMinQty: e.target.value })}
                placeholder="50"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Technical Specs & Certifications</label>
            <input
              type="text"
              value={formData.specifications}
              onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
              placeholder="e.g. Grade: PPC 53 | IS:1489 Part 1 Certified | Weather Resistant"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide commodity details for contractor site engineers..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Image Upload & Preview */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Image Preview</label>
            <div className="flex items-center gap-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-sm"
              />
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">Supports local image selection with preview</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="eligible24"
              checked={formData.eligible24HrDelivery}
              onChange={(e) => setFormData({ ...formData, eligible24HrDelivery: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="eligible24" className="font-semibold text-slate-700 text-xs cursor-pointer">
              Enable Guaranteed 24-Hour Jobsite Delivery eligibility
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
