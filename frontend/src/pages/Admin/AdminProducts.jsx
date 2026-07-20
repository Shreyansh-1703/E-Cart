import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { productService } from '../../services/api';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data?.content || data?.products || (Array.isArray(data) ? data : []));
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-8 md:p-12">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900">Manage Products</h1>
          <p className="text-slate-500 font-medium">Add, edit, or remove store items</p>
        </div>
        <button className="btn-primary py-4 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-primary-200">
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
           <div className="relative flex-1">
              <input type="text" placeholder="Search products..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 outline-none font-bold" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
           </div>
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
                  <th className="pb-6 pr-4">Product</th>
                  <th className="pb-6 pr-4">Category</th>
                  <th className="pb-6 pr-4">Price</th>
                  <th className="pb-6 pr-4">Stock</th>
                  <th className="pb-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((p) => (
                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 pr-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 p-2 border border-slate-100 shrink-0">
                          <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-black text-slate-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-6 pr-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-primary-100 text-primary-700 uppercase tracking-widest">{p.category?.name || 'Store'}</span>
                    </td>
                    <td className="py-6 pr-4 font-black text-slate-900">₹{p.price.toLocaleString()}</td>
                    <td className="py-6 pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-bold text-slate-600">{p.stock} units</span>
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2.5 text-slate-300 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                        <button className="p-2.5 text-slate-300 hover:text-slate-600 rounded-xl transition-all"><MoreVertical className="w-4 h-4" /></button>
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

export default AdminProducts;
