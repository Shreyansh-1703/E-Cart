import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Package, ArrowLeft, ChevronRight, CheckCircle2, Clock, Truck, CreditCard, AlertCircle } from 'lucide-react';
import { returnService } from '../../services/api';

const STATUS_CONFIG = {
  REQUESTED:        { label: 'Requested',         color: 'bg-amber-100 text-amber-700',   icon: <Clock className="w-3.5 h-3.5" /> },
  APPROVED:         { label: 'Approved',           color: 'bg-blue-100 text-blue-700',     icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  PICKUP_SCHEDULED: { label: 'Pickup Scheduled',   color: 'bg-sky-100 text-sky-700',       icon: <Truck className="w-3.5 h-3.5" /> },
  REFUND_INITIATED: { label: 'Refund Initiated',   color: 'bg-purple-100 text-purple-700', icon: <CreditCard className="w-3.5 h-3.5" /> },
  REFUND_COMPLETED: { label: 'Refund Completed',   color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  REJECTED:         { label: 'Rejected',           color: 'bg-red-100 text-red-700',       icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

const stepOrder = ['REQUESTED', 'APPROVED', 'PICKUP_SCHEDULED', 'REFUND_INITIATED', 'REFUND_COMPLETED'];

const ReturnCard = ({ ret }) => {
  const cfg = STATUS_CONFIG[ret.status] || STATUS_CONFIG.REQUESTED;
  const currentStep = stepOrder.indexOf(ret.status);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 flex flex-col sm:flex-row gap-5">
        {/* Product image */}
        <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 p-2 shrink-0">
          <img
            src={ret.product?.imageUrl || 'https://via.placeholder.com/80'}
            alt={ret.product?.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{ret.product?.name}</h3>
            <span className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 ${cfg.color}`}>
              {cfg.icon} {cfg.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 mb-4">
            <span>Return #{ret.returnNumber}</span>
            <span>·</span>
            <span>Order #{ret.order?.orderNumber}</span>
            <span>·</span>
            <span className="text-emerald-600">Refund: ₹{Number(ret.refundAmount).toLocaleString()}</span>
            <span>·</span>
            <span>{ret.returnType === 'REPLACEMENT' ? '🔄 Replacement' : '💳 Refund'}</span>
          </div>

          {/* Progress steps */}
          {ret.status !== 'REJECTED' && (
            <div className="flex items-center gap-1">
              {stepOrder.map((step, i) => {
                const isCompleted = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <React.Fragment key={step}>
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full text-[8px] font-black transition-all ${
                      isCompleted ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
                    } ${isCurrent ? 'ring-2 ring-primary-200' : ''}`}>
                      {isCompleted ? '✓' : i + 1}
                    </div>
                    {i < stepOrder.length - 1 && (
                      <div className={`flex-1 h-0.5 max-w-8 rounded-full transition-all ${i < currentStep ? 'bg-primary-600' : 'bg-slate-100'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {ret.pickupScheduled && ret.pickupDate && (
            <p className="text-[10px] text-sky-600 font-bold mt-2 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Pickup scheduled: {new Date(ret.pickupDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const MyReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    returnService.getMyReturns()
      .then(data => setReturns(data || []))
      .catch(() => setReturns([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="h-10 w-48 bg-slate-200 rounded-2xl animate-pulse mb-10" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 mb-6 animate-pulse flex gap-5">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/profile" className="p-2 bg-white rounded-xl border border-slate-100 text-slate-500 hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <RotateCcw className="w-7 h-7 text-emerald-600" />
              My Returns
            </h1>
            <p className="text-sm text-slate-400 mt-1">{returns.length} return {returns.length === 1 ? 'request' : 'requests'}</p>
          </div>
        </div>

        {returns.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2">No returns yet</h3>
            <p className="text-slate-400 mb-6 font-medium max-w-xs mx-auto">
              You haven't initiated any returns. Items are eligible for return within 7 days of delivery.
            </p>
            <Link to="/orders" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-2xl">
              View My Orders <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map(ret => <ReturnCard key={ret.id} ret={ret} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReturns;
