/**
 * Authentication Service (Simulated Frontend Auth)
 * Future Integration Point: SAP Cloud Identity Services / SAP BTP Destination Service
 */

const STORAGE_KEY_AUTH = 'buildkart_auth_user';

export const authService = {
  /**
   * Authenticate user with User ID and Password
   * Automatically derives role (vendor or client)
   */
  async login(userId, password) {
    // Simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanId = String(userId).trim();
    const cleanPwd = String(password).trim();

    // Check Vendor Credentials (Demo: 3267 / 0000)
    if (cleanId === '3267' && cleanPwd === '0000') {
      const vendorUser = {
        id: '3267',
        role: 'vendor',
        name: 'Ramesh Sharma',
        shopName: 'Sharma Cement Traders',
        locality: 'MP Nagar',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        phone: '+91 98260 12345',
        email: 'ramesh.sharma@sharmacement.in',
        avatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=120&auto=format&fit=crop&q=80',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(vendorUser));
      return { success: true, user: vendorUser };
    }

    // Check Client Credentials (Demo: 1004 / 1234)
    if (cleanId === '1004' && cleanPwd === '1234') {
      const clientUser = {
        id: '1004',
        role: 'client',
        name: 'Rahul Verma',
        phone: '+91 94250 88991',
        email: 'rahul.verma@example.com',
        locality: 'Arera Colony',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        activeAddress: 'Villa 14, Green Meadows, Arera Colony, Bhopal - 462016',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(clientUser));
      return { success: true, user: clientUser };
    }

    // Invalid credentials
    return {
      success: false,
      error: 'Invalid credentials. Please enter valid Demo User ID and Password.'
    };
  },

  /**
   * Get current authenticated user from localStorage
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Logout user and clear session
   */
  logout() {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }
};
