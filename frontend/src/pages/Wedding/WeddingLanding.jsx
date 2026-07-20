import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Zap, Clock, Star, ShieldCheck, PhoneCall, RotateCcw, HeartHandshake } from 'lucide-react';
import { toast } from 'react-toastify';

const WEDDING_FALLBACK = [
  { id:'w1', name:'Bridal Lehenga — Red & Gold', price:24999, originalPrice:39999, rentPrice: 2000, securityDeposit: 5000, rentable: true, category:'Bridal Wear', brand:'Manyavar', rating:4.9, reviewCount:1200, stock:10, badge:'Rentable', imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAzZhNU_r39Un-SLgERVI1l0WZvrdyS8toNg&s', weddingItem:true, tags:['bridal'] },
  { id:'w2', name:'Wedding Cake — 3 Tier', price:8999, originalPrice:12999, category:'Food & Cake', brand:'BakeHouse', rating:4.8, reviewCount:890, stock:5, badge:'NEW', imageUrl:'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400', weddingItem:true, tags:['food'] },
  { id:'w3', name:'Floral Decoration Package', price:14999, originalPrice:22999, category:'Decor', brand:'BloomDecor', rating:4.7, reviewCount:560, stock:8, badge:'SALE', imageUrl:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400', weddingItem:true, tags:['decor'] },
  { id:'w4', name:"Groom's Sherwani — Ivory", price:12999, originalPrice:18999, rentPrice: 1500, securityDeposit: 3000, rentable: true, category:'Bridal Wear', brand:'Manyavar', rating:4.8, reviewCount:780, stock:15, badge:'Rentable', imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7RwGYfVcHXfX3XMOss2HQMA2zqx3WpJVN7w&s', weddingItem:true, tags:['bridal'] },
  { id:'w5', name:'Bridal Jewellery Set', price:5000, originalPrice:9999, rentPrice: 2000, securityDeposit: 5000, rentable: true, category:'Jewellery', brand:'Tanishq', rating:4.9, reviewCount:1450, stock:20, badge:'Rentable', imageUrl:'https://images.jdmagicbox.com/quickquotes/images_main/-41honv5n.jpg', weddingItem:true, tags:['jewellery'] },
  { id:'w6', name:'Wedding Invitation Cards (50 pcs)', price:1999, originalPrice:2999, category:'Decor', brand:'PrintKart', rating:4.6, reviewCount:3200, stock:50, badge:'NEW', imageUrl:'https://img.thecdn.in/284204/1693303670284_SKU-0453_4.jpeg?width=600&format=webp', weddingItem:true, tags:['decor'] },
  { id:'w7', name:'Mehendi Artist Booking', price:3999, originalPrice:5999, bookable: true, category:'Services', brand:'MehndiPro', rating:4.9, reviewCount:2100, stock:3, badge:'Service', imageUrl:'https://imgcdn.bookmywed.in/VendorGallery/abd40b5a-9f64-431b-a8bc-63c140df9916WhatsApp%20Image%202022-11-28%20at%201.36.31%20PM%20(2).jpeg', weddingItem:true, tags:['services'] },
  { id:'w8', name:'Wedding Photographer (1 Day)', price:19999, originalPrice:29999, bookable: true, category:'Services', brand:'SnapStudio', rating:4.9, reviewCount:980, stock:2, badge:'Service', imageUrl:'https://content.jdmagicbox.com/comp/tirupur/g7/9999px421.x421.171205122246.q7g7/catalogue/yuktha-studios-samundipuram-tirupur-wedding-photographers-4xz5q3xbn5.jpg', weddingItem:true, tags:['services'] }
];

const WeddingLanding = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState(WEDDING_FALLBACK);
    const [filter, setFilter] = useState('all');
    const [countdown, setCountdown] = useState('--:--:--');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const end = new Date(now);
            end.setHours(23, 59, 59, 0);
            const diff = end - now;
            const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
            setCountdown(`${h}:${m}:${s}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => {
            const cat = p.category.toLowerCase();
            return cat.includes(filter);
        });

    return (
        <div className="bg-[#fdf2f8] min-h-screen">
            {/* HERO */}
            <section 
                className="py-24 relative overflow-hidden text-white"
                style={{
                    backgroundColor: '#831843',
                    backgroundImage: `linear-gradient(to bottom right, rgba(131, 24, 67, 0.95), rgba(157, 23, 77, 0.85)), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSASdEnR86_s_yLg_3T6Dc810PxU4IokmpVzdp8x-Pm_w&s=10')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full bg-white/10 blur-[100px]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-wrap items-center">
                        <div className="w-full lg:w-7/12">
                            <div className="flex gap-2 mb-4">
                                <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                    <Zap className="w-3 h-3" /> EXPRESS DELIVERY
                                </span>
                                <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                                    <Heart className="w-3 h-3 fill-current" /> WEDDING SPECIAL
                                </span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight">
                                Last Minute Wedding<br />Essentials 💍
                            </h1>
                            <p className="text-lg mb-8 opacity-90 max-w-lg">
                                Everything you need for the perfect wedding — delivered in <span className="font-bold text-amber-300 underline decoration-2 underline-offset-4">30 mins – 3 hours</span>.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-xs opacity-80 font-semibold italic"><Clock className="w-4 h-4 text-amber-300" /> Ultra-Fast Express Delivery</div>
                                <div className="flex items-center gap-2 text-xs opacity-80 font-semibold italic"><Star className="w-4 h-4 text-amber-300" /> Curated Collection</div>
                                <div className="flex items-center gap-2 text-xs opacity-80 font-semibold italic"><ShieldCheck className="w-4 h-4 text-amber-300" /> Satisfaction Guaranteed</div>
                                <div className="flex items-center gap-2 text-xs opacity-80 font-semibold italic"><HeartHandshake className="w-4 h-4 text-amber-300" /> Trusted Vendors Only</div>
                            </div>
                        </div>
                        <div className="hidden lg:block w-full lg:w-5/12 text-center select-none">
                            <div className="w-64 h-64 mx-auto rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                                <Heart className="w-32 h-32 text-white animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* URGENCY BAR */}
            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-xl flex flex-wrap items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center animate-bounce">
                        <Clock className="text-amber-700 w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                        <div className="text-sm font-black text-amber-900 flex items-center gap-2">
                            <span className="bg-red-500 text-white p-1 rounded animate-pulse">URGENT</span> 
                            Order within <span className="text-red-600 font-mono text-lg">{countdown}</span> for same-day delivery!
                        </div>
                        <p className="text-xs text-amber-700 font-semibold opacity-75">All wedding items are available for ultra-fast delivery options.</p>
                    </div>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95">
                        Shop Now
                    </button>
                </div>
            </div>

            <main className="py-16 container mx-auto px-4">
                {/* CATEGORY TABS */}
                <div className="flex overflow-x-auto pb-4 gap-3 mb-10 no-scrollbar">
                    {['all', 'bridal', 'decor', 'food', 'jewellery', 'services'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black transition-all shadow-sm ${
                                filter === cat 
                                ? 'bg-[#db2777] text-white' 
                                : 'bg-white text-slate-500 hover:bg-pink-50 border border-pink-100'
                            }`}
                        >
                            {cat === 'all' ? '💍 All Items' : cat === 'bridal' ? '👗 Bridal Wear' : cat === 'decor' ? '🌸 Decor' : cat === 'food' ? '🎂 Food & Cake' : cat === 'jewellery' ? '📿 Jewellery' : '📸 Services'}
                        </button>
                    ))}
                </div>

                {/* PRODUCT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(p => (
                        <div key={p.id} className="bg-white rounded-3xl overflow-hidden border-2 border-pink-50 hover:border-pink-200 hover:shadow-2xl transition-all group">
                            <div className="h-56 bg-pink-50 relative overflow-hidden">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    <span className="bg-[#db2777] text-white text-[9px] font-black px-2 py-1 rounded shadow-sm">WEDDING</span>
                                    {p.rentable && <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-1 rounded shadow-sm">RENTABLE</span>}
                                </div>
                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-amber-400 fill-current" /> 1–3 Hour Delivery
                                </div>
                            </div>
                            <div className="p-6">
                                <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">{p.category}</span>
                                <h3 className="font-bold text-slate-800 mb-2 truncate">{p.name}</h3>
                                
                                {p.rentable ? (
                                    <div className="mb-4 space-y-1">
                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-black text-[#db2777]">₹{p.rentPrice}<span className="text-xs font-normal text-slate-400">/day</span></span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 flex justify-between">
                                            <span>Purchase Price: ₹{p.price}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl font-black text-[#db2777]">₹{p.price}</span>
                                        <span className="text-sm text-slate-400 line-through font-bold">₹{p.originalPrice}</span>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => {
                                            const checkoutData = {
                                                items: [{
                                                    product: p,
                                                    quantity: 1,
                                                    price: p.price
                                                }],
                                                isBuyNow: true
                                            };
                                            navigate('/checkout', { state: checkoutData });
                                        }}
                                        className="flex-1 bg-white border-2 border-pink-100 text-pink-600 font-bold py-2.5 rounded-xl hover:bg-pink-50 transition-all text-sm"
                                    >
                                        Buy Now
                                    </button>
                                    {p.rentable && (
                                        <button 
                                            onClick={() => {
                                                sessionStorage.setItem('rental_item', JSON.stringify(p));
                                                navigate('/rental/checkout');
                                            }}
                                            className="flex-1 bg-gradient-to-r from-[#db2777] to-[#be185d] text-white font-bold py-2.5 rounded-xl shadow-lg hover:shadow-pink-200 transition-all text-sm"
                                        >
                                            Rent
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* WHY CHOOSE US - Modular Divider */}
                <div className="my-20 flex items-center gap-6">
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-pink-200 to-pink-300"></div>
                    <span className="text-lg font-black text-[#831843] flex items-center gap-2">✨ Why Choose E-Cart for Weddings?</span>
                    <div className="flex-1 h-0.5 bg-gradient-to-l from-transparent via-pink-200 to-pink-300"></div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: '⚡', title: 'Under 3 Hours', desc: 'Fastest delivery in India' },
                        { icon: '💯', title: 'Quality Assured', desc: 'Hand-picked premium items' },
                        { icon: '📞', title: '24/7 Support', desc: 'Dedicated concierge' },
                        { icon: '🔄', title: 'Return Policy', desc: 'Hassle-free guarantee' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl border-2 border-pink-50 text-center hover:bg-pink-50 transition-all">
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h4 className="font-black text-[#831843] text-sm mb-1">{item.title}</h4>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default WeddingLanding;
