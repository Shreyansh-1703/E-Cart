import React from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Package, Heart, RotateCcw, LogOut, ChevronRight, ShieldCheck, Store, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const Profile = () => {
  const { user, logout, isAdmin, isSeller, isServiceProvider } = useAuth();
  const { wishlistCount } = useWishlist();

  const baseItems = [
    { icon: <Package className="w-5 h-5" />, label: 'My Orders', sub: 'Track and manage orders', path: '/orders', color: 'text-primary-600 bg-primary-50' },
    { icon: <Heart className="w-5 h-5" />, label: 'My Wishlist', sub: `${wishlistCount} saved item${wishlistCount !== 1 ? 's' : ''}`, path: '/wishlist', color: 'text-red-500 bg-red-50' },
    { icon: <RotateCcw className="w-5 h-5" />, label: 'Returns & Refunds', sub: 'Manage return requests', path: '/returns', color: 'text-emerald-600 bg-emerald-50' },
    { icon: <ShieldCheck className="w-5 h-5" />, label: 'Account Security', sub: 'Password and settings', path: '/profile', color: 'text-slate-600 bg-slate-50' },
  ];

  const roleItems = [
    ...(isSeller ? [{ icon: <Store className="w-5 h-5" />, label: 'Seller Dashboard', sub: 'Manage products, orders & revenue', path: '/seller/dashboard', color: 'text-amber-600 bg-amber-50' }] : []),
    ...(isServiceProvider ? [{ icon: <Heart className="w-5 h-5" />, label: 'Provider Dashboard', sub: 'Manage bookings & gallery', path: '/service-provider/dashboard', color: 'text-pink-600 bg-pink-50' }] : []),
    ...(isAdmin ? [{ icon: <LayoutDashboard className="w-5 h-5" />, label: 'Admin Dashboard', sub: 'Platform management', path: '/admin', color: 'text-emerald-600 bg-emerald-50' }] : []),
    ...(!isSeller && !isServiceProvider && !isAdmin ? [{ icon: <Store className="w-5 h-5" />, label: 'Become a Seller', sub: 'Start selling on E-Cart', path: '/seller/register', color: 'text-slate-500 bg-slate-50' }] : []),
  ];

  const menuItems = [...roleItems, ...baseItems];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-black text-slate-900 mb-10">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-primary-100 text-primary-700 rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-4">
                {user?.fullName?.substring(0, 1).toUpperCase()}
              </div>
              <h2 className="text-xl font-black text-slate-900">{user?.fullName}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                {user?.role === 'SELLER' ? '🏪 Seller' : user?.role === 'SERVICE_PROVIDER' ? '💍 Service Provider' : user?.role === 'ADMIN' ? '⚙️ Admin' : '👤 Customer'}
              </p>
              <p className="text-sm text-slate-500 mt-2">{user?.email}</p>
            </div>

            <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Main */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal info card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6 pb-4 border-b border-slate-50">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', value: user?.fullName },
                  { label: 'Email Address', value: user?.email },
                  { label: 'Phone Number', value: '+91 98765 43210' },
                  { label: 'Member Since', value: 'January 2024' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="font-bold text-slate-900 text-sm">{value}</p>
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-6 text-sm px-6 py-2.5 rounded-xl">Edit Profile</button>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6">Quick Links</h3>
              <div className="space-y-2">
                {menuItems.map(item => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                      <p className="text-xs text-slate-400 font-medium">{item.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
