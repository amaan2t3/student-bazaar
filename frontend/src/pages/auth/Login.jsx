import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import  image  from '../../../src/assets/Logo-Icon.png';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const { loginWithCredentials, requestPasswordReset, updatePassword, recoveryMode, loading, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setResetMessage('');

    if (!email.trim() || !password) {
      setLocalError('Please enter both your email address and password.');
      return;
    }

    try {
      const authenticatedUser = await loginWithCredentials(email.trim(), password);
      navigate(
        authenticatedUser.role === 'admin' ? '/admin/dashboard' : (location.state?.from || '/browse'),
        { replace: true }
      );
    } catch (err) {
      setLocalError(err.message || 'Invalid login credentials.');
    }
  };

  const handlePasswordReset = async () => {
    setLocalError('');
    setResetMessage('');
    if (!email.trim()) {
      setLocalError('Enter your email address first to receive a password reset link.');
      return;
    }

    try {
      await requestPasswordReset(email);
      setResetMessage('If an account exists for this email, a password reset link has been sent.');
    } catch (error) {
      setLocalError(error.message || 'Unable to send a password reset email.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (newPassword.length < 8) {
      setLocalError('Password must be at least 8 characters in length.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError('The passwords do not match.');
      return;
    }

    try {
      await updatePassword(newPassword);
      setResetMessage('Your password has been updated. Sign in with your new password.');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigate('/login', { replace: true });
    } catch (error) {
      setLocalError(error.message || 'Unable to update your password.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl  flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
           <img src={image} alt="Logo" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign in to student<span className="text-gold">Bazaar</span>
          </h2>
          <p className="text-xs text-slate-500">
            Access your purchased project packages, custom requests, and seller earnings.
          </p>
        </div>

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError || authError}</span>
          </div>
        )}
        {resetMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{resetMessage}</span>
          </div>
        )}

        {recoveryMode ? (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
              />
            </div>
            <Button type="submit" variant="primary" size="md" isLoading={loading} className="w-full shadow-md">
              Update Password
            </Button>
          </form>
        ) : (
        /* Login Form */
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
             </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <button type="button" onClick={handlePasswordReset} className="text-[11px] text-gold hover:underline">
                Forgot password?
              </button>
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
        )}

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
