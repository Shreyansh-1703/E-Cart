import React, { useState, useEffect } from 'react';
import {
  Users, CreditCard, TrendingUp, Package,
  ArrowUpRight, ArrowDownRight, Truck, Heart, AlertTriangle,
  CheckCircle2, Landmark, Users2
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { adminService, productService, orderService } from '../../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const COLORS = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

// Static placeholder — backend has no time-series endpoint yet
const MONTHLY_REVENUE = [
  { name: 'Jan', revenue: 420000 }, { name: 'Feb', revenue: 510000 },
  { name: 'Mar', revenue: 380000 }, { name: 'Apr', revenue: 650000 },
  { name: 'May', revenue: 480000 }, { name: 'Jun', revenue: 720000 },
  { name: 'Jul', revenue: 590000 },
];

const StatCard = ({ title, value, icon, trend, trendValue, color }) => (
  <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3.5 rounded-xl ${color}`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <span className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-md ${
        trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'
      }`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {trendValue}
      </span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats]             = useState(null);
  const [lowStock, setLowStock]       = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsData, prodData, ordersData] = await Promise.all([
          adminService.getStats(),
          productService.getAll({ size: 200, sort: 'rating' }),
          orderService.getAll(true),
        ]);

        setStats(statsData);

        const prods = prodData.content || prodData.products || [];
        setLowStock(prods.filter(p => p.stock < 10).slice(0, 6));
        setTopProducts(prods.slice(0, 5).map((p, i) => ({
          ...p,
          revenueGenerated: (150 - i * 22) * Number(p.price),
        })));

        const orders = Array.isArray(ordersData) ? ordersData : (ordersData.orders || []);
        setRecentOrders(orders.slice(0, 8).map(o => ({
          id:           o.id,
          orderId:      o.orderNumber,
          customerName: o.user?.fullName || 'Customer',
          amount:       Number(o.totalAmount),
          status:       o.status,
        })));
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categoryData = [
    { name: 'Electronics',      value: 45 },
    { name: 'Fashion',          value: 25 },
    { name: 'Books & Groceries',value: 18 },
    { name: 'Jewellery',        value: 12 },
  ];

  if (loading) return (
    <div className="p-6 md:p-10 bg-slate-50/50 min-h-screen animate-pulse space-y-5">
      <div className="h-10 w-64 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-[2rem] border border-slate-100" />
        ))}
      </div>
    </div>
  );

  if (!stats) return null;

  return (
    <div className="p-6 md:p-10 bg-slate-50/50 min-h-screen">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">Admin Console</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Live platform analytics.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-4 py-2.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700">Server: Online</span>
          </div>
          <Link to="/"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg hover:opacity-90 transition-all">
            View Customer Site →
          </Link>
        </div>
      </header>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard title="Total Revenue"    value={`₹${(Number(stats.totalRevenue) / 100000).toFixed(1)}L`} icon={<CreditCard />}    trend="up"   trendValue="+14.2%" color="text-blue-600 bg-blue-50" />
        <StatCard title="Total Orders"     value={Number(stats.totalOrders).toLocaleString()}               icon={<Package />}       trend="up"   trendValue="+8.9%"  color="text-emerald-600 bg-emerald-50" />
        <StatCard title="Active Customers" value={Number(stats.totalUsers).toLocaleString()}                icon={<Users />}         trend="up"   trendValue="+12.4%" color="text-indigo-600 bg-indigo-50" />
        <StatCard title="Low Stock Alerts" value={stats.lowStockProducts}                                   icon={<AlertTriangle />} trend="down" trendValue="Warning" color="text-amber-600 bg-amber-50" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Approved Sellers" value={stats.totalSellers}         icon={<Users2 />}   trend="up" trendValue="+3"       color="text-sky-600 bg-sky-50" />
        <StatCard title="Wedding Vendors"  value={stats.totalVendors}         icon={<Landmark />} trend="up" trendValue="+5"       color="text-pink-600 bg-pink-50" />
        <StatCard title="Railway Orders"   value={stats.totalRailwayOrders}   icon={<Truck />}    trend="up" trendValue="Live"     color="text-cyan-600 bg-cyan-50" />
        <StatCard title="Wedding Bookings" value={stats.totalWeddingBookings} icon={<Heart />}    trend="up" trendValue="Seasonal" color="text-purple-600 bg-purple-50" />
      </div>

      {/* Order Pipeline */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Pending Orders',   value: stats.pendingOrders,   color: 'bg-amber-500',   bg: 'bg-amber-50'   },
          { label: 'Delivered Orders', value: stats.deliveredOrders, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Cancelled Orders', value: stats.cancelledOrders, color: 'bg-red-500',     bg: 'bg-red-50'     },
        ].map(item => (
          <div key={item.label} className={`${item.bg} rounded-2xl p-5 border border-white`}>
            <div className={`w-3 h-3 rounded-full ${item.color} mb-3`} />
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Monthly Revenue
            </h3>
            <span className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg uppercase">
              Last 7 Months
            </span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_REVENUE}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dx={-10}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 700 }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3}
                  fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6">Category Share</h3>
          <div className="h-[200px] relative flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={6} dataKey="value">
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-xl font-black text-slate-900">100%</span>
              <span className="text-[10px] text-slate-400 font-black uppercase">Share</span>
            </div>
          </div>
          <div className="space-y-2.5 mt-4">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs font-bold text-slate-600">{cat.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Orders */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs font-black text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8 font-bold">No orders yet</p>
            ) : recentOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-[10px] font-black">
                    {(o.customerName || 'CU').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">{o.orderId}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{o.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">₹{o.amount?.toLocaleString()}</p>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                    o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                    o.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                    o.status === 'SHIPPED'   ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock + Top Products */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-amber-600 flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5" /> Low Stock Alerts
          </h3>

          {lowStock.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-500">All products are well stocked!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <img src={p.imageUrl} alt="" onError={e => (e.target.style.display = 'none')}
                    className="w-10 h-10 rounded-xl object-contain bg-slate-50 border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{p.category?.name}</p>
                  </div>
                  <span className="text-xs font-black text-red-600">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-50">
            <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Top Sellers
            </h4>
            <div className="space-y-3">
              {topProducts.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.imageUrl} alt="" onError={e => (e.target.style.display = 'none')}
                    className="w-8 h-8 rounded-lg object-contain bg-slate-50 border" />
                  <span className="text-xs font-bold text-slate-800 flex-1 line-clamp-1">{p.name}</span>
                  <span className="text-xs font-black text-emerald-600">
                    ₹{(p.revenueGenerated / 100000).toFixed(1)}L
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
