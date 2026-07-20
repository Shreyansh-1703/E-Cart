import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Zap, ShieldCheck, AlertCircle, ChevronRight, Info } from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { toast } from 'react-toastify';

// ── Demo station bank used as fallback when a train has no eligible halts ──────
const DEMO_STATION_BANK = [
    { name: 'Kanpur Central',   code: 'CNB',  arrival: '10:08', departure: '10:13' },
    { name: 'Prayagraj Jn',     code: 'PRYJ', arrival: '12:08', departure: '12:13' },
    { name: 'Agra Cantt',       code: 'AGC',  arrival: '08:00', departure: '08:05' },
    { name: 'Mathura Jn',       code: 'MTJ',  arrival: '07:20', departure: '07:25' },
    { name: 'Gwalior Jn',       code: 'GWL',  arrival: '09:30', departure: '09:35' },
    { name: 'Jhansi Jn',        code: 'VGLB', arrival: '10:50', departure: '10:55' },
    { name: 'Bhopal Jn',        code: 'BPL',  arrival: '13:00', departure: '13:05' },
    { name: 'Nagpur Jn',        code: 'NGP',  arrival: '18:30', departure: '18:35' },
    { name: 'Pune Jn',          code: 'PUNE', arrival: '11:10', departure: '11:15' },
    { name: 'Vadodara Jn',      code: 'BRC',  arrival: '21:10', departure: '21:15' },
    { name: 'Surat',            code: 'ST',   arrival: '19:45', departure: '19:50' },
    { name: 'Secunderabad Jn',  code: 'SC',   arrival: '18:05', departure: '18:10' },
    { name: 'Vijayawada Jn',    code: 'BZA',  arrival: '22:00', departure: '22:05' },
    { name: 'Gaya Jn',          code: 'GAYA', arrival: '04:38', departure: '04:43' },
    { name: 'Dhanbad Jn',       code: 'DHN',  arrival: '07:18', departure: '07:23' },
];

const StationSelection = () => {
    const navigate = useNavigate();
    const { selectedTrain, setSelectedStation } = useRailway();
    const [eligibleStations, setEligibleStations] = useState([]);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        if (!selectedTrain) {
            navigate('/railway');
            return;
        }

        const stations = selectedTrain.stations || [];

        // Filter: skip first & last (origin/destination), require halt >= 3 min
        let filtered = stations.filter((s, idx) => {
            if (idx === 0 || idx === stations.length - 1) return false;
            return s.halt >= 3;
        });

        // ── Fallback: generate demo stations if none pass the filter ──────────
        if (filtered.length === 0) {
            // Seed deterministically from train number so same train → same demo stops
            const seed = parseInt((selectedTrain.number || '12301').replace(/\D/g, '')) || 12301;
            const count = 3 + (seed % 3); // gives 3, 4, or 5
            const picked = [];
            for (let i = 0; i < count; i++) {
                picked.push(DEMO_STATION_BANK[(seed + i * 7) % DEMO_STATION_BANK.length]);
            }
            filtered = picked.map(s => ({ ...s, halt: 5 }));
            setIsDemo(true);
        } else {
            setIsDemo(false);
        }

        setEligibleStations(filtered);
    }, [selectedTrain, navigate]);

    if (!selectedTrain) return null;

    const handleStationSelect = (station) => {
        setSelectedStation(station);
        navigate('/railway/details');
    };

    const getFeasibility = (station) => {
        if (station.halt > 7) return { status: 'Available',    color: 'text-emerald-500', bg: 'bg-emerald-50', icon: Zap };
        if (station.halt >= 3) return { status: 'Express Only', color: 'text-amber-500',  bg: 'bg-amber-50',  icon: Clock };
        return                         { status: 'Too Late',     color: 'text-red-500',    bg: 'bg-red-50',    icon: AlertCircle };
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen py-16 font-sans">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* ── PROGRESS STEPPER ── */}
                <div className="flex items-center justify-between mb-12 px-8">
                    {[
                        { n: 1, l: 'Train',   active: true  },
                        { n: 2, l: 'Station', active: true  },
                        { n: 3, l: 'Details', active: false },
                        { n: 4, l: 'Order',   active: false }
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${step.active ? 'bg-sky-600 text-white shadow-xl shadow-sky-100' : 'bg-slate-200 text-slate-400'}`}>
                                {step.n}
                            </div>
                            <span className={`text-xs font-black uppercase tracking-widest ${step.active ? 'text-sky-600' : 'text-slate-400'}`}>{step.l}</span>
                            {i < 3 && <div className="w-12 h-0.5 bg-slate-100 hidden md:block" />}
                        </div>
                    ))}
                </div>

                {/* ── HEADER ── */}
                <header className="mb-10">
                    <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 border border-sky-200">
                        Now Selecting Station
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Where should we{' '}
                        <span className="text-sky-600 underline underline-offset-8 decoration-sky-100">deliver?</span>
                    </h1>
                    <p className="text-slate-400 font-bold mt-2">
                        {selectedTrain.name} ({selectedTrain.number})
                    </p>

                    {/* Demo mode banner */}
                    {isDemo && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-2 rounded-xl">
                            <Info className="w-4 h-4" />
                            Demo stations shown — all have a 5-minute halt for delivery
                        </div>
                    )}
                </header>

                {/* ── STATION LIST ── */}
                <div className="space-y-4">
                    {eligibleStations.map((station, idx) => {
                        const feas = getFeasibility(station);
                        const disabled = feas.status === 'Too Late';

                        return (
                            <button
                                key={idx}
                                disabled={disabled}
                                onClick={() => handleStationSelect(station)}
                                className={`w-full group relative bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-sky-500 hover:shadow-2xl transition-all flex flex-col md:flex-row items-center justify-between gap-8 text-left ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center gap-8 flex-1">
                                    <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center border border-slate-100 group-hover:bg-sky-50 group-hover:border-sky-100 transition-colors">
                                        <MapPin className="w-8 h-8 text-slate-900 group-hover:text-sky-600 transition-colors" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                                                {station.name}
                                            </h3>
                                            <span className="text-xs font-black text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded border">
                                                {station.code}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <Clock className="w-4 h-4 text-slate-300" />
                                                <span>Arr: {station.arrival}</span>
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <Info className="w-4 h-4 text-slate-300" />
                                                <span>Halt: {station.halt} Mins</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-10">
                                    <div className={`${feas.bg} ${feas.color} px-5 py-3 rounded-2xl flex items-center gap-3 border border-transparent group-hover:border-current transition-all shadow-sm`}>
                                        <feas.icon className="w-5 h-5 fill-current opacity-20" />
                                        <div className="text-right">
                                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</div>
                                            <div className="text-xs font-black whitespace-nowrap uppercase tracking-tighter">{feas.status}</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-8 h-8 text-slate-100 group-hover:text-sky-600 transition-all hidden md:block" />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* ── GUARANTEE FOOTER ── */}
                <div className="mt-12 bg-sky-900 rounded-[2.5rem] p-10 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        <h4 className="text-lg font-black uppercase tracking-tight">Delivery Guarantee</h4>
                    </div>
                    <p className="text-sky-200 text-sm font-medium leading-relaxed max-w-xl">
                        We only deliver at stations with halts of 3 minutes or more to ensure our delivery
                        partners can safely reach your coach and seat before the train departs.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default StationSelection;
