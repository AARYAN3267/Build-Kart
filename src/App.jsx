import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { Login } from './pages/Login';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { ClientDashboard } from './pages/client/ClientDashboard';

// Protected Vendor Route Guard
const VendorRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'vendor') return <Navigate to="/client" replace />;
  return children;
};

// Protected Client Route Guard
const ClientRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'client') return <Navigate to="/vendor" replace />;
  return children;
};

// Root index redirect based on authentication
const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'vendor') return <Navigate to="/vendor" replace />;
  if (role === 'client') return <Navigate to="/client" replace />;
  return <Navigate to="/login" replace />;
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <Routes>
            {/* The First Screen: Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Vendor Dashboard Protected Portal */}
            <Route
              path="/vendor/*"
              element={
                <VendorRoute>
                  <VendorDashboard />
                </VendorRoute>
              }
            />

            {/* Client Marketplace Protected Portal */}
            <Route
              path="/client/*"
              element={
                <ClientRoute>
                  <ClientDashboard />
                </ClientRoute>
              }
            />

            {/* Root & Catch-all: Directs unauthenticated users to Login */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
