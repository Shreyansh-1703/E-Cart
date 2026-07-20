import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Truck, User, Phone, CheckCircle2, MapPin,
  Home, List, ShieldCheck, KeyRound, Copy, Check
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';

const RailwayOrderTracking = () => {
    const navigate = useNavigate();
    const { orderInfo, clearFlow } = useRailway();
    const [step, setStep] = useState(1);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!orderInfo) {
            navigate('/railway');
            return;
        }
        // Simulate order progression (5 steps now, no Kitchen Preparing)
        const timer = setInterval(() => {
            setStep(prev => (prev < 5 ? prev + 1 : prev));
        }, 8000);
        return () => clearInterval(timer);
    }, [orderInfo, navigate]);

    if (!orderInfo) return null;

    // 5 steps — "Kitchen Preparing" removed
    const steps = [
        { id: 1, label: 'Order Confirmed',          icon: CheckCircle2, color: 'text-emerald-500' },
        { id: 2, label: 'Packed & Quality Check',   icon: Package,      color: 'text-sky-500'     },
        { id: 3, label: 'Assigned to Agent',         icon: User,         color: 'text-purple-500'  },
        { id: 4, label: 'Out for Station Delivery',  icon: Truck,        color: 'text-sky-600'     },
        { id: 5, label: 'Delivered to Seat',         icon: ShieldCheck,  color: 'text-emerald-600' },
    ];

    const handleCopyOTP = () => {
        navigator.clipboard.writeText(orderInfo.otp || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleHome = () => {
        clearFlow();
        navigate('/');
    };

    return (
        <div className="bg-[#f0f4f8] min-h-screen py-16 font-sans">
            <div className="container mx-auto px-4 max-w-5xl">

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* ── LEFT: PROGRESS TIMELINE ── */}
                    <div className="flex-1 space-y-8">
                        <header className="mb-10 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 mb-6">
                                <ShieldCheck className="w-4 h-4" /> SECURE LIVE TRACKING
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                Hang tight! Your delivery is{' '}
                                <span className="text-sky-600">on the way.</span>
                            </h1>
                            <p className="text-slate-400 font-bold mt-2">
                                Tracking ID: {orderInfo.orderId} · Expected at {orderInfo.station.name}
                            </p>
                        </header>

                        <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
                            <div className="relative">
                                {/* Vertical connector */}
                                <div className="absolute left-[31px] top-4 bottom-4 w-1 bg-slate-100">
                                    <div
                                        className="absolute top-0 w-full bg-emerald-500 transition-all duration-1000"
                                        style={{ height: `${(step - 1) * 25}%` }}
                                    />
                                </div>

                                <div className="space-y-12">
                                    {steps.map((s) => {
                                        const isCompleted = step > s.id;
                                        const isCurrent   = step === s.id;
                                        const Icon = s.icon;

                                        return (
                                            <div
                                                key={s.id}
                                                className={`relative flex items-start gap-8 transition-all duration-500 ${
                                                    isCompleted || isCurrent ? 'opacity-100' : 'opacity-30'
                                                }`}
                                            >
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 shrink-0 ${
                                                    isCompleted
                                                        ? 'bg-emerald-500 text-white'
                                                        : isCurrent
                                                        ? 'bg-slate-900 text-white animate-pulse scale-110 shadow-xl'
                                                        : 'bg-slate-50 text-slate-300'
                                                }`}>
                                                    <Icon className="w-8 h-8" />
                                                </div>
                                                <div className="pt-2">
                                                    <h3 className={`text-xl font-black ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                                                        {s.label}
                                                    </h3>
                                                    {isCurrent && (
                                                        <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mt-1">
                                                            This is taking place now...
                                                        </p>
                                                    )}
                                                    {isCompleted && (
                                                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">
                                                            ✓ Completed
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: AGENT + OTP ── */}
                    <div className="w-full lg:w-[400px] shrink-0 space-y-8">

                        {/* AGENT CARD */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-24 bg-sky-600" />
                            <div className="relative z-10 pt-4">
                                <div className="w-32 h-32 rounded-full border-8 border-white bg-slate-100 mx-auto mb-6 shadow-2xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200"
                                        className="w-full h-full object-cover"
                                        alt="Agent"
                                    />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-1">Ravi Kumar</h3>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                    Your Station Delivery Agent
                                </p>
                                <div className="flex items-center justify-center gap-6 mt-8">
                                    <button className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-sm">
                                        <Phone className="w-6 h-6" />
                                    </button>
                                    <div className="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100">
                                        <div className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-none mb-1">
                                            Estimated Arrival
                                        </div>
                                        <div className="text-xl font-black text-amber-900 italic">12 Mins</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── OTP BOX (replaces Station Reliability) ── */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <KeyRound className="w-5 h-5 text-sky-400" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-tight">Delivery OTP</h4>
                            </div>

                            {/* OTP digits */}
                            <div className="flex justify-center gap-2 mb-5">
                                {(orderInfo.otp || '------').split('').map((digit, i) => (
                                    <div
                                        key={i}
                                        className="w-11 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl font-black text-white border border-white/20 tracking-widest"
                                    >
                                        {digit}
                                    </div>
                                ))}
                            </div>

                            <p className="text-sky-300 text-xs font-bold text-center leading-relaxed mb-5">
                                Show this OTP to the delivery agent at your seat.
                                Do <span className="text-white font-black">NOT</span> share it before receiving your order.
                            </p>

                            <button
                                onClick={handleCopyOTP}
                                className={`w-full py-3 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                                    copied
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                }`}
                            >
                                {copied ? (
                                    <><Check className="w-4 h-4" /> Copied!</>
                                ) : (
                                    <><Copy className="w-4 h-4" /> Copy OTP</>
                                )}
                            </button>

                            <div className="mt-4 flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10">
                                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                                <p className="text-[10px] text-sky-300 font-bold uppercase tracking-wide">
                                    Deliver at · {orderInfo.station.name} ({orderInfo.station.code})
                                </p>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleHome}
                                className="flex-1 bg-white border border-slate-100 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" /> Home
                            </button>
                            <button
                                onClick={() => navigate('/orders')}
                                className="flex-1 bg-sky-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-100 hover:bg-sky-700 transition-all flex items-center justify-center gap-2"
                            >
                                <List className="w-4 h-4" /> All Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RailwayOrderTracking;
