import React from 'react';
import { FileText, Download, TrendingUp, DollarSign, ShoppingBag, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminReports = () => {
  const data = [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 2000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 },
  ];

  const ReportCard = ({ title, icon, color }) => (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 mb-6 group-hover:scale-110 transition-transform w-fit`}>
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">Detailed analysis of your store's {title.toLowerCase()}.</p>
      <button className="flex items-center gap-2 text-xs font-black text-primary-600 uppercase tracking-widest hover:gap-3 transition-all">
        Download PDF <Download className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="p-8 md:p-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-500 font-medium">Insights and business performance</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-white border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
             Last Year
           </button>
           <button className="btn-primary py-4 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-primary-200">
             <Download className="w-5 h-5" /> Export All
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <ReportCard title="Sales Report" icon={<ShoppingBag />} color="text-primary-600 bg-primary-600" />
        <ReportCard title="Revenue Analysis" icon={<DollarSign />} color="text-emerald-600 bg-emerald-600" />
        <ReportCard title="Customer Growth" icon={<TrendingUp />} color="text-indigo-600 bg-indigo-600" />
        <ReportCard title="Inventory Audit" icon={<FileText />} color="text-amber-600 bg-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
           <h3 className="text-xl font-black text-slate-900 mb-8">Monthly Growth</h3>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={4} dot={{r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
           <h3 className="text-xl font-black text-slate-900 mb-8">Revenue vs Costs</h3>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
