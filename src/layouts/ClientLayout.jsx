import React, { useState } from 'react';
import { 
  HardHat, 
  Home, 
  Layers, 
  Package, 
  MapPin, 
  TrendingDown, 
  ShoppingBag, 
  Clock, 
  Truck, 
  Sparkles, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Search,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { NotificationDropdown } from '../components/common/NotificationDropdown';
import { CartDrawer } from '../components/client/CartDrawer';
import { JouleAssistantModal } from '../components/joule/JouleAssistantModal';
import { SupplyChainRecoveryModal } from '../components/joule/SupplyChainRecoveryModal';
import { BHOPAL_LOCALITIES } from '../utils/bhopalGeo';

export const ClientLayout = ({ currentTab, setCurrentTab, children }) => {
  const { logout, currentUser } = useAuth();
  const { 
    cart, 
    activeLocality, 
    setActiveLocality, 
    triggerVendorFailure, 
    recoveryIncident, 
    setRecoveryModalOpen 
  } = useAppData();

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [jouleOpen, setJouleOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localityDropdownOpen, setLocalityDropdownOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Shop by Category', icon: Layers },
    { id: 'all-products', label: 'All Products', icon: Package },
    { id: 'vendors', label: 'Nearby Vendors', icon: MapPin },
    { id: 'compare', label: 'Compare Prices', icon: TrendingDown },
    { id: 'orders', label: 'My Orders', icon: Clock },
    { id: 'track', label: 'Track Delivery', icon: Truck },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#102A43] flex flex-col">
      
      {/* Top Marketplace Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Brand & Bhopal Locality Selector */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo */}
            <div 
              onClick={() => setCurrentTab('home')}
              className="flex items-center space-x-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
                <HardHat className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-[#102A43]">BuildKart</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded border border-emerald-300">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Bhopal Jobsite Commerce</p>
              </div>
            </div>

            {/* Locality Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLocalityDropdownOpen(!localityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span className="truncate max-w-[110px] sm:max-w-none">{activeLocality}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {localityDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLocalityDropdownOpen(false)}></div>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 py-1">
                      Deliver to Bhopal Area:
                    </span>
                    {BHOPAL_LOCALITIES.map((loc) => (
                      <div
                        key={loc.name}
                        onClick={() => {
                          setActiveLocality(loc.name);
                          setLocalityDropdownOpen(false);
                        }}
                        className={`px-3 py-2 rounded-xl cursor-pointer flex items-center justify-between font-medium ${
                          activeLocality === loc.name
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{loc.name}</span>
                        {activeLocality === loc.name && <span className="text-blue-600 text-[10px]">● Active</span>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold">
            {navLinks.slice(0, 5).map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`px-3 py-2 rounded-xl transition ${
                  currentTab === link.id
                    ? 'bg-[#102A43] text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hackathon Simulation Trigger Button */}
            <button
              onClick={() => triggerVendorFailure("ORD-BK-8821")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-extrabold text-xs transition"
              title="Test centerpiece failure & Joule AI recovery"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>SIMULATE VENDOR FAILURE</span>
            </button>

            {/* Joule AI Button */}
            <button
              onClick={() => setJouleOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-sm hover:opacity-90 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Joule AI</span>
            </button>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Shopping Cart Pill Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white font-black text-[11px] rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Logout button */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <div className="relative w-72 bg-white text-slate-800 p-6 flex flex-col justify-between shadow-2xl z-50">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-extrabold text-sm text-[#102A43]">Customer Marketplace</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 text-xs">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentTab === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setCurrentTab(link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                        isActive ? 'bg-[#102A43] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Secondary Sub-Navigation for Orders & Tracking */}
      <div className="bg-slate-100/90 border-b border-slate-200 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 overflow-x-auto">
            {navLinks.slice(5).map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`flex items-center gap-1.5 font-bold transition py-1 ${
                    isActive ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>24h Fast Fulfillment Engine Active</span>
          </div>
        </div>
      </div>

      {/* Critical Recovery Action Alert Banner for Client */}
      {recoveryIncident && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-3 shadow-md animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-white animate-bounce" />
              </span>
              <div>
                <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-100 block">
                  Action Required on Order #{recoveryIncident.orderId}
                </span>
                <span className="font-bold text-xs">
                  Supplier {recoveryIncident.failedVendorName} reported stock shortage on {recoveryIncident.affectedQuantity} bags. Joule AI found alternative Bhopal suppliers for you.
                </span>
              </div>
            </div>

            <button
              onClick={() => setRecoveryModalOpen(true)}
              className="px-4 py-2 bg-white text-slate-900 rounded-xl font-black text-xs hover:bg-slate-100 transition whitespace-nowrap self-start sm:self-auto shadow-sm flex items-center gap-1.5"
            >
              <span>Review Alternatives & Choose</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Floating Joule AI Trigger Icon */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setJouleOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/80 group"
          aria-label="Open Joule AI Assistant"
          title="Open Joule AI Assistant"
        >
          <Sparkles className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
        </button>
      </div>

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onOrderPlaced={(order) => {
          setCurrentTab('track');
        }}
      />

      {/* Joule Assistant Modal */}
      <JouleAssistantModal isOpen={jouleOpen} onClose={() => setJouleOpen(false)} />

      {/* Autonomous Supply Chain Recovery Modal */}
      <SupplyChainRecoveryModal />
    </div>
  );
};
