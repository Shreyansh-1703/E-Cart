import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, ChevronRight, ArrowLeft, Truck, Info, MapPin } from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { toast } from 'react-toastify';

// Generate a 6-digit OTP
const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

const RailwayCheckout = () => {
    const navigate = useNavigate();
    const { cart, selectedTrain, selectedStation, passengerDetails, setOrderInfo } = useRailway();

    if (cart.length === 0 || !selectedTrain || !selectedStation) {
        navigate('/railway');
        return null;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = Math.round(subtotal * 0.18);
    const deliveryCharge = 50;
    const grandTotal = subtotal + gst + deliveryCharge;

    const handlePlaceOrder = () => {
        const orderId = 'RORD-' + Math.floor(100000 + Math.random() * 900000);
        const otp = generateOTP();
        const info = {
            orderId,
            otp,
            items: cart,
            total: grandTotal,
            station: selectedStation,
            train: selectedTrain,
            passenger: passengerDetails,
            paymentMethod: 'cod',
            timestamp: new Date().toISOString(),
            status: 'Confirmed'
        };
        setOrderInfo(info);
        toast.success('Order Placed! Your OTP: ' + otp);
        navigate('/railway/track');
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen py-16 font-sans">
            <div className="container mx-auto px-4 max-w-6xl">
                <header className="mb-12">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-6 hover:text-sky-600 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Edit Order
                    </button>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">One last step to <span className="text-sky-600 underline underline-offset-8 decoration-sky-100">confirm.</span></h1>
                    <p className="text-slate-400 font-bold mt-3">Your order will be delivered at Station: <span className="text-slate-600 uppercase">{selectedStation.name}</span></p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* LEFT: DETAILS */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* JOURNEY & SEAT SUMMARY */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
                            <h4 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tight">
                                <MapPin className="w-5 h-5 text-sky-500" /> Delivery Spot Info
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Train</p>
                                    <p className="text-sm font-black text-slate-800">{selectedTrain.number}</p>
                                    <p className="text-[10px] font-bold text-slate-400 truncate">{selectedTrain.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Station</p>
                                    <p className="text-sm font-black text-slate-800">{selectedStation.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400">Halt: {selectedStation.halt} Mins</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Coach/Seat</p>
                                    <p className="text-sm font-black text-slate-800 uppercase">{passengerDetails.coach} / {passengerDetails.seat}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{passengerDetails.berth}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Passenger</p>
                                    <p className="text-sm font-black text-slate-800 truncate">{passengerDetails.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 truncate">{passengerDetails.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT — COD ONLY */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
                            <h4 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tight">
                                <CreditCard className="w-5 h-5 text-sky-500" /> Payment Method
                            </h4>

                            {/* Single COD card — always selected */}
                            <div className="p-6 rounded-2xl border-2 border-sky-500 bg-sky-50 shadow-lg shadow-sky-100 flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0">
                                    <Truck className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 text-base">Cash on Delivery</p>
                                    <p className="text-sm text-slate-500 font-bold mt-0.5">Pay in cash to the delivery agent at your seat.</p>
                                    <p className="text-xs text-sky-600 font-black mt-1 uppercase tracking-wide">✓ Selected — Only available option</p>
                                </div>
                            </div>

                            <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-amber-800">
                                    Keep exact change ready. An OTP will be generated after placing your order — share it with the delivery agent to confirm handover.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: BILLING */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
                            <h4 className="text-lg font-black text-slate-800 mb-8 uppercase tracking-tighter">Billing Details</h4>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm font-bold text-slate-500">
                                    <span>Item Total</span>
                                    <span className="text-slate-900 font-black">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-500">
                                    <span>GST (18%)</span>
                                    <span className="text-slate-900 font-black">₹{gst}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-500 pb-4 border-b border-slate-100">
                                    <span>Station Service Fee</span>
                                    <span className="text-slate-900 font-black">₹{deliveryCharge}</span>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <span className="text-xl font-black text-slate-900">Grand Total</span>
                                    <span className="text-3xl font-black text-sky-600">₹{grandTotal}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="w-full py-5 rounded-2xl bg-slate-900 hover:bg-sky-700 text-white font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-2 group"
                            >
                                Place Order <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="mt-6 flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                                <p className="text-[10px] font-black text-emerald-800 uppercase leading-tight tracking-tight">Secured by E-Cart Security Protocol</p>
                            </div>
                        </div>

                        <div className="bg-sky-50 rounded-[2rem] p-6 border border-sky-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg shrink-0">
                                <Info className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-sky-900 uppercase">24/7 Helpline</p>
                                <p className="text-xs font-bold text-sky-700">1800-ECART-TRAIN</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RailwayCheckout;
