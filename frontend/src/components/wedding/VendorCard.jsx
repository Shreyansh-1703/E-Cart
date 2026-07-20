import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Briefcase, ChevronRight } from 'lucide-react';

const VendorCard = ({ vendor }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-pink-50 group">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={vendor.profilePictureUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'} 
          alt={vendor.businessName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-pink-600 shadow-sm">
          {vendor.category.replace('_', ' ')}
        </div>
        <div className="absolute bottom-3 right-3 bg-pink-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
          Starting ₹{vendor.startingPrice?.toLocaleString()}
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{vendor.businessName}</h3>
          <p className="text-sm text-slate-500 font-medium">{vendor.fullName}</p>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-bold text-slate-700">{vendor.rating}</span>
            <span>({vendor.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{vendor.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            <span>{vendor.experienceYears} Years Exp.</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {vendor.description}
        </p>

        <div className="pt-2 flex gap-2">
          <Link 
            to={`/wedding/vendors/${vendor.id}`} 
            className="flex-grow bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-xl text-center text-sm font-bold transition-colors shadow-sm shadow-pink-100"
          >
            Book Now
          </Link>
          <Link 
            to={`/wedding/vendors/${vendor.id}`} 
            className="px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-bold transition-colors border border-slate-100"
            title="View Profile"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
