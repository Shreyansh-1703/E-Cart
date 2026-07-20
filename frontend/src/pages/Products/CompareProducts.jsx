import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { 
  X, ShoppingCart, Star, Layers, ChevronLeft, Check, 
  AlertCircle, ShieldCheck
} from 'lucide-react';
import { toast } from 'react-toastify';

const CompareProducts = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    }
  };

  const getDiscountPct = (p) => {
    if (p.originalPrice && Number(p.originalPrice) > Number(p.price)) {
      return Math.round(((Number(p.originalPrice) - Number(p.price)) / Number(p.originalPrice)) * 100);
    }
    return null;
  };

  if (compareList.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen pt-20 pb-20 flex items-center justify-center">
        <div className="text-center bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl max-w-lg w-full mx-4">
          <Layers className="w-16 h-16 text-pink-500 mx-auto mb-6 stroke-1" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Comparison List is Empty</h2>
          <p className="text-slate-500 font-medium mb-8">
            Add up to 4 products from the catalog to compare their prices, ratings, and specifications side-by-side.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-pink-650 bg-pink-600 hover:bg-pink-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-pink-200 transition-all active:scale-95 text-sm uppercase tracking-widest"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back and Title */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-pink-600 mb-3 transition-colors font-bold group text-sm"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Catalog
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Layers className="w-8 h-8 text-pink-600" /> Compare Products
            </h1>
          </div>
          <button
            onClick={clearCompare}
            className="text-xs font-black text-red-500 hover:text-red-750 uppercase tracking-widest border border-red-200 hover:bg-red-50 py-3 px-6 rounded-xl transition-all"
          >
            Clear Comparison
          </button>
        </div>

        {/* Comparison grid / table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[700px]">
            {/* Table Header / Sticky info */}
            <thead>
              <tr className="border-b border-slate-100">
                <th className="w-1/5 p-6 bg-slate-55 bg-slate-50/50 text-left align-top font-bold text-xs uppercase tracking-widest text-slate-400">
                  Product Details
                </th>
                {compareList.map((p) => (
                  <th key={p.id} className="p-6 text-center align-top relative group border-l border-slate-50">
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 bg-slate-50 rounded-2xl p-2 mb-4 flex items-center justify-center border border-slate-100">
                        <img src={p.imageUrl || 'https://via.placeholder.com/150'} alt={p.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-1">{p.category?.name}</span>
                      <h3 className="font-bold text-slate-900 text-sm mb-3 line-clamp-2 max-w-[200px] h-10 leading-snug">
                        {p.name}
                      </h3>
                      
                      {/* Price & Discount */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-black text-slate-900">₹{Number(p.price).toLocaleString()}</span>
                        {getDiscountPct(p) && (
                          <span className="text-xs text-red-600 font-extrabold bg-red-50 px-1.5 py-0.5 rounded">
                            -{getDiscountPct(p)}%
                          </span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={p.stock <= 0}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-100 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none uppercase tracking-wider"
                      >
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
                {/* Fill empty comparison slots if less than 4 */}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, idx) => (
                  <th key={`empty-${idx}`} className="p-6 text-center align-middle border-l border-slate-50">
                    <Link
                      to="/products"
                      className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center hover:border-pink-300 hover:bg-pink-50/20 group transition-all h-64"
                    >
                      <Layers className="w-8 h-8 text-slate-350 group-hover:text-pink-400 transition-colors mb-2" />
                      <span className="text-xs font-black text-slate-400 group-hover:text-pink-600 transition-colors uppercase tracking-widest">
                        Add Product
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Comparison Spec Rows */}
            <tbody className="divide-y divide-slate-100">
              {/* Price row */}
              <tr>
                <td className="p-5 font-bold text-slate-700 bg-slate-50/50 text-xs uppercase tracking-wider">Price</td>
                {compareList.map((p) => (
                  <td key={`price-${p.id}`} className="p-5 text-center font-black text-slate-900 border-l border-slate-50 text-sm">
                    ₹{Number(p.price).toLocaleString()}
                    {p.originalPrice > p.price && (
                      <div className="text-xs text-slate-450 line-through font-medium">₹{Number(p.originalPrice).toLocaleString()}</div>
                    )}
                  </td>
                ))}
                {/* Empty column cells */}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, idx) => (
                  <td key={`empty-price-${idx}`} className="p-5 border-l border-slate-50"></td>
                ))}
              </tr>

              {/* Rating row */}
              <tr>
                <td className="p-5 font-bold text-slate-700 bg-slate-50/50 text-xs uppercase tracking-wider">Rating</td>
                {compareList.map((p) => {
                  const stars = Math.round(Number(p.rating) || 0);
                  return (
                    <td key={`rating-${p.id}`} className="p-5 text-center border-l border-slate-50">
                      <div className="flex justify-center items-center gap-0.5 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {p.rating || '4.5'}★ ({p.reviewCount || 0} reviews)
                      </span>
                    </td>
                  );
                })}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, idx) => (
                  <td key={`empty-rating-${idx}`} className="p-5 border-l border-slate-50"></td>
                ))}
              </tr>

              {/* Discount row */}
              <tr>
                <td className="p-5 font-bold text-slate-700 bg-slate-50/50 text-xs uppercase tracking-wider">Discount</td>
                {compareList.map((p) => {
                  const pct = getDiscountPct(p);
                  return (
                    <td key={`discount-${p.id}`} className="p-5 text-center border-l border-slate-50 font-black text-sm">
                      {pct ? (
                        <span className="text-red-600 bg-red-50 px-2 py-1 rounded-lg">-{pct}% OFF</span>
                      ) : (
                        <span className="text-slate-400 font-bold text-xs">-</span>
                      )}
                    </td>
                  );
                })}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, idx) => (
                  <td key={`empty-discount-${idx}`} className="p-5 border-l border-slate-50"></td>
                ))}
              </tr>

              {/* Seller / Brand row */}
              <tr>
                <td className="p-5 font-bold text-slate-700 bg-slate-50/50 text-xs uppercase tracking-wider">Brand / Seller</td>
                {compareList.map((p) => (
                  <td key={`seller-${p.id}`} className="p-5 text-center border-l border-slate-50 text-slate-700 font-bold text-sm">
                    {p.brand || 'Generic'}
                    <div className="text-[10px] text-slate-400 font-medium mt-1">Sold by E-Cart Approved Seller</div>
                  </td>
                ))}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, idx) => (
                  <td key={`empty-seller-${idx}`} className="p-5 border-l border-slate-50"></td>
                ))}
              </tr>

              {/* Stock status row */}
              <tr>
                <td className="p-5 font-bold text-slate-700 bg-slate-50/50 text-xs uppercase tracking-wider">Availability</td>
                {compareList.map((p) => {
                  const inStock = p.stock > 0;
                  return (
                    <td key={`stock-${p.id}`} className="p-5 text-center border-l border-slate-50">
                      {inStock ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-black">
                          <Check className="w-3.5 h-3.5" /> In Stock ({p.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-black">
                          <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                        </span>
                      )}
                    </td>
                  );
                })}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, idx) => (
                  <td key={`empty-stock-${idx}`} className="p-5 border-l border-slate-50"></td>
                ))}
              </tr>

              {/* Specific features / description row */}
              <tr>
                <td className="p-5 font-bold text-slate-700 bg-slate-50/50 text-xs uppercase tracking-wider">Key Features</td>
                {compareList.map((p) => (
                  <td key={`desc-${p.id}`} className="p-5 border-l border-slate-50 text-slate-650 text-xs leading-relaxed text-left align-top">
                    <p className="line-clamp-6">{p.description}</p>
                    <ul className="mt-3 space-y-1 text-[11px] font-bold text-slate-500">
                      <li>• 100% Genuine Quality</li>
                      <li>• COD & Online Payment Support</li>
                      {p.fastDeliveryAvailable && <li>• Same-day Express Delivery</li>}
                    </ul>
                  </td>
                ))}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, idx) => (
                  <td key={`empty-desc-${idx}`} className="p-5 border-l border-slate-50"></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareProducts;
