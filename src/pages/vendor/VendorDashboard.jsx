import React, { useState } from 'react';
import { VendorLayout } from '../../layouts/VendorLayout';
import { VendorOverview } from '../../components/vendor/VendorOverview';
import { VendorProfile } from '../../components/vendor/VendorProfile';
import { VendorProducts } from '../../components/vendor/VendorProducts';
import { VendorInventory } from '../../components/vendor/VendorInventory';
import { VendorPricing } from '../../components/vendor/VendorPricing';
import { VendorOrders } from '../../components/vendor/VendorOrders';
import { VendorTransport } from '../../components/vendor/VendorTransport';
import { VendorAnalytics } from '../../components/vendor/VendorAnalytics';
import { AddProductModal } from '../../components/vendor/AddProductModal';
import { useAppData } from '../../context/AppDataContext';
import { RotateCcw, ShieldCheck, Database, Check } from 'lucide-react';

export const VendorDashboard = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const { resetDemoData } = useAppData();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (window.confirm("Reset all demo data back to clean Bhopal baseline state?")) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <VendorLayout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      openAddProduct={() => setAddProductModalOpen(true)}
    >
      {currentTab === 'overview' && (
        <VendorOverview
          setActiveTab={setCurrentTab}
          openAddProduct={() => setAddProductModalOpen(true)}
        />
      )}

      {currentTab === 'profile' && <VendorProfile />}

      {currentTab === 'products' && (
        <VendorProducts openAddProduct={() => setAddProductModalOpen(true)} />
      )}

      {currentTab === 'inventory' && <VendorInventory />}

      {currentTab === 'pricing' && <VendorPricing />}

      {currentTab === 'orders' && <VendorOrders />}

      {currentTab === 'transport' && <VendorTransport />}

      {currentTab === 'analytics' && <VendorAnalytics />}

      {/* Settings & Demo Reset Tab */}
      {currentTab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-2xl">
          <div>
            <h2 className="text-xl font-extrabold text-[#102A43]">Vendor Settings & Demo Control</h2>
            <p className="text-xs text-slate-500">Manage demo persistence and simulated enterprise storage</p>
          </div>

          {resetSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Demo data successfully reset to clean initial Bhopal state!</span>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center gap-2.5 font-bold text-slate-800">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Simulated SAP HANA Cloud & Local Storage State</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              All inventory adjustments, product additions, price alterations, and order fulfillment actions are preserved across page refreshes via unified browser state.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Demo Data</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Enterprise Integration Architecture Ready</span>
            </div>
            <p className="text-blue-800 text-xs">
              Services are structured for plug-and-play connection to SAP BTP Event Mesh, SAP S/4HANA Sales & Distribution (SD), SAP TM, and SAP Joule Copilot.
            </p>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
      />
    </VendorLayout>
  );
};
