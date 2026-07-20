import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, ListChecks, Users2, FileText, 
  ShoppingCart, ArrowUpRight, LogOut, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard />, label: 'Overview', path: '/admin' },
    { icon: <ShoppingBag />, label: 'Products', path: '/admin/products' },
    { icon: <ListChecks />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users2 />, label: 'Users', path: '/admin/users' },
    { icon: <FileText />, label: 'Reports', path: '/admin/reports' },
    { icon: <Shield />, label: 'Vendors', path: '/admin/vendors' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 sticky top-0 h-screen p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-primary-600 p-2 rounded-xl">
            <ShoppingCart className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 border-b-4 border-primary-500/20">Admin.</span>
        </div>

        <nav className="flex-1 space-y-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.label}
                to={item.path} 
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-8 border-t border-slate-100">
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 font-black flex items-center justify-center text-xs">
                  {user?.fullName?.substring(0, 2).toUpperCase()}
                </div>
                <p className="text-sm font-bold truncate">{user?.fullName}</p>
              </div>
              <Link to="/" className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-black hover:bg-primary-50 transition-colors w-full justify-center">
                Storefront <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl"></div>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl font-bold text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="lg:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-2">
             <div className="bg-primary-600 p-1.5 rounded-lg">
               <ShoppingCart className="text-white w-4 h-4" />
             </div>
             <span className="font-black text-slate-900">Admin</span>
           </div>
           {/* Mobile menu toggle would go here */}
        </header>

        <main className="flex-1 container mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
