import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, ChevronLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const OtpVerification = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [demoOtp, setDemoOtp] = useState('');
    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    useEffect(() => {
        // Generate a random 6-digit OTP for demo purposes
        const generated = Math.floor(100000 + Math.random() * 900000).toString();
        setDemoOtp(generated);
        
        // Focus first input
        inputRefs[0].current?.focus();
    }, []);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleVerify = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }

        if (enteredOtp === demoOtp) {
            toast.success('OTP Verified successfully!');
            // Store order ID in session
            const orderId = 'RD-' + Math.floor(100000 + Math.random() * 900000);
            sessionStorage.setItem('railway_order_id', orderId);
            navigate('/railway/confirmation');
        } else {
            toast.error('Invalid OTP. Use the demo OTP provided.');
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-lg">
                {/* STEP INDICATOR */}
                <div className="flex justify-between mb-12">
                    <div className="flex-1 text-center border-b-4 border-emerald-500 pb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-1 font-bold text-xs"><CheckCircle2 className="w-4 h-4" /></div>
                        <span className="text-[10px] font-bold text-emerald-600">Info</span>
                    </div>
                    <div className="flex-1 text-center border-b-4 border-emerald-500 pb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-1 font-bold text-xs"><CheckCircle2 className="w-4 h-4" /></div>
                        <span className="text-[10px] font-bold text-emerald-600">Station</span>
                    </div>
                    <div className="flex-1 text-center border-b-4 border-emerald-500 pb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-1 font-bold text-xs"><CheckCircle2 className="w-4 h-4" /></div>
                        <span className="text-[10px] font-bold text-emerald-600">Products</span>
                    </div>
                    <div className="flex-1 text-center border-b-4 border-sky-600 pb-2">
                        <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center mx-auto mb-1 font-bold text-xs">4</div>
                        <span className="text-[10px] font-bold text-sky-600">OTP</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-100">
                        <ShieldAlert className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Verify Security OTP</h2>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                        Enter the 6-digit OTP sent to your registered mobile number for delivery verification.
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                        <p className="text-xs text-amber-800 font-bold mb-1 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> DEMO MODE — Use this OTP:
                        </p>
                        <span className="text-3xl font-black text-amber-900 tracking-[10px] ml-[10px]">{demoOtp}</span>
                    </div>

                    <div className="flex justify-center gap-3 mb-8">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={inputRefs[idx]}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                className="w-12 h-14 text-center text-2xl font-black border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-600/10 focus:border-sky-600 focus:outline-none transition-all font-mono"
                            />
                        ))}
                    </div>

                    <button 
                        onClick={handleVerify}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mb-4"
                    >
                        Verify & Confirm Delivery
                    </button>

                    <button 
                        onClick={() => navigate('/railway/products')}
                        className="text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto text-sm font-semibold"
                    >
                        <ChevronLeft className="w-4 h-4" /> Change Items
                    </button>
                    
                    <p className="mt-8 text-[10px] text-slate-400">
                        By confirming, you agree to receive the products at the selected station during the train's scheduled stop.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
