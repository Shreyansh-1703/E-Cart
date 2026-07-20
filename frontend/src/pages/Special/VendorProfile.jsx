import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vendorService, vendorBookingService } from '../../services/api';
import { Star, MapPin, Briefcase, Calendar, Clock, CheckCircle, Info, ChevronRight, Share2, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const VendorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await vendorService.getById(id);
        setVendor(data);
      } catch (error) {
        toast.error('Failed to load vendor profile');
        navigate('/wedding/vendors');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to book a vendor');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await vendorBookingService.create({
        user: { id: user.id },
        vendor: { id: vendor.id },
        bookingDate,
        timeSlot: bookingSlot,
        status: 'PENDING'
      });
      toast.success('Booking request sent successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.message || 'Failed to send booking request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
  if (!vendor) return null;

  return (
    <div className="min-h-screen bg-white pb-20 pt-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <span>Wedding</span> <ChevronRight className="w-4 h-4" />
          <span>Vendors</span> <ChevronRight className="w-4 h-4" />
          <span className="text-pink-600 font-bold">{vendor.businessName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Info & Portfolio */}
          <div className="lg:col-2 space-y-12">
            {/* Hero Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-4 lg:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-lg shadow-pink-100 relative shrink-0">
                <img src={vendor.profilePictureUrl || 'https://via.placeholder.com/300'} alt={vendor.businessName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl"></div>
              </div>
              <div className="flex-grow text-center md:text-left space-y-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                   <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-[10px] font-black uppercase tracking-wider">{vendor.category.replace('_',' ')}</span>
                   <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                     <Star className="w-4 h-4 fill-current" /> {vendor.rating} <span className="text-slate-400 font-medium">({vendor.reviewCount} Reviews)</span>
                   </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900">{vendor.businessName}</h1>
                <p className="text-lg text-slate-500 font-medium">{vendor.fullName}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-slate-600 font-bold pt-2">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-pink-500" /> {vendor.city}</div>
                  <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-pink-500" /> {vendor.experienceYears} Years Exp.</div>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-pink-500 transition-colors border border-slate-100"><Share2 className="w-5 h-5" /></button>
                <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-pink-500 transition-colors border border-slate-100"><Heart className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                About the Business
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg italic">
                "{vendor.description}"
              </p>
            </div>

            {/* Portfolio Gallery */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Portfolio Gallery</h2>
                <span className="text-sm font-bold text-pink-600">{vendor.portfolioImages?.length || 0} Photos</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vendor.portfolioImages?.map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 group cursor-pointer relative">
                    <img src={img} alt={`Work ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Share2 className="text-white w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-[2.5rem] border border-pink-100 shadow-xl shadow-pink-100/50 p-8 space-y-8">
              <div className="flex items-center justify-between">
                 <span className="text-slate-500 text-sm font-bold">Starting From</span>
                 <div className="text-3xl font-black text-pink-600">₹{vendor.startingPrice?.toLocaleString()}</div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl flex items-start gap-3 border border-emerald-100">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-emerald-900">Instantly Available</div>
                  <div className="text-xs text-emerald-700">Vendor usually responds within 2 hours.</div>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink-500" /> Select Event Date
                  </label>
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-500 font-bold text-slate-700"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-500" /> Preferred Time Slot
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Morning', 'Afternoon', 'Evening', 'Night'].map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingSlot(slot)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                          bookingSlot === slot
                            ? 'bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-100'
                            : 'bg-white text-slate-600 border-slate-100 hover:border-pink-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-pink-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
                </button>

                <p className="text-[10px] text-center text-slate-400 font-medium">
                  By clicking this, you agree to our booking terms & conditions.
                </p>
              </form>

              <div className="pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-4">
                   <Info className="w-4 h-4" /> Package includes:
                </div>
                <ul className="space-y-3">
                   {['Initial Consultation', 'On-site Execution', 'Quality Guarantee', 'Basic Equipment'].map((item, i) => (
                     <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-pink-500" /> {item}
                     </li>
                   ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
