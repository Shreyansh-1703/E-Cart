import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Star, ShieldCheck, Truck, RotateCcw,
  ChevronRight, Minus, Plus, Heart, Share2, Zap, CheckCircle2, StarHalf, Layers
} from 'lucide-react';
import { productService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { toast } from 'react-toastify';
import ProductReviews from '../../components/products/ProductReviews';
import FrequentlyBought from '../../components/products/FrequentlyBought';
import CustomersAlsoBought from '../../components/products/CustomersAlsoBought';
import DeliveryETA from '../../components/products/DeliveryETA';
import ReturnsPolicy from '../../components/products/ReturnsPolicy';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getById(id);
        setProduct(data);
      } catch {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    navigate('/checkout', {
      state: { items: [{ product, quantity, price: product.price }], isBuyNow: true }
    });
  };

  const handleWishlist = async () => {
    setWishlistLoading(true);
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        toast.info('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        toast.success('Added to wishlist ❤️');
      }
    } catch {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2 aspect-square bg-slate-200 rounded-[3rem]" />
        <div className="lg:w-1/2 space-y-6">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-12 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-20 bg-slate-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h2 className="text-2xl font-bold">Product not found</h2>
      <Link to="/products" className="text-primary-600 font-bold mt-4 inline-block">Back to products</Link>
    </div>
  );

  const inWishlist = isInWishlist(product.id);
  const avgRating = Number(product.rating) || 4.5;
  const reviewCount = product.reviewCount || 0;
  const discountPct = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap bg-slate-50 p-4 rounded-2xl">
          <Link to="/" className="hover:text-primary-600 font-medium">Home</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link to="/products" className="hover:text-primary-600 font-medium">Products</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-slate-400 font-medium">{product.category?.name}</span>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="font-bold text-slate-900 truncate">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* ── Left: Gallery ── */}
          <div className="lg:w-5/12 space-y-6">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col gap-3">
                {[product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl].map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 transition-all p-1 bg-white ${activeImg === i ? 'border-primary-600 shadow-lg shadow-primary-100' : 'border-slate-100'}`}>
                    <img src={img || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
              <div className="flex-1 aspect-square bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden relative group cursor-zoom-in">
                <img src={product.imageUrl || 'https://via.placeholder.com/600'} alt={product.name}
                  className="w-full h-full object-contain p-8 group-hover:scale-150 transition-transform duration-500 ease-out" />
                {product.badge && (
                  <span className="absolute top-6 left-6 bg-primary-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary-200">
                    {product.badge}
                  </span>
                )}
                {/* Wishlist button on image */}
                <button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  className={`absolute top-6 right-6 p-3 backdrop-blur-md shadow-lg rounded-full transition-all hover:scale-110 ${
                    inWishlist ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="lg:w-7/12 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-primary-600 font-bold text-sm tracking-wide">{product.brand || 'Premium Brand'}</span>
                {product.stock > 0 && product.stock < 10 && (
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest animate-pulse">
                    Only {product.stock} left!
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                    Out of Stock
                  </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">{product.name}</h1>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    i <= Math.floor(avgRating)
                      ? <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      : i === Math.ceil(avgRating) && avgRating % 1 >= 0.3
                      ? <StarHalf key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      : <Star key={i} className="w-4 h-4 text-slate-200 fill-slate-200" />
                  ))}
                  <span className="ml-1 text-sm font-black text-amber-600">{avgRating.toFixed(1)}</span>
                </div>
                <span className="text-slate-400 text-sm font-semibold">{reviewCount.toLocaleString()} ratings</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-primary-600 text-sm font-bold hover:underline"
                >
                  See all reviews
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-black text-slate-900 tracking-tight">₹{Number(product.price).toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-slate-400 line-through font-medium">₹{Number(product.originalPrice).toLocaleString()}</span>
                  <span className="text-red-600 font-black text-lg bg-red-50 px-2 py-0.5 rounded-lg">-{discountPct}%</span>
                </>
              )}
            </div>
            <p className="text-slate-500 text-sm font-medium -mt-3">Inclusive of all taxes · No-cost EMI from ₹{Math.round(product.price / 12).toLocaleString()}/mo*</p>

            {/* Action block */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900">Quantity</p>
                <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-slate-50 rounded-lg"><Minus className="w-4 h-4" /></button>
                  <span className="w-8 text-center font-black">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-slate-50 rounded-lg"><Plus className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleAddToCart} disabled={product.stock <= 0}
                  className="flex-1 bg-white border-2 border-primary-600 text-primary-600 py-4 rounded-2xl flex items-center justify-center gap-2 font-black hover:bg-primary-50 transition-all shadow-lg shadow-primary-100 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button onClick={handleBuyNow} disabled={product.stock <= 0}
                  className="flex-1 bg-primary-600 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 disabled:opacity-40 disabled:cursor-not-allowed">
                  <Zap className="w-5 h-5 fill-white" /> Buy It Now
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handleWishlist} disabled={wishlistLoading}
                  className={`flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl transition-all border ${
                    inWishlist
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-500'
                  }`}>
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  {inWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>
                <button onClick={() => {
                    if (isInCompare(product.id)) {
                      removeFromCompare(product.id);
                    } else {
                      addToCompare(product);
                    }
                  }}
                  className={`flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl transition-all border ${
                    isInCompare(product.id)
                      ? 'bg-pink-50 border-pink-200 text-pink-600'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-pink-200 hover:text-pink-600'
                  }`}>
                  <Layers className={`w-4 h-4 ${isInCompare(product.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                  {isInCompare(product.id) ? 'Added to Compare' : 'Add to Compare'}
                </button>
                <button className="flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary-600 transition-all">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

              <div className="flex items-center gap-2 text-primary-700 font-bold justify-center pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">100% Secure Checkout</span>
              </div>
            </div>

            {/* Delivery ETA */}
            <DeliveryETA />

            {/* Returns Policy */}
            <ReturnsPolicy productId={product.id} />

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-600">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-bold text-slate-600">7-Day Return</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-bold text-slate-600">Tracked Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-600">Genuine Product</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="mt-16 border-t border-slate-100 pt-12">
          <div className="flex gap-8 mb-10 border-b border-slate-100 overflow-x-auto whitespace-nowrap no-scrollbar">
            {[
              { key: 'description', label: 'Description' },
              { key: 'specs', label: 'Specifications' },
              { key: 'reviews', label: `Reviews (${reviewCount})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`pb-5 text-sm font-black border-b-2 transition-all shrink-0 ${
                  activeTab === tab.key ? 'border-primary-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">About this item</h2>
                <p className="text-slate-600 leading-relaxed text-base font-medium">{product.description}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  {['Premium quality materials and build', 'Optimized for performance and durability',
                    'Elegant design with modern aesthetics', 'Industry leading warranty and support',
                    'Eco-friendly packaging', 'BIS/ISI certified'].map((point, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="w-2 h-2 rounded-full bg-primary-600 mt-2 shrink-0" />
                      <span className="text-slate-600 font-medium text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Technical Details</h2>
                <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {[
                        ['Brand', product.brand || 'Generic'],
                        ['Category', product.category?.name || '-'],
                        ['Item Weight', '450 g'],
                        ['Dimensions', '15 × 8 × 20 cm'],
                        ['In the Box', 'Product, User Manual, Warranty Card'],
                        ['Model Year', '2024'],
                        ['Country of Origin', 'India'],
                        ['Warranty', '1 Year Manufacturer Warranty'],
                      ].map(([k, v]) => (
                        <tr key={k} className="border-b border-white last:border-0">
                          <td className="p-4 font-bold text-slate-700 w-2/5 text-sm">{k}</td>
                          <td className="p-4 text-slate-600 text-sm">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ProductReviews productId={product.id} />
            )}
          </div>
        </div>

        {/* ── Recommendations ── */}
        <div className="mt-16 pt-12 border-t border-slate-100 space-y-14">
          <FrequentlyBought currentProduct={product} />
          <CustomersAlsoBought currentProductId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
