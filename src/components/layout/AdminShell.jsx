import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

/**
 * AdminShell gates access to admin routes.
 * Reads auth state from localStorage for simplicity; replace with real auth context as needed.
 */
const AdminShell = () => {
  const isAdmin = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return user && user.role === 'admin';
    } catch {
      return false;
    }
  })();

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
