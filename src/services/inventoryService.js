/**
 * Inventory Management Service
 * Future Integration Point: SAP S/4HANA Material Management (MM-IM) & SAP IBP (Integrated Business Planning)
 */

import { productService } from './productService';

export const inventoryService = {
  /**
   * Update product available stock quantity
   * Persists to shared products collection so customer marketplace, vendor portal, and Joule AI stay 100% in sync
   */
  updateStock(products, productId, newAvailableQty, reorderLevel = null) {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const qty = Math.max(0, parseInt(newAvailableQty, 10) || 0);
        return {
          ...p,
          availableQuantity: qty,
          reorderLevel: reorderLevel !== null ? parseInt(reorderLevel, 10) : p.reorderLevel,
          available: qty > 0,
          lastStockUpdate: new Date().toISOString()
        };
      }
      return p;
    });
    productService.saveProducts(updated);
    return updated;
  },

  /**
   * Reserve inventory when a customer places an order
   */
  reserveStock(products, orderItems) {
    let updated = [...products];
    orderItems.forEach((item) => {
      updated = updated.map((p) => {
        if (p.id === item.productId) {
          const reserved = (p.reservedQuantity || 0) + item.quantity;
          const available = Math.max(0, p.availableQuantity - item.quantity);
          return {
            ...p,
            reservedQuantity: reserved,
            availableQuantity: available,
            available: available > 0
          };
        }
        return p;
      });
    });
    productService.saveProducts(updated);
    return updated;
  },

  /**
   * Release reserved stock on order cancellation or failure
   */
  releaseReservedStock(products, orderItems) {
    let updated = [...products];
    orderItems.forEach((item) => {
      updated = updated.map((p) => {
        if (p.id === item.productId) {
          const reserved = Math.max(0, (p.reservedQuantity || 0) - item.quantity);
          const available = p.availableQuantity + item.quantity;
          return {
            ...p,
            reservedQuantity: reserved,
            availableQuantity: available,
            available: available > 0
          };
        }
        return p;
      });
    });
    productService.saveProducts(updated);
    return updated;
  }
};
