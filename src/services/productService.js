/**
 * Product & Catalog Service
 * Future Integration Point: SAP S/4HANA Material Master API / SAP Commerce Cloud
 */

import { INITIAL_PRODUCTS } from '../data/mockProducts';

const STORAGE_KEY_PRODUCTS = 'buildkart_products';

export const productService = {
  getInitialProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading products from storage:', e);
    }
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  saveProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed saving products to storage:', e);
    }
  },

  addProduct(products, newProduct) {
    const productWithId = {
      ...newProduct,
      id: `PROD-${Date.now()}`,
      sku: newProduct.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      reservedQuantity: 0,
      available: true
    };
    const updated = [productWithId, ...products];
    this.saveProducts(updated);
    return { updatedProducts: updated, newProduct: productWithId };
  },

  updateProduct(products, productId, updatedFields) {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, ...updatedFields, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    this.saveProducts(updated);
    return updated;
  },

  deleteProduct(products, productId) {
    const updated = products.filter((p) => p.id !== productId);
    this.saveProducts(updated);
    return updated;
  }
};
