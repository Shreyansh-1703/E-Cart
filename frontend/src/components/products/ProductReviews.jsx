import React, { useState, useEffect, useCallback } from 'react';
import { Star, ThumbsUp, ShieldCheck, ChevronDown } from 'lucide-react';
import { reviewService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const StarRow = ({ count, total, label }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-slate-500 w-3">{label}</span>
      <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-400 w-8 text-right">{pct}%</span>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const stars = review.rating || 0;
  const date = new Date(review.reviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="py-6 border-b border-slate-100 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 font-black flex items-center justify-center text-sm shrink-0">
            {review.reviewerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{review.reviewerName}</p>
            <p className="text-xs text-slate-400">{date}</p>
          </div>
        </div>
        {review.verifiedPurchase && (
          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full shrink-0">
            <ShieldCheck className="w-3 h-3" /> Verified Purchase
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
        ))}
      </div>
      <p className="text-sm font-bold text-slate-900 mb-1">{review.title}</p>
      <p className="text-sm text-slate-600 leading-relaxed">{review.description}</p>
    </div>
  );
};

const ProductReviews = ({ productId }) => {
  const { isAuthenticated } = useAuth();
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: '', description: '', reviewerName: '' });

  const fetchSummary = useCallback(async () => {
    try {
      const data = await reviewService.getSummary(productId);
      setSummary(data);
    } catch { /* silent */ }
  }, [productId]);

  const fetchReviews = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const data = await reviewService.getByProduct(productId, p, 5);
      setReviews(prev => p === 0 ? data.reviews : [...prev, ...data.reviews]);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [productId]);

  useEffect(() => {
    fetchSummary();
    fetchReviews(0);
  }, [fetchSummary, fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reviewerName.trim() || !form.title.trim() || !form.description.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.add(productId, form);
      toast.success('Review submitted!');
      setForm({ rating: 5, title: '', description: '', reviewerName: '' });
      setShowForm(false);
      fetchSummary();
      fetchReviews(0);
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!summary) return null;

  const avg = parseFloat(summary.average || 0);
  const total = summary.total || 0;
  const breakdown = summary.breakdown || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Customer Reviews</h2>
          <p className="text-sm text-slate-400 mt-1">{total} global ratings</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setShowForm(v => !v)}
            className="px-5 py-2.5 bg-primary-600 text-white text-xs font-black rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Summary + Breakdown */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Average */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-7xl font-black text-slate-900 leading-none">{avg.toFixed(1)}</span>
          <div className="flex items-center gap-1 my-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.round(avg) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
            ))}
          </div>
          <p className="text-sm font-bold text-slate-500">out of 5 · {total} reviews</p>
        </div>
        {/* Breakdown */}
        <div className="space-y-2.5 justify-center flex flex-col">
          {[5, 4, 3, 2, 1].map(star => (
            <StarRow key={star} label={star} count={breakdown[star] || 0} total={total} />
          ))}
        </div>
      </div>

      {/* Write Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-primary-100 rounded-3xl p-8 shadow-sm space-y-5">
          <h3 className="font-black text-slate-900 text-lg">Share your experience</h3>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Your Name</label>
            <input
              value={form.reviewerName}
              onChange={e => setForm(p => ({ ...p, reviewerName: e.target.value }))}
              placeholder="e.g. Priya Sharma"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => setForm(p => ({ ...p, rating: s }))}>
                  <Star className={`w-7 h-7 transition-all ${s <= form.rating ? 'text-amber-400 fill-amber-400 scale-110' : 'text-slate-200 fill-slate-200'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Review Title</label>
            <input
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Summarize your experience"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Detailed Review</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="What did you like or dislike? How was the quality?"
              rows={4}
              className="input-field resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary px-8 py-3 rounded-2xl disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
        {loading && reviews.length === 0 ? (
          <div className="p-8 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="flex gap-3"><div className="w-10 h-10 rounded-2xl bg-slate-100" /><div className="space-y-2 flex-1"><div className="h-3 bg-slate-100 rounded w-1/4" /><div className="h-3 bg-slate-100 rounded w-1/6" /></div></div>
                <div className="h-3 bg-slate-100 rounded w-full" /><div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <Star className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold">No reviews yet. Be the first!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 px-8">
            {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}

        {page + 1 < totalPages && (
          <div className="p-6 text-center border-t border-slate-50">
            <button
              onClick={() => fetchReviews(page + 1)}
              className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 mx-auto"
            >
              Load more reviews <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
