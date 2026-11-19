/**
 * Order Service
 * Future Integration Point: SAP S/4HANA Sales & Distribution (SD) & SAP Event Mesh
 */

import { INITIAL_ORDERS } from '../data/mockOrders';

const STORAGE_KEY_ORDERS = 'buildkart_orders';

export const orderService = {
  getInitialOrders() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading orders from storage:', e);
    }
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  },

  saveOrders(orders) {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed saving orders to storage:', e);
    }
  },

  createOrder(orders, orderData) {
    const newOrder = {
      ...orderData,
      id: `ORD-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: new Date().toISOString(),
      status: "Confirmed",
      trackingSteps: [
        { stage: "Order Confirmed", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
        { stage: "Vendor Preparing", time: "Pending", done: false },
        { stage: "Ready for Pickup", time: "Pending", done: false },
        { stage: "Picked Up", time: "Pending", done: false },
        { stage: "In Transit", time: "Pending", done: false },
        { stage: "Delivered", time: "Pending", done: false }
      ]
    };
    const updated = [newOrder, ...orders];
    this.saveOrders(updated);
    return { updatedOrders: updated, createdOrder: newOrder };
  },

  updateOrderStatus(orders, orderId, newStatus, additionalData = {}) {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedSteps = (order.trackingSteps || []).map((step) => {
          if (newStatus === "Preparing" && step.stage === "Vendor Preparing") {
            return { ...step, time: timeNow, done: true };
          }
          if (newStatus === "Ready for Pickup" && (step.stage === "Vendor Preparing" || step.stage === "Ready for Pickup")) {
            return { ...step, time: step.done ? step.time : timeNow, done: true };
          }
          if (newStatus === "In Transit" && (step.stage === "Vendor Preparing" || step.stage === "Ready for Pickup" || step.stage === "Picked Up" || step.stage === "In Transit")) {
            return { ...step, time: step.done ? step.time : timeNow, done: true };
          }
          if (newStatus === "Delivered") {
            return { ...step, time: step.done ? step.time : timeNow, done: true };
          }
          return step;
        });

        return {
          ...order,
          status: newStatus,
          trackingSteps: updatedSteps,
          ...additionalData,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });

    this.saveOrders(updated);
    return updated;
  }
};
