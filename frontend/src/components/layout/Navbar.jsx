import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Search, MapPin, Package, Heart, ChevronDown, Store, LayoutDashboard, Train, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { DEMO_PRODUCTS } from '../../data/demoData';

const Navbar = () => {
  const { user, logout, isAdmin, isSeller, isServiceProvider, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchDropdown(false);
      // add to recent searches logic can go here (using localStorage) if we wanted to dynamically persist it
    }
  };

  const fuzzyResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return DEMO_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.brand && p.brand.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const categories = [
    { name: 'Electronics', icon: '📱' },
    { name: 'Fashion', icon: '👗' },
    { name: 'Home', icon: '🏠' },
    { name: 'Beauty', icon: '💄' },
    { name: 'Books', icon: '📚' },
    { name: 'Sports', icon: '🏋️' },
    { name: 'Jewellery', icon: '💍' },
    { name: 'Wedding', icon: '💒', color: 'text-pink-500', link: '/wedding' },
    { name: 'Railway Delivery', icon: '🚂', color: 'text-sky-500', link: '/railway' }
  ];

  return (
    <header className="z-50 sticky top-0 bg-white">
      {/* PRIMARY NAVBAR */}
      <nav className="border-b border-slate-100 py-3">
        <div className="container mx-auto px-4 flex items-center gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-slate-900 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-lg shadow-slate-200">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div className="leading-tight">
              <div className="text-xl font-black text-slate-800 tracking-tighter">E-Cart</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">India's Store</div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-grow max-w-2xl relative group">
            <div className="absolute left-0 top-0 bottom-0 px-4 bg-slate-50 border border-slate-200 border-r-0 rounded-l-2xl flex items-center gap-2 text-xs font-black text-slate-500 cursor-pointer hover:bg-slate-100">
              All <ChevronDown className="w-3 h-3" />
            </div>
            <form onSubmit={handleSearchSubmit} className="w-full relative z-10 flex">
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..." 
                className="w-full pl-20 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white focus:border-slate-300 transition-all text-sm font-semibold"
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              />
              <button type="submit" className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-slate-900 text-white rounded-xl hover:bg-black transition-colors z-20">
                <Search className="w-4 h-4" />
              </button>
            </form>
            
            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                  {searchQuery.trim().length > 0 ? (
                      <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Search className="w-3 h-3"/> Top Results for "{searchQuery}"
                          </h4>
                          {fuzzyResults.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                  {fuzzyResults.map(p => (
                                      <Link key={p.id} to={`/products/${p.id}`} className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-xl transition-all">
                                          <img src={p.imageUrl} alt="" className="w-10 h-10 object-contain bg-slate-100 rounded-lg p-1"/>
                                          <div className="flex-1 min-w-0">
                                              <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                                              <p className="text-[10px] font-bold text-primary-600">₹{p.price.toLocaleString()}</p>
                                          </div>
                                      </Link>
                                  ))}
                              </div>
                          ) : (
                              <p className="text-xs text-slate-500 font-bold p-4 text-center">No matching products found.</p>
                          )}
                      </div>
                  ) : (
                      <>
                        <div className="mb-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recent Searches</h4>
                            <div className="flex flex-wrap gap-2">
                                <span onClick={() => { setSearchQuery('iPhone'); navigate('/products?q=iPhone'); }} className="text-xs font-bold bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100">iPhone</span>
                                <span onClick={() => { setSearchQuery('MacBook'); navigate('/products?q=MacBook'); }} className="text-xs font-bold bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100">MacBook</span>
                                <span onClick={() => { setSearchQuery('Gaming Laptop'); navigate('/products?q=Gaming Laptop'); }} className="text-xs font-bold bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100">Gaming Laptop</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trending Searches</h4>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => navigate('/wedding')} className="text-xs font-bold bg-pink-50 text-pink-600 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-pink-100 flex items-center gap-1"><Heart className="w-3 h-3"/> Wedding Packages</button>
                                <button onClick={() => navigate('/railway')} className="text-xs font-bold bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-sky-100 flex items-center gap-1"><Train className="w-3 h-3"/> Railway Delivery</button>
                                <button onClick={() => navigate('/products?sort=rating')} className="text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-amber-100 flex items-center gap-1"><Star className="w-3 h-3"/> Top Rated</button>
                            </div>
                        </div>
                      </>
                  )}
              </div>
            )}
          </div>


          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto">
            {!isAuthenticated ? (
              <Link to="/login" className="flex flex-col items-center px-4 py-1 hover:bg-slate-50 rounded-xl transition-all">
                <User className="w-5 h-5 text-slate-800" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Account</span>
              </Link>
            ) : (
                <div className="relative group">
                    <button className="flex flex-col items-center px-4 py-1 hover:bg-slate-50 rounded-xl transition-all max-w-[100px]">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {user?.fullName?.substring(0,1).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight truncate w-full text-center">
                            Welcome, {user?.fullName?.split(' ')[0] || 'User'}
                        </span>
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-[60]">
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">
                            <User className="w-4 h-4" /> My Profile
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">
                            <Package className="w-4 h-4" /> My Orders
                        </Link>
                        <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">
                            <Heart className="w-4 h-4 text-red-400" /> My Wishlist
                        </Link>
                        {isSeller && (
                            <Link to="/seller/dashboard" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 rounded-xl">
                                <Store className="w-4 h-4" /> Seller Dashboard
                            </Link>
                        )}
                        {isServiceProvider && (
                            <Link to="/service-provider/dashboard" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-pink-600 hover:bg-pink-50 rounded-xl">
                                <Heart className="w-4 h-4" /> Provider Dashboard
                            </Link>
                        )}
                        {!isSeller && !isServiceProvider && !isAdmin && (
                            <Link to="/seller/register" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl">
                                <Store className="w-4 h-4" /> Become a Seller
                            </Link>
                        )}
                        {isAdmin && (
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl">
                                <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                            </Link>
                        )}
                        <hr className="my-2 border-slate-50" />
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            )}

            <Link to="/cart" className="flex flex-col items-center px-4 py-1 hover:bg-slate-50 rounded-xl transition-all relative">
              <ShoppingCart className="w-5 h-5 text-slate-800" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-3 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <Link to="/wishlist" className="flex flex-col items-center px-3 py-1 hover:bg-slate-50 rounded-xl transition-all relative">
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-slate-800'}`} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Saved</span>
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            <button className="md:hidden ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* CATEGORY BAR */}
      <nav className="border-b border-slate-50 py-1 bg-white hidden md:block overflow-x-auto no-scrollbar">
        <div className="container mx-auto px-4">
            <ul className="flex items-center gap-8 list-none m-0 p-0">
                <li className="shrink-0"><Link to="/products" className="text-xs font-black text-slate-800 flex items-center gap-1.5 py-2 border-b-2 border-slate-900">All</Link></li>
                {categories.map((cat, i) => (
                    <li key={i} className="shrink-0">
                        <Link 
                            to={cat.link || `/products?category=${cat.name}`} 
                            className={`text-xs font-black text-slate-500 hover:text-slate-900 flex items-center gap-1.5 py-2 transition-all ${cat.color || ''}`}
                        >
                            <span className="text-sm">{cat.icon}</span> {cat.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categories</h4>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat, i) => (
                <Link key={i} to={cat.link || `/products?category=${cat.name}`} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700">
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <hr className="border-slate-100" />
          <div className="space-y-3">
             <Link to="/profile" className="block text-sm font-bold text-slate-700">My Profile</Link>
             <Link to="/orders" className="block text-sm font-bold text-slate-700">My Orders</Link>
             <button onClick={handleLogout} className="block text-sm font-bold text-red-600">Logout</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
