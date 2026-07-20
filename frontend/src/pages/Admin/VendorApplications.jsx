import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MapPin, Award, IndianRupee, Clock, Store, Heart, RefreshCw } from 'lucide-react';
import { vendorService, sellerService } from '../../services/api';
import { toast } from 'react-toastify';

const VendorApplications = () => {
  const [activeTab, setActiveTab]     = useState('vendors');
  const [vendors, setVendors]         = useState([]);
  const [sellers, setSellers]         = useState([]);
  const [loadingV, setLoadingV]       = useState(true);
  const [loadingS, setLoadingS]       = useState(true);

  useEffect(() => {
    fetchVendors();
    fetchSellers();
  }, []);

  const fetchVendors = async () => {
    setLoadingV(true);
    try {
      const data = await vendorService.getPending();
      setVendors(data || []);
    } catch {
      // Silently handle — may be empty
      setVendors([]);
    } finally {
      setLoadingV(false);
    }
  };

  const fetchSellers = async () => {
    setLoadingS(true);
    try {
      const data = await sellerService.getPending();
      setSellers(data || []);
    } catch {
      setSellers([]);
    } finally {
      setLoadingS(false);
    }
  };

  const handleVendorAction = async (id, action) => {
    try {
      if (action === 'approve') await vendorService.approve(id);
      else await vendorService.reject(id);
      toast.success(`Vendor application ${action}d`);
      fetchVendors();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleSellerAction = async (id, action) => {
    try {
      if (action === 'approve') await sellerService.approve(id);
      else await sellerService.reject(id);
      toast.success(`Seller application ${action}d`);
      fetchSellers();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const EmptyState = ({ label }) => (
    <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-lg font-black text-slate-800 mb-1">No Pending {label}</h3>
      <p className="text-slate-400 text-sm">All caught up! New applications will appear here.</p>
    </div>
  );

  return (
    <div className="p-6 md:p-10 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-1">Applications</h1>
        <p className="text-slate-500 font-medium">Review and approve vendor & seller registrations.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm w-fit mb-8">
        <button onClick={() => setActiveTab('vendors')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'vendors' ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' : 'text-slate-500 hover:text-slate-700'}`}>
          <Heart className="w-4 h-4" /> Service Providers
          {vendors.length > 0 && <span className="bg-white text-pink-600 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{vendors.length}</span>}
        </button>
        <button onClick={() => setActiveTab('sellers')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'sellers' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-slate-500 hover:text-slate-700'}`}>
          <Store className="w-4 h-4" /> Sellers
          {sellers.length > 0 && <span className="bg-white text-primary-600 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{sellers.length}</span>}
        </button>
      </div>

      {/* Vendor Applications */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-slate-500">{vendors.length} pending application{vendors.length !== 1 ? 's' : ''}</p>
            <button onClick={fetchVendors} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
          {loadingV ? (
            [...Array(3)].map((_,i) => <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse" />)
          ) : vendors.length === 0 ? <EmptyState label="Vendor Applications" /> : vendors.map(app => (
            <div key={app.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                {app.profilePictureUrl
                  ? <img src={app.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">💼</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-pink-100 text-pink-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                    {(app.category || '').replace('_',' ')}
                  </span>
                  <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> Pending
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-lg">{app.businessName}</h3>
                <p className="text-sm font-bold text-slate-500">{app.fullName}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {app.city}</span>
                  <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {app.experienceYears || 0} yrs exp</span>
                  <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> ₹{Number(app.startingPrice || 0).toLocaleString()} starting</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleVendorAction(app.id, 'reject')}
                  className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-all border border-red-100">
                  <XCircle className="w-5 h-5" />
                </button>
                <button onClick={() => handleVendorAction(app.id, 'approve')}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-black text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seller Applications */}
      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-slate-500">{sellers.length} pending application{sellers.length !== 1 ? 's' : ''}</p>
            <button onClick={fetchSellers} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
          {loadingS ? (
            [...Array(3)].map((_,i) => <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse" />)
          ) : sellers.length === 0 ? <EmptyState label="Seller Applications" /> : sellers.map(app => (
            <div key={app.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0 text-primary-600 font-black text-2xl">
                {app.businessName?.charAt(0) || 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-primary-100 text-primary-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Seller</span>
                  <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> Pending
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-lg">{app.businessName}</h3>
                <p className="text-sm font-bold text-slate-500">{app.ownerName} · {app.email}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs font-bold text-slate-400">
                  <span>GST: {app.gstNumber}</span>
                  <span>PAN: {app.panNumber}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {app.businessAddress?.slice(0,40)}...</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleSellerAction(app.id, 'reject')}
                  className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-all border border-red-100">
                  <XCircle className="w-5 h-5" />
                </button>
                <button onClick={() => handleSellerAction(app.id, 'approve')}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-black text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorApplications;
