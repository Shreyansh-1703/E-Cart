import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Zap, Search, Plus, Minus, X, ChevronRight, ArrowLeft } from 'lucide-react';
import { RAILWAY_PRODUCTS } from '../../data/railwayData';
import { useRailway } from '../../context/RailwayContext';
import { toast } from 'react-toastify';

const ProductSelection = () => {
    const navigate = useNavigate();
    const { cart, addToCart, removeFromCart, updateQuantity, selectedTrain, selectedStation } = useRailway();
    const [activeCategory, setActiveCategory] = useState(RAILWAY_PRODUCTS[0]?.id);
    const [search, setSearch] = useState('');

    if (!selectedTrain || !selectedStation) {
        navigate('/railway');
        return null;
    }

    const currentCat = RAILWAY_PRODUCTS.find(c => c.id === activeCategory);
    const filteredItems = currentCat?.items.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* LEFT: CATALOG */}
                    <div className="flex-1">
                        <header className="mb-10">
                             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-6 hover:text-sky-600 transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Go Back
                            </button>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Select your <span className="text-sky-600">Essentials.</span></h1>
                                    <p className="text-slate-400 font-bold mt-2">Will be delivered at {selectedStation.name} ({selectedStation.code})</p>
                                </div>
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                    <input 
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-800 shadow-sm focus:ring-4 focus:ring-sky-500/10 transition-all"
                                    />
                                </div>
                            </div>
                        </header>

                        {/* CATEGORIES */}
                        <div className="flex overflow-x-auto pb-4 gap-3 mb-10 no-scrollbar">
                            {RAILWAY_PRODUCTS.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`whitespace-nowrap px-8 py-3 rounded-2xl text-xs font-black transition-all shadow-sm ${
                                        activeCategory === cat.id 
                                        ? 'bg-sky-600 text-white shadow-xl shadow-sky-100 scale-105' 
                                        : 'bg-white text-slate-500 hover:bg-sky-50 border border-slate-100'
                                    }`}
                                >
                                    {cat.category}
                                </button>
                            ))}
                        </div>

                        {/* PRODUCT GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map(item => {
                                const inCart = cart.find(i => i.id === item.id);
                                return (
                                    <div key={item.id} className="bg-white rounded-[2rem] p-4 border border-slate-50 hover:border-sky-100 hover:shadow-2xl transition-all group flex flex-col">
                                        <div className="h-40 bg-slate-50 rounded-2xl overflow-hidden relative mb-4">
                                            <img 
                                                src={item.img} 
                                                alt={item.name} 
                                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                <span className="text-[10px] font-black text-slate-800">{item.rating}</span>
                                            </div>
                                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-sky-500 text-white text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                                    <Zap className="w-3 h-3" /> FAST
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-2 text-sm leading-tight mb-2 uppercase tracking-tight">{item.name}</h3>
                                            <div className="text-xl font-black text-slate-900 mb-4">₹{item.price}</div>
                                        </div>
                                        
                                        {inCart ? (
                                            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-1">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors shadow-sm"><Minus className="w-4 h-4" /></button>
                                                <span className="font-black text-slate-900">{inCart.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-emerald-50 text-emerald-500 transition-colors shadow-sm"><Plus className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => addToCart(item)}
                                                className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" /> Add to Cart
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: CART SUMMARY */}
                    <div className="w-full lg:w-96 shrink-0">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden sticky top-8">
                            <div className="bg-slate-900 p-8 text-white">
                                <h3 className="text-xl font-black flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6 text-sky-500" /> Order Summary
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Standard Delivery at station</p>
                            </div>
                            
                            <div className="p-8 max-h-[400px] overflow-y-auto no-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                                            <ShoppingBag className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm">Your cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex gap-4 group">
                                                <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                                                    <img src={item.img} className="w-full h-full object-contain p-2" alt="" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-slate-800 text-xs line-clamp-1 truncate uppercase">{item.name}</h4>
                                                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">Qty: {item.quantity} × ₹{item.price}</p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <div className="flex gap-2">
                                                            <button onClick={() => updateQuantity(item.id, -1)} className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-xs">-</button>
                                                            <span className="text-xs font-black">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, 1)} className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-xs">+</button>
                                                        </div>
                                                        <span className="font-black text-slate-900 text-xs">₹{item.price * item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-slate-50 space-y-4">
                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 font-black">₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                    <span>Station Delivery Fee</span>
                                    <span className="text-emerald-600 font-black">FREE</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-slate-200">
                                    <div className="text-lg font-black text-slate-900">Total</div>
                                    <div className="text-2xl font-black text-sky-600">₹{cartTotal}</div>
                                </div>
                                <button 
                                    onClick={() => navigate('/railway/checkout')}
                                    disabled={cart.length === 0}
                                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl ${
                                        cart.length > 0 ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-sky-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                    }`}
                                >
                                    Review Order <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSelection;
