import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  CreditCard, MapPin, Truck, CheckCircle, ChevronLeft, 
  ShieldCheck, ShoppingBag, Landmark, Wallet, Phone, 
  Mail, User, Receipt, CreditCard as CardIcon, Globe,
  Zap, Info, Ticket, Lock, ArrowRight, Home
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { orderService, paymentService } from '../../services/api';

// Dynamically inject Razorpay script if not already loaded
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const { cart, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. DATA SOURCE: Buy Now State or Cart
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isBuyNow, setIsBuyNow] = useState(false);
  
  // 2. FORM & UI STATE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [deliveryType, setDeliveryType] = useState('standard');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isPrimeMember] = useState(true); // Mocking prime status

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Initialize data and persistence
  useEffect(() => {
    // 1. Try React Router State (Buy Now)
    if (location.state?.items) {
      setCheckoutItems(location.state.items);
      setIsBuyNow(true);
      localStorage.setItem('ecart_checkout_pending', JSON.stringify(location.state));
    } 
    // 2. Try Persistence (Refresh)
    else {
      const persisted = localStorage.getItem('ecart_checkout_pending');
      if (persisted) {
        const data = JSON.parse(persisted);
        setCheckoutItems(data.items);
        setIsBuyNow(data.isBuyNow || false);
      } 
      // 3. Fallback to Cart
      else if (cart?.items?.length > 0) {
        setCheckoutItems(cart.items);
        setIsBuyNow(false);
      }
      // 4. Redirect if nothing
      else if (!cartCount) {
        navigate('/products');
      }
    }
  }, [location.state, cart, cartCount]);

  // Calculations
  const subtotal = checkoutItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const gst = subtotal * 0.18;
  
  // Delivery Charge Logic
  let deliveryCharge = deliveryType === 'express' ? 200 : 0;
  if (isPrimeMember && deliveryType === 'express') deliveryCharge = 0;
  if (subtotal > 2000) deliveryCharge = 0; // Free delivery over 2000

  // Coupon Logic
  let discount = 0;
  if (appliedCoupon === 'WELCOME10') discount = subtotal * 0.10;
  if (appliedCoupon === 'SAVE500') discount = Math.min(500, subtotal);

  const total = subtotal + gst + deliveryCharge - discount;

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (code === 'WELCOME10' || code === 'SAVE500') {
      setAppliedCoupon(code);
      toast.success(`Coupon ${code} applied successfully!`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const backendOrderData = {
        addressLine: `${formData.houseNumber}, ${formData.street}${formData.landmark ? `, ${formData.landmark}` : ''}`,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'RAZORPAY',
        fastDelivery: deliveryType === 'express',
        items: checkoutItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      const orderResponse = await orderService.place(backendOrderData);
      const appOrderId = orderResponse.id;

      if (paymentMethod === 'COD') {
        localStorage.removeItem('ecart_checkout_pending');
        if (!isBuyNow) await clearCart();
        toast.success('Order placed successfully! 🎉');
        navigate('/order-success', { 
          state: { 
            addressLine: backendOrderData.addressLine,
            city: backendOrderData.city,
            state: backendOrderData.state,
            pincode: backendOrderData.pincode,
            paymentMethod: 'COD',
            totalAmount: total,
            customerName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            orderId: orderResponse.orderNumber || appOrderId,
            date: new Date().toLocaleDateString(),
            estimatedDelivery: deliveryType === 'express' ? 'Today (within 6 hours)' : '3-4 Days'
          } 
        });
      } else {
        // Online Payment Flow (Razorpay)
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error('Razorpay SDK failed to load. Please check your internet connection.');
          setIsSubmitting(false);
          return;
        }

        const paymentOrder = await paymentService.createOrder(appOrderId);
        
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_TDktDNxSZR3gZC', // Use environment variable for Razorpay Key
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
          name: 'E-Cart Platform',
          description: 'Payment for order #' + (orderResponse.orderNumber || appOrderId),
          order_id: paymentOrder.paymentOrderId,
          handler: async function (response) {
            try {
              setIsSubmitting(true);
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                app_order_id: String(appOrderId)
              };

              const verificationResult = await paymentService.verifyPayment(verificationData);

              if (verificationResult.status === 'success') {
                localStorage.removeItem('ecart_checkout_pending');
                if (!isBuyNow) {
                  await clearCart();
                }
                toast.success('Payment verified! Order placed successfully. 🎉');
                navigate('/payment-success', { 
                  state: { 
                    addressLine: backendOrderData.addressLine,
                    city: backendOrderData.city,
                    state: backendOrderData.state,
                    pincode: backendOrderData.pincode,
                    paymentMethod: paymentMethod, // Card, UPI, etc.
                    totalAmount: total,
                    customerName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    orderId: orderResponse.orderNumber || appOrderId,
                    paymentId: response.razorpay_payment_id,
                    date: new Date().toLocaleDateString(),
                    estimatedDelivery: deliveryType === 'express' ? 'Today (within 6 hours)' : '3-4 Days'
                  } 
                });
              } else {
                toast.error('Payment verification failed. Please contact support.');
                setIsSubmitting(false);
                navigate('/payment-failed');
              }
            } catch (err) {
              toast.error(err.message || 'Payment verification failed.');
              setIsSubmitting(false);
              navigate('/payment-failed');
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#4f46e5'
          },
          modal: {
            ondismiss: function () {
              toast.warning('Payment window closed.');
              setIsSubmitting(false);
              navigate('/payment-failed');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (response) {
          toast.error(response.error.description || 'Payment Failed');
          setIsSubmitting(false);
          navigate('/payment-failed');
        });
        
        rzp.open();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
      setIsSubmitting(false);
    }
  };

  if (checkoutItems.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      {/* Header bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-primary-600 tracking-tighter flex items-center gap-2">
            <ShoppingBag className="w-8 h-8" /> E-CART
          </Link>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest hidden md:flex">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-10">
          <Link to={isBuyNow ? `/products/${checkoutItems[0].product.id}` : "/cart"} className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-4 transition-colors font-bold group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to {isBuyNow ? 'Product' : 'Cart'}
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Finalizing Your Order</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT SECTION — FORMS */}
          <div className="lg:w-2/3 space-y-8">
            
            {/* DELIVERY ADDRESS */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">1. Delivery Address</h3>
              </div>
              
              <div className="p-6 md:p-8 overflow-hidden">
                <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <input 
                        {...register('fullName', { required: 'Full Name is required' })}
                        placeholder="Arjun Kapoor"
                        className={`w-full bg-slate-50 border ${errors.fullName ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-3.5 pl-11 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-900 font-bold`}
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    </div>
                    {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                    <div className="relative group">
                      <input 
                        {...register('phone', { required: 'Required', pattern: { value: /^[0-9]{10}$/, message: '10 digits' } })}
                        placeholder="9876543210"
                        className={`w-full bg-slate-50 border ${errors.phone ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-3.5 pl-11 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-900 font-bold`}
                      />
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    </div>
                    {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.phone.message}</p>}
                  </div>

                  <div className="col-span-full space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <input 
                        {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                        placeholder="arjun@example.com"
                        className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-3.5 pl-11 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-900 font-bold`}
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">House / Apt No.</label>
                    <div className="relative group">
                      <input 
                        {...register('houseNumber', { required: 'Required' })}
                        placeholder="Flat 402, Building A"
                        className={`w-full bg-slate-50 border ${errors.houseNumber ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-3.5 pl-11 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-900 font-bold`}
                      />
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street / Area</label>
                    <div className="relative group">
                      <input 
                        {...register('street', { required: 'Required' })}
                        placeholder="Green Avenue, Sector 12"
                        className={`w-full bg-slate-50 border ${errors.street ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-3.5 pl-11 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-900 font-bold`}
                      />
                      <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Landmark (Optional)</label>
                    <input 
                      {...register('landmark')}
                      placeholder="Near City Park"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode</label>
                    <input 
                      {...register('pincode', { required: 'Required', pattern: { value: /^[0-9]{6}$/, message: '6 digits' } })}
                      placeholder="123456"
                      className={`w-full bg-slate-50 border ${errors.pincode ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-3.5 px-5 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-bold`}
                    />
                    {errors.pincode && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.pincode.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                    <input 
                      {...register('city', { required: 'Required' })}
                      placeholder="Mumbai"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                    <input 
                      {...register('state', { required: 'Required' })}
                      placeholder="Maharashtra"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-bold"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* DELIVERY OPTIONS */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">2. Delivery Options</h3>
              </div>
              
              <div className="p-6 md:p-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setDeliveryType('standard')}
                    className={`flex items-start gap-4 p-6 rounded-2xl border-2 transition-all ${deliveryType === 'standard' ? 'border-primary-600 bg-primary-50/50' : 'border-slate-50 hover:bg-slate-50'}`}
                  >
                    <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${deliveryType === 'standard' ? 'border-primary-600' : 'border-slate-300'}`}>
                      {deliveryType === 'standard' && <div className="h-2.5 w-2.5 bg-primary-600 rounded-full"></div>}
                    </div>
                    <div className="text-left">
                      <p className="font-black text-slate-900">Standard Delivery</p>
                      <p className="text-xs text-slate-500 font-bold">Arrives in 3–5 working days</p>
                      <p className="mt-2 text-emerald-600 font-black text-sm uppercase tracking-widest">FREE</p>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setDeliveryType('express')}
                    className={`flex items-start gap-4 p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${deliveryType === 'express' ? 'border-amber-500 bg-amber-50/30' : 'border-slate-50 hover:bg-slate-50'}`}
                  >
                    <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${deliveryType === 'express' ? 'border-amber-500' : 'border-slate-300'}`}>
                      {deliveryType === 'express' && <div className="h-2.5 w-2.5 bg-amber-500 rounded-full"></div>}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900">Express Delivery</p>
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </div>
                      <p className="text-xs text-slate-500 font-bold">Same day or within 24 hours</p>
                      <p className="mt-2 text-slate-900 font-black text-sm uppercase tracking-widest">₹200 EXTRA</p>
                    </div>
                    {isPrimeMember && (
                      <div className="absolute top-0 right-0 bg-primary-600 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-lg">
                        PRIME FREE
                      </div>
                    )}
                  </button>
                </div>

                <div className="bg-primary-50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="bg-primary-600 p-2 rounded-lg text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary-900">Prime Member Benefit</p>
                    <p className="text-xs text-primary-700 font-bold">You get <span className="underline">FREE Express Delivery</span> on this order!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT METHODS */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                  <CardIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">3. Payment Method</h3>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { id: 'UPI', label: 'UPI', icon: <Wallet className="w-4 h-4" /> },
                    { id: 'CARD', label: 'Card', icon: <CreditCard className="w-4 h-4" /> },
                    { id: 'NET', label: 'Net Banking', icon: <Landmark className="w-4 h-4" /> },
                    { id: 'COD', label: 'Cash', icon: <Truck className="w-4 h-4" /> },
                    { id: 'WALLET', label: 'Wallet', icon: <ShoppingBag className="w-4 h-4" /> },
                  ].map(method => (
                    <button 
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === method.id ? 'border-primary-600 bg-primary-50' : 'border-slate-50 bg-slate-50/50'}`}
                    >
                      <div className={`p-2 rounded-lg ${paymentMethod === method.id ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {method.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === method.id ? 'text-primary-600' : 'text-slate-400'}`}>
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Method Specific Fields */}
                <div className="animate-fade-in p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-4 grey opacity-50" alt="" />
                        <img src="https://static.brandirectory.com/logos/google-pay-logo.png" className="h-6" alt="" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Paytm_logo.png/640px-Paytm_logo.png" className="h-4" alt="" />
                      </div>
                      <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enter UPI ID</label>
                        <input 
                          placeholder="arjun@okicici"
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary-500/10 outline-none text-slate-900 font-bold"
                        />
                        <p className="text-[9px] text-slate-400 font-bold ml-1 uppercase">Examples: yourname@ptsbi, user@okaxis</p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'CARD' && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                        <input 
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary-500/10 outline-none text-slate-900 font-bold tracking-[0.2em]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                          <input placeholder="MM/YY" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none text-slate-900 font-bold" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                          <input placeholder="•••" type="password" maxLength="3" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none text-slate-900 font-bold" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'NET' && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Bank</label>
                      <select className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none text-slate-900 font-bold appearance-none cursor-pointer">
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'COD' && (
                    <div className="flex items-center gap-4 text-slate-600">
                      <Truck className="w-8 h-8 opacity-40 shrink-0" />
                      <p className="text-sm font-bold">Pay with cash or via UPI at your doorstep when the delivery arrives.</p>
                    </div>
                  )}

                  {paymentMethod === 'WALLET' && (
                    <div className="grid grid-cols-1 gap-3">
                      {['Amazon Pay', 'Paytm Wallet', 'MobiKwik'].map(w => (
                        <button key={w} className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-primary-200 transition-all">
                          <span className="font-bold text-slate-700">{w}</span>
                          <div className="h-4 w-4 border-2 border-slate-300 rounded-full"></div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION — SUMMARY */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 space-y-6">
              
              {/* ORDER SUMMARY CARD */}
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-slide-left">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
                  <Receipt className="w-6 h-6 text-primary-600" />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Order Summary</h3>
                </div>

                <div className="p-8 space-y-8">
                  {/* Item List */}
                  <div className="space-y-6">
                    {checkoutItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                          <img src={item.product.imageUrl || 'https://via.placeholder.com/100'} className="w-full h-full object-contain p-2" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-primary-600 transition-colors uppercase tracking-tight">{item.product.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.product.category?.name || 'Category'}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold">Qty: {item.quantity}</span>
                            <span className="text-sm font-black text-slate-900">₹{item.product.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Section */}
                  <div className="pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2 mb-3 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                      <Ticket className="w-3 h-3" /> Have a Coupon?
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="WELCOME10"
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:bg-white focus:border-primary-500 transition-all uppercase"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-primary-600 transition-all active:scale-90"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedCoupon && (
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-emerald-600 font-black animate-slide-up">
                        <CheckCircle className="w-3 h-3" /> {appliedCoupon} APPLIED SUCCESSFULLY!
                      </div>
                    )}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-3 pt-6 border-t border-slate-50">
                    <div className="flex justify-between text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <span>Total MRP</span>
                      <span className="text-slate-900">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <span>GST (18%)</span>
                      <span className="text-slate-900 font-black">₹{gst.toFixed(0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <span>Delivery Charge</span>
                      <span className={deliveryCharge === 0 ? 'text-emerald-600 font-black' : 'text-slate-900'}>
                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-red-500 font-black text-xs uppercase tracking-wider">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Final Total */}
                  <div className="pt-6 border-t-4 border-dashed border-slate-50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payable Amount</span>
                      <div className="flex justify-between items-baseline">
                        <span className="text-4xl font-black text-primary-600 tracking-tighter">₹{total.toLocaleString()}</span>
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase">Secure</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Place Order CTA */}
                  <div className="pt-6">
                    <button 
                      form="checkout-form"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white h-16 rounded-2xl flex items-center justify-center gap-4 text-lg font-black shadow-2xl shadow-primary-200 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:shadow-none group"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Place Order Now <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="mt-4 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest px-4 italic leading-relaxed">
                      By placing your order, you agree to e-cart's privacy notice and conditions of use.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Lock />, label: 'SSL Encrypted' },
                  { icon: <CheckCircle className="text-emerald-500" />, label: 'Easy Returns' },
                ].map((t, i) => (
                  <div key={i} className="bg-white/60 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">{t.icon}</div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
