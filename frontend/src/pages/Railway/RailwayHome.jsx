import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Train, Search, Star, Clock, MapPin, Zap, ChevronRight, TrendingUp } from 'lucide-react';
import { POPULAR_TRAINS } from '../../data/railwayData';
import { useRailway } from '../../context/RailwayContext';

const RailwayHome = () => {
    const navigate = useNavigate();
    const { setSelectedTrain } = useRailway();
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = (val) => {
        setSearch(val);
        if (val.length > 1) {
            const matches = POPULAR_TRAINS.filter(t => 
                t.name.toLowerCase().includes(val.toLowerCase()) || 
                t.number.includes(val)
            );
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    };

    const selectTrain = (train) => {
        setSelectedTrain(train);
        navigate('/railway/stations');
    };

    return (
        <div className="bg-[#f0f4f8] min-h-screen pb-20 font-sans">
            {/* HERO SECTION */}
            <section className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <img 
                        src="https://images.unsplash.com/photo-1474487056269-ac48360001df?w=1200" 
                        className="w-full h-full object-cover" 
                        alt="Train Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-400 px-4 py-1.5 rounded-full text-xs font-black mb-8 border border-sky-500/30">
                            <Train className="w-4 h-4" /> OFFICIAL STATION DELIVERY PARTNER
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                            Food & Essentials<br />at your <span className="text-sky-500">Train Seat.</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium mb-12 max-w-2xl mx-auto">
                            Trusted by thousands of passengers. Order from top brands and get it delivered directly to your berth at upcoming stations.
                        </p>

                        {/* SEARCH COMPONENT */}
                        <div className="relative max-w-2xl mx-auto">
                            <div className="bg-white rounded-[2rem] p-2 flex items-center shadow-2xl border-4 border-slate-800 focus-within:border-sky-500 transition-all">
                                <Search className="w-6 h-6 text-slate-400 ml-4" />
                                <input 
                                    type="text"
                                    placeholder="Enter Train Number (e.g. 22436) or Name..."
                                    className="w-full py-4 px-6 text-slate-800 font-bold bg-transparent outline-none placeholder:text-slate-300"
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <button className="bg-sky-600 hover:bg-sky-700 text-white px-10 py-4 rounded-[1.5rem] font-black text-sm tracking-widest transition-all">
                                    FIND TRAIN
                                </button>
                            </div>

                            {/* AUTOCOMPLETE SUGGESTIONS */}
                            {suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50 text-left animate-slide-down">
                                    {suggestions.map((t, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => selectTrain(t)}
                                            className="w-full p-6 hover:bg-sky-50 flex items-center justify-between border-b border-slate-50 last:border-0 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-white">
                                                    <Train className="w-6 h-6 text-slate-900" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-black text-slate-900">{t.number}</span>
                                                        <span className="text-slate-400">—</span>
                                                        <span className="font-black text-slate-900 group-hover:text-sky-600 transition-colors">{t.name}</span>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t.route}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-sky-600 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* POPULAR TRAINS SECTION */}
            <section className="container mx-auto px-4 -mt-20 relative z-20">
                <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter uppercase">
                                <TrendingUp className="w-8 h-8 text-sky-500 fill-current opacity-20" /> Popular Trains
                            </h2>
                            <p className="text-sm text-slate-400 font-bold tracking-widest mt-1">TOP 10 MOST REQUESTED SERVICES</p>
                        </div>
                        <div className="hidden md:flex gap-2">
                            {['Daily', 'Express', 'Elite'].map(tag => (
                                <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-400">{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {POPULAR_TRAINS.map((train, idx) => (
                            <div 
                                key={idx}
                                className="group relative bg-slate-50/50 rounded-[2.5rem] p-8 border-2 border-transparent hover:border-sky-500/30 hover:bg-white hover:shadow-xl transition-all cursor-pointer"
                                onClick={() => selectTrain(train)}
                            >
                                <div className="absolute top-6 right-6">
                                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-100">
                                        {train.reliability} RELIABLE
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <div className="text-xs font-black text-sky-600 mb-1">{train.number}</div>
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">{train.name}</h3>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-5 h-5 text-slate-300 mt-1" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</p>
                                            <p className="text-sm font-bold text-slate-600">{train.route}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Clock className="w-5 h-5 text-slate-300 mt-1" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</p>
                                            <p className="text-sm font-bold text-slate-600">{train.departure} — {train.arrival}</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-black text-sm uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all flex items-center justify-center gap-2 shadow-sm">
                                    Book Now <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRUST METRICS */}
            <section className="container mx-auto px-4 py-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { icon: '🚂', val: '500+', label: 'Trains Covered' },
                    { icon: '📍', val: '150+', label: 'Stations' },
                    { icon: '📦', val: '1M+', label: 'Orders Delivered' },
                    { icon: '⭐', val: '4.8/5', label: 'Customer Rating' }
                ].map((m, i) => (
                    <div key={i} className="text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="text-4xl mb-4">{m.icon}</div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{m.val}</div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{m.label}</div>
                    </div>
                ))}
            </section>
        </div>
    );
};

const ArrowRight = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export default RailwayHome;
