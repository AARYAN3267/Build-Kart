import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (userId, password) => {
    const res = await authService.login(userId, password);
    if (res.success) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  /**
   * Quick role switcher for testing and demonstration workflows
   */
  const switchRole = async (targetRole) => {
    if (targetRole === 'client') {
      return await login('1004', '1234');
    } else if (targetRole === 'vendor') {
      return await login('3267', '0000');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser ? currentUser.role : null,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchRole,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
