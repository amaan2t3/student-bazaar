import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { loginWithCredentials, loading, authError } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password) {
      setLocalError('Please enter both your email address and password.');
      return;
    }

    try {
      await loginWithCredentials(email.trim(), password);
      navigate('/browse');
    } catch (err) {
      setLocalError(typeof err === 'string' ? err : 'Invalid login credentials.');
    }
  };

  // Helper to instantly fill demo student credentials
  const fillDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('DemoPass123!');
    setLocalError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gold text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
            <Code2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign in to student<span className="text-gold">Bazaar</span>
          </h2>
          <p className="text-xs text-slate-500">
            Access your purchased project packages, custom requests, and seller earnings.
          </p>
        </div>

        {/* Demo Persona Quick-Fill Banner (Ideal for University Project Evaluation) */}
        <div className="p-3 bg-ivory rounded-xl border border-gold-soft text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-navy">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Evaluation Quick-Fill:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('ali.raza@student.edu.pk')}
              className="py-1 px-1.5 bg-white hover:bg-gold-soft/30 text-navy font-semibold rounded border border-gold-soft text-[10px] truncate"
            >
              Buyer (Ali)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('usman.dev@student.edu.pk')}
              className="py-1 px-1.5 bg-white hover:bg-gold-soft/30 text-navy font-semibold rounded border border-gold-soft text-[10px] truncate"
            >
              Seller (Usman)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@studentbazaar.pk')}
              className="py-1 px-1.5 bg-white hover:bg-gold-soft/30 text-navy font-semibold rounded border border-gold-soft text-[10px] truncate"
            >
              Admin (Prof)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              University Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu.pk"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link will be sent to your email.'); }} className="text-[11px] text-gold hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            className="w-full shadow-md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Account
          </Button>
        </form>

        {/* Register Link */}
        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-gold hover:text-navy-mid underline">
            Register as a Student
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
