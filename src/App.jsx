import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Component/Login';
import UserManagement from './Component/UserManagement';
import CustomerPage from './Component/CustomerPage';
import ProtectedRoute, { AdminRoute, CustomerRoute } from './Component/ProtectedRoute';
import authService from './service/authService';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } 
        />
        
        <Route 
          path="/customer" 
          element={
            <CustomerRoute>
              <CustomerPage />
            </CustomerRoute>
          } 
        />
        
        {/* Root redirect based on authentication */}
        <Route 
          path="/" 
          element={<RootRedirect />} 
        />
        
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

// Component to handle root path redirection
function RootRedirect() {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/customer" replace />;
  }
}

export default App;
