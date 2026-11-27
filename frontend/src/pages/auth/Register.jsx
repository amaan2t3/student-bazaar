import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  Lock, 
  Mail, 
  User, 
  GraduationCap, 
  Layers, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEGREES } from '../../data/academicData';
import Button from '../../components/common/Button';
import UniversitySelect from '../../components/common/UniversitySelect';
import  image  from '../../../src/assets/Logo-Icon.png';

export const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('BSCS');
  const [semester, setSemester] = useState('3');
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { registerUser, loading, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (!fullName.trim() || !email.trim() || !password || !university) {
      setLocalError('All academic registration fields are required.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters in length.');
      return;
    }

    try {
      const registration = await registerUser({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        university,
        degree,
        semester: Number(semester)
      });
      if (registration.requiresEmailConfirmation) {
        setSuccessMessage('Account created. Check your email and confirm your address before signing in.');
      } else {
        setSuccessMessage('Student account created successfully. Redirecting...');
        navigate(location.state?.from || '/browse', { replace: true });
      }
    } catch (err) {
      setLocalError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16     h-14 rounded-xl  flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
           <img src={image} alt="Logo" />
           </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Student Account
          </h2>
          <p className="text-xs text-slate-500">
            Join thousands of university computing students across Pakistan.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 bg-ivory border border-gold-soft rounded-xl text-xs text-navy flex items-center gap-2">
             <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
             <span>{localError || authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Muhammad Hamza"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
                required
              />
             </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              University Email <span className="text-red-500">*</span>
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

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password (Min. 8 characters) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
                required
              />
             </div>
          </div>

          {/* University Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your University <span className="text-red-500">*</span>
            </label>
            <div className="relative ">
              <UniversitySelect
                value={university}
                onChange={setUniversity}
                required
              />
             </div>
          </div>

          {/* Degree & Semester Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree Program <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:border-gold"
                >
                  {DEGREES.map((deg) => (
                    <option key={deg.id} value={deg.id}>{deg.id}</option>
                  ))}
                </select>
               </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Semester <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:border-gold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
               </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full shadow-md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </div>
        </form> 

        {/* Login Link */}
        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-gold hover:text-navy-mid underline">
            Sign In to your account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
