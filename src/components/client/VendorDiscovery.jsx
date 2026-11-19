import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Truck, 
  Clock, 
  ArrowRight, 
  Grid, 
  Map as MapIcon, 
  Search,
  Filter
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAppData } from '../../context/AppDataContext';
import { BHOPAL_LOCALITIES, BHOPAL_CENTER, calculateDistanceKm } from '../../utils/bhopalGeo';

// Fix Leaflet marker icon issue in Vite React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom custom marker for BuildKart vendors
const vendorMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const VendorDiscovery = ({ onSelectVendor }) => {
  const { vendors, activeLocality, setActiveLocality } = useAppData();
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'map'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocalityFilter, setSelectedLocalityFilter] = useState('ALL');

  const filteredVendors = vendors.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        v.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        v.locality?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocality = selectedLocalityFilter === 'ALL' || v.locality === selectedLocalityFilter;
    return matchSearch && matchLocality;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search / Toggle */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#102A43]">Nearby Bhopal Vendors & Yards</h2>
          <p className="text-xs text-slate-500">
            Discover verified suppliers in Bhopal with guaranteed 24-hour dispatch fleet
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search supplier or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'cards' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'map' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Interactive Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bhopal Locality Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap mr-1">
          Bhopal Zones:
        </span>
        <button
          onClick={() => setSelectedLocalityFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl font-medium transition text-xs whitespace-nowrap ${
            selectedLocalityFilter === 'ALL'
              ? 'bg-[#102A43] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Bhopal Localities
        </button>
        {BHOPAL_LOCALITIES.map((loc) => (
          <button
            key={loc.name}
            onClick={() => setSelectedLocalityFilter(loc.name)}
            className={`px-3 py-1.5 rounded-xl font-medium transition text-xs whitespace-nowrap ${
              selectedLocalityFilter === loc.name
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* Cards View vs Map View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVendors.map((vendor) => {
            const distance = calculateDistanceKm(
              vendor.latitude,
              vendor.longitude,
              23.2140, // Arera Colony reference
              77.4270
            );

            return (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Vendor Top Banner / Image */}
                  <div className="relative h-32 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-xs font-bold truncate">{vendor.locality}</span>
                      <span className="text-[11px] font-mono bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-emerald-300 font-semibold">
                        {distance} km away
                      </span>
                    </div>

                    {vendor.verified && (
                      <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  {/* Vendor Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-base text-[#102A43] leading-snug">
                        {vendor.name}
                      </h3>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold text-xs flex-shrink-0 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{vendor.rating}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      {vendor.category}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {vendor.description}
                    </p>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{vendor.operatingHours}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>Radius: {vendor.deliveryRadiusKm} km</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    24-Hour Dispatch Ready
                  </span>

                  <button
                    onClick={() => onSelectVendor?.(vendor)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#102A43] hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1 shadow-sm"
                  >
                    <span>View Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* INTERACTIVE LEAFLET MAP VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm overflow-hidden space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#102A43]">
              Bhopal Material Logistics Map (Showing {filteredVendors.length} Suppliers)
            </span>
            <span className="text-slate-400 text-[11px]">
              Click on pins to inspect supplier yard inventory & contact
            </span>
          </div>

          <div className="h-[480px] w-full rounded-2xl overflow-hidden border border-slate-200 relative">
            <MapContainer
              center={BHOPAL_CENTER}
              zoom={12}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredVendors.map((vendor) => (
                <Marker
                  key={vendor.id}
                  position={[vendor.latitude, vendor.longitude]}
                  icon={vendorMarkerIcon}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <div className="font-bold text-slate-900">{vendor.name}</div>
                      <div className="text-[11px] text-slate-500">{vendor.address}</div>
                      <div className="text-[11px] text-emerald-600 font-semibold">★ {vendor.rating} • {vendor.category}</div>
                      <button
                        onClick={() => onSelectVendor?.(vendor)}
                        className="mt-1 w-full py-1 bg-blue-600 text-white rounded text-[11px] font-bold"
                      >
                        Explore Yard Products
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

    </div>
  );
};
