/**
 * Transport & Logistics Service
 * Future Integration Point: SAP Transportation Management (SAP TM) API / SAP Logistics Business Network
 */

import { INITIAL_TRANSPORT_PARTNERS } from '../data/mockTransport';

const STORAGE_KEY_TRANSPORT = 'buildkart_transport';

export const transportService = {
  getInitialTransport() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TRANSPORT);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading transport from storage:', e);
    }
    localStorage.setItem(STORAGE_KEY_TRANSPORT, JSON.stringify(INITIAL_TRANSPORT_PARTNERS));
    return INITIAL_TRANSPORT_PARTNERS;
  },

  saveTransport(partners) {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSPORT, JSON.stringify(partners));
    } catch (e) {
      console.error('Failed saving transport to storage:', e);
    }
  },

  toggleVehicleStatus(partners, partnerId, newStatus) {
    const updated = partners.map((p) => {
      if (p.id === partnerId) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    this.saveTransport(updated);
    return updated;
  },

  updateVehicleRates(partners, partnerId, newRatePerKm, newBaseFare) {
    const updated = partners.map((p) => {
      if (p.id === partnerId) {
        return {
          ...p,
          ratePerKm: parseFloat(newRatePerKm) || p.ratePerKm,
          baseFare: parseFloat(newBaseFare) || p.baseFare
        };
      }
      return p;
    });
    this.saveTransport(updated);
    return updated;
  },

  addCustomVehicle(partners, vehicleData) {
    const newVehicle = {
      ...vehicleData,
      id: `TRP-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      assignedOrders: []
    };
    const updated = [newVehicle, ...partners];
    this.saveTransport(updated);
    return { updatedTransport: updated, newVehicle };
  },

  calculateDeliveryCharge(vehicleType, distanceKm) {
    const rates = {
      "Two-wheeler": { base: 50, perKm: 12 },
      "Three-wheeler": { base: 150, perKm: 18 },
      "Mini Truck": { base: 250, perKm: 26 },
      "Pickup Truck": { base: 450, perKm: 34 },
      "Medium Truck": { base: 800, perKm: 55 },
      "Heavy Truck": { base: 1200, perKm: 75 }
    };
    const rate = rates[vehicleType] || rates["Mini Truck"];
    return Math.round(rate.base + (distanceKm * rate.perKm));
  }
};
