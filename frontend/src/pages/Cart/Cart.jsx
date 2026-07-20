import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Ticket } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, cartCount, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    try {
      await updateQuantity(itemId, newQty);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.info('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cart?.items?.reduce((total, item) => total + (item.product.price * item.quantity), 0) || 0;
  const tax = subtotal * 0.18;
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + tax + shipping;

  if (loading && !cart) return <div className="container mx-auto px-4 py-20 text-center">Loading cart...</div>;

  if (cartCount === 0) return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <ShoppingCart className="w-12 h-12 text-slate-300" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-4">Your cart is empty</h2>
      <p className="text-slate-500 mb-8 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
      <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl">
        <ArrowLeft className="w-5 h-5" /> Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-slate-900 mb-10 flex items-center gap-4">
          Shopping Cart <span className="text-lg font-bold text-slate-400 bg-white px-4 py-1 rounded-full border border-slate-100">{cartCount} items</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Items List */}
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-8 border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-widest">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-1"></div>
              </div>

              <div className="divide-y divide-slate-100">
                {cart.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-8 items-center bg-white hover:bg-slate-50/50 transition-colors">
                    <div className="col-span-6 flex gap-6">
                      <div className="w-24 h-24 bg-slate-50 rounded-2xl p-2 shrink-0 border border-slate-100">
                        <img src={item.product.imageUrl || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-lg hover:text-primary-600 transition-colors">
                          <Link to={`/products/${item.product.id}`}>{item.product.name}</Link>
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-1">{item.product.category?.name || 'Category'}</p>
                        <div className="md:hidden mt-2 font-black text-lg">₹{item.product.price.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="col-span-3 flex justify-center">
                      <div className="flex items-center gap-1 bg-slate-100/50 rounded-xl p-1 border border-slate-100">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          className="p-2 hover:bg-white rounded-lg transition-all text-slate-500 shadow-sm disabled:opacity-30"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-black text-slate-900">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          className="p-2 hover:bg-white rounded-lg transition-all text-slate-500 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 text-right hidden md:block">
                      <div className="font-black text-slate-900 text-lg">₹{(item.product.price * item.quantity).toLocaleString()}</div>
                      <div className="text-xs text-slate-400 font-bold mt-1">₹{item.product.price.toLocaleString()} / unit</div>
                    </div>

                    <div className="col-span-1 text-right">
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Remove Item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-slate-50/50 flex justify-between items-center">
                <Link to="/products" className="text-sm font-bold text-slate-600 hover:text-primary-600 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>
                <button 
                  onClick={clearCart}
                  className="text-sm font-bold text-red-400 hover:text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Clear Shopping Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-8 sticky top-28">
              <h2 className="text-2xl font-black text-slate-900">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>GST (18%)</span>
                  <span className="text-slate-900 font-bold">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Shipping Fee</span>
                  <span className={`${shipping === 0 ? 'text-emerald-600' : 'text-slate-900'} font-bold`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-amber-600 font-bold">Add ₹{(1001 - subtotal).toLocaleString()} more for FREE shipping</p>
                )}
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xl font-black text-slate-900">Total</span>
                  <span className="text-3xl font-black text-primary-600">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-bold placeholder:text-slate-400"
                  />
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-primary-600 transition-colors">Apply</button>
                </div>
                
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-primary py-5 rounded-2xl text-lg font-bold shadow-xl shadow-primary-200 flex items-center justify-center gap-3 group"
                >
                  Checkout Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="pt-6 flex items-center justify-center gap-6 opacity-30">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
              </div>
              
              <div className="flex items-start gap-3 bg-primary-50 p-4 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-primary-800 font-bold leading-normal">Your payment is 100% secure. We use world-class encryption to keep your data safe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
