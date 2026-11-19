/**
 * Joule AI Service (Enterprise Supply Chain Assistant & Recovery Engine)
 * Future Integration Point: SAP Joule / SAP AI Core / Foundation Models on SAP BTP GenAI Hub
 */

import { calculateDistanceKm } from '../utils/bhopalGeo';

export const jouleService = {
  /**
   * Process customer conversational prompts against current live application data
   */
  async processCustomerQuery(prompt, { products, vendors, orders }) {
    await new Promise((r) => setTimeout(r, 450));
    const lower = prompt.toLowerCase();

    // Query 1: Cement near MP Nagar
    if (lower.includes('cement') || lower.includes('bag')) {
      const cementProducts = products.filter((p) => p.category === 'Cement' && p.available);
      return {
        reply: `I analyzed live supplier inventory across Bhopal. Found ${cementProducts.length} verified cement listings meeting structural standards.`,
        suggestedProducts: cementProducts.slice(0, 3),
        quickActions: [
          { label: "Compare Cement Prices", action: "NAVIGATE_COMPARE", params: { category: "Cement" } },
          { label: "View Fast-Dispatch Options", action: "FILTER_24HR" }
        ],
        agentNotes: "Scanned 10 local vendors. Verified PPC 53 IS:1489 compliance. Sharma Cement Traders (MP Nagar) & MP Building Materials (Ayodhya Bypass) offer optimal stock."
      };
    }

    // Query 2: Cheapest electrical wire
    if (lower.includes('electrical') || lower.includes('wire') || lower.includes('cheap')) {
      const elecProducts = products
        .filter((p) => p.category === 'Electrical' && p.available)
        .sort((a, b) => a.discountPrice - b.discountPrice);

      return {
        reply: `Comparing copper wiring across verified distributors in Bhopal: **${elecProducts[0]?.name}** at ₹${elecProducts[0]?.discountPrice} offers the lowest per-meter cost with ISI 694 flame-retardant certification.`,
        suggestedProducts: elecProducts.slice(0, 3),
        quickActions: [
          { label: "Add to Cart", action: "ADD_CART", params: { product: elecProducts[0] } },
          { label: "View Technical Specs", action: "VIEW_DETAILS" }
        ],
        agentNotes: "Gupta Electricals (Kolar Road) has 110 coils ready with 2-wheeler express delivery in under 3 hours."
      };
    }

    // Query 3: Steel rods within 24 hours
    if (lower.includes('steel') || lower.includes('tmt') || lower.includes('rod')) {
      const steelProducts = products.filter((p) => p.category === 'Steel' && p.eligible24HrDelivery);
      return {
        reply: `Found ${steelProducts.length} certified TMT steel grades with guaranteed 24-hour delivery via heavy transport fleet:`,
        suggestedProducts: steelProducts,
        quickActions: [
          { label: "Compare TMT Grades", action: "NAVIGATE_COMPARE", params: { category: "Steel" } },
          { label: "Book Heavy Hauler", action: "NAVIGATE_TRANSPORT" }
        ],
        agentNotes: "Bhopal Steel House (BHEL) & Mahaveer TMT have active Eicher heavy trucks dispatched for same-day delivery."
      };
    }

    // Query 4: Track current order
    if (lower.includes('track') || lower.includes('order') || lower.includes('status')) {
      const activeOrder = orders[0];
      return {
        reply: activeOrder
          ? `Your recent order **${activeOrder.id}** (${activeOrder.items[0]?.productName || 'Materials'}) is currently in status: **${activeOrder.status}**. Assigned to ${activeOrder.assignedTransport?.companyName || 'Logistics Partner'}.`
          : "You currently have no active orders in transit.",
        quickActions: [
          { label: "Open Live Tracker", action: "NAVIGATE_TRACKER", params: { orderId: activeOrder?.id } }
        ],
        agentNotes: "Live telematics synced via Simulated SAP TM Dispatch node."
      };
    }

    // Fallback general Joule response
    const recommended = products.slice(0, 3);
    return {
      reply: `I can assist with real-time price comparisons, vendor stock audits, 24-hour delivery routing, and autonomous order recovery across Bhopal. Here are currently trending building supplies:`,
      suggestedProducts: recommended,
      quickActions: [
        { label: "Explore Bhopal Vendors", action: "NAVIGATE_VENDORS" },
        { label: "Price Comparison Tool", action: "NAVIGATE_COMPARE" }
      ],
      agentNotes: "All recommendations generated from shared real-time mock ERP state."
    };
  },

  /**
   * Process vendor conversational prompts
   */
  async processVendorQuery(prompt, { products, orders, vendorId }) {
    await new Promise((r) => setTimeout(r, 450));
    const lower = prompt.toLowerCase();
    const vendorProds = products.filter((p) => p.vendorId === String(vendorId));
    const vendorOrders = orders.filter((o) => o.vendorId === String(vendorId));

    if (lower.includes('low stock') || lower.includes('inventory')) {
      const lowStock = vendorProds.filter((p) => p.availableQuantity <= p.reorderLevel);
      return {
        reply: `You have **${lowStock.length}** items at or below reorder threshold. Immediate restock recommended to avoid order failure penalties:`,
        items: lowStock,
        agentNotes: "Inventory Analysis Agent scanned SKU velocity over the last 14 days."
      };
    }

    if (lower.includes('pending') || lower.includes('orders') || lower.includes('incoming')) {
      const pending = vendorOrders.filter((o) => o.status === 'Confirmed' || o.status === 'Preparing');
      return {
        reply: `You have **${pending.length}** pending order(s) requiring action. Oldest pending order is **${pending[0]?.id || 'None'}**.`,
        orders: pending,
        agentNotes: "Automated SLA timer: ensure dispatch confirmation within 2 hours of customer placement."
      };
    }

    if (lower.includes('price') || lower.includes('pricing') || lower.includes('margin')) {
      return {
        reply: "Market pricing intelligence for Bhopal region shows PPC Cement prices averaging ₹378-₹385/bag. Your current price of ₹375 is competitive and maintains high buy-box priority.",
        agentNotes: "Procurement Optimization Agent benchmarked against 10 local vendors."
      };
    }

    return {
      reply: `Your store currently has **${vendorProds.length}** active listed products, **${vendorOrders.length}** total orders, and an average customer satisfaction rating of 4.8 / 5.0.`,
      agentNotes: "Simulated SAP Analytics Cloud metric rollup."
    };
  },

  /**
   * Central Autonomous Supply Chain Recovery Engine (Step 1 to Step 10)
   * Activated when a vendor cannot fulfill an order (stock shortage / rejection)
   */
  generateRecoveryPlan({ order, products, vendors, transportPartners }) {
    if (!order || !order.items || order.items.length === 0) return null;

    const targetItem = order.items[0]; // e.g. UltraTech Weather Pro Cement 50kg
    const neededQty = targetItem.quantity; // 100 bags
    const failedVendorId = order.vendorId;
    const clientLocality = order.deliveryAddress?.locality || "Arera Colony";
    const clientLat = order.deliveryAddress?.latitude || 23.2140;
    const clientLng = order.deliveryAddress?.longitude || 77.4270;

    // Step 4: Search alternative vendors using current shared mock inventory
    // Must have matching category or brand, sufficient stock, and NOT be the failed vendor
    const eligibleAlternatives = [];

    products.forEach((prod) => {
      if (
        prod.vendorId !== failedVendorId &&
        prod.category === targetItem.category &&
        prod.availableQuantity >= neededQty &&
        prod.available
      ) {
        const vendor = vendors.find((v) => v.id === prod.vendorId);
        if (vendor) {
          const distanceKm = calculateDistanceKm(vendor.latitude, vendor.longitude, clientLat, clientLng);
          const priceDiff = prod.discountPrice - targetItem.price;
          const totalNewPrice = prod.discountPrice * neededQty;

          // Check transport match
          const suitableTransport = transportPartners.find(
            (t) => t.status === 'Available' && t.capacityKg >= (neededQty * 50)
          ) || transportPartners[0];

          eligibleAlternatives.push({
            product: prod,
            vendor: vendor,
            availableStock: prod.availableQuantity,
            unitPrice: prod.discountPrice,
            originalUnitPrice: targetItem.price,
            priceDiffPerUnit: priceDiff,
            totalAmount: totalNewPrice,
            distanceKm: distanceKm,
            vendorRating: vendor.rating,
            transportPartner: suitableTransport,
            estimatedDelivery: "Guaranteed Tomorrow by 11:00 AM (Within 24 Hours)",
            matchScore: 100 - (distanceKm * 1.5) + (vendor.rating * 10) - (Math.max(0, priceDiff) * 2)
          });
        }
      }
    });

    // Sort by multi-objective score (stock + distance + reliability + price)
    eligibleAlternatives.sort((a, b) => b.matchScore - a.matchScore);

    const recommended = eligibleAlternatives[0] || null;

    return {
      orderId: order.id,
      failedVendorId: failedVendorId,
      failedVendorName: order.vendorName,
      failureReason: "Unexpected inventory variance: Physical warehouse stock depleted below 100 bags due to concurrent bulk dispatch.",
      affectedItem: targetItem,
      affectedQuantity: neededQty,
      candidateAlternatives: eligibleAlternatives,
      recommendedAlternative: recommended,
      recoverySteps: [
        { title: "Anomaly Detected", desc: `Vendor ${order.vendorName} reported stock shortage on ${neededQty} bags.`, status: "done" },
        { title: "Live Inventory Scan", desc: `Found ${eligibleAlternatives.length} alternative local vendors with >= ${neededQty} bags in stock.`, status: "done" },
        { title: "Multi-Objective Optimization", desc: `Selected ${recommended?.vendor.name} (${recommended?.distanceKm} km away) with identical IS:1489 PPC 53 spec.`, status: "done" },
        { title: "Transport Reallocation", desc: `Pre-booked ${recommended?.transportPartner.companyName} (${recommended?.transportPartner.vehicleType}).`, status: "done" },
        { title: "Customer Sign-off", desc: "Awaiting customer approval of revised supplier and dispatch schedule.", status: "action_needed" }
      ]
    };
  }
};
