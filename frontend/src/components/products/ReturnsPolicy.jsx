import React from 'react';
import { RotateCcw, RefreshCw, CreditCard, Truck, ShieldCheck, Calendar } from 'lucide-react';

const PolicyRow = ({ icon, label, value, highlight }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-bold mt-0.5 ${highlight ? 'text-emerald-600' : 'text-slate-900'}`}>{value}</p>
    </div>
  </div>
);

const ReturnsPolicy = ({ productId }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <RotateCcw className="w-5 h-5 text-emerald-600" />
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">Returns & Refunds</h3>
      </div>

      <PolicyRow
        icon={<Calendar className="w-4 h-4 text-primary-600" />}
        label="Return Window"
        value="7 Days from Delivery"
      />
      <PolicyRow
        icon={<RefreshCw className="w-4 h-4 text-amber-500" />}
        label="Return Type"
        value="Replacement or Full Refund"
      />
      <PolicyRow
        icon={<CreditCard className="w-4 h-4 text-emerald-500" />}
        label="Refund Method"
        value="Original Payment Method"
        highlight
      />
      <PolicyRow
        icon={<Truck className="w-4 h-4 text-sky-500" />}
        label="Pickup"
        value="Free Doorstep Pickup Available"
        highlight
      />
      <PolicyRow
        icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
        label="Policy"
        value="No Questions Asked for Eligible Products"
        highlight
      />

      <p className="text-[10px] text-slate-400 font-medium leading-relaxed pt-2">
        Items must be unused, in original packaging, with all tags intact. Electronics must be in factory-sealed condition for full refund.
      </p>
    </div>
  );
};

export default ReturnsPolicy;
