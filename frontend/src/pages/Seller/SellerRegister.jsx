import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Store, Building2, CreditCard, Phone, Mail, MapPin, User, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { sellerService } from '../../services/api';
import { toast } from 'react-toastify';

const steps = ['Business Info', 'Contact & Address', 'Bank Details'];

const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
  </div>
);

const inp = "w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 outline-none transition-all";

const SellerRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm();

  const nextStep = async () => {
    const fields = [
      ['businessName', 'ownerName', 'gstNumber', 'panNumber'],
      ['email', 'phone', 'businessAddress'],
      ['bankAccountNumber', 'bankIfsc', 'bankName'],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await sellerService.register(data);
      setDone(true);
      toast.success('Seller application submitted! Awaiting admin approval.');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-12 text-center max-w-md w-full border border-slate-100 shadow-sm">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Application Submitted!</h2>
        <p className="text-slate-500 font-medium mb-2">Your seller application is under review.</p>
        <p className="text-slate-400 text-sm mb-8">You'll receive an email once approved. Approval typically takes 1-2 business days.</p>
        <Link to="/" className="btn-primary px-8 py-3 rounded-2xl inline-block text-sm font-black">Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Become a Seller</h1>
          <p className="text-slate-500 mt-2 font-medium">Join thousands of sellers on E-Cart marketplace</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all ${
                i === step ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                : i < step ? 'bg-emerald-100 text-emerald-700'
                : 'bg-white text-slate-400 border border-slate-200'
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  i < step ? 'bg-emerald-600 text-white' : i === step ? 'bg-white text-primary-600' : 'bg-slate-100 text-slate-400'
                }`}>{i < step ? '✓' : i + 1}</span>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300" />}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">

            {/* Step 0 — Business Info */}
            {step === 0 && (
              <>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
                  <Building2 className="w-6 h-6 text-primary-600" /> Business Information
                </h2>
                <Field label="Business Name" error={errors.businessName?.message}>
                  <input {...register('businessName', { required: 'Required' })} placeholder="e.g. Sharma Electronics Pvt. Ltd." className={inp} />
                </Field>
                <Field label="Owner / Proprietor Name" error={errors.ownerName?.message}>
                  <input {...register('ownerName', { required: 'Required' })} placeholder="e.g. Rajesh Sharma" className={inp} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="GST Number" error={errors.gstNumber?.message}>
                    <input {...register('gstNumber', { required: 'Required', pattern: { value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: 'Invalid GST' } })}
                      placeholder="22AAAAA0000A1Z5" className={inp} />
                  </Field>
                  <Field label="PAN Number" error={errors.panNumber?.message}>
                    <input {...register('panNumber', { required: 'Required', pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'Invalid PAN' } })}
                      placeholder="AAAAA0000A" className={inp} />
                  </Field>
                </div>
              </>
            )}

            {/* Step 1 — Contact */}
            {step === 1 && (
              <>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
                  <Phone className="w-6 h-6 text-primary-600" /> Contact & Address
                </h2>
                <Field label="Business Email" error={errors.email?.message}>
                  <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                    placeholder="business@example.com" type="email" className={inp} />
                </Field>
                <Field label="Phone Number" error={errors.phone?.message}>
                  <input {...register('phone', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: '10-digit Indian mobile' } })}
                    placeholder="9876543210" className={inp} />
                </Field>
                <Field label="Business Address" error={errors.businessAddress?.message}>
                  <textarea {...register('businessAddress', { required: 'Required' })}
                    rows={3} placeholder="Flat 12, Industrial Area, Sector 18, Noida, UP - 201301"
                    className={`${inp} resize-none`} />
                </Field>
              </>
            )}

            {/* Step 2 — Bank */}
            {step === 2 && (
              <>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
                  <CreditCard className="w-6 h-6 text-primary-600" /> Bank Details
                </h2>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-sm text-amber-800 font-medium mb-4">
                  <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  Bank details are used for seller payouts. Your information is encrypted and secure.
                </div>
                <Field label="Bank Name" error={errors.bankName?.message}>
                  <select {...register('bankName', { required: 'Required' })} className={inp}>
                    <option value="">Select Bank</option>
                    {['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra Bank','Punjab National Bank','Bank of Baroda','Canara Bank','IndusInd Bank','Yes Bank'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Account Number" error={errors.bankAccountNumber?.message}>
                  <input {...register('bankAccountNumber', { required: 'Required', minLength: { value: 9, message: 'Min 9 digits' } })}
                    placeholder="1234567890123456" className={inp} />
                </Field>
                <Field label="IFSC Code" error={errors.bankIfsc?.message}>
                  <input {...register('bankIfsc', { required: 'Required', pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Invalid IFSC' } })}
                    placeholder="SBIN0001234" className={`${inp} uppercase`} />
                </Field>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mt-6">
            {step > 0 && (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="flex-1 py-4 border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all text-sm">
                ← Back
              </button>
            )}
            {step < 2 ? (
              <button type="button" onClick={nextStep}
                className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 text-sm">
                Continue →
              </button>
            ) : (
              <button type="submit" disabled={submitting}
                className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 text-sm disabled:opacity-60">
                {submitting ? 'Submitting...' : '✓ Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerRegister;
