/**
 * Notification Service
 * Simulates real-time alerts for orders, stock shortages, recovery events and dispatches
 */

const STORAGE_KEY_NOTIFS = 'buildkart_notifications';

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    targetRole: "vendor",
    vendorId: "3267",
    title: "New Bulk Order Received",
    message: "Order ORD-BK-8821 received for 100 bags UltraTech Cement from Rahul Verma.",
    type: "order",
    time: "10 mins ago",
    read: false
  },
  {
    id: "notif-2",
    targetRole: "vendor",
    vendorId: "3267",
    title: "Low Stock Alert",
    message: "Ambuja Kawach Waterproof Cement is approaching reorder threshold (80 bags left).",
    type: "stock",
    time: "1 hour ago",
    read: true
  },
  {
    id: "notif-3",
    targetRole: "client",
    clientId: "1004",
    title: "Order In Transit",
    message: "Your plumbing order ORD-BK-8819 is picked up by Bhopal Swift Logistics.",
    type: "transport",
    time: "2 hours ago",
    read: false
  }
];

export const notificationService = {
  getInitialNotifications() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    return DEFAULT_NOTIFICATIONS;
  },

  addNotification(notifications, notif) {
    const newNotif = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: "Just now",
      read: false
    };
    const updated = [newNotif, ...notifications];
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
    return updated;
  },

  markAllAsRead(notifications, role) {
    const updated = notifications.map((n) =>
      n.targetRole === role ? { ...n, read: true } : n
    );
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
    return updated;
  }
};
