import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, Train, Heart } from 'lucide-react';

const slides = [
    {
        id: 1,
        badge: '💒 WEDDING ESSENTIALS',
        badgeColor: 'bg-amber-400 text-slate-900',
        title: 'Last-Minute Wedding Essentials',
        subtitle: 'Everything you need for your special day, delivered quickly.',
        desc: 'Shop wedding decorations, gifts, ceremonial items, and emergency essentials from trusted vendors.',
        buttonText: 'Explore Wedding Essentials',
        buttonLink: '/wedding',
        bgGradient: 'from-[#4a0020] via-[#831843] to-[#9d174d]',
        image: 'https://images.stockcake.com/public/f/a/7/fa76812e-16a2-4a87-8ead-b78b726c9636_large/traditional-indian-wedding-stockcake.jpg',
        icon: <Heart className="w-4 h-4 fill-current" />
    },
    {
        id: 2,
        badge: '🚂 RAILWAY DELIVERY',
        badgeColor: 'bg-sky-400 text-slate-900',
        title: 'Railway Station Delivery',
        subtitle: 'Get products delivered during your train journey.',
        desc: 'Choose a station on your route and receive your order securely with OTP-based delivery verification.',
        buttonText: 'Explore Railway Delivery',
        buttonLink: '/railway',
        bgGradient: 'from-[#0c1a2e] via-[#1a3a5c] to-[#0f2744]',
        image: 'https://assets.qz.com/media/5ced559c4b68873a16204f31ca25a3c3.jpg',
        icon: <Train className="w-4 h-4" />
    },
    {
        id: 3,
        badge: '⚡ MARKETPLACE',
        badgeColor: 'bg-emerald-400 text-slate-900',
        title: 'Explore Everything',
        subtitle: 'One marketplace for all your needs.',
        desc: 'Browse electronics, fashion, books, sports equipment, groceries, wedding essentials, and much more.',
        buttonText: 'Start Shopping',
        buttonLink: '/products',
        bgGradient: 'from-[#131921] via-[#1a3a5c] to-[#0f2744]',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&q=80',
        icon: <Zap className="w-4 h-4 fill-current" />
    }
];

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent(prev => (prev + 1) % slides.length);
    const prev = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative w-full h-[400px] lg:h-[480px] overflow-hidden group">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                        index === current ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                    }`}
                >
                    <div className={`w-full h-full bg-gradient-to-br ${slide.bgGradient} relative flex items-center`}>
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-40 mix-blend-overlay">
                            <img src={slide.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="container mx-auto px-6 lg:px-12 relative z-10">
                            <div className="max-w-2xl">
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest mb-6 ${slide.badgeColor}`}>
                                    {slide.icon} {slide.badge}
                                </span>
                                <h2 className="text-4xl lg:text-5xl font-black text-white mb-2 leading-tight tracking-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-lg lg:text-xl font-bold text-white/90 mb-4 italic">
                                    {slide.subtitle}
                                </p>
                                <p className="text-sm font-medium text-white/70 mb-10 max-w-lg leading-relaxed">
                                    {slide.desc}
                                </p>
                                <div className="flex gap-4">
                                    <Link 
                                        to={slide.buttonLink} 
                                        className={`px-8 py-3.5 rounded-xl font-black text-sm transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg ${slide.badgeColor}`}
                                    >
                                        {slide.buttonText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button 
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`transition-all duration-300 rounded-full h-1.5 ${
                            i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'
                        }`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
