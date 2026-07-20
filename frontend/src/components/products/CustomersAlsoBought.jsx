import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { recommendationService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const ProductMini = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const stars = Math.round(Number(product.rating) || 0);
  const discountPct = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link to={`/products/${product.id}`} className="group bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 flex flex-col">
      <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-3 relative">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/200'}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
        />
        {discountPct && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
            -{discountPct}%
          </span>
        )}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{product.brand || product.category?.name}</p>
      <h3 className="text-xs font-bold text-slate-800 line-clamp-2 flex-1 group-hover:text-primary-600 transition-colors leading-snug mb-2">
        {product.name}
      </h3>
      <div className="flex items-center gap-0.5 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
        ))}
        <span className="text-[10px] text-slate-400 ml-1">({product.reviewCount || 0})</span>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-black text-slate-900 text-sm">₹{Number(product.price).toLocaleString()}</span>
        <button
          onClick={handleAdd}
          disabled={adding}
          className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all disabled:opacity-50"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
        </button>
      </div>
    </Link>
  );
};

const CustomersAlsoBought = ({ currentProductId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProductId) return;
    setLoading(true);
    recommendationService.getAlsoBought(currentProductId, 6)
      .then(data => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [currentProductId]);

  if (loading) return (
    <div className="space-y-4">
      <div className="h-7 w-56 bg-slate-100 rounded-xl animate-pulse" />
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Customers Also Bought</h2>
      <p className="text-sm text-slate-400 mb-6 font-medium">Based on what others viewed and purchased</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {items.map(p => <ProductMini key={p.id} product={p} />)}
      </div>
    </section>
  );
};

export default CustomersAlsoBought;
