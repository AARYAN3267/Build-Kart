import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  CheckCircle, 
  Edit3, 
  Save, 
  X,
  Truck,
  FileText,
  Navigation
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';

export const VendorProfile = () => {
  const { vendors, updateVendorProfile } = useAppData();
  const { currentUser } = useAuth();

  const vendorId = currentUser?.id || '3267';
  const vendor = vendors.find((v) => v.id === vendorId) || vendors[0];

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: vendor.name,
    owner: vendor.owner,
    logo: vendor.logo,
    description: vendor.description,
    phone: vendor.phone,
    email: vendor.email,
    category: vendor.category,
    address: vendor.address,
    city: vendor.city,
    state: vendor.state,
    pincode: vendor.pincode,
    latitude: vendor.latitude,
    longitude: vendor.longitude,
    locality: vendor.locality,
    operatingHours: vendor.operatingHours,
    workingDays: vendor.workingDays,
    deliveryRadiusKm: vendor.deliveryRadiusKm,
    gstin: vendor.gstin
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateVendorProfile(vendorId, {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      deliveryRadiusKm: parseInt(formData.deliveryRadiusKm, 10)
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Edit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={vendor.logo}
            alt={vendor.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#102A43]">{vendor.name}</h2>
              {vendor.verified && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Supplier
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Supplier ID: <span className="font-mono font-bold text-slate-700">{vendor.id}</span> • {vendor.category}
            </p>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-xl bg-[#102A43] hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              <span>EDIT PROFILE</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>SAVE CHANGES</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Info or Edit Form */}
      {!isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Business Overview & Location (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#102A43] uppercase tracking-wider text-xs">
                About the Business
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {vendor.description}
              </p>
            </div>

            {/* Address & Bhopal Geographic Specs */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Operating Yard & Location
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Full Street Address</span>
                  <span className="font-bold text-slate-800">{vendor.address}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Locality & City</span>
                  <span className="font-bold text-slate-800">{vendor.locality}, {vendor.city} ({vendor.state})</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">PIN Code</span>
                  <span className="font-bold font-mono text-slate-800">{vendor.pincode}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">GPS Coordinates (Lat / Lng)</span>
                  <span className="font-bold font-mono text-blue-700">
                    {vendor.latitude?.toFixed(4)}, {vendor.longitude?.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timings & Service Area */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
                Service Delivery Scope & Timings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Operating Hours</span>
                    <span className="font-bold text-slate-800">{vendor.operatingHours}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Working Days</span>
                    <span className="font-bold text-slate-800">{vendor.workingDays}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Max Delivery Radius</span>
                    <span className="font-bold text-slate-800">{vendor.deliveryRadiusKm} Kilometers</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Contact & Legal Identifiers (1 col) */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Contact Person & Office
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Proprietor / Owner</span>
                  <span className="font-bold text-slate-800">{vendor.owner}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Phone</span>
                  <span className="font-bold text-slate-800">{vendor.phone}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Business Email</span>
                  <span className="font-bold text-blue-700">{vendor.email}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Compliance & Tax Master
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">GSTIN Registration</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block">
                    {vendor.gstin}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">State Jurisdiction</span>
                  <span className="font-bold text-slate-800">Commercial Tax Dept, Bhopal (MP)</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Verification Seal</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-xs mt-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified SAP Ariba Supplier
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* EDIT PROFILE FORM */
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-[#102A43]">Edit Store & Yard Information</h3>
            <p className="text-slate-500 text-xs">All updates persist to the centralized frontend state and localStorage.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Shop Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Owner Name *</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Business Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">GSTIN</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Street Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Bhopal Locality</label>
              <input
                type="text"
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Operating Hours</label>
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Working Days</label>
              <input
                type="text"
                value={formData.workingDays}
                onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Delivery Radius (km)</label>
              <input
                type="number"
                value={formData.deliveryRadiusKm}
                onChange={(e) => setFormData({ ...formData, deliveryRadiusKm: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Business Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
            >
              Save Profile
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
