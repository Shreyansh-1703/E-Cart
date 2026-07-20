import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  if (!state) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800">No order details found.</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-slate-900 tracking-tight">Payment Successful!</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">Your order has been placed and is being processed.</p>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-8">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Number</dt>
              <dd className="mt-1 text-sm font-black text-slate-900">{state.orderId}</dd>
            </div>
            {state.paymentId && (
              <div className="sm:col-span-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment ID</dt>
                <dd className="mt-1 text-sm font-black text-slate-900">{state.paymentId}</dd>
              </div>
            )}
            <div className="sm:col-span-1">
              <dt className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</dt>
              <dd className="mt-1 text-sm font-black text-primary-600">₹{state.totalAmount?.toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-xs font-bold text-slate-400 uppercase tracking-widest">Est. Delivery</dt>
              <dd className="mt-1 text-sm font-black text-slate-900">{state.estimatedDelivery}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="flex-1 flex justify-center items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-black text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <Package className="w-5 h-5" /> View Orders
          </Link>
          <Link
            to="/"
            className="flex-1 flex justify-center items-center gap-2 px-6 py-3 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-black text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <Home className="w-5 h-5" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
