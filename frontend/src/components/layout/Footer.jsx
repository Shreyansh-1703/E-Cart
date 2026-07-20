import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Train, MapPin, Phone, Mail, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 pt-20 pb-10">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-white/10 p-2.5 rounded-2xl group-hover:bg-pink-600 transition-colors">
                                <ShoppingCart className="text-white w-6 h-6" />
                            </div>
                            <div className="leading-tight">
                                <div className="text-2xl font-black text-white tracking-widest uppercase">E-Cart</div>
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">India Store</div>
                            </div>
                        </Link>
                        <p className="text-sm font-medium leading-relaxed max-w-xs">
                            India's first truly specialized e-commerce platform. Providing essential deliveries at railway stations and curated wedding services.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#db2777] hover:text-white transition-all"><Globe className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all"><Globe className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Globe className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Service Modules</h4>
                        <ul className="space-y-4">
                            <li><Link to="/railway" className="text-sm font-bold flex items-center gap-2 hover:text-sky-400 transition-colors"><Train className="w-4 h-4" /> Railway Delivery</Link></li>
                            <li><Link to="/wedding" className="text-sm font-bold flex items-center gap-2 hover:text-pink-500 transition-colors"><Heart className="w-4 h-4 fill-current" /> Wedding Essentials</Link></li>
                            <li><Link to="/rental" className="text-sm font-bold flex items-center gap-2 hover:text-emerald-400 transition-colors">👗 Rental Service</Link></li>
                            <li><Link to="/order-tracking" className="text-sm font-bold flex items-center gap-2 hover:text-amber-400 transition-colors">📍 Order Tracking</Link></li>
                        </ul>
                    </div>

                    {/* Service Provider Register */}
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Want to Join With Us as a Wedding Service Provider?</h4>
                        <p className="text-sm font-medium mb-6 leading-relaxed max-w-xs">
                            Join our platform and connect with thousands of couples planning their dream wedding!
                        </p>
                        <Link to="/service-provider/register" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg">
                            Register as Service Provider
                        </Link>
                    </div>

                    {/* Support */}
                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Contact Support</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-pink-500 mt-1 shrink-0" />
                                <span className="text-xs font-bold leading-relaxed">Level 4, Sky Tower, Sector 62, Noida, UP - 201301</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-pink-500 shrink-0" />
                                <span className="text-xs font-bold">+91 1800 123 4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-pink-500 shrink-0" />
                                <span className="text-xs font-bold">care@ecart.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-widest">&copy; {new Date().getFullYear()} E-CART INDIA. ALL RIGHTS RESERVED.</p>
                    <div className="flex items-center gap-8">
                        <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest hover:text-white">Terms</Link>
                        <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest hover:text-white">Privacy</Link>
                        <Link to="/legal" className="text-[10px] font-black uppercase tracking-widest hover:text-white">Legal</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
