import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../service/authService';

// Protected route component that checks authentication and role-based access
export default function ProtectedRoute({ children, requiredRole = null }) {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect based on their role
  if (requiredRole && (!user || user.role !== requiredRole)) {
    // Redirect admin to admin page, customer to customer page
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/customer" replace />;
    }
  }

  // If all checks pass, render the protected component
  return children;
}

// Convenience components for specific roles
export function AdminRoute({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}

export function CustomerRoute({ children }) {
  return (
    <ProtectedRoute requiredRole="customer">
      {children}
    </ProtectedRoute>
  );
}
