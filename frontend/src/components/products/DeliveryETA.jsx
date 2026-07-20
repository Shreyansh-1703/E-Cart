import React, { useState } from 'react';
import { Truck, Zap, Crown, MapPin, RotateCcw, CreditCard, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { returnService } from '../../services/api';

const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
};

const DeliveryETA = () => {
  const [pin, setPin] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      return;
    }
    setLoading(true);
    try {
      const data = await returnService.checkPin(pin);
      setResult(data);
      setChecked(true);
    } catch {
      setResult({ available: false });
      setChecked(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Truck className="w-5 h-5 text-primary-600" />
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">Delivery Options</h3>
      </div>

      {/* PIN check */}
      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            maxLength={6}
            value={pin}
            onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setChecked(false); setResult(null); }}
            placeholder="Enter PIN code"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={pin.length !== 6 || loading}
          className="px-4 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-40"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
        </button>
      </form>

      {/* Result */}
      {checked && result && (
        <div className="space-y-3 animate-fade-in">
          {!result.available ? (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-2xl">
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm font-bold text-red-700">Delivery not available to PIN {pin}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-sm font-bold text-emerald-700">Delivery available to PIN {pin} ✓</p>
              </div>

              <div className="space-y-2.5">
                {/* Standard */}
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Truck className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-800">Standard Delivery</p>
                      <span className="text-xs font-black text-emerald-600">FREE</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Arrives by {addDays(5)}</p>
                  </div>
                </div>

                {/* Express */}
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-100">
                  <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-800">Express Delivery</p>
                      <span className="text-xs font-black text-amber-600">₹200</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Arrives by {addDays(1)}</p>
                  </div>
                </div>

                {/* Prime */}
                <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-2xl border border-primary-100">
                  <Crown className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-800">Prime Delivery</p>
                      <span className="text-xs font-black text-primary-600">FREE</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Today by 10 PM</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Default info (before check) */}
      {!checked && (
        <p className="text-[11px] text-slate-400 font-medium">Enter your 6-digit PIN code to see delivery options and estimated dates.</p>
      )}

      {/* Always-visible bottom info */}
      <div className="pt-3 border-t border-slate-50 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
          <CreditCard className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          Cash on Delivery available on eligible orders
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
          <RotateCcw className="w-3.5 h-3.5 text-primary-500 shrink-0" />
          7-Day Return — No questions asked
        </div>
      </div>
    </div>
  );
};

export default DeliveryETA;
