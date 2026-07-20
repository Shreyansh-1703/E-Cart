import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Lock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { authService } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: 'CUSTOMER'
      });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md my-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium">Back to Login</span>
        </Link>
        
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 lg:p-12 border border-slate-100 animate-fade-in">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl mb-4">
              <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">Join our exclusive shopping club</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <input 
                  type="text" 
                  {...register('fullName', { required: 'Full name is required' })}
                  placeholder="John Doe"
                  className={`w-full bg-slate-50 border ${errors.fullName ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-900 font-medium`}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs ml-1 font-medium">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <input 
                  type="email" 
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  placeholder="john@example.com"
                  className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-900 font-medium`}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              {errors.email && <p className="text-red-500 text-xs ml-1 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border ${errors.password ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-900 font-medium`}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              {errors.password && <p className="text-red-500 text-xs ml-1 font-medium">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border ${errors.confirmPassword ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-900 font-medium`}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs ml-1 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full btn-primary py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary-200 disabled:opacity-70 disabled:shadow-none flex items-center justify-center gap-2 group mt-4"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-slate-500 font-medium">
              By joining, you agree to our {' '}
              <Link to="/privacy" className="text-primary-600 hover:underline">Terms & Conditions</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
