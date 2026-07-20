import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PartyPopper, Home, List, Hash, Calendar, RotateCcw, ShieldCheck } from 'lucide-react';

const RentalConfirmation = () => {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const item = JSON.parse(sessionStorage.getItem('rental_item'));
        const orderId = sessionStorage.getItem('rental_order_id');
        const days = sessionStorage.getItem('rental_days');
        const dates = JSON.parse(sessionStorage.getItem('rental_dates'));

        setDetails({ item, orderId, days, dates });
    }, []);

    if (!details) return null;

    return (
        <div className="bg-[#fdf2f8] min-h-screen flex items-center py-20">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-[40px] p-10 md:p-16 border-2 border-pink-50 shadow-2xl text-center relative overflow-hidden">
                    {/* Floating icons */}
                    <div className="absolute top-10 left-10 text-pink-100 animate-pulse"><Heart className="w-12 h-12 fill-current" /></div>
                    
                    <div className="relative z-10">
                        <div className="w-24 h-24 rounded-[30px] bg-pink-100 flex items-center justify-center mx-auto mb-10 rotate-12 shadow-inner">
                            <PartyPopper className="w-12 h-12 text-[#db2777]" />
                        </div>

                        <h1 className="text-4xl font-black text-[#831843] mb-4 tracking-tight">Rental Booking Confirmed!</h1>
                        <p className="text-slate-500 font-bold mb-10 max-w-sm mx-auto leading-relaxed">
                            Your rental is confirmed. We will deliver it to your address shortly. Please have your ID ready.
                        </p>

                        <div className="bg-pink-50/50 rounded-[30px] p-8 border border-pink-100 grid grid-cols-2 gap-y-10 gap-x-6 mb-12 text-left">
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2">
                                    <Hash className="w-3 h-3" /> Booking ID
                                </h4>
                                <p className="text-sm font-black text-slate-800 font-mono tracking-wider">{details.orderId}</p>
                            </div>
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2">
                                    <RotateCcw className="w-3 h-3" /> Duration
                                </h4>
                                <p className="text-sm font-black text-slate-800">{details.days} Days</p>
                            </div>
                            <div className="col-span-2">
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2">
                                    <Calendar className="w-3 h-3" /> Rental Dates
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white px-3 py-1.5 rounded-lg border border-pink-100 text-xs font-black text-pink-700">{details.dates.start}</div>
                                    <span className="text-slate-400 font-bold">to</span>
                                    <div className="bg-white px-3 py-1.5 rounded-lg border border-pink-100 text-xs font-black text-pink-700">{details.dates.end}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <Link 
                                to="/" 
                                className="flex-1 bg-gradient-to-r from-[#db2777] to-[#be185d] text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-pink-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" /> Back Home
                            </Link>
                            <Link 
                                to="/orders" 
                                className="flex-1 bg-white border-2 border-pink-100 text-pink-700 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-pink-50"
                            >
                                <List className="w-5 h-5" /> Track Rental
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400"><ShieldCheck className="w-4 h-4" /> SECURE BOOKING</div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400"><Hash className="w-4 h-4" /> TRACEABLE</div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400"><RotateCcw className="w-4 h-4" /> EASY RETURN</div>
                </div>
            </div>
        </div>
    );
};

// Internal Heart Component for decorative purposes
const Heart = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

export default RentalConfirmation;
