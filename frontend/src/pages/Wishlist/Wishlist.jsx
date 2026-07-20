import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      await removeFromWishlist(product.id);
      toast.success(`${product.name} moved to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleRemove = async (productId, name) => {
    await removeFromWishlist(productId);
    toast.info(`${name} removed from wishlist`);
  };

  if (loading) return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="h-10 w-48 bg-slate-200 rounded-2xl animate-pulse mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 animate-pulse border border-slate-100">
              <div className="aspect-square bg-slate-100 rounded-2xl mb-4" />
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-6 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (wishlist.length === 0) return (
    <div className="bg-slate-50 min-h-screen py-24 text-center">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
        <Heart className="w-12 h-12 text-red-300" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-4">Your wishlist is empty</h2>
      <p className="text-slate-500 mb-8 max-w-xs mx-auto">Save items you love and come back to them anytime.</p>
      <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl">
        <ArrowLeft className="w-5 h-5" /> Discover Products
      </Link>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            My Wishlist
            <span className="text-lg font-bold text-slate-400 bg-white px-4 py-1 rounded-full border border-slate-100">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </span>
          </h1>
          <Link to="/products" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(({ id, product, addedAt }) => (
            <div key={id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-square bg-slate-50 overflow-hidden">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => handleRemove(product.id, product.name)}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-primary-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {product.brand || product.category?.name}
                </p>
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2 hover:text-primary-600 transition-colors leading-snug">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-1">({product.reviewCount || 0})</span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-black text-slate-900">₹{Number(product.price).toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">₹{Number(product.originalPrice).toLocaleString()}</span>
                  )}
                </div>

                {product.stock === 0 ? (
                  <div className="w-full py-3 rounded-2xl bg-slate-100 text-slate-400 text-xs font-black text-center uppercase tracking-widest">
                    Out of Stock
                  </div>
                ) : (
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-3 rounded-2xl bg-primary-600 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
                  >
                    <ShoppingCart className="w-4 h-4" /> Move to Cart
                  </button>
                )}
                <p className="text-[10px] text-slate-300 text-center mt-2 font-medium">
                  Added {new Date(addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
