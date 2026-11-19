import React, { useState } from 'react';
import { ClientLayout } from '../../layouts/ClientLayout';
import { ClientHome } from '../../components/client/ClientHome';
import { ProductCard } from '../../components/client/ProductCard';
import { CategoryGrid, CATEGORIES } from '../../components/client/CategoryGrid';
import { VendorDiscovery } from '../../components/client/VendorDiscovery';
import { PriceComparison } from '../../components/client/PriceComparison';
import { OrderHistory } from '../../components/client/OrderHistory';
import { DeliveryTracker } from '../../components/client/DeliveryTracker';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck,
  CheckCircle2,
  Package
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ClientDashboard = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProductForCompare, setSelectedProductForCompare] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  // Search & Filtering state for 'all-products'
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('ALL');
  const [only24Hr, setOnly24Hr] = useState(false);
  const [sortBy, setSortBy] = useState('FEATURED');

  const { products, vendors, activeLocality } = useAppData();
  const { currentUser } = useAuth();

  // Filtered Products for All Products & Categories
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const match24Hr = !only24Hr || p.eligible24HrDelivery;

    let matchPrice = true;
    if (priceFilter === 'UNDER_1000') matchPrice = p.discountPrice < 1000;
    if (priceFilter === '1000_5000') matchPrice = p.discountPrice >= 1000 && p.discountPrice <= 5000;
    if (priceFilter === 'OVER_5000') matchPrice = p.discountPrice > 5000;

    return matchSearch && matchCat && match24Hr && matchPrice;
  }).sort((a, b) => {
    if (sortBy === 'PRICE_LOW') return a.discountPrice - b.discountPrice;
    if (sortBy === 'PRICE_HIGH') return b.discountPrice - a.discountPrice;
    if (sortBy === 'RATING') return (b.rating || 0) - (a.rating || 0);
    return 0; // Featured
  });

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setCurrentTab('all-products');
  };

  const handleCompareProduct = (product) => {
    setSelectedProductForCompare(product);
    setCurrentTab('compare');
  };

  const handleTrackOrder = (orderId) => {
    setTrackingOrderId(orderId);
    setCurrentTab('track');
  };

  return (
    <ClientLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      
      {/* 1. HOME TAB */}
      {currentTab === 'home' && (
        <ClientHome
          onSelectCategory={handleSelectCategory}
          onSelectProduct={(p) => handleCompareProduct(p)}
          onCompareProduct={handleCompareProduct}
          onExploreVendors={() => setCurrentTab('vendors')}
          onOpenJoule={() => {
            // Trigger Joule from home
            const evt = new CustomEvent('open-joule');
            window.dispatchEvent(evt);
          }}
        />
      )}

      {/* 2. CATEGORIES TAB */}
      {currentTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#102A43]">Shop by Construction Category</h2>
            <p className="text-xs text-slate-500">Pick a material category to inspect verified Bhopal yard stocks</p>
          </div>
          <CategoryGrid onSelectCategory={handleSelectCategory} />
        </div>
      )}

      {/* 3. ALL PRODUCTS TAB */}
      {currentTab === 'all-products' && (
        <div className="space-y-6">
          
          {/* Top Filter Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#102A43]">
                  {selectedCategory === 'ALL' ? 'All Construction Materials' : `${selectedCategory} Commodities`}
                </h2>
                <p className="text-xs text-slate-500">
                  Showing {filteredProducts.length} verified listings available for Bhopal dispatch
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter name, brand, SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Filter Pills & Sort Options */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              
              {/* Category selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {['ALL', 'Cement', 'Steel', 'Bricks', 'Sand', 'Electrical', 'Plumbing', 'Paint', 'Tiles', 'Hardware', 'Home Improvement'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition text-[11px] ${
                      selectedCategory === cat
                        ? 'bg-[#102A43] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort & 24h checkbox */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 text-xs">
                  <input
                    type="checkbox"
                    checked={only24Hr}
                    onChange={(e) => setOnly24Hr(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span>24h Guaranteed Only</span>
                </label>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="FEATURED">Sort: Featured</option>
                  <option value="PRICE_LOW">Price: Low to High</option>
                  <option value="PRICE_HIGH">Price: High to Low</option>
                  <option value="RATING">Highest Rated</option>
                </select>
              </div>

            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No commodities matched your criteria. Try adjusting the category or search keywords.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onCompareProduct={handleCompareProduct}
                />
              ))}
            </div>
          )}

        </div>
      )}

      {/* 4. NEARBY VENDORS TAB */}
      {currentTab === 'vendors' && (
        <VendorDiscovery
          onSelectVendor={(v) => {
            // Filter products for this vendor and switch to all products
            setSelectedCategory('ALL');
            setSearchTerm(v.name);
            setCurrentTab('all-products');
          }}
        />
      )}

      {/* 5. COMPARE PRICES TAB */}
      {currentTab === 'compare' && (
        <PriceComparison
          initialProduct={selectedProductForCompare}
          onBack={() => setCurrentTab('all-products')}
        />
      )}

      {/* 6. MY ORDERS TAB */}
      {currentTab === 'orders' && (
        <OrderHistory onTrackOrder={handleTrackOrder} />
      )}

      {/* 7. TRACK DELIVERY TAB */}
      {currentTab === 'track' && (
        <DeliveryTracker
          orderId={trackingOrderId}
          onBack={() => setCurrentTab('orders')}
        />
      )}

      {/* 8. PROFILE TAB */}
      {currentTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
              alt="Client"
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-[#102A43]">{currentUser?.name || 'Rahul Verma'}</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Verified Builder
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Client ID: <span className="font-mono font-bold">{currentUser?.id || '1004'}</span></p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{currentUser?.phone || '+91 94250 88991'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{currentUser?.email || 'rahul.verma@example.com'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Active Jobsite: {currentUser?.activeAddress || 'Villa 14, Green Meadows, Arera Colony, Bhopal - 462016'}</span>
            </div>
          </div>
        </div>
      )}

    </ClientLayout>
  );
};
