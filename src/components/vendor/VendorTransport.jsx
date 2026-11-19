import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Power, 
  MapPin, 
  Clock, 
  Weight, 
  ShieldCheck, 
  CheckCircle, 
  X,
  Navigation
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export const VendorTransport = () => {
  const { transportPartners, toggleTransportVehicle, updateTransportRates, addTransportVehicle } = useAppData();
  const { currentUser } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    companyName: currentUser?.shopName || 'Sharma Logistics Direct',
    contactPerson: currentUser?.owner || 'Ramesh Sharma',
    phone: '+91 98260 12345',
    vehicleType: 'Pickup Truck',
    vehicleModel: 'Mahindra Bolero Maxi Truck HD',
    registrationNo: 'MP 04 ZB 8820',
    capacityKg: 1800,
    baseFare: 400,
    ratePerKm: 32,
    status: 'Available',
    currentLocation: 'MP Nagar Zone 2',
    serviceAreas: ['MP Nagar', 'Arera Colony', 'Kolar Road', 'BHEL']
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addTransportVehicle({
      ...newVehicle,
      capacityKg: parseInt(newVehicle.capacityKg, 10),
      baseFare: parseFloat(newVehicle.baseFare),
      ratePerKm: parseFloat(newVehicle.ratePerKm)
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#102A43]">Logistics & Fleet Availability</h2>
          <p className="text-xs text-slate-500">
            Dedicated shop vehicles & integrated 3PL logistics mesh across Bhopal (SAP TM Ready)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fleet Vehicle</span>
        </button>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {transportPartners.map((partner) => (
          <div
            key={partner.id}
            className={`bg-white rounded-2xl border p-5 transition shadow-sm flex flex-col justify-between ${
              partner.status === 'Available'
                ? 'border-slate-200 hover:border-blue-300'
                : 'border-slate-200 bg-slate-50/70 opacity-75'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  {partner.vehicleType}
                </span>

                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  partner.status === 'Available'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${partner.status === 'Available' ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                  {partner.status}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-[#102A43]">{partner.companyName}</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">{partner.vehicleModel}</p>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">{partner.registrationNo}</div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Payload Capacity</span>
                  <span className="font-extrabold text-slate-800">{partner.capacityKg.toLocaleString()} kg</span>
                  <span className="text-[10px] text-slate-500 block">~{Math.floor(partner.capacityKg / 50)} cement bags</span>
                </div>

                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Commercial Freight Rate</span>
                  <span className="font-extrabold text-blue-700">₹{partner.ratePerKm} / km</span>
                  <span className="text-[10px] text-slate-500 block">Base: ₹{partner.baseFare}</span>
                </div>
              </div>

              {/* Service Areas */}
              <div className="mt-3 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Active Service Hubs
                </span>
                <div className="flex flex-wrap gap-1">
                  {partner.serviceAreas?.map((area, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle Status Action */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Driver: <strong className="text-slate-700">{partner.contactPerson}</strong>
              </span>

              <button
                onClick={() =>
                  toggleTransportVehicle(
                    partner.id,
                    partner.status === 'Available' ? 'Unavailable' : 'Available'
                  )
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  partner.status === 'Available'
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{partner.status === 'Available' ? 'Set Offline' : 'Set Available'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 text-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-[#102A43]">Register Yard Logistics Vehicle</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Fleet Label</label>
                <input
                  type="text"
                  value={newVehicle.companyName}
                  onChange={(e) => setNewVehicle({ ...newVehicle, companyName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vehicle Type</label>
                  <select
                    value={newVehicle.vehicleType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Two-wheeler">Two-wheeler</option>
                    <option value="Three-wheeler">Three-wheeler</option>
                    <option value="Mini Truck">Mini Truck</option>
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="Medium Truck">Medium Truck</option>
                    <option value="Heavy Truck">Heavy Truck</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Model Name</label>
                  <input
                    type="text"
                    value={newVehicle.vehicleModel}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicleModel: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="e.g. Tata Ace Gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registration No</label>
                  <input
                    type="text"
                    value={newVehicle.registrationNo}
                    onChange={(e) => setNewVehicle({ ...newVehicle, registrationNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono uppercase"
                    placeholder="MP 04 GA 0000"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Capacity (kg)</label>
                  <input
                    type="number"
                    value={newVehicle.capacityKg}
                    onChange={(e) => setNewVehicle({ ...newVehicle, capacityKg: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Fare (₹)</label>
                  <input
                    type="number"
                    value={newVehicle.baseFare}
                    onChange={(e) => setNewVehicle({ ...newVehicle, baseFare: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rate Per Km (₹)</label>
                  <input
                    type="number"
                    value={newVehicle.ratePerKm}
                    onChange={(e) => setNewVehicle({ ...newVehicle, ratePerKm: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
