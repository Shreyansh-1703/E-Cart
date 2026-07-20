import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Products from '../pages/Products/Products';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import CompareProducts from '../pages/Products/CompareProducts';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import OrderSuccess from '../pages/Checkout/OrderSuccess';
import PaymentSuccess from '../pages/Checkout/PaymentSuccess';
import PaymentFailed from '../pages/Checkout/PaymentFailed';
import Profile from '../pages/Profile/Profile';
import MyOrders from '../pages/Orders/MyOrders';
import OrderTracking from '../pages/OrderTracking/OrderTracking';
import Wishlist from '../pages/Wishlist/Wishlist';
import MyReturns from '../pages/Returns/MyReturns';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminProducts from '../pages/Admin/AdminProducts';
import AdminOrders from '../pages/Admin/AdminOrders';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminReports from '../pages/Admin/AdminReports';
import VendorApplications from '../pages/Admin/VendorApplications';

// Railway Module
import RailwayHome from '../pages/Railway/RailwayHome';
import StationSelection from '../pages/Railway/StationSelection';
import PassengerDetails from '../pages/Railway/PassengerDetails';
import ProductSelection from '../pages/Railway/ProductSelection';
import RailwayCheckout from '../pages/Railway/RailwayCheckout';
import RailwayOrderTracking from '../pages/Railway/RailwayOrderTracking';
import { RailwayProvider } from '../context/RailwayContext';

// Wedding & Vendor Module
import WeddingLanding from '../pages/Wedding/WeddingLanding';
import VendorMarketplace from '../pages/Special/VendorMarketplace';
import VendorProfile from '../pages/Special/VendorProfile';
import VendorRegistration from '../pages/Special/VendorRegistration';

// Rental Module
import RentalSelection from '../pages/Rental/RentalSelection';
import RentalCheckout from '../pages/Rental/RentalCheckout';
import RentalConfirmation from '../pages/Rental/RentalConfirmation';

// Seller Portal
import SellerRegister from '../pages/Seller/SellerRegister';
import SellerDashboard from '../pages/Seller/SellerDashboard';

// Service Provider Portal
import ServiceProviderRegister from '../pages/ServiceProvider/ServiceProviderRegister';
import ServiceProviderDashboard from '../pages/ServiceProvider/ServiceProviderDashboard';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';

// ── Route guards ──────────────────────────────────────────────────────────────

/**
 * Requires full authentication (not guest).
 * Optionally adminOnly.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

/**
 * Allows both authenticated users AND guests (browsing only).
 * Pure unauthenticated visitors (no guest flag) → login.
 */
const BrowseRoute = ({ children }) => {
  const { isAuthenticated, isGuest } = useAuth();
  if (!isAuthenticated && !isGuest) return <Navigate to="/login" replace />;
  return children;
};

/**
 * Auth pages — redirect away if already logged in.
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  return children;
};

/**
 * Root index redirect logic component.
 */
const HomeRedirect = () => {
  const { isAuthenticated, isGuest } = useAuth();
  if (!isAuthenticated && !isGuest) return <Navigate to="/login" replace />;
  return (
    <BrowseRoute>
      <MainLayout><Home /></MainLayout>
    </BrowseRoute>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Auth pages ─────────────────────────────────── */}
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* ── Root (default landing page = login, then home) ─ */}
      <Route path="/" element={<HomeRedirect />} />

      {/* ── Guest-browsable routes ──────────────────────── */}
      <Route path="/products"       element={<BrowseRoute><MainLayout><Products /></MainLayout></BrowseRoute>} />
      <Route path="/products/:id"   element={<BrowseRoute><MainLayout><ProductDetails /></MainLayout></BrowseRoute>} />
      <Route path="/compare"        element={<BrowseRoute><MainLayout><CompareProducts /></MainLayout></BrowseRoute>} />
      <Route path="/order-tracking" element={<BrowseRoute><MainLayout><OrderTracking /></MainLayout></BrowseRoute>} />
      <Route path="/wedding"         element={<BrowseRoute><MainLayout><WeddingLanding /></MainLayout></BrowseRoute>} />
      <Route path="/wedding/products" element={<BrowseRoute><MainLayout><WeddingLanding /></MainLayout></BrowseRoute>} />
      <Route path="/wedding/vendors"  element={<BrowseRoute><MainLayout><VendorMarketplace /></MainLayout></BrowseRoute>} />
      <Route path="/wedding/vendor/:id" element={<BrowseRoute><MainLayout><VendorProfile /></MainLayout></BrowseRoute>} />
      <Route path="/rental"           element={<BrowseRoute><MainLayout><RentalSelection /></MainLayout></BrowseRoute>} />

      {/* ── Railway Module ──────────────────────────────── */}
      <Route path="/railway/*" element={
        <BrowseRoute>
          <MainLayout>
            <RailwayProvider>
              <Routes>
                <Route path="/"         element={<RailwayHome />} />
                <Route path="/stations" element={<StationSelection />} />
                <Route path="/details"  element={<PassengerDetails />} />
                <Route path="/products" element={<ProductSelection />} />
                <Route path="/checkout" element={<RailwayCheckout />} />
                <Route path="/track"    element={<RailwayOrderTracking />} />
              </Routes>
            </RailwayProvider>
          </MainLayout>
        </BrowseRoute>
      } />

      {/* ── Customer-only (login required) ─────────────── */}
      <Route path="/cart"            element={<ProtectedRoute><MainLayout><Cart /></MainLayout></ProtectedRoute>} />
      <Route path="/checkout"        element={<ProtectedRoute><MainLayout><Checkout /></MainLayout></ProtectedRoute>} />
      <Route path="/order-success"   element={<ProtectedRoute><MainLayout><OrderSuccess /></MainLayout></ProtectedRoute>} />
      <Route path="/payment-success" element={<ProtectedRoute><MainLayout><PaymentSuccess /></MainLayout></ProtectedRoute>} />
      <Route path="/payment-failed"  element={<ProtectedRoute><MainLayout><PaymentFailed /></MainLayout></ProtectedRoute>} />
      <Route path="/profile"         element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
      <Route path="/orders"          element={<ProtectedRoute><MainLayout><MyOrders /></MainLayout></ProtectedRoute>} />
      <Route path="/wishlist"        element={<ProtectedRoute><MainLayout><Wishlist /></MainLayout></ProtectedRoute>} />
      <Route path="/returns"         element={<ProtectedRoute><MainLayout><MyReturns /></MainLayout></ProtectedRoute>} />
      <Route path="/rental/checkout"     element={<ProtectedRoute><MainLayout><RentalCheckout /></MainLayout></ProtectedRoute>} />
      <Route path="/rental/confirmation" element={<ProtectedRoute><MainLayout><RentalConfirmation /></MainLayout></ProtectedRoute>} />
      <Route path="/wedding/register"    element={<ProtectedRoute><MainLayout><VendorRegistration /></MainLayout></ProtectedRoute>} />

      {/* ── Seller Portal ───────────────────────────────── */}
      <Route path="/seller/register"  element={<ProtectedRoute><SellerRegister /></ProtectedRoute>} />
      <Route path="/seller/dashboard" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />

      {/* ── Service Provider Portal ─────────────────────── */}
      <Route path="/service-provider/register"  element={<ProtectedRoute><ServiceProviderRegister /></ProtectedRoute>} />
      <Route path="/service-provider/dashboard" element={<ProtectedRoute><MainLayout><ServiceProviderDashboard /></MainLayout></ProtectedRoute>} />

      {/* ── Admin Protected Routes ──────────────────────── */}
      <Route path="/admin"          element={<ProtectedRoute adminOnly><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/orders"   element={<ProtectedRoute adminOnly><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/users"    element={<ProtectedRoute adminOnly><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/reports"  element={<ProtectedRoute adminOnly><AdminLayout><AdminReports /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/vendors"  element={<ProtectedRoute adminOnly><AdminLayout><VendorApplications /></AdminLayout></ProtectedRoute>} />

      {/* ── Fallback ────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
