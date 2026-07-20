import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, MapPin, Zap, Lock, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const RentalCheckout = () => {
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [agreed, setAgreed] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [days, setDays] = useState(0);

    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        zip: ''
    });

    useEffect(() => {
        const saved = sessionStorage.getItem('rental_item');
        if (!saved) {
            navigate('/rental');
            return;
        }
        setItem(JSON.parse(saved));
    }, [navigate]);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDays(diffDays > 0 ? diffDays : 0);
        }
    }, [startDate, endDate]);

    const handleConfirm = () => {
        if (!agreed || days <= 0 || !form.name || !form.phone || !form.address) {
            toast.error('Please complete all requirements.');
            return;
        }

        const orderId = 'RENT-' + Math.floor(100000 + Math.random() * 900000);
        sessionStorage.setItem('rental_order_id', orderId);
        sessionStorage.setItem('rental_days', days);
        sessionStorage.setItem('rental_dates', JSON.stringify({ start: startDate, end: endDate }));
        navigate('/rental/confirmation');
    };

    if (!item) return null;

    const totalRent = item.rentPrice * days;
    const grandTotal = totalRent + item.securityDeposit;

    return (
        <div className="bg-[#fdf2f8] min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-[#831843]">Rental Checkout</h1>
                    <p className="text-pink-600 font-semibold opacity-60">Securely book your rental item for your special day.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT FORM */}
                    <div className="flex-1 space-y-6">
                        {/* TERMS */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-pink-50 shadow-sm">
                            <h4 className="font-black text-[#831843] mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-amber-500" /> 1. Rental Terms & Conditions
                            </h4>
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 h-32 overflow-y-auto text-xs text-slate-500 mb-6 custom-scrollbar">
                                <ol className="list-decimal pl-4 space-y-2">
                                    <li>Damage Liability: Any damage to the product during the rental period will incur a fine based on the severity.</li>
                                    <li>Security Deposit: A refundable security deposit is collected and will be returned after the item is collected and verified.</li>
                                    <li>Hygiene: All rentals are dry-cleaned and sanitized before delivery.</li>
                                    <li>Identity Verification: A photo of the receiver will be taken at the time of delivery for security purposes.</li>
                                    <li>Late Return: Delays in returning the product beyond the agreed date will incur additional daily rent charges + 20% penalty.</li>
                                </ol>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="w-5 h-5 border-2 border-pink-200 rounded text-pink-600 focus:ring-[#db2777]"
                                />
                                <span className="text-sm font-bold text-slate-700 group-hover:text-pink-600 transition-colors">I agree to all rental terms and conditions.</span>
                            </label>
                        </div>

                        {/* DURATION */}
                        <div className={`bg-white rounded-3xl p-8 border-2 border-pink-50 shadow-sm transition-all ${!agreed ? 'opacity-50 pointer-events-none' : ''}`}>
                            <h4 className="font-black text-[#831843] mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-pink-500" /> 2. Rental Duration
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Rent From</label>
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-3 border border-pink-50 bg-pink-50/30 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none font-bold text-slate-700" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Rent To</label>
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        min={startDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-3 border border-pink-50 bg-pink-50/30 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none font-bold text-slate-700" 
                                    />
                                </div>
                            </div>
                            {startDate && endDate && days <= 0 && (
                                <p className="text-red-500 text-[10px] font-bold mt-2">End date must be after start date.</p>
                            )}
                        </div>

                        {/* ADDRESS */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-pink-50 shadow-sm">
                            <h4 className="font-black text-[#831843] mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-emerald-500" /> 3. Delivery Location
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={form.name}
                                        onChange={(e) => setForm({...form, name: e.target.value})}
                                        className="w-full px-4 py-3 border border-slate-100 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#db2777]/20" 
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Phone</label>
                                    <input 
                                        type="tel" 
                                        value={form.phone}
                                        onChange={(e) => setForm({...form, phone: e.target.value})}
                                        className="w-full px-4 py-3 border border-slate-100 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#db2777]/20" 
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Address</label>
                                    <textarea 
                                        rows="2"
                                        value={form.address}
                                        onChange={(e) => setForm({...form, address: e.target.value})}
                                        className="w-full px-4 py-3 border border-slate-100 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#db2777]/20"
                                    ></textarea>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Pincode</label>
                                    <input 
                                        type="text" 
                                        value={form.zip}
                                        onChange={(e) => setForm({...form, zip: e.target.value})}
                                        className="w-full px-4 py-3 border border-slate-100 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#db2777]/20" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="w-full lg:w-[380px]">
                        <div className="bg-white rounded-3xl border-2 border-pink-50 shadow-xl overflow-hidden sticky top-8">
                            <div className="p-6 border-b border-pink-50">
                                <h5 className="font-black text-slate-800 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
                                    <Info className="w-4 h-4 text-pink-400" /> Order Summary
                                </h5>
                                <div className="flex gap-4 mb-6">
                                    <img src={item.imageUrl} className="w-20 h-20 rounded-2xl object-cover border border-slate-100" alt="" />
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.name}</h4>
                                        <span className="text-[10px] bg-pink-100 text-[#db2777] px-2 py-0.5 rounded-full font-black">RENTABLE</span>
                                    </div>
                                </div>
                                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-amber-500 fill-current" />
                                    <div>
                                        <div className="text-xs font-black text-amber-900 leading-none">Express Delivery</div>
                                        <div className="text-[10px] text-amber-700 font-bold opacity-75">Delivered in 30–60 mins</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50/50 space-y-3">
                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                    <span>Daily Rent</span>
                                    <span className="text-slate-800 font-black">₹{item.rentPrice}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                    <span>Rental Duration</span>
                                    <span className={`font-black ${days > 0 ? 'text-pink-600 underline' : 'text-slate-400'}`}>{days} Day(s)</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-500 pb-3 border-b border-slate-100">
                                    <span>Total Rental Amount</span>
                                    <span className="text-slate-800 font-black">₹{totalRent}</span>
                                </div>
                                <div className="flex justify-between text-xs font-black text-emerald-600">
                                    <span>Security Deposit</span>
                                    <span>+ ₹{item.securityDeposit}</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-slate-100">
                                    <span className="text-lg font-black text-slate-800">Grand Total</span>
                                    <span className="text-2xl font-black text-[#db2777]">₹{grandTotal}</span>
                                </div>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!agreed || days <= 0 || !form.name || !form.phone}
                                    className={`w-full mt-6 py-4 rounded-2xl font-black shadow-lg shadow-pink-100 flex items-center justify-center gap-2 transition-all ${
                                        (agreed && days > 0 && form.name) ? 'bg-[#db2777] text-white hover:bg-[#be185d]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    <Lock className="w-4 h-4" /> Confirm Rental
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalCheckout;
