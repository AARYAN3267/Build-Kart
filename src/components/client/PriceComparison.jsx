import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  MapPin, 
  Truck, 
  Clock, 
  ShoppingBag, 
  ShieldCheck,
  TrendingDown,
  Zap,
  Award
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { formatCurrency } from '../../utils/formatters';
import { calculateDistanceKm } from '../../utils/bhopalGeo';

export const PriceComparison = ({ initialProduct = null, onBack }) => {
  const { products, vendors, addToCart, activeLocality } = useAppData();

  // Find comparable items (e.g. UltraTech cement or other cement products)
  const defaultCategory = initialProduct ? initialProduct.category : 'Cement';
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  // Filter products by selected category
  const categoryProducts = products.filter((p) => p.category === selectedCategory);
  
  // Pick active target product or first product
  const [targetProduct, setTargetProduct] = useState(() => {
    return initialProduct || categoryProducts[0] || products[0];
  });

  // Find all vendors providing products in this category or comparable brand
  const comparisonList = categoryProducts.map((prod) => {
    const vendor = vendors.find((v) => v.id === prod.vendorId) || {
      name: prod.vendorName,
      locality: prod.vendorLocality || 'Bhopal',
      rating: 4.8,
      deliveryRadiusKm: 25,
      latitude: 23.2325,
      longitude: 77.4326
    };

    const distanceKm = calculateDistanceKm(
      vendor.latitude,
      vendor.longitude,
      23.2140, // reference locality (Arera Colony)
      77.4270
    );

    // Calculated delivery charge based on distance
    const deliveryCharge = Math.round(150 + distanceKm * 25);
    const totalCost = prod.discountPrice + deliveryCharge;

    // Delivery time estimate
    const isLocalZone = vendor.locality === activeLocality;
    const estHours = isLocalZone ? 4 : Math.ceil(distanceKm * 1.5 + 4);

    return {
      product: prod,
      vendor: vendor,
      unitPrice: prod.discountPrice,
      sellingPrice: prod.sellingPrice,
      availableStock: prod.availableQuantity,
      distanceKm: distanceKm,
      deliveryCharge: deliveryCharge,
      totalCost: totalCost,
      vendorRating: vendor.rating,
      estDeliveryText: estHours <= 4 ? "Express (4 Hours)" : `Guaranteed in ${estHours}h`,
      estHours: estHours,
      // Overall suitability composite score: Stock (30%) + Distance (25%) + Price (25%) + Rating (20%)
      score: (prod.availableQuantity * 0.1) - (distanceKm * 2) - (prod.discountPrice * 0.1) + (vendor.rating * 20)
    };
  });

  // Determine highlights:
  // 1. Best Price
  const sortedByPrice = [...comparisonList].sort((a, b) => a.unitPrice - b.unitPrice);
  const bestPriceId = sortedByPrice[0]?.product.id;

  // 2. Fastest Delivery
  const sortedBySpeed = [...comparisonList].sort((a, b) => a.estHours - b.estHours);
  const fastestDeliveryId = sortedBySpeed[0]?.product.id;

  // 3. Best Overall Option (High stock + reliable vendor rating + feasible distance)
  const sortedByScore = [...comparisonList].sort((a, b) => b.score - a.score);
  const bestOverallId = sortedByScore[0]?.product.id;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#102A43]">Multi-Vendor Price Comparison</h2>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">
                Joule Procurement Matrix
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Benchmark equivalent specifications across Bhopal verified suppliers
            </p>
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {['Cement', 'Steel', 'Electrical', 'Plumbing', 'Paint', 'Tiles'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-[#102A43] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Highlight Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-700">
            <strong>Procurement Algorithm:</strong> Compares available stock, vendor rating, haulage distance, and 24h jobsite reliability.
          </span>
        </div>
        <span className="font-bold text-blue-700 hidden sm:inline">Bhopal Hub Network</span>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {comparisonList.map((item) => {
          const isBestPrice = item.product.id === bestPriceId;
          const isFastest = item.product.id === fastestDeliveryId;
          const isBestOverall = item.product.id === bestOverallId;

          return (
            <div
              key={item.product.id}
              className={`bg-white rounded-3xl border p-5 shadow-sm transition-all duration-200 flex flex-col justify-between relative ${
                isBestOverall
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              {/* Highlight Badge */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {isBestOverall && (
                  <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Award className="w-3 h-3" /> Best Overall Option
                  </span>
                )}
                {isBestPrice && (
                  <span className="bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <TrendingDown className="w-3 h-3" /> Best Price
                  </span>
                )}
                {isFastest && (
                  <span className="bg-purple-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Zap className="w-3 h-3" /> Fastest Delivery
                  </span>
                )}
              </div>

              <div>
                {/* Vendor Identity */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-extrabold text-base text-[#102A43]">
                      {item.vendor.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.vendor.locality} • {item.distanceKm} km away</span>
                    </div>
                  </div>

                  <span className="flex items-center gap-0.5 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{item.vendorRating}</span>
                  </span>
                </div>

                {/* Product Name */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 my-3 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Product Listing
                  </span>
                  <div className="font-bold text-slate-800 mt-0.5 line-clamp-1">{item.product.name}</div>
                  <div className="text-[11px] text-slate-500">{item.product.brand} • {item.product.unit}</div>
                </div>

                {/* Metrics Comparison Table */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Unit Price</span>
                    <span className="font-extrabold text-slate-900">{formatCurrency(item.unitPrice)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Available Stock</span>
                    <span className="font-extrabold text-emerald-700">{item.availableStock} Units</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Est. Haulage & Delivery</span>
                    <span className="font-bold text-slate-700">{formatCurrency(item.deliveryCharge)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Delivery Turnaround</span>
                    <span className="font-bold text-purple-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.estDeliveryText}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 pt-2 font-bold text-sm text-[#102A43]">
                    <span>Total Landed Unit Cost:</span>
                    <span className="text-base text-blue-700">{formatCurrency(item.totalCost)}</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart Action */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    addToCart(item.product, 1);
                    alert(`Added 1 unit of ${item.product.name} from ${item.vendor.name} to cart.`);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 ${
                    isBestOverall
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-[#102A43] hover:bg-blue-700 text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Choose This Vendor</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
