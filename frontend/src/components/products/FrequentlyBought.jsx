import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Star, Check } from 'lucide-react';
import { recommendationService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const FrequentlyBought = ({ currentProduct }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingAll, setAddingAll] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!currentProduct?.id) return;
    setLoading(true);
    recommendationService.getFrequentlyBought(currentProduct.id, 4)
      .then(data => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [currentProduct?.id]);

  if (loading) return (
    <div className="space-y-4">
      <div className="h-7 w-64 bg-slate-100 rounded-xl animate-pulse" />
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => <div key={i} className="w-40 h-52 bg-slate-100 rounded-2xl animate-pulse shrink-0" />)}
      </div>
    </div>
  );

  if (items.length === 0) return null;

  const allProducts = [currentProduct, ...items];

  const handleAddAll = async () => {
    setAddingAll(true);
    try {
      for (const p of allProducts) {
        await addToCart(p.id, 1);
      }
      setAdded(true);
      toast.success(`${allProducts.length} items added to cart!`);
      setTimeout(() => setAdded(false), 3000);
    } catch {
      toast.error('Failed to add some items');
    } finally {
      setAddingAll(false);
    }
  };

  const totalPrice = allProducts.reduce((sum, p) => sum + Number(p.price), 0);

  return (
    <section>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Frequently Bought Together</h2>
      <p className="text-sm text-slate-400 mb-6 font-medium">Customers who bought this also bought these items together</p>

      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
        {/* Product strip */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          {allProducts.map((p, idx) => (
            <React.Fragment key={p.id}>
              <div className={`flex flex-col items-center gap-2 w-28 ${p.id === currentProduct.id ? '' : ''}`}>
                <div className={`w-24 h-24 rounded-2xl bg-white border-2 overflow-hidden p-2 ${p.id === currentProduct.id ? 'border-primary-300' : 'border-slate-100'}`}>
                  <img src={p.imageUrl || 'https://via.placeholder.com/100'} alt={p.name} className="w-full h-full object-contain" />
                </div>
                <Link to={`/products/${p.id}`} className="text-[10px] font-bold text-slate-700 text-center line-clamp-2 hover:text-primary-600 transition-colors leading-tight">
                  {p.name}
                </Link>
                <span className="text-xs font-black text-slate-900">₹{Number(p.price).toLocaleString()}</span>
              </div>
              {idx < allProducts.length - 1 && (
                <Plus className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <p className="text-xs text-slate-500 font-bold">Total for all {allProducts.length} items</p>
            <p className="text-2xl font-black text-slate-900">₹{totalPrice.toLocaleString()}</p>
          </div>
          <button
            onClick={handleAddAll}
            disabled={addingAll}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg ${
              added
                ? 'bg-emerald-500 text-white shadow-emerald-100'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-100'
            } disabled:opacity-60`}
          >
            {added ? (
              <><Check className="w-4 h-4" /> Added to Cart</>
            ) : addingAll ? (
              'Adding...'
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Add All {allProducts.length} to Cart</>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FrequentlyBought;
