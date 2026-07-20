import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star, Heart, Train, Sparkles } from 'lucide-react';
import { productService } from '../../services/api';
import HeroCarousel from './HeroCarousel';

const Home = () => {

    const categories = [
        { name: 'Electronics', icon: '📱', color: 'bg-blue-50 text-blue-600', items: ['Laptop', 'Smartphone', 'Headphones'], img: 'https://img.freepik.com/free-photo/modern-stationary-collection-arrangement_23-2149309643.jpg' },
        { name: 'Fashion', icon: '👗', color: 'bg-pink-50 text-pink-600', items: ['T-Shirts', 'Sneakers', 'Watches'], img: 'https://img.freepik.com/free-photo/two-young-beautiful-smiling-hipster-female-trendy-white-sweater-coat_158538-16931.jpg' },
        { name: 'Home', icon: '🏠', color: 'bg-orange-50 text-orange-600', items: ['Sofa', 'Lamp', 'Wall Decor'], img: 'https://assets.architecturaldigest.in/photos/6954d0958351aa67c33a52d0/16:9/w_1616,h_909,c_limit/Untitled%20design%20(9).jpg' },
        { name: 'Beauty', icon: '💄', color: 'bg-purple-50 text-purple-600', items: ['Lipstick', 'Perfume', 'Face Serum'], img: 'https://plus.unsplash.com/premium_photo-1684407616442-8d5a1b7c978e?fm=jpg&q=60&w=3000' },
        { name: 'Books', icon: '📚', color: 'bg-emerald-50 text-emerald-600', items: ['Java Programming', 'Novels', 'Guides'], img: 'https://img.freepik.com/free-vector/books-stack-realistic_1284-4735.jpg' },
        { name: 'Sports', icon: '🏋️', color: 'bg-yellow-50 text-yellow-600', items: ['Football', 'Dumbbells', 'Yoga Mat'], img: 'https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg' }
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* HERO CAROUSEL */}
            <HeroCarousel />

            <main className="py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    
                    {/* EXPLORE CATEGORIES SECTION */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight underline decoration-pink-500/30 underline-offset-8">Explore Categories</h2>
                        <p className="text-slate-500 font-medium">Browse popular product categories available on E-Cart.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {categories.map((cat, idx) => (
                            <Link 
                                key={idx} 
                                to={`/products?category=${cat.name}`}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${cat.color} backdrop-blur-sm shadow-lg`}>
                                            {cat.icon} {cat.name}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-pink-600 transition-colors uppercase tracking-tight">{cat.name}</h3>
                                    <ul className="space-y-2 mb-6">
                                        {cat.items.map((item, i) => (
                                            <li key={i} className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div> {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-xs font-black text-pink-600 uppercase tracking-widest">Shop Now</span>
                                        <ArrowRight className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* SPECIALTIES SECTION (Restore Wedding & Railway specific highlight) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        <Link to="/wedding" className="relative h-64 rounded-3xl overflow-hidden group shadow-xl">
                            <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Wedding" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#831843]/90 to-transparent flex items-center p-10">
                                <div>
                                    <span className="inline-flex items-center gap-1 bg-white text-[#831843] text-[9px] font-black px-2 py-0.5 rounded mb-4">
                                        <Heart className="w-3 h-3 fill-current" /> WEDDING SPECIAL
                                    </span>
                                    <h2 className="text-3xl font-black text-white mb-2 underline decoration-white/30 underline-offset-4">Wedding Essentials</h2>
                                    <p className="text-white/80 text-sm font-semibold mb-6 italic max-w-xs">Everything for your special day in 1 hour.</p>
                                    <div className="inline-flex items-center gap-2 text-white font-black text-xs group-hover:gap-4 transition-all uppercase tracking-widest">
                                        Explore <Sparkles className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <Link to="/railway" className="relative h-64 rounded-3xl overflow-hidden group shadow-xl">
                            <img src="https://images.unsplash.com/photo-1474487056269-ac48360001df?w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Railway" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0c1a2e]/90 to-transparent flex items-center p-10">
                                <div>
                                    <span className="inline-flex items-center gap-1 bg-sky-500 text-white text-[9px] font-black px-2 py-0.5 rounded mb-4">
                                        <Train className="w-3 h-3" /> RAILWAY DELIVERY
                                    </span>
                                    <h2 className="text-3xl font-black text-white mb-2 underline decoration-white/30 underline-offset-4">Station Delivery</h2>
                                    <p className="text-white/80 text-sm font-semibold mb-6 italic max-w-xs">Essentials delivered to your train berth.</p>
                                    <div className="inline-flex items-center gap-2 text-white font-black text-xs group-hover:gap-4 transition-all uppercase tracking-widest">
                                        Find Train <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>


                </div>
            </main>
        </div>
    );
};

export default Home;
