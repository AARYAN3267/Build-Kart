/**
 * Vendor Service
 * Future Integration Point: SAP Ariba Supplier Management / SAP S/4HANA Business Partner OData API
 */

import { INITIAL_VENDORS } from '../data/mockVendors';

const STORAGE_KEY_VENDORS = 'buildkart_vendors';

export const vendorService = {
  getInitialVendors() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VENDORS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading vendors from storage:', e);
    }
    localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(INITIAL_VENDORS));
    return INITIAL_VENDORS;
  },

  saveVendors(vendors) {
    try {
      localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(vendors));
    } catch (e) {
      console.error('Failed saving vendors to storage:', e);
    }
  },

  getVendorById(vendors, vendorId) {
    return vendors.find((v) => v.id === String(vendorId)) || null;
  },

  updateVendorProfile(vendors, vendorId, updatedData) {
    const updated = vendors.map((v) => {
      if (v.id === String(vendorId)) {
        return { ...v, ...updatedData, updatedAt: new Date().toISOString() };
      }
      return v;
    });
    this.saveVendors(updated);
    return updated;
  }
};
