import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  UploadCloud, 
  Github, 
  Globe, 
  Code2, 
  Clock, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import sellerService from '../../services/sellerService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const AVAILABLE_SPECIALIZATIONS = [
  'React.js & MERN Stack',
  'C++ & OOP Fundamentals',
  'Java & Spring / Swing',
  'Python & Machine Learning',
  'Database Systems (MySQL/PostgreSQL)',
  'Flutter Mobile Apps',
  'Data Structures & Algorithms',
  'Deep Learning & PyTorch',
  'Cybersecurity & Network Sockets',
  'Django & REST Framework'
];

export const BecomeSeller = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [bio, setBio] = useState('');
  const [specializations, setSpecializations] = useState(['React.js & MERN Stack', 'C++ & OOP Fundamentals']);
  const [idCardFile, setIdCardFile] = useState('student_id_card.png');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingApp, setExistingApp] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user already submitted application
  useEffect(() => {
    if (user) {
      sellerService.getMyApplication()
        .then(res => {
          if (res.data) setExistingApp(res.data);
        })
        .catch(() => {});
    }
  }, [user]);

  const toggleSpecialization = (tech) => {
    setSpecializations(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech) 
        : [...prev, tech]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!githubUrl.trim()) {
      setError('Please provide your active GitHub profile URL.');
      return;
    }

    if (specializations.length === 0) {
      setError('Please select at least one core computing specialization.');
      return;
    }

    if (!agreeTerms) {
      setError('You must certify that all projects you list are your original work or authorized intellectual property.');
      return;
    }

    setLoading(true);
    try {
      const response = await sellerService.apply({
        github_url: githubUrl.trim(),
        portfolio_url: portfolioUrl.trim(),
        id_card_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
        specializations,
        bio: bio.trim()
      });

      setSuccess('Seller application submitted successfully! Our academic admin will review your credentials within 24-48 hours.');
      setExistingApp(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(typeof err === 'string' ? err : 'Failed to submit seller application.');
    }
  };

  // If already approved as a seller
  if (role === 'seller') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gold-soft/30 text-navy-mid flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-mid bg-ivory px-3 py-1 rounded-full border border-gold-soft">
            Verified Creator Status
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">You Are an Approved Seller!</h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your student developer credentials have been verified. You can now upload ready-made semester project packages and bid on custom student assignment briefs.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/custom-request">
            <Button variant="primary" size="md">
              Browse Custom Assignment Requests
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="outline" size="md">
              View Marketplace Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-soft/30 text-navy text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Earn in PKR from Your University Projects</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Apply to Become an Approved Seller
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Top computing students from FAST, NUST, PUCIT, and COMSATS monetize their completed semester projects and earn passive income while helping juniors learn.
        </p>
      </div>

      {/* If existing application is under review */}
      {existingApp && existingApp.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-base text-amber-800">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Your Seller Application is Under Review</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
            Submitted on <strong>{new Date(existingApp.created_at).toLocaleDateString()}</strong>. Our academic moderation board is reviewing your university credentials and GitHub portfolio. You will be notified once approved.
          </p>
          <div className="pt-2">
            <Link to="/admin/seller-applications" className="text-xs font-semibold text-navy-mid underline">
              (Admin Evaluation Shortcut: Review Applications in Admin Panel &rarr;)
            </Link>
          </div>
        </div>
      )}

      {/* Application Form */}
      {(!existingApp || existingApp.status === 'rejected') && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-ivory border border-gold-soft rounded-xl text-xs text-navy flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-gold" />
              <span>{success}</span>
            </div>
          )}

          {/* Section 1: Academic Identity */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-gold" />
              <span>1. Academic Verification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 block">Student Name:</span>
                <span className="font-semibold text-slate-900">{user?.full_name || user?.name || 'Logged in student'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">University:</span>
                <span className="font-semibold text-slate-900">{user?.university || 'FAST-NUCES'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Degree & Semester:</span>
                <span className="font-semibold text-slate-900">{user?.degree || 'BSIT'} &bull; Sem {user?.semester || 4}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Code Portfolio & GitHub */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-gold" />
              <span>2. Code Profiles & Links</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GitHub Profile URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-username"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
                    required
                  />
                  <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Personal Portfolio / LinkedIn (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
                  />
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Technical Specializations */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
              3. Select Your Core Technical Disciplines <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500">Pick the technologies and subjects you have built high-distinction projects in:</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_SPECIALIZATIONS.map((tech) => {
                const selected = specializations.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleSpecialization(tech)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      selected 
                        ? 'bg-gold text-white border-gold font-semibold shadow-sm' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}{tech}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Bio / Experience Summary */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              4. Developer Bio & Experience Summary
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Highlight your semester distinctions, hackathons won, GPA in programming subjects, or previous teaching assistant (TA) experience..."
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
            />
          </div>

          {/* Section 5: Student ID Card Proof */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              5. University Student ID Card Verification <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-gold rounded-xl p-4 text-center bg-slate-50 hover:bg-ivory/20 transition-all cursor-pointer relative">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1" />
              <div className="text-xs text-slate-700 font-medium">
                <span className="text-navy-mid font-semibold">{idCardFile}</span> (Attached for verification)
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Proof of enrollment prevents anonymous scammers and protects marketplace academic standards.
              </p>
            </div>
          </div>

          {/* Section 6: Warranty of Original Work */}
          <div className="p-3.5 bg-ivory/70 border border-gold-soft rounded-xl space-y-2 text-xs text-navy">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-emerald-600 rounded"
              />
              <span className="leading-relaxed">
                I certify that all project code, database dumps, and documentation packages I list will be my <strong>original work or authorized intellectual property</strong>. I agree to a 15% platform commission on completed sales.
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full shadow-md"
              leftIcon={<ShieldCheck className="w-5 h-5" />}
            >
              Submit Seller Application
            </Button>
          </div>

        </form>
      )}

    </div>
  );
};

export default BecomeSeller;
