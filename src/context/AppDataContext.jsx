import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { vendorService } from '../services/vendorService';
import { productService } from '../services/productService';
import { inventoryService } from '../services/inventoryService';
import { orderService } from '../services/orderService';
import { transportService } from '../services/transportService';
import { notificationService } from '../services/notificationService';
import { jouleService } from '../services/jouleService';
import { INITIAL_AGENTS } from '../data/mockAgents';
import { INITIAL_VENDORS } from '../data/mockVendors';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { INITIAL_ORDERS } from '../data/mockOrders';
import { INITIAL_TRANSPORT_PARTNERS } from '../data/mockTransport';

const AppDataContext = createContext();

const STORAGE_KEY_CART = 'buildkart_cart';
const STORAGE_KEY_AGENTS = 'buildkart_agents';
const STORAGE_KEY_LOCALITY = 'buildkart_active_locality';

export const AppDataProvider = ({ children }) => {
  // Shared Domain Data
  const [vendors, setVendors] = useState(() => vendorService.getInitialVendors());
  const [products, setProducts] = useState(() => productService.getInitialProducts());
  const [orders, setOrders] = useState(() => orderService.getInitialOrders());
  const [transportPartners, setTransportPartners] = useState(() => transportService.getInitialTransport());
  const [notifications, setNotifications] = useState(() => notificationService.getInitialNotifications());
  
  // Agents Activity State
  const [agents, setAgents] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AGENTS);
      return stored ? JSON.parse(stored) : INITIAL_AGENTS;
    } catch {
      return INITIAL_AGENTS;
    }
  });

  // Client Cart State
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Selected Location for Client
  const [activeLocality, setActiveLocality] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_LOCALITY) || 'Arera Colony';
  });

  // Autonomous Recovery Incident State
  const [recoveryIncident, setRecoveryIncident] = useState(null);
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);

  // Sync Cart
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  // Sync Agents
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(agents));
  }, [agents]);

  // Sync Locality
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOCALITY, activeLocality);
  }, [activeLocality]);

  // ---------------------------------------------
  // VENDOR PROFILE ACTIONS
  // ---------------------------------------------
  const updateVendorProfile = (vendorId, profileData) => {
    const updated = vendorService.updateVendorProfile(vendors, vendorId, profileData);
    setVendors(updated);
  };

  // ---------------------------------------------
  // PRODUCT & CATALOG ACTIONS
  // ---------------------------------------------
  const addProduct = (newProduct) => {
    const { updatedProducts, newProduct: created } = productService.addProduct(products, newProduct);
    setProducts(updatedProducts);
    
    // Add notification
    const updatedNotifs = notificationService.addNotification(notifications, {
      targetRole: "client",
      title: "New Product Available",
      message: `${created.name} listed by ${created.vendorName} at ₹${created.sellingPrice}.`,
      type: "product"
    });
    setNotifications(updatedNotifs);
    return created;
  };

  const updateProduct = (productId, updatedFields) => {
    const updated = productService.updateProduct(products, productId, updatedFields);
    setProducts(updated);
  };

  const deleteProduct = (productId) => {
    const updated = productService.deleteProduct(products, productId);
    setProducts(updated);
  };

  // ---------------------------------------------
  // INVENTORY ACTIONS (Shared Source of Truth!)
  // ---------------------------------------------
  const updateStock = (productId, newAvailableQty, reorderLevel = null) => {
    const updated = inventoryService.updateStock(products, productId, newAvailableQty, reorderLevel);
    setProducts(updated);
  };

  // ---------------------------------------------
  // PRICING MANAGEMENT
  // ---------------------------------------------
  const updateProductPrice = (productId, { sellingPrice, discountPrice, bulkPrice, bulkMinQty, available }) => {
    const updated = productService.updateProduct(products, productId, {
      sellingPrice: parseFloat(sellingPrice),
      discountPrice: parseFloat(discountPrice),
      bulkPrice: parseFloat(bulkPrice || discountPrice),
      bulkMinQty: parseInt(bulkMinQty || 1, 10),
      available: available !== undefined ? available : true
    });
    setProducts(updated);
  };

  // ---------------------------------------------
  // ORDER ACTIONS
  // ---------------------------------------------
  const createOrder = (orderData) => {
    // 1. Reserve stock from shared products
    const updatedProducts = inventoryService.reserveStock(products, orderData.items);
    setProducts(updatedProducts);

    // 2. Create order
    const { updatedOrders, createdOrder } = orderService.createOrder(orders, orderData);
    setOrders(updatedOrders);

    // 3. Clear cart
    setCart([]);

    // 4. Notify vendor
    const updatedNotifs = notificationService.addNotification(notifications, {
      targetRole: "vendor",
      vendorId: orderData.vendorId,
      title: "New Order Received",
      message: `Order #${createdOrder.id} placed for ${orderData.items.length} item(s) totaling ₹${orderData.totalAmount}.`,
      type: "order"
    });
    setNotifications(updatedNotifs);

    return createdOrder;
  };

  const updateOrderStatus = (orderId, newStatus, additionalData = {}) => {
    const updated = orderService.updateOrderStatus(orders, orderId, newStatus, additionalData);
    setOrders(updated);

    // Notify client
    const targetOrder = updated.find((o) => o.id === orderId);
    if (targetOrder) {
      const updatedNotifs = notificationService.addNotification(notifications, {
        targetRole: "client",
        clientId: targetOrder.customerId,
        title: `Order Status Updated: ${newStatus}`,
        message: `Order #${orderId} is now ${newStatus}.`,
        type: "order"
      });
      setNotifications(updatedNotifs);
    }
  };

  // ---------------------------------------------
  // TRANSPORT MANAGEMENT
  // ---------------------------------------------
  const toggleTransportVehicle = (transportId, newStatus) => {
    const updated = transportService.toggleVehicleStatus(transportPartners, transportId, newStatus);
    setTransportPartners(updated);
  };

  const updateTransportRates = (transportId, ratePerKm, baseFare) => {
    const updated = transportService.updateVehicleRates(transportPartners, transportId, ratePerKm, baseFare);
    setTransportPartners(updated);
  };

  const addTransportVehicle = (vehicleData) => {
    const { updatedTransport, newVehicle } = transportService.addCustomVehicle(transportPartners, vehicleData);
    setTransportPartners(updatedTransport);
    return newVehicle;
  };

  // ---------------------------------------------
  // CART ACTIONS
  // ---------------------------------------------
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // ---------------------------------------------
  // THE SHOWPIECE: AUTONOMOUS SUPPLY CHAIN RECOVERY WORKFLOW
  // ---------------------------------------------
  /**
   * Triggers the failure simulation on order ORD-BK-8821 (or designated order)
   */
  const triggerVendorFailure = (targetOrderId = "ORD-BK-8821") => {
    const order = orders.find((o) => o.id === targetOrderId) || orders[0];
    if (!order) return;

    // 1. Mark order status as Stock Shortage / Anomaly Detected
    const updatedOrders = orderService.updateOrderStatus(orders, order.id, "Stock Shortage Reported", {
      failureReason: "Warehouse physical audit failure: Stock depleted unexpectedly."
    });
    setOrders(updatedOrders);

    // 2. Activate Supply Chain Recovery Agent in Agents Panel
    const updatedAgents = agents.map((agent) => {
      if (agent.id === "agent-rec") {
        return {
          ...agent,
          status: "Approval Required",
          lastTask: `RESOLVING OUTAGE on Order ${order.id}: Failed Vendor ${order.vendorName}. Formulated multi-objective recovery routing.`,
          result: "Identified replacement vendor (MP Building Materials Co.) with 650 bags available & 24h dispatch guarantee.",
          executionMs: 340,
          timestamp: "Just now"
        };
      }
      if (agent.id === "agent-cmp") {
        return {
          ...agent,
          status: "Processing",
          lastTask: "Customer confirmation workflow dispatched. Awaiting digital sign-off.",
          timestamp: "Just now"
        };
      }
      return agent;
    });
    setAgents(updatedAgents);

    // 3. Generate structured recovery plan via Joule
    const plan = jouleService.generateRecoveryPlan({
      order,
      products,
      vendors,
      transportPartners
    });

    setRecoveryIncident(plan);
    setRecoveryModalOpen(true);

    // 4. Send high-priority notification to client
    const updatedNotifs = notificationService.addNotification(notifications, {
      targetRole: "client",
      clientId: order.customerId,
      title: "Joule AI Action Required: Order Recovery",
      message: `Vendor ${order.vendorName} reported stock shortage on Order ${order.id}. Joule AI has found an instant alternative.`,
      type: "recovery"
    });
    setNotifications(updatedNotifs);
  };

  /**
   * Approves the autonomous recovery plan
   */
  const approveRecoveryPlan = (selectedAlternative = null) => {
    if (!recoveryIncident) return;

    const plan = recoveryIncident;
    const alternative = selectedAlternative || plan.recommendedAlternative;
    if (!alternative) return;

    const orderId = plan.orderId;
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // 1. Update shared stock: Deduct 100 bags from the alternative vendor
    const updatedProducts = products.map((prod) => {
      if (prod.id === alternative.product.id) {
        const newStock = Math.max(0, prod.availableQuantity - plan.affectedQuantity);
        return {
          ...prod,
          availableQuantity: newStock,
          reservedQuantity: (prod.reservedQuantity || 0) + plan.affectedQuantity
        };
      }
      return prod;
    });
    setProducts(updatedProducts);
    productService.saveProducts(updatedProducts);

    // 2. Update order to the new vendor and mark as Confirmed (Recovered)
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          vendorId: alternative.vendor.id,
          vendorName: alternative.vendor.name,
          items: [
            {
              ...o.items[0],
              productId: alternative.product.id,
              productName: alternative.product.name,
              price: alternative.unitPrice,
              total: alternative.unitPrice * plan.affectedQuantity
            }
          ],
          subtotal: alternative.unitPrice * plan.affectedQuantity,
          totalAmount: (alternative.unitPrice * plan.affectedQuantity) + o.gstAmount + o.deliveryFee,
          status: "Confirmed (Recovered via Joule)",
          assignedTransport: {
            partnerId: alternative.transportPartner.id,
            companyName: alternative.transportPartner.companyName,
            vehicleType: alternative.transportPartner.vehicleType,
            registrationNo: alternative.transportPartner.registrationNo,
            driverName: alternative.transportPartner.contactPerson,
            contact: alternative.transportPartner.phone,
            eta: "Within 24 Hours (Guaranteed Tomorrow 11:00 AM)"
          },
          recoveryPlan: {
            originalVendor: plan.failedVendorName,
            resolvedByJoule: true,
            recoveredAt: new Date().toISOString(),
            replacementVendor: alternative.vendor.name
          }
        };
      }
      return o;
    });
    setOrders(updatedOrders);
    orderService.saveOrders(updatedOrders);

    // 3. Update Agents status
    const updatedAgents = agents.map((agent) => {
      if (agent.id === "agent-rec") {
        return {
          ...agent,
          status: "Completed",
          lastTask: `Order ${orderId} successfully recovered via ${alternative.vendor.name}. Stock reallocated & heavy hauler dispatched.`,
          result: "Zero delay SLA maintained. Full 24-hour delivery promise preserved.",
          timestamp: "Just now"
        };
      }
      if (agent.id === "agent-cmp") {
        return {
          ...agent,
          status: "Completed",
          lastTask: "Customer digital sign-off logged to audit trail.",
          result: "Authorized and validated.",
          timestamp: "Just now"
        };
      }
      return agent;
    });
    setAgents(updatedAgents);

    // 4. Send success notification
    const updatedNotifs = notificationService.addNotification(notifications, {
      targetRole: "client",
      clientId: order.customerId,
      title: "Order Successfully Recovered!",
      message: `Order #${orderId} has been successfully transferred to ${alternative.vendor.name}. Delivery guaranteed within 24 hours.`,
      type: "success"
    });
    setNotifications(updatedNotifs);

    // 5. Confetti celebration effect!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }

    setRecoveryModalOpen(false);
  };

  /**
   * Reject alternative
   */
  const rejectRecoveryPlan = () => {
    if (!recoveryIncident) return;
    const orderId = recoveryIncident.orderId;
    updateOrderStatus(orderId, "Cancelled by Customer");
    setRecoveryModalOpen(false);
  };

  /**
   * Reset Demo Data to initial state
   */
  const resetDemoData = () => {
    localStorage.removeItem('buildkart_vendors');
    localStorage.removeItem('buildkart_products');
    localStorage.removeItem('buildkart_orders');
    localStorage.removeItem('buildkart_transport');
    localStorage.removeItem('buildkart_notifications');
    localStorage.removeItem(STORAGE_KEY_CART);
    localStorage.removeItem(STORAGE_KEY_AGENTS);
    localStorage.removeItem(STORAGE_KEY_LOCALITY);

    setVendors(INITIAL_VENDORS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setTransportPartners(INITIAL_TRANSPORT_PARTNERS);
    setNotifications(notificationService.getInitialNotifications());
    setAgents(INITIAL_AGENTS);
    setCart([]);
    setActiveLocality('Arera Colony');
    setRecoveryIncident(null);
    setRecoveryModalOpen(false);
  };

  return (
    <AppDataContext.Provider
      value={{
        vendors,
        products,
        orders,
        transportPartners,
        notifications,
        agents,
        cart,
        activeLocality,
        setActiveLocality,
        updateVendorProfile,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        updateProductPrice,
        createOrder,
        updateOrderStatus,
        toggleTransportVehicle,
        updateTransportRates,
        addTransportVehicle,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        // Recovery System
        recoveryIncident,
        recoveryModalOpen,
        setRecoveryModalOpen,
        triggerVendorFailure,
        approveRecoveryPlan,
        rejectRecoveryPlan,
        resetDemoData
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
