import React, { useState } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Package, 
  Layers, 
  Tag, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  HardHat, 
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { NotificationDropdown } from '../components/common/NotificationDropdown';
import { JouleAssistantModal } from '../components/joule/JouleAssistantModal';
import { SupplyChainRecoveryModal } from '../components/joule/SupplyChainRecoveryModal';

export const VendorLayout = ({ currentTab, setCurrentTab, children, openAddProduct }) => {
  const { logout, currentUser } = useAuth();
  const { resetDemoData, triggerVendorFailure, orders } = useAppData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jouleOpen, setJouleOpen] = useState(false);

  const vendorOrders = orders.filter((o) => o.vendorId === currentUser?.id);
  const pendingOrders = vendorOrders.filter((o) => o.status === 'Confirmed' || o.status === 'Preparing').length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Store Profile', icon: Building2 },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'inventory', label: 'Inventory Management', icon: Layers },
    { id: 'pricing', label: 'Pricing Management', icon: Tag },
    { id: 'orders', label: 'Incoming Orders', icon: ShoppingCart, badge: pendingOrders > 0 ? pendingOrders : null },
    { id: 'transport', label: 'Transport Availability', icon: Truck },
    { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Demo Reset', icon: Settings }
  ];

  const handleNavClick = (id) => {
    setCurrentTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#102A43] flex flex-col">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-sm">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#102A43] flex items-center justify-center text-white shadow-md">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-[#102A43]">BuildKart</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded border border-emerald-300">
                    Vendor Portal
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Bhopal Supplier Hub</p>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Hackathon Quick Action Button: SIMULATE VENDOR FAILURE */}
            <button
              onClick={() => triggerVendorFailure("ORD-BK-8821")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-extrabold text-xs transition"
              title="Test centerpiece failure & Joule AI recovery"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>SIMULATE VENDOR FAILURE</span>
            </button>

            {/* Joule AI Assistant Pill */}
            <button
              onClick={() => setJouleOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-sm hover:opacity-90 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Joule AI</span>
            </button>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Vendor Profile Dropdown / Info */}
            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=120&auto=format&fit=crop&q=80'}
                alt="Vendor Avatar"
                className="w-8 h-8 rounded-xl object-cover border border-slate-200"
              />
              <div className="text-xs">
                <span className="font-bold text-[#102A43] block leading-tight">
                  {currentUser?.shopName || 'Sharma Cement Traders'}
                </span>
                <span className="text-[10px] text-slate-400">ID: {currentUser?.id || '3267'}</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-[#102A43] text-white flex-col justify-between p-4 shadow-xl flex-shrink-0">
          <div className="space-y-6">
            
            {/* Store Card in Sidebar */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0 font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-xs text-white truncate">
                  {currentUser?.shopName || 'Sharma Cement'}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Verified Yard
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1 text-xs font-semibold">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-md'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logout Action */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-rose-900/40 hover:text-rose-300 text-xs font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div 
              onClick={() => setSidebarOpen(false)} 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <div className="relative w-64 bg-[#102A43] text-white p-5 flex flex-col justify-between shadow-2xl z-50">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-extrabold text-sm text-white">Vendor Menu</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-slate-400 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1 text-xs">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                          isActive
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-300 hover:bg-rose-900/40 text-xs font-semibold transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

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

      {/* Joule Assistant Modal */}
      <JouleAssistantModal isOpen={jouleOpen} onClose={() => setJouleOpen(false)} />

      {/* Autonomous Supply Chain Recovery Modal */}
      <SupplyChainRecoveryModal />
    </div>
  );
};
