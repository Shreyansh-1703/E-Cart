import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Phone, Briefcase, Hash, Armchair, ChevronRight,
  ArrowLeft, ShieldCheck, MapPin, Train, Clock, Star, ShoppingBag
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { RAILWAY_PRODUCTS } from '../../data/railwayData';
import { toast } from 'react-toastify';

/* A compact preview strip of what's available to order */
const ProductPreview = () => {
  // Show 2 items from each category (first 4 categories)
  const previews = RAILWAY_PRODUCTS.slice(0, 4).map(cat => ({
    category: cat.category,
    items: cat.items.slice(0, 2),
  }));

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
      {/* header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingBag className="w-5 h-5" />
          <span className="font-black text-sm uppercase tracking-widest">Available on Train</span>
        </div>
        <p className="text-sky-200 text-xs font-bold">Select products after confirming seat details</p>
      </div>

      <div className="p-5 space-y-5">
        {previews.map(cat => (
          <div key={cat.category}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              {cat.category}
            </p>
            <div className="flex gap-3">
              {cat.items.map(item => (
                <div key={item.id} className="flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-100 group">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-white mb-2 border border-slate-100">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      onError={e => { e.target.src = 'https://via.placeholder.com/100'; }}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 line-clamp-2 leading-tight mb-1">
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">₹{item.price}</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-[9px] font-bold text-slate-400">{item.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-slate-50 rounded-2xl px-4 py-3 flex items-center justify-between border border-slate-100">
          <p className="text-xs font-bold text-slate-500">
            +{RAILWAY_PRODUCTS.reduce((t, c) => t + c.items.length, 0) - 8} more products across {RAILWAY_PRODUCTS.length} categories
          </p>
          <span className="text-[10px] font-black text-sky-600 uppercase tracking-wide">After This Step →</span>
        </div>
      </div>
    </div>
  );
};

const PassengerDetails = () => {
  const navigate = useNavigate();
  const { passengerDetails, setPassengerDetails, selectedTrain, selectedStation } = useRailway();

  if (!selectedTrain || !selectedStation) {
    navigate('/railway');
    return null;
  }

  const handleChange = (e) => {
    setPassengerDetails({ ...passengerDetails, [e.target.name]: e.target.value });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!passengerDetails.name || !passengerDetails.phone || !passengerDetails.coach || !passengerDetails.seat) {
      toast.error('Please fill all mandatory fields');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(passengerDetails.phone.replace(/\s/g, ''))) {
      toast.error('Enter a valid 10-digit Indian mobile number');
      return;
    }
    navigate('/railway/products');
  };

  const inputClass = "w-full bg-slate-50 border-2 border-transparent focus:border-sky-500 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300";

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── PROGRESS STEPPER ── */}
        <div className="flex items-center justify-center gap-3 mb-12 overflow-x-auto pb-2">
          {[
            { n: 1, l: 'Train',   done: true  },
            { n: 2, l: 'Station', done: true  },
            { n: 3, l: 'Details', done: false, active: true },
            { n: 4, l: 'Order',   done: false },
          ].map((step, i) => (
            <React.Fragment key={step.n}>
              <div className="flex items-center gap-2 shrink-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                  step.active ? 'bg-sky-600 text-white shadow-xl shadow-sky-200 ring-4 ring-sky-100'
                  : step.done  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-400'
                }`}>
                  {step.done ? '✓' : step.n}
                </div>
                <span className={`text-xs font-black uppercase tracking-widest hidden sm:block ${
                  step.active ? 'text-sky-600' : step.done ? 'text-emerald-600' : 'text-slate-400'
                }`}>{step.l}</span>
              </div>
              {i < 3 && <div className="w-8 md:w-16 h-0.5 bg-slate-200 shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── LEFT: FORM ── */}
          <div className="flex-1 min-w-0">
            <header className="mb-8">
              <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-5 hover:text-sky-600 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Go Back
              </button>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Confirm your <span className="text-sky-600">Seat Details.</span>
              </h1>
              <p className="text-slate-400 font-bold mt-2 text-sm">
                Delivery partners use this to find you on the train.
              </p>
            </header>

            {/* Journey summary pill */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 px-4 py-2 rounded-full text-xs font-black">
                <Train className="w-3.5 h-3.5" />
                {selectedTrain.name} · {selectedTrain.number}
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-xs font-black">
                <MapPin className="w-3.5 h-3.5" />
                {selectedStation.name} ({selectedStation.code})
              </div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 px-4 py-2 rounded-full text-xs font-black">
                <Clock className="w-3.5 h-3.5" />
                Arr: {selectedStation.arrival} · {selectedStation.halt} min halt
              </div>
            </div>

            <form onSubmit={handleContinue}
              className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-slate-100 space-y-7">

              {/* Name + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Passenger Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                    <input
                      name="name"
                      value={passengerDetails.name}
                      onChange={handleChange}
                      placeholder="e.g. Arjun Kapoor"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                    <input
                      name="phone"
                      value={passengerDetails.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Coach + Seat + Berth */}
              <div className="grid grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Coach <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                    <input
                      name="coach"
                      value={passengerDetails.coach}
                      onChange={handleChange}
                      placeholder="B2, S5…"
                      className={`${inputClass} uppercase`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Seat No <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                    <input
                      name="seat"
                      value={passengerDetails.seat}
                      onChange={handleChange}
                      placeholder="45"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Berth
                  </label>
                  <select
                    name="berth"
                    value={passengerDetails.berth}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-sky-500 focus:bg-white rounded-2xl py-4 px-4 outline-none font-bold text-slate-800 transition-all"
                  >
                    <option value="">Select</option>
                    <option>Lower</option>
                    <option>Middle</option>
                    <option>Upper</option>
                    <option>Side Lower</option>
                    <option>Side Upper</option>
                  </select>
                </div>
              </div>

              {/* PNR */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  PNR Number <span className="text-slate-300">(Optional)</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input
                    name="pnr"
                    value={passengerDetails.pnr}
                    onChange={handleChange}
                    placeholder="10-digit PNR"
                    className={inputClass}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold ml-1">
                  Adding PNR helps us verify your journey for priority delivery.
                </p>
              </div>

              {/* Security note */}
              <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-2xl p-4">
                <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-sky-800">
                  Your details are used only for delivery purposes and are never shared with third parties.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-sky-700 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-2xl shadow-slate-200 group"
              >
                Select Products
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* ── RIGHT: PRODUCT PREVIEW + JOURNEY CARD ── */}
          <div className="w-full lg:w-80 xl:w-96 space-y-5 lg:sticky lg:top-8">
            <ProductPreview />

            {/* Delivery guarantee */}
            <div className="bg-sky-900 rounded-[2rem] p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-black text-sm uppercase tracking-tight">Delivery Guarantee</span>
              </div>
              <p className="text-sky-300 text-xs font-medium leading-relaxed">
                Products are packed and dispatched before your train arrives at{' '}
                <span className="text-white font-black">{selectedStation.name}</span>.
                Our partner will reach your coach within the{' '}
                <span className="text-white font-black">{selectedStation.halt}-minute</span> halt window.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
