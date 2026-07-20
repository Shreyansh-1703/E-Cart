import React, { useState } from 'react';
import { Search, MapPin, Package, Truck, CheckCircle2, Navigation } from 'lucide-react';

const OrderTracking = () => {
    const [orderId, setOrderId] = useState('');
    const [status, setStatus] = useState(null);

    const handleTrack = () => {
        if (!orderId) return;
        setStatus({
            id: orderId,
            currentStep: 2,
            steps: [
                { title: 'Order Placed', time: '10:30 AM', completed: true },
                { title: 'Processing', time: '11:00 AM', completed: true },
                { title: 'Out for Delivery', time: '12:15 PM', completed: false },
                { title: 'Delivered', time: '--', completed: false }
            ],
            location: 'Near Sector 62, Noida'
        });
    };

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                        <Navigation className="text-sky-600" /> Track Your Order
                    </h2>

                    <div className="flex gap-2 mb-10">
                        <input 
                            type="text" 
                            placeholder="Enter Order ID" 
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="flex-grow px-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-sky-600 focus:outline-none transition-all font-mono font-bold"
                        />
                        <button 
                            onClick={handleTrack}
                            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-8 rounded-2xl transition-all shadow-lg overflow-hidden relative group"
                        >
                            <span className="relative z-10">Track</span>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        </button>
                    </div>

                    {status && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-sky-50 border border-sky-100">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <Truck className="text-sky-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-sky-900">In Transit</h4>
                                    <p className="text-[10px] text-sky-700 flex items-center gap-1 font-bold">
                                        <MapPin className="w-3 h-3" /> {status.location}
                                    </p>
                                </div>
                            </div>

                            <div className="relative pl-8 space-y-12 before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                {status.steps.map((step, idx) => (
                                    <div key={idx} className="relative">
                                        <div className={`absolute left-[-23px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-md z-10 ${
                                            step.completed ? 'bg-emerald-500' : 'bg-slate-300'
                                        }`}></div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className={`font-black text-sm ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                                                    {step.title}
                                                </h5>
                                                {step.completed && <p className="text-[10px] text-slate-400 font-bold">{step.time}</p>}
                                            </div>
                                            {step.completed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
