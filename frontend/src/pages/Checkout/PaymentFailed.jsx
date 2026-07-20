import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { XCircle, RefreshCw, Home } from 'lucide-react';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-slate-900 tracking-tight">Payment Failed</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            We couldn't process your payment. Don't worry, your cart is safe. You can try again or choose a different payment method.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/checkout"
            className="flex-1 flex justify-center items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-black text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" /> Try Again
          </Link>
          <Link
            to="/"
            className="flex-1 flex justify-center items-center gap-2 px-6 py-3 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-black text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <Home className="w-5 h-5" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
