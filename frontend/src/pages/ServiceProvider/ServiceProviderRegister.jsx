import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Heart, Camera, CheckCircle2, ChevronRight, MapPin, Phone, Mail, Star, Calendar, DollarSign, Image } from 'lucide-react';
import { vendorService } from '../../services/api';
import { toast } from 'react-toastify';

const CATEGORIES = [
  { value: 'PHOTOGRAPHER', label: 'Photographer', icon: '📸' },
  { value: 'MAKEUP_ARTIST', label: 'Makeup Artist', icon: '💄' },
  { value: 'MEHNDI_ARTIST', label: 'Mehndi Artist', icon: '🌿' },
  { value: 'CATERER', label: 'Caterer', icon: '🍽️' },
  { value: 'DECORATOR', label: 'Decorator', icon: '🎀' },
  { value: 'DJ', label: 'DJ / Music', icon: '🎵' },
  { value: 'VENUE', label: 'Venue Manager', icon: '🏛️' },
  { value: 'EVENT_PLANNER', label: 'Event Planner', icon: '📋' },
  { value: 'BAND', label: 'Band / Orchestra', icon: '🎺' },
  { value: 'FLORIST', label: 'Florist', icon: '🌸' },
];

const inp = "w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-pink-500/10 focus:border-pink-400 transition-all";

const ServiceProviderRegister = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const selectedCat = watch('category');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await vendorService.register({
        fullName: data.ownerName,
        businessName: data.businessName,
        category: data.category,
        phone: data.phone,
        email: data.email,
        city: data.city,
        experienceYears: parseInt(data.experienceYears) || 0,
        description: data.description,
        startingPrice: parseFloat(data.startingPrice) || 0,
        profilePictureUrl: data.profilePictureUrl || '',
        portfolioImages: data.portfolioImages ? data.portfolioImages.split('\n').map(s=>s.trim()).filter(Boolean) : [],
      });
      setDone(true);
      toast.success('Application submitted! Awaiting admin approval.');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-12 text-center max-w-md w-full shadow-xl border border-pink-100">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Application Submitted!</h2>
        <p className="text-slate-500 font-medium mb-2">Your service provider profile is under review.</p>
        <p className="text-slate-400 text-sm mb-8">Approval typically takes 1–2 business days. You'll be notified via email.</p>
        <Link to="/wedding/vendors" className="inline-block px-8 py-3 bg-pink-600 text-white rounded-2xl font-black text-sm hover:bg-pink-700 transition-all">
          Browse Vendors
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-pink-200">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Join as Service Provider</h1>
          <p className="text-slate-500 mt-2 font-medium">Showcase your talent to thousands of couples planning their big day</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Selection */}
          <div className="bg-white rounded-[2rem] border border-pink-100 shadow-sm p-8">
            <h2 className="text-lg font-black text-slate-900 mb-5">What service do you offer? *</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {CATEGORIES.map(cat => (
                <label key={cat.value} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedCat === cat.value
                    ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-100'
                    : 'border-slate-100 hover:border-pink-200 hover:bg-pink-50/30'
                }`}>
                  <input type="radio" value={cat.value} {...register('category', { required: 'Please select a category' })} className="hidden" />
                  <span className="text-2xl">{cat.icon}</span>
                  <span className={`text-[10px] font-black text-center leading-tight ${selectedCat === cat.value ? 'text-pink-700' : 'text-slate-600'}`}>
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.category && <p className="text-xs text-red-500 font-bold mt-2">{errors.category.message}</p>}
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-[2rem] border border-pink-100 shadow-sm p-8 space-y-5">
            <h2 className="text-lg font-black text-slate-900 mb-1">Business Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Business Name *</label>
                <input {...register('businessName', { required: 'Required' })} placeholder="e.g. Sharma Photography" className={inp} />
                {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Owner Name *</label>
                <input {...register('ownerName', { required: 'Required' })} placeholder="e.g. Priya Sharma" className={inp} />
                {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Email *</label>
                <input type="email" {...register('email', { required: 'Required' })} placeholder="priya@example.com" className={inp} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Phone *</label>
                <input {...register('phone', { required: 'Required' })} placeholder="9876543210" className={inp} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">City *</label>
                <input {...register('city', { required: 'Required' })} placeholder="e.g. Mumbai" className={inp} />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Years of Experience</label>
                <input type="number" {...register('experienceYears')} placeholder="5" min="0" max="50" className={inp} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Starting Price (₹) *</label>
              <input type="number" {...register('startingPrice', { required: 'Required' })} placeholder="15000" className={inp} />
              {errors.startingPrice && <p className="text-xs text-red-500 mt-1">{errors.startingPrice.message}</p>}
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">About Your Services *</label>
              <textarea {...register('description', { required: 'Required', minLength: { value: 50, message: 'At least 50 characters' } })}
                rows={4} placeholder="Describe your services, style, specializations, and what makes you unique..."
                className={`${inp} resize-none`} />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-[2rem] border border-pink-100 shadow-sm p-8 space-y-5">
            <h2 className="text-lg font-black text-slate-900 mb-1">Portfolio & Photos</h2>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Profile / Cover Photo URL</label>
              <input {...register('profilePictureUrl')} placeholder="https://images.unsplash.com/..." className={inp} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Portfolio Image URLs (one per line)</label>
              <textarea {...register('portfolioImages')} rows={4}
                placeholder={"https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2...\nhttps://images.unsplash.com/photo-3..."}
                className={`${inp} resize-none font-mono text-xs`} />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Add 3–8 portfolio images to attract more clients</p>
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl font-black text-sm hover:from-pink-700 hover:to-rose-700 transition-all shadow-xl shadow-pink-200 disabled:opacity-60">
            {submitting ? 'Submitting Application...' : '💍 Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceProviderRegister;
