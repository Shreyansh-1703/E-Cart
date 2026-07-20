import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Clock, ShieldCheck, Star } from 'lucide-react';

const RENTAL_FALLBACK = [
    { id: 'r1', name: 'Premium Red Bridal Lehenga', price: 24999, rentPrice: 2000, securityDeposit: 5000, category: 'Wedding', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAzZhNU_r39Un-SLgERVI1l0WZvrdyS8toNg&s' },
    { id: 'r2', name: 'Ivory Designer Sherwani', price: 12999, rentPrice: 1500, securityDeposit: 3000, category: 'Wedding', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7RwGYfVcHXfX3XMOss2HQMA2zqx3WpJVN7w&s' },
    { id: 'r3', name: 'Gold Jewellery Set', price: 50000, rentPrice: 1000, securityDeposit: 10000, category: 'Wedding', imageUrl: 'https://images.jdmagicbox.com/quickquotes/images_main/-41honv5n.jpg' },
    { id: 'r4', name: 'Party Speaker Set', price: 15000, rentPrice: 500, securityDeposit: 2000, category: 'Electronics', imageUrl: 'https://m.media-amazon.com/images/I/71rIsc37T1L.jpg' }
];

const RentalSelection = () => {
    const navigate = useNavigate();

    const handleRentNow = (item) => {
        sessionStorage.setItem('rental_item', JSON.stringify(item));
        navigate('/rental/checkout');
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-slate-800 mb-4">Rental Marketplace</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Rent premium outfits, electronics, and decor for a fraction of the cost. 
                        Safe, hygienic, and ultra-fast delivery.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {RENTAL_FALLBACK.map(p => (
                        <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="h-64 relative">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded">RENTABLE</div>
                            </div>
                            <div className="p-6">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.category}</span>
                                <h3 className="font-bold text-slate-800 mb-4 truncate">{p.name}</h3>
                                
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs font-semibold text-slate-500 uppercase">Per Day</span>
                                        <span className="text-2xl font-black text-emerald-600">₹{p.rentPrice}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] bg-slate-50 p-2 rounded-lg">
                                        <span className="font-bold text-slate-400 uppercase tracking-tighter">Security Deposit</span>
                                        <span className="font-black text-slate-600">₹{p.securityDeposit} (Refundable)</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleRentNow(p)}
                                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" /> Rent Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200">
                    <h2 className="text-xl font-black text-slate-800 mb-8 text-center">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🔍</div>
                            <h4 className="font-bold mb-2">1. Select Product</h4>
                            <p className="text-xs text-slate-500">Pick from our premium collection of rentable items.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🕒</div>
                            <h4 className="font-bold mb-2">2. Choose Dates</h4>
                            <p className="text-xs text-slate-500">Set your rental duration and complete the checkout.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🚛</div>
                            <h4 className="font-bold mb-2">3. Receive & Enjoy</h4>
                            <p className="text-xs text-slate-500">Get it delivered in under 3 hours, use it, and return!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalSelection;
