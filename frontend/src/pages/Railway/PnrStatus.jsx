import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Ticket, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const PnrStatus = () => {
    const navigate = useNavigate();
    const [pnr, setPnr] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusData, setStatusData] = useState(null);

    const handleCheckStatus = () => {
        if (pnr.length !== 10) return;
        setLoading(true);
        setTimeout(() => {
            setStatusData({
                pnr: pnr,
                trainNum: '12301',
                trainName: 'Rajdhani Express',
                date: '2026-06-20',
                status: 'CNF',
                coach: 'A1',
                berth: '24',
                passengers: 1
            });
            setLoading(false);
        }, 800);
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition-all">
                    <button onClick={() => navigate('/railway')} className="text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1 text-sm font-semibold">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3 decoration-sky-600/30 underline decoration-4 underline-offset-4">
                        <Ticket className="text-sky-600" /> PNR Status Tracking
                    </h2>

                    <div className="flex gap-2 mb-8">
                        <input 
                            type="text" 
                            value={pnr}
                            onChange={(e) => setPnr(e.target.value)}
                            placeholder="Enter 10-digit PNR" 
                            className="flex-grow px-4 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-sky-600/10 focus:border-sky-600 focus:outline-none transition-all font-mono text-xl tracking-[4px]"
                            maxLength="10"
                        />
                        <button 
                            onClick={handleCheckStatus}
                            disabled={pnr.length !== 10 || loading}
                            className="bg-sky-600 hover:bg-sky-700 text-white p-4 rounded-2xl shadow-lg transition-all disabled:bg-slate-200"
                        >
                            <Search className="w-6 h-6" />
                        </button>
                    </div>

                    {statusData && (
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Status</span>
                                    <span className="text-lg font-black text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-5 h-5" /> CONFIRMED
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Coach/Berth</span>
                                    <span className="text-lg font-black text-slate-800">{statusData.coach} / {statusData.berth}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Train Details</span>
                                    <p className="font-bold text-slate-800">{statusData.trainNum} — {statusData.trainName}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Departure Date: {statusData.date}</p>
                                </div>
                                
                                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <AlertCircle className="text-sky-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-sm font-bold text-sky-800">Available for Delivery!</h4>
                                        <p className="text-[10px] text-sky-700 opacity-80 leading-tight">Your train route supports platform delivery at key stations.</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/railway/train-search')}
                                        className="bg-sky-600 text-white text-[10px] font-bold px-3 py-2 rounded-lg"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PnrStatus;
