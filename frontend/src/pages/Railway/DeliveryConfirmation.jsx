import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PartyPopper, Home, List, Calendar, MapPin, Hash, Package } from 'lucide-react';

const DeliveryConfirmation = () => {
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const station = JSON.parse(sessionStorage.getItem('railway_station'));
        const train = JSON.parse(sessionStorage.getItem('railway_train'));
        const items = JSON.parse(sessionStorage.getItem('railway_items')) || [];
        const orderId = sessionStorage.getItem('railway_order_id');

        setOrderDetails({ station, train, items, orderId });
    }, []);

    if (!orderDetails) return null;

    return (
        <div className="bg-slate-50 min-h-screen py-16 flex items-center">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl text-center relative overflow-hidden">
                    {/* Decorative background circle */}
                    <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-emerald-50 rounded-full"></div>
                    <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-sky-50 rounded-full"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <PartyPopper className="w-12 h-12 text-emerald-600" />
                        </div>
                        
                        <h1 className="text-4xl font-black text-emerald-600 mb-4 tracking-tight">Delivery Confirmed!</h1>
                        <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
                            Your essentials are being prepared for delivery at the selected station. Keep your OTP ready for the delivery person.
                        </p>

                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 grid grid-cols-2 gap-y-8 gap-x-4 mb-10 text-left">
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    <Calendar className="w-3 h-3" /> Train
                                </h4>
                                <p className="text-sm font-black text-slate-800">{orderDetails.train.number} — {orderDetails.train.name}</p>
                            </div>
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    <MapPin className="w-3 h-3" /> Station
                                </h4>
                                <p className="text-sm font-black text-slate-800">{orderDetails.station.name} ({orderDetails.station.code})</p>
                            </div>
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    <Package className="w-3 h-3" /> Items
                                </h4>
                                <p className="text-sm font-black text-slate-800">{orderDetails.items.length} Items Selected</p>
                            </div>
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    <Hash className="w-3 h-3" /> Delivery ID
                                </h4>
                                <p className="text-sm font-black text-sky-600 font-mono">{orderDetails.orderId}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <Link 
                                to="/" 
                                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" /> Back Home
                            </Link>
                            <Link 
                                to="/orders" 
                                className="flex-1 bg-white border-2 border-slate-100 hover:border-sky-200 text-slate-600 hover:text-sky-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <List className="w-5 h-5" /> My Orders
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryConfirmation;
