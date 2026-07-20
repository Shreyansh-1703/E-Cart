import React, { useState, useEffect } from 'react';
import { Package, Truck, Calendar, ChevronRight, Search, Filter } from 'lucide-react';
import { orderService } from '../../services/api';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAll();
        setOrders(data?.content || data?.orders || (Array.isArray(data) ? data : []));
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-6 items-end justify-between mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900">My Orders</h1>
            <p className="text-slate-500 font-medium">Track and manage your order history</p>
          </div>
          <div className="flex gap-4">
             <div className="relative group">
                <input type="text" placeholder="Search order ID..." className="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 focus:ring-4 focus:ring-primary-500/10 outline-none font-bold" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
             </div>
             <button className="bg-white border border-slate-200 rounded-2xl p-3 hover:bg-slate-50 transition-all text-slate-400">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(n => <div key={n} className="h-48 bg-white rounded-3xl animate-pulse"></div>)}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6 animate-fade-in">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="shrink-0 w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-600 border border-slate-100">
                    <Package className="w-10 h-10" />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                      <p className="font-black text-slate-900">#ORD-{order.id.toString().padStart(6, '0')}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Placed</p>
                      <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" /> {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                      <p className="font-black text-primary-600">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3 w-full md:w-auto">
                    <button className="flex-1 btn-primary text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2">
                       Track Order <Truck className="w-4 h-4" />
                    </button>
                    <button className="flex-1 bg-slate-900 text-white text-xs font-bold py-3 px-6 rounded-xl hover:bg-slate-800 transition-all">
                       View Details
                    </button>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="bg-slate-50/50 p-6 border-t border-slate-100 flex items-center gap-4 overflow-x-auto">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-2 pr-6 rounded-2xl border border-slate-100 grow-0 shrink-0">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg p-1">
                        <img src={item.product?.imageUrl} alt="" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 max-w-[120px] truncate">{item.product?.name}</span>
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <div className="text-xs font-bold text-slate-400 px-4">+{order.items.length - 4} more items</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h2>
            <p className="text-slate-500 mb-8">You haven't placed any orders with us yet.</p>
            <Link to="/products" className="btn-primary inline-flex px-8 py-4 rounded-2xl">Start Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
import { ShoppingBag } from 'lucide-react';
