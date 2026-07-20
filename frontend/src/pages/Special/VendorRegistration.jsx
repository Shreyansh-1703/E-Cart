import React, { useState } from 'react';
import { vendorService } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Phone, Mail, MapPin, Award, IndianRupee, ImagePlus, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';

const VendorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    category: '',
    phone: '',
    email: '',
    city: '',
    experienceYears: '',
    description: '',
    startingPrice: '',
    profilePictureUrl: '',
    portfolioImages: []
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vendorService.register({
        ...formData,
        portfolioImages: formData.portfolioImages.split(',').map(s => s.trim())
      });
      toast.success('Registration submitted! Awaiting admin approval.');
      navigate('/');
    } catch (error) {
      toast.error('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Personal Details', icon: <User className="w-5 h-5" /> },
    { id: 2, name: 'Business Info', icon: <Building2 className="w-5 h-5" /> },
    { id: 3, name: 'Portfolio', icon: <ImagePlus className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-[#fdf2f8]/50 pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
               <div>
                 <h1 className="text-3xl font-black text-slate-900 mb-2">Join the Wedding <span className="text-pink-600">Circle</span></h1>
                 <p className="text-slate-500 font-medium">Register as a vendor and grow your wedding business with us.</p>
               </div>
               <div className="hidden sm:flex items-center gap-6">
                 {steps.map(s => (
                   <div key={s.id} className={`flex items-center gap-2 ${step >= s.id ? 'text-pink-600' : 'text-slate-300'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step >= s.id ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' : 'bg-slate-50 border border-slate-100'}`}>
                        {s.icon}
                      </div>
                      <div className="hidden lg:block">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Step 0{s.id}</div>
                        <div className="text-xs font-bold whitespace-nowrap">{s.name}</div>
                      </div>
                      {s.id < 3 && <ChevronRight className="w-4 h-4 ml-2 opacity-30" />}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl shadow-pink-100/50 border border-pink-50 relative overflow-hidden">
             
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-1"></div>

             {step === 1 && (
               <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input name="fullName" placeholder="Rahul Sharma" required className="input-field pl-12 w-full bg-slate-50 border-none rounded-2xl py-4 focus:ring-2 focus:ring-pink-500" value={formData.fullName} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input name="email" type="email" placeholder="rahul@example.com" required className="input-field pl-12 w-full bg-slate-50 border-none rounded-2xl py-4 focus:ring-2 focus:ring-pink-500" value={formData.email} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input name="phone" placeholder="+91 98765 43210" required className="input-field pl-12 w-full bg-slate-50 border-none rounded-2xl py-4 focus:ring-2 focus:ring-pink-500" value={formData.phone} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">City of Operation</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input name="city" placeholder="Mumbai, MH" required className="input-field pl-12 w-full bg-slate-50 border-none rounded-2xl py-4 focus:ring-2 focus:ring-pink-500" value={formData.city} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setStep(2)} className="bg-pink-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-pink-700 transition-all shadow-lg shadow-pink-200">
                      Next Step <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
               </div>
             )}

             {step === 2 && (
               <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Business Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input name="businessName" placeholder="Royal Studio" required className="input-field pl-12 w-full bg-slate-50 border-none rounded-2xl py-4 focus:ring-2 focus:ring-pink-500" value={formData.businessName} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select name="category" required className="input-field pl-12 w-full bg-slate-50 border-none rounded-2xl py-4 focus:ring-2 focus:ring-pink-500 appearance-none font-bold text-slate-700" value={formData.category} onChange={handleChange}>
                          <option value="">Select Category</option>
                          <option value="PHOTOGRAPHER">Photographer</option>
                          <option value="MAKEUP_ARTIST">Makeup Artist</option>
                          <option value="MEHNDI_ARTIST">Mehendi Artist</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Years of Experience</label>
                      <div className="relative">
                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input name="experienceYears" type="number" placeholder="5" required className="input-field pl-12 w-full bg-slate-50 border-none rounded-2xl py-4 focus:ring-2 focus:ring-pink-500" value={formData.experienceYears} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Starting Price (₹)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input name="startingPrice" type="number" placeholder="5000" required className="input-field pl-12 w-full bg-slate-50 border-none rounded-2xl py-4 focus:ring-2 focus:ring-pink-500" value={formData.startingPrice} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 ml-1">Business Description</label>
                    <textarea name="description" rows="4" placeholder="Tell us about your services..." className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-500" value={formData.description} onChange={handleChange}></textarea>
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(1)} className="px-10 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Back</button>
                    <button type="button" onClick={() => setStep(3)} className="bg-pink-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-pink-700 transition-all shadow-lg shadow-pink-200">
                      Final Step <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
               </div>
             )}

             {step === 3 && (
               <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Profile Picture URL</label>
                      <input name="profilePictureUrl" placeholder="https://..." className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-500" value={formData.profilePictureUrl} onChange={handleChange} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Portfolio Images (Comma separated URLs)</label>
                      <textarea name="portfolioImages" rows="4" placeholder="URL1, URL2, URL3..." className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-500" value={formData.portfolioImages} onChange={handleChange}></textarea>
                    </div>
                  </div>
                  <div className="p-6 bg-pink-50 rounded-3xl border border-pink-100 flex items-start gap-4">
                     <CheckCircle2 className="w-6 h-6 text-pink-600 shrink-0 mt-1" />
                     <div>
                       <h4 className="font-bold text-pink-900">Important Note</h4>
                       <p className="text-sm text-pink-700 mt-1">Our team will review your application within 24-48 hours. Once approved, your profile will be visible in the marketplace.</p>
                     </div>
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(2)} className="px-10 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Back</button>
                    <button type="submit" disabled={loading} className="bg-pink-600 text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 disabled:opacity-50">
                      {loading ? 'Submitting...' : 'Complete Registration'} <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
               </div>
             )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration;
