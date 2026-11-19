import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Flame, 
  Percent, 
  TrendingUp,
  HardHat,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { ProductCard } from './ProductCard';
import { CategoryGrid } from './CategoryGrid';
import { BHOPAL_LOCALITIES } from '../../utils/bhopalGeo';
import { formatCurrency } from '../../utils/formatters';

export const ClientHome = ({ 
  onSelectCategory, 
  onSelectProduct, 
  onCompareProduct, 
  onExploreVendors, 
  onOpenJoule 
}) => {
  const { products, vendors, activeLocality, setActiveLocality, triggerVendorFailure } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');

  // Popular products (high rating/reviews)
  const popularProducts = products.filter((p) => p.rating >= 4.8).slice(0, 4);

  // Best deals (biggest discount)
  const bestDeals = products
    .filter((p) => p.sellingPrice > p.discountPrice)
    .sort((a, b) => (b.sellingPrice - b.discountPrice) - (a.sellingPrice - a.discountPrice))
    .slice(0, 4);

  // Recently added / available commodities
  const recentProducts = products.slice(0, 4);

  // Local vendors preview (top 3)
  const localVendorsPreview = vendors.slice(0, 3);

  return (
    <div className="space-y-10">
      
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#102A43] via-[#1E3A5F] to-[#102A43] text-white p-8 sm:p-12 shadow-2xl border border-slate-700">
        {/* Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          {/* 24-Hour Delivery Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide shadow-sm">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed 24-Hour Jobsite Delivery Across Bhopal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
            Everything You Need for Your Home Construction,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
              Delivered Faster.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover nearby vendors, compare prices and get eligible products delivered within 24 hours. Powered by autonomous multi-agent failover logistics.
          </p>

          {/* Quick Search & Locality Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cement, steel, wires, CPVC pipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
            </div>

            <button
              onClick={onOpenJoule}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Joule AI</span>
            </button>
          </div>
        </div>

        {/* Hero Features Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-700/60 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-[11px]">24-Hour SLA</div>
              <span className="text-[10px] text-slate-400">Fast jobsite drop</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-[11px]">Auto Recovery</div>
              <span className="text-[10px] text-slate-400">Joule failover shield</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-[11px]">Verified Yards</div>
              <span className="text-[10px] text-slate-400">100% genuine brands</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-[11px]">Heavy Freight</div>
              <span className="text-[10px] text-slate-400">Direct tipper & truck</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Construction Commodity Categories */}
      <CategoryGrid onSelectCategory={onSelectCategory} />

      {/* Popular Products Carousel / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-extrabold text-[#102A43]">Popular Jobsite Essentials</h2>
          </div>
          <button
            onClick={() => onSelectCategory('ALL')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelectProduct={onSelectProduct}
              onCompareProduct={onCompareProduct}
            />
          ))}
        </div>
      </div>

      {/* Best Deals & Volume Discounts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-extrabold text-[#102A43]">Best Deals & Contractor Savings</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestDeals.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelectProduct={onSelectProduct}
              onCompareProduct={onCompareProduct}
            />
          ))}
        </div>
      </div>

      {/* Nearby Local Vendors Showcase */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-[#102A43]">Verified Bhopal Material Suppliers</h2>
            <p className="text-xs text-slate-500">Authorized dealers in MP Nagar, Kolar, Arera Colony, and BHEL</p>
          </div>

          <button
            onClick={onExploreVendors}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1"
          >
            <span>Explore All 10 Vendors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {localVendorsPreview.map((v) => (
            <div
              key={v.id}
              onClick={onExploreVendors}
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition cursor-pointer space-y-3"
            >
              <div className="flex items-center gap-3">
                <img src={v.logo} alt={v.name} className="w-12 h-12 rounded-xl object-cover border" />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[#102A43] truncate">{v.name}</h4>
                  <p className="text-[11px] text-slate-500">{v.locality} • ★ {v.rating}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{v.description}</p>
              <div className="text-[11px] font-bold text-blue-600 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Radius: {v.deliveryRadiusKm} km</span>
                <span>View Products &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
