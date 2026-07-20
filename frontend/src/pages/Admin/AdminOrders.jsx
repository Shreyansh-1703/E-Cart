import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, MoreHorizontal, Eye } from 'lucide-react';
import { orderService } from '../../services/api';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAll(true);
        setOrders(data?.content || data?.orders || (Array.isArray(data) ? data : []));
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen p-8 md:p-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900">Order Management</h1>
        <p className="text-slate-500 font-medium">Track and update customer orders</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="relative flex-1">
              <input type="text" placeholder="Search orders..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 outline-none font-bold" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
           </div>
           <button className="bg-slate-50 text-slate-500 font-bold px-6 py-4 rounded-2xl flex items-center gap-2 hover:bg-slate-100 transition-all border border-slate-100">
             <Filter className="w-5 h-5" /> All Status
           </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(n => <div key={n} className="h-20 bg-slate-50 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-6 pr-4">Order ID</th>
                  <th className="pb-6 pr-4">Customer</th>
                  <th className="pb-6 pr-4">Date</th>
                  <th className="pb-6 pr-4">Amount</th>
                  <th className="pb-6 pr-4 text-center">Status</th>
                  <th className="pb-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((o) => (
                  <tr key={o.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 pr-4 font-black text-slate-900">#ORD-{o.id.toString().padStart(6, '0')}</td>
                    <td className="py-6 pr-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-[10px]">{o.user?.fullName?.substring(0,2) || 'JD'}</div>
                         <span className="text-sm font-bold text-slate-600">{o.user?.fullName || 'Guest'}</span>
                      </div>
                    </td>
                    <td className="py-6 pr-4 text-sm font-bold text-slate-400">{new Date(o.orderDate).toLocaleDateString()}</td>
                    <td className="py-6 pr-4 font-black text-slate-900">₹{o.totalAmount.toLocaleString()}</td>
                    <td className="py-6 pr-4">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span>
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2.5 text-slate-300 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"><Eye className="w-4 h-4" /></button>
                        <button className="p-2.5 text-slate-300 hover:text-slate-600 rounded-xl transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
