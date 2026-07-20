import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, TrendingUp, ShoppingBag, BarChart2, Plus, Edit3, Trash2,
  IndianRupee, AlertTriangle, CheckCircle2, Eye, MoreVertical, X
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { sellerService, productService, categoryService } from '../../services/api';
import { toast } from 'react-toastify';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-[1.75rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-900">{value}</p>
    {sub && <p className="text-xs text-slate-400 font-bold mt-1">{sub}</p>}
  </div>
);

const ProductModal = ({ product, categories, onClose, onSave }) => {
  const [form, setForm] = useState(product || { name:'', description:'', price:'', stock:'', imageUrl:'', categoryId:'', badge:'' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) { toast.error('Name, price and stock are required'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name, description: form.description,
        price: parseFloat(form.price), stock: parseInt(form.stock),
        imageUrl: form.imageUrl, badge: form.badge,
        category: form.categoryId ? { id: parseInt(form.categoryId) } : null,
      };
      if (product?.id) await productService.update(product.id, payload);
      else await productService.create(payload);
      toast.success(product?.id ? 'Product updated!' : 'Product created!');
      onSave();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary-300 transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900">{product?.id ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Product Name *</label>
            <input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Samsung Galaxy S24" className={inp} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))}
              rows={3} placeholder="Describe your product..." className={`${inp} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm(p=>({...p,price:e.target.value}))} placeholder="999" className={inp} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Stock *</label>
              <input type="number" value={form.stock} onChange={e => setForm(p=>({...p,stock:e.target.value}))} placeholder="100" className={inp} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category</label>
            <select value={form.categoryId} onChange={e => setForm(p=>({...p,categoryId:e.target.value}))} className={inp}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Image URL</label>
            <input value={form.imageUrl} onChange={e => setForm(p=>({...p,imageUrl:e.target.value}))}
              placeholder="https://images.unsplash.com/..." className={inp} />
            {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-2 w-20 h-20 object-contain rounded-xl border border-slate-100" onError={e=>e.target.style.display='none'} />}
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Badge (optional)</label>
            <select value={form.badge} onChange={e => setForm(p=>({...p,badge:e.target.value}))} className={inp}>
              <option value="">None</option>
              <option value="NEW">NEW</option>
              <option value="SALE">SALE</option>
              <option value="HOT">HOT</option>
              <option value="BESTSELLER">BESTSELLER</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 text-sm shadow-lg shadow-primary-200 disabled:opacity-60">
            {saving ? 'Saving...' : product?.id ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SellerDashboard = () => {
  const [stats, setStats]         = useState(null);
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [modalProduct, setModalProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, catData] = await Promise.all([
        sellerService.getStats(),
        categoryService.getAll(),
      ]);
      setStats(statsData);
      setCategories(catData);
      // Products from stats.products or fetch separately
      if (statsData?.totalProducts !== undefined) {
        const prodData = await productService.getAll({ size: 1000 });
        // Filter to only this seller's products (backend handles this for SELLER role)
        setProducts(prodData.content || []);
      }
    } catch (err) {
      if (err.message?.includes('seller profile')) {
        // Not registered as seller yet
        setStats(null);
      } else {
        toast.error('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      toast.success('Product deleted');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const handleModalSave = () => { setShowModal(false); setModalProduct(null); fetchData(); };

  if (loading) return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_,i) => <div key={i} className="h-32 bg-slate-200 rounded-[1.75rem]" />)}
      </div>
    </div>
  );

  if (!stats && !loading) return (
    <div className="p-8">
      <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-10 text-center max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-slate-900 mb-2">Not Registered as Seller</h3>
        <p className="text-slate-500 mb-6 font-medium">You need to register as a seller to access this dashboard.</p>
        <Link to="/seller/register" className="btn-primary px-8 py-3 rounded-2xl inline-block font-black text-sm">
          Register as Seller
        </Link>
      </div>
    </div>
  );

  const pending = !stats?.isApproved;

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Seller Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">
            {stats?.businessName || 'Your Business'}
            {pending && <span className="ml-2 bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Pending Approval</span>}
            {!pending && <span className="ml-2 bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">✓ Approved</span>}
          </p>
        </div>
        {!pending && (
          <button onClick={() => { setModalProduct(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {pending && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start mb-8">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-amber-900">Application Under Review</p>
            <p className="text-amber-700 text-sm font-medium mt-0.5">Your seller application is being reviewed by our team. You'll receive an email once approved (usually within 1–2 business days).</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<Package className="w-6 h-6 text-primary-600" />} label="Total Products" value={stats?.totalProducts || 0} sub={`${stats?.totalInventory || 0} items in stock`} color="bg-primary-50" />
        <StatCard icon={<ShoppingBag className="w-6 h-6 text-emerald-600" />} label="Total Orders" value={stats?.totalOrders || 0} sub="All time" color="bg-emerald-50" />
        <StatCard icon={<IndianRupee className="w-6 h-6 text-amber-600" />} label="Revenue" value={`₹${Number(stats?.revenue || 0).toLocaleString()}`} sub="Gross earnings" color="bg-amber-50" />
        <StatCard icon={<TrendingUp className="w-6 h-6 text-indigo-600" />} label="Avg Order Value" value={stats?.totalOrders ? `₹${Math.round(Number(stats.revenue) / stats.totalOrders).toLocaleString()}` : '₹0'} sub="Per order" color="bg-indigo-50" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm w-fit mb-8">
        {['overview', 'products', 'orders'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-black capitalize transition-all ${activeTab === tab ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
          <h3 className="font-black text-slate-900 text-lg mb-6">Monthly Sales</h3>
          {stats?.monthlySales?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats.monthlySales}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => [`₹${Number(v).toLocaleString()}`, 'Sales']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,.1)' }} />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-300">
              <BarChart2 className="w-16 h-16" />
            </div>
          )}
        </div>
      )}

      {/* Products */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-lg">My Products ({products.length})</h3>
            {!pending && (
              <button onClick={() => { setModalProduct(null); setShowModal(true); }}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl font-black text-xs hover:bg-primary-700 transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="p-5">Product</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Stock</th>
                  <th className="p-5">Status</th>
                  <th className="p-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.length === 0 && (
                  <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-bold">No products yet. Add your first product!</td></tr>
                )}
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                          <img src={p.imageUrl || 'https://via.placeholder.com/48'} alt="" className="w-full h-full object-contain p-1" />
                        </div>
                        <span className="font-bold text-slate-900 text-sm line-clamp-1 max-w-40">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-bold text-slate-500">{p.category?.name || '—'}</td>
                    <td className="p-5 font-black text-slate-900">₹{Number(p.price).toLocaleString()}</td>
                    <td className="p-5">
                      <span className={`text-sm font-bold ${p.stock <= 5 ? 'text-red-600' : p.stock <= 20 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700'
                        : p.status === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-500'
                      }`}>{p.status}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 justify-end">
                        <Link to={`/products/${p.id}`} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => { setModalProduct(p); setShowModal(true); }}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-lg">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="p-5">Order #</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Items</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(stats?.recentOrders || []).length === 0 && (
                  <tr><td colSpan={5} className="p-12 text-center text-slate-400 font-bold">No orders yet</td></tr>
                )}
                {(stats?.recentOrders || []).map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-black text-slate-900 text-sm">#{order.orderNumber}</td>
                    <td className="p-5 font-bold text-slate-700 text-sm">{order.customerName}</td>
                    <td className="p-5 text-slate-500 text-sm">{order.itemCount} items</td>
                    <td className="p-5 font-black text-slate-900">₹{Number(order.sellerAmount).toLocaleString()}</td>
                    <td className="p-5">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700'
                        : order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700'
                        : order.status === 'CANCELLED' ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                      }`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={modalProduct}
          categories={categories}
          onClose={() => { setShowModal(false); setModalProduct(null); }}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default SellerDashboard;
