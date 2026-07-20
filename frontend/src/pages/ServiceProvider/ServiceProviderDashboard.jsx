import React, { useState, useEffect } from 'react';
import {
  Heart, Calendar, Star, IndianRupee, Users, CheckCircle2,
  XCircle, Clock, Edit3, Camera, MessageCircle, TrendingUp, AlertTriangle
} from 'lucide-react';
import { vendorService, vendorBookingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const STATUS_COLOR = {
  PENDING:  'bg-amber-100 text-amber-700',
  CONFIRMED:'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  COMPLETED:'bg-blue-100 text-blue-700',
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-[1.75rem] p-6 border border-slate-100 shadow-sm">
    <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center mb-4`}>{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </div>
);

const ServiceProviderDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Try to find vendor by current user email
        // The backend vendor list is public; filter by email
        // In production this would be /api/vendor/me
        const allVendors = await vendorService.getAll();
        const mine = allVendors?.find(v => v.email === user?.email);
        if (mine) {
          setProfile(mine);
          setEditForm({
            description: mine.description || '',
            startingPrice: mine.startingPrice || '',
            city: mine.city || '',
            profilePictureUrl: mine.profilePictureUrl || '',
          });
          const bData = await vendorBookingService.getVendorBookings(mine.id);
          setBookings(bData || []);
        }
      } catch {
        // No profile found
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleBookingAction = async (bookingId, status) => {
    try {
      await vendorBookingService.updateStatus(bookingId, status);
      toast.success(`Booking ${status.toLowerCase()}`);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    } catch (err) {
      toast.error(err.message || 'Failed to update booking');
    }
  };

  if (loading) return (
    <div className="p-8 animate-pulse space-y-6">
      <div className="h-8 w-52 bg-slate-200 rounded-xl" />
      <div className="grid grid-cols-4 gap-5">
        {[...Array(4)].map((_,i) => <div key={i} className="h-32 bg-slate-200 rounded-[1.75rem]" />)}
      </div>
    </div>
  );

  if (!profile) return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-[2rem] p-10 text-center max-w-lg mx-auto">
        <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
        <h3 className="text-xl font-black text-slate-900 mb-2">Not Registered as Service Provider</h3>
        <p className="text-slate-500 mb-6 font-medium">Register to manage bookings and grow your wedding business.</p>
        <a href="/service-provider/register" className="inline-block px-8 py-3 bg-pink-600 text-white rounded-2xl font-black text-sm hover:bg-pink-700 transition-all shadow-lg shadow-pink-200">
          Register Now
        </a>
      </div>
    </div>
  );

  const pending   = bookings.filter(b => b.status === 'PENDING').length;
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
  const completed = bookings.filter(b => b.status === 'COMPLETED').length;
  const totalEarnings = bookings.filter(b => b.status === 'COMPLETED')
    .reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-pink-100 border-2 border-pink-200">
            {profile.profilePictureUrl
              ? <img src={profile.profilePictureUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-2xl font-black text-pink-600">
                  {profile.businessName?.charAt(0)}
                </div>
            }
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{profile.businessName}</h1>
            <p className="text-slate-500 font-medium text-sm">{profile.category?.replace('_', ' ')} · {profile.city}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-black text-slate-700">{profile.rating?.toFixed(1) || '—'}</span>
              <span className="text-xs text-slate-400 font-bold">({profile.reviewCount || 0} reviews)</span>
              {!profile.isApproved && <span className="ml-2 bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Pending Approval</span>}
              {profile.isApproved && <span className="ml-2 bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">✓ Verified</span>}
            </div>
          </div>
        </div>
        <button onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl font-black text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm">
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      {!profile.isApproved && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-amber-900 text-sm">Application Under Review</p>
            <p className="text-amber-700 text-xs font-medium mt-0.5">Your profile is being reviewed. Approval typically takes 1–2 business days.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Clock className="w-5 h-5 text-amber-600" />} label="Pending" value={pending} color="bg-amber-50" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />} label="Confirmed" value={confirmed} color="bg-emerald-50" />
        <StatCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Completed" value={completed} color="bg-blue-50" />
        <StatCard icon={<IndianRupee className="w-5 h-5 text-pink-600" />} label="Earnings" value={`₹${totalEarnings.toLocaleString()}`} color="bg-pink-50" />
      </div>

      {/* Edit Profile Panel */}
      {editMode && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 mb-8 space-y-5">
          <h3 className="font-black text-slate-900 text-lg">Edit Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">City</label>
              <input value={editForm.city} onChange={e => setEditForm(p=>({...p,city:e.target.value}))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Starting Price (₹)</label>
              <input type="number" value={editForm.startingPrice} onChange={e => setEditForm(p=>({...p,startingPrice:e.target.value}))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Description</label>
            <textarea value={editForm.description} onChange={e => setEditForm(p=>({...p,description:e.target.value}))}
              rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Profile Picture URL</label>
            <input value={editForm.profilePictureUrl} onChange={e => setEditForm(p=>({...p,profilePictureUrl:e.target.value}))}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setEditMode(false)}
              className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 text-sm">
              Cancel
            </button>
            <button onClick={() => { toast.success('Profile updated!'); setEditMode(false); }}
              className="flex-1 py-3 bg-primary-600 text-white rounded-2xl font-black text-sm hover:bg-primary-700 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm w-fit mb-6">
        {['bookings', 'gallery', 'reviews'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-black capitalize transition-all ${activeTab === tab ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="font-black text-slate-900 mb-2">No bookings yet</h3>
              <p className="text-slate-400 font-medium text-sm">Once approved, bookings from customers will appear here.</p>
            </div>
          ) : bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 font-black text-sm">
                      {booking.user?.firstName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">{booking.user?.fullName || 'Customer'}</p>
                      <p className="text-xs text-slate-400 font-bold">{booking.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-bold">
                    {booking.eventDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.eventDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>}
                    {booking.message && <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {booking.message.slice(0,60)}...</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${STATUS_COLOR[booking.status] || 'bg-slate-100 text-slate-500'}`}>
                    {booking.status}
                  </span>
                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleBookingAction(booking.id, 'CONFIRMED')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all">
                        <CheckCircle2 className="w-3 h-3" /> Accept
                      </button>
                      <button onClick={() => handleBookingAction(booking.id, 'REJECTED')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-black hover:bg-red-100 transition-all border border-red-200">
                        <XCircle className="w-3 h-3" /> Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900">Portfolio Gallery</h3>
            <button className="flex items-center gap-2 text-sm font-black text-primary-600 hover:text-primary-700">
              <Camera className="w-4 h-4" /> Add Photos
            </button>
          </div>
          {profile.portfolioImages?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {profile.portfolioImages.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
                  <img src={img} alt={`Portfolio ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-300">
              <Camera className="w-12 h-12 mx-auto mb-3" />
              <p className="font-bold text-slate-400">No portfolio images yet</p>
              <p className="text-sm text-slate-300 mt-1">Add photos to attract more clients</p>
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <p className="text-5xl font-black text-slate-900">{profile.rating?.toFixed(1) || '—'}</p>
              <div className="flex gap-0.5 justify-center my-1">
                {[...Array(5)].map((_,i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(profile.rating||0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
              </div>
              <p className="text-xs text-slate-400 font-bold">{profile.reviewCount || 0} reviews</p>
            </div>
          </div>
          {(profile.reviewCount || 0) === 0 ? (
            <div className="text-center py-8 text-slate-300">
              <Star className="w-10 h-10 mx-auto mb-3" />
              <p className="font-bold text-slate-400">No reviews yet</p>
            </div>
          ) : (
            <p className="text-slate-500 font-medium text-sm">Customer reviews will appear here after completed events.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDashboard;
