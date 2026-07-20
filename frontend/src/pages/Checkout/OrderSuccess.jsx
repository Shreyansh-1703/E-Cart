import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, Home, ShoppingBag, Download, Calendar, MapPin, CreditCard, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state;

  useEffect(() => {
    if (!orderDetails) {
      navigate('/');
      return;
    }

    // Fire premium confetti effect
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 80 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, [orderDetails, navigate]);

  if (!orderDetails) return null;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden mb-12 animate-fade-in">
            {/* Header / Celebration Banner */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <circle cx="10" cy="10" r="20" fill="white" />
                  <circle cx="90" cy="50" r="15" fill="white" />
                  <circle cx="30" cy="80" r="25" fill="white" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-4 border-white/30 shadow-2xl animate-float">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">Order Placed Successfully!</h1>
                <div className="inline-flex items-center gap-3 bg-black/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10">
                  <span className="text-emerald-50 font-black tracking-widest uppercase text-xs">Order ID: {orderDetails.orderId}</span>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left Side: Order Contents */}
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                      <Package className="w-6 h-6 text-primary-600" /> Your Order Items
                    </h2>
                    <div className="space-y-6">
                      {orderDetails.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6 group hover:bg-slate-50 p-4 rounded-3xl transition-colors border border-transparent hover:border-slate-100">
                          <div className="w-20 h-20 bg-white rounded-2xl p-3 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                            <img src={item.product.imageUrl || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-slate-900 text-base truncate uppercase tracking-tight">{item.product.name}</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                              Quantity: {item.quantity} • Unit: ₹{item.product.price.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-slate-900 text-lg">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-10 border-t-4 border-dashed border-slate-50">
                    <div className="flex justify-between items-center text-3xl font-black text-slate-900">
                      <span className="tracking-tighter uppercase text-sm text-slate-400">Total Amount Paid</span>
                      <span className="text-primary-600">₹{orderDetails.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Delivery & Logistics */}
                <div className="space-y-8">
                  <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100 space-y-8">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                        <p className="text-xl font-black text-emerald-600 flex items-center gap-2">
                          {orderDetails.estimatedDelivery} {orderDetails.estimatedDelivery === 'Today' && <Zap className="w-5 h-5 fill-emerald-600" />}
                        </p>
                        <p className="text-xs text-slate-500 font-bold mt-1 tracking-tight">By End of Day, 9:00 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivering To</p>
                        <p className="font-bold text-slate-900 text-sm leading-relaxed">{orderDetails.address || orderDetails.shippingAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
                        <p className="font-black text-slate-900 uppercase tracking-tight text-sm px-3 py-1 bg-slate-200 rounded-lg inline-block mt-1">
                          {orderDetails.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-primary-50 p-6 rounded-3xl border border-primary-100 group">
                    <div className="bg-primary-600 p-3 rounded-2xl text-white group-hover:scale-110 transition-transform">
                      <Truck className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-primary-900">Live Express Tracking</p>
                      <p className="text-xs text-primary-700 font-bold italic opacity-80 underline decoration-primary-300">You can start tracking your order in 30 minutes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-slate-900 p-10 flex flex-col md:flex-row gap-8 items-center justify-between border-t border-slate-800">
              <button className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white transition-colors group">
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Download Digital Invoice
              </button>
              <div className="flex gap-4 w-full md:w-auto">
                <Link to="/" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all border border-white/5">
                  <Home className="w-5 h-5" /> HOME
                </Link>
                <Link to="/orders" className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-primary-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-primary-900 hover:bg-primary-700 transition-all transform hover:-translate-y-1 active:translate-y-0 group">
                  MY ORDERS <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Social / Support Links */}
          <div className="text-center space-y-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-center gap-10">
              <button className="text-[10px] font-black text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-colors">Need Help?</button>
              <button className="text-[10px] font-black text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-colors">Refund Policy</button>
              <button className="text-[10px] font-black text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-colors">Share Order</button>
            </div>
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em] px-4">CERTIFIED SECURE E-COMMERCE HUB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
