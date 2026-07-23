import { createBrowserRouter, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';

// Lazy-loaded page components
import { lazy, Suspense } from 'react';

const lazyLoad = (factory) => {
  const Component = lazy(factory);
  return (
    <Suspense fallback={<div className="page-loader" />}>
      <Component />
    </Suspense>
  );
};

// Public pages
const HomePage         = lazy(() => import('@/pages/HomePage'));
const ProductListPage  = lazy(() => import('@/pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const NotFoundPage     = lazy(() => import('@/pages/NotFoundPage'));
const ForbiddenPage    = lazy(() => import('@/pages/ForbiddenPage'));

// Auth pages (guest only)
const LoginPage        = lazy(() => import('@/pages/LoginPage'));
const RegisterPage     = lazy(() => import('@/pages/RegisterPage'));

// Protected customer pages
const AccountPage      = lazy(() => import('@/pages/AccountPage'));
const OrdersPage       = lazy(() => import('@/pages/OrdersPage'));
const OrderDetailPage  = lazy(() => import('@/pages/OrderDetailPage'));
const CartPage         = lazy(() => import('@/pages/CartPage'));
const CheckoutPage     = lazy(() => import('@/pages/CheckoutPage'));
const WishlistPage     = lazy(() => import('@/pages/WishlistPage'));

// Admin pages
const AdminDashboardPage  = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminProductsPage   = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminOrdersPage     = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminUsersPage      = lazy(() => import('@/pages/admin/AdminUsersPage'));

const wrap = (Component) => (
  <Suspense fallback={<div className="page-loader" />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // ─── Public routes ────────────────────────────────────────────────
  {
    path: '/',
    element: wrap(HomePage),
  },
  {
    path: '/products',
    element: wrap(ProductListPage),
  },
  {
    path: '/products/:slug',
    element: wrap(ProductDetailPage),
  },

  // ─── Guest-only routes ────────────────────────────────────────────
  {
    element: <GuestRoute redirectTo="/" />,
    children: [
      {
        path: '/login',
        element: wrap(LoginPage),
      },
      {
        path: '/register',
        element: wrap(RegisterPage),
      },
    ],
  },

  // ─── Protected routes (authenticated users) ───────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/account',
        element: wrap(AccountPage),
      },
      {
        path: '/orders',
        element: wrap(OrdersPage),
      },
      {
        path: '/orders/:orderId',
        element: wrap(OrderDetailPage),
      },
      {
        path: '/cart',
        element: wrap(CartPage),
      },
      {
        path: '/checkout',
        element: wrap(CheckoutPage),
      },
      {
        path: '/wishlist',
        element: wrap(WishlistPage),
      },
    ],
  },

  // ─── Admin routes ─────────────────────────────────────────────────
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        index: true,
        element: wrap(AdminDashboardPage),
      },
      {
        path: 'products',
        element: wrap(AdminProductsPage),
      },
      {
        path: 'orders',
        element: wrap(AdminOrdersPage),
      },
      {
        path: 'users',
        element: wrap(AdminUsersPage),
      },
    ],
  },

  // ─── Error pages ──────────────────────────────────────────────────
  {
    path: '/403',
    element: wrap(ForbiddenPage),
  },
  {
    path: '/404',
    element: wrap(NotFoundPage),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);

export default router;
