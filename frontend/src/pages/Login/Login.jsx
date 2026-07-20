import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight, Users, ShieldCheck, ShoppingBag, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const Login = () => {
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const handleLogin = async (email, password) => {
    setIsSubmitting(true);
    try {
      const user = await login({ email, password });
      toast.success(`Welcome back, ${user.fullName}! 🎉`);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data) => handleLogin(data.email, data.password);

  const handleGuestLogin = () => {
    loginAsGuest();
    toast.info('Browsing as Guest – add to cart requires login');
    navigate('/');
  };

  // Simulated Google OAuth (shows a prompt with fake Google profile)
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      // Simulate the OAuth flow — in production replace with actual Firebase/OAuth
      const googleProfiles = [
        { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', picture: 'https://i.pravatar.cc/150?img=12' },
        { name: 'Priya Mehta', email: 'priya.mehta@gmail.com', picture: 'https://i.pravatar.cc/150?img=47' },
        { name: 'Aarav Kapoor', email: 'aarav.kapoor@gmail.com', picture: 'https://i.pravatar.cc/150?img=32' },
      ];
      const profile = googleProfiles[Math.floor(Math.random() * googleProfiles.length)];

      // Use loginWithGoogle from context
      const { loginWithGoogle } = useAuthInstance;
      const user = await loginWithGoogle(profile);
      toast.success(`Welcome, ${user.fullName}! Signed in with Google ✨`);
      navigate('/');
    } catch (err) {
      toast.error('Google Sign-In failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // We need to access loginWithGoogle – fix the hook call
  const authCtx = useAuth();
  const useAuthInstance = authCtx;

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    const googleProfiles = [
      { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', picture: 'https://i.pravatar.cc/150?img=12' },
      { name: 'Priya Mehta', email: 'priya.mehta@gmail.com', picture: 'https://i.pravatar.cc/150?img=47' },
      { name: 'Aarav Kapoor', email: 'aarav.kapoor@gmail.com', picture: 'https://i.pravatar.cc/150?img=32' },
    ];
    const profile = googleProfiles[Math.floor(Math.random() * googleProfiles.length)];
    try {
      const user = await authCtx.loginWithGoogle(profile);
      toast.success(`Welcome, ${user.fullName}! Signed in with Google ✨`);
      navigate('/');
    } catch {
      toast.error('Google Sign-In failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 mb-6">
            <Store className="w-6 h-6 text-white" />
            <span className="text-white font-black text-xl tracking-tight">E-Cart India</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome Back!</h1>
          <p className="text-slate-400 font-medium">Sign in to continue shopping</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-8 shadow-2xl">


          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-300 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="your@email.com"
                  className={`w-full bg-white/10 border ${errors.email ? 'border-red-400' : 'border-white/20'} rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all font-medium`}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-300 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••"
                  className={`w-full bg-white/10 border ${errors.password ? 'border-red-400' : 'border-white/20'} rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all font-medium`}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn className="w-5 h-5" /> Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Google Sign In */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3.5 rounded-2xl transition-all"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center border-t border-white/10 pt-6">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Continue as Guest */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleGuestLogin}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl text-slate-300 font-bold transition-all hover:text-white group"
          >
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Continue as a Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
