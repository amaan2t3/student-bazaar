import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  UploadCloud, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import customRequestService from '../../services/customRequestService';
import { DEGREES, SEMESTERS, SUBJECTS_BY_DEGREE, getUniversityPricingTier } from '../../data/mockAcademicData';
import Button from '../../components/common/Button';
import UniversitySelect from '../../components/common/UniversitySelect';

const PROJECT_LEVELS = [
  { id: 'simple', name: 'Simple', basePrice: 2500, description: 'A focused project with core features.' },
  { id: 'modern', name: 'Modern', basePrice: 4500, description: 'A polished project with current tools and expanded features.' },
  { id: 'premium', name: 'Premium', basePrice: 7500, description: 'A comprehensive project with advanced features and support.' }
];

const DELIVERABLE_BUNDLES = [
  { id: 'project_only', name: 'Project only', extraPrice: 0 },
  { id: 'project_with_ppt', name: 'Project + PPT file', extraPrice: 1500 },
  { id: 'project_ppt_meet', name: 'Project + PPT + Google Meet overview', extraPrice: 2500 }
];

export const CustomProjectRequest = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [university, setUniversity] = useState(user?.university || '');
  const [degree, setDegree] = useState('BSCS');
  const [semester, setSemester] = useState('4');
  const [subject, setSubject] = useState('');
  const [projectLevel, setProjectLevel] = useState('simple');
  const [deliverableBundle, setDeliverableBundle] = useState('project_only');
  const [detailedScope, setDetailedScope] = useState('');
  const [deadline, setDeadline] = useState('2026-12-10');
  const [technologies, setTechnologies] = useState('React.js, Node.js, MongoDB');
  const [attachmentName, setAttachmentName] = useState(null);
  const [agreeIntegrity, setAgreeIntegrity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedLevel = PROJECT_LEVELS.find((level) => level.id === projectLevel);
  const selectedBundle = DELIVERABLE_BUNDLES.find((bundle) => bundle.id === deliverableBundle);
  const selectedUniversity = university.trim();
  const universityTier = getUniversityPricingTier(selectedUniversity);
  const priceIncrease = universityTier === 'high' ? 0.1 : 0.05;
  const pricePKR = Math.round((selectedLevel.basePrice + selectedBundle.extraPrice) * (1 + priceIncrease));

  // Dynamically available subjects
  const availableSubjects = (degree && semester && SUBJECTS_BY_DEGREE[degree]?.[semester])
    ? SUBJECTS_BY_DEGREE[degree][semester]
    : [];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError('Assignment file must be under 15MB');
        return;
      }
      setAttachmentName(file.name);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedUniversity || !detailedScope.trim() || !subject) {
      setError('Please fill in all required academic fields (Title, Subject, Scope).');
      return;
    }
    if (!user) {
      setError('Please sign in as a buyer to submit your custom project request.');
      return;
    }
    if (!agreeIntegrity) {
      setError('You must acknowledge the Academic Integrity & Learning policy.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await customRequestService.create({
        title: title.trim(),
        university: selectedUniversity,
        degree,
        semester: Number(semester),
        subject,
        project_level: projectLevel,
        deliverable_bundle: deliverableBundle,
        detailed_scope: detailedScope.trim(),
        deadline,
        attachment_urls: attachmentName ? [attachmentName] : [],
        technologies_needed: technologies.split(',').map((technology) => technology.trim()).filter(Boolean)
      });
      setSubmitted(true);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to submit your custom project request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-soft/30 text-navy text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>University Assignment & Project Bidding</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Request a Custom Academic Project
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Submit your semester project prompt, rubrics, and deadline. Approved senior developers will review your requirements and submit milestone proposals.
        </p>
      </div>

      {submitted ? (
        /* Submission Success Card */
        <div className="bg-white rounded-2xl border border-gold-soft p-8 sm:p-10 shadow-lg text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-gold-soft/30 text-navy-mid flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Custom Request Published!</h2>
            <p className="text-sm text-slate-600">
              Your request: <strong>"{title}"</strong> has been queued for admin review.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 max-w-md mx-auto text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Degree & Semester:</span>
              <span className="font-semibold text-slate-800">{degree} &bull; Semester {semester}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Subject:</span>
              <span className="font-semibold text-slate-800">{subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Price:</span>
              <span className="font-bold text-navy-mid">Rs. {pricePKR.toLocaleString()} PKR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">University:</span>
              <span className="font-semibold text-slate-800">{selectedUniversity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Package:</span>
              <span className="font-semibold text-slate-800">{selectedBundle.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Deadline:</span>
              <span className="font-semibold text-slate-800">{deadline}</span>
            </div>
            {attachmentName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Rubric Attachment:</span>
                <span className="font-mono text-navy-mid font-semibold">{attachmentName}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Approved sellers with matching skills will now submit proposals with their approach, delivery timeframe, and milestone breakdown.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <Button variant="primary" onClick={() => setSubmitted(false)}>
              Submit Another Request
            </Button>
          </div>
        </div>
      ) : (
        /* The Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
              1. Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., MERN Stack Student Portal with Real-Time Chat & Socket.io"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold-soft/30"
              required
            />
          </div>

          {/* Section 2: Academic Curriculum Alignment */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider">
              2. Academic Course Context <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">University</label>
                <UniversitySelect
                  value={university}
                  onChange={setUniversity}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Degree</label>
                <select
                  value={degree}
                  onChange={(e) => {
                    setDegree(e.target.value);
                    setSubject('');
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-gold"
                >
                  {DEGREES.map((deg) => (
                    <option key={deg.id} value={deg.id}>
                      {deg.id} ({deg.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => {
                    setSemester(e.target.value);
                    setSubject('');
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-gold"
                >
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-gold"
                  required
                >
                  <option value="">Select Course...</option>
                  {availableSubjects.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Project level and deliverables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
                Project Level
              </label>
              <select
                value={projectLevel}
                onChange={(e) => setProjectLevel(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-gold"
              >
                {PROJECT_LEVELS.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name} — Rs. {level.basePrice.toLocaleString()}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">{selectedLevel.description}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
                Deliverables
              </label>
              <select
                value={deliverableBundle}
                onChange={(e) => setDeliverableBundle(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-gold"
              >
                {DELIVERABLE_BUNDLES.map((bundle) => (
                  <option key={bundle.id} value={bundle.id}>
                    {bundle.name}{bundle.extraPrice ? ` (+ Rs. ${bundle.extraPrice.toLocaleString()})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="rounded-xl border border-gold-soft bg-ivory/50 p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-navy">
                {universityTier === 'high' ? 'High-tier' : 'Low-tier'} price for {selectedUniversity || 'your university'}
              </p>
              <p className="text-[10px] text-slate-500">
                {universityTier === 'high' ? '10%' : '5%'} university rate applied to the selected package.
              </p>
            </div>
            <p className="text-lg font-extrabold text-navy">Rs. {pricePKR.toLocaleString()}</p>
          </div>

          {/* Section 3: Scope & Assignment Rubric */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
              3. Assignment Requirements & Features <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={detailedScope}
              onChange={(e) => setDetailedScope(e.target.value)}
              placeholder="Paste the assignment description, specific classes/methods required, database schemas expected, or special instructions from your professor..."
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold-soft/30"
              required
            />
          </div>

          {/* Section 4: File Upload (Lab Manual / PDF) */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
              4. Upload Assignment Rubric / PDF (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-gold rounded-xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-ivory/30 transition-all relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.zip,.png,.jpg"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1" />
              <div className="text-xs text-slate-700 font-medium">
                {attachmentName ? (
                  <span className="text-navy-mid font-semibold">{attachmentName} (Attached)</span>
                ) : (
                  <span>Click or drag and drop your assignment document here (PDF, DOCX up to 15MB)</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Encrypted and shared only with approved bidding sellers.</p>
            </div>
          </div>

          {/* Submission Deadline */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
              5. Submission Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-gold"
              required
            />
          </div>

          {/* Section 6: Tech Preferences */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
              6. Required Frameworks / Technologies
            </label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g., C++, Java Swing, React.js, Python, PostgreSQL"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-gold"
            />
          </div>

          {/* Section 7: Academic Integrity Agreement */}
          <div className="p-3.5 bg-ivory/70 border border-gold-soft rounded-xl space-y-2 text-xs text-navy">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeIntegrity}
                onChange={(e) => setAgreeIntegrity(e.target.checked)}
                className="mt-0.5 accent-emerald-600 rounded"
              />
              <span className="leading-relaxed">
                I agree that this custom deliverable will be used as a <strong>reference framework and learning model</strong> to understand how to design and build the system. I will not engage in unauthorized submission where prohibited.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            {!user && (
              <p className="text-xs text-center text-slate-600 mb-3">
                You can browse requests without an account. To submit, <Link to="/login" className="font-semibold text-gold underline">sign in</Link> or <Link to="/register" className="font-semibold text-gold underline">create an account</Link>.
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={submitting}
              className="w-full shadow-md"
              leftIcon={<Sparkles className="w-5 h-5" />}
            >
              Post Request for Bidding
            </Button>
          </div>

        </form>
      )}

    </div>
  );
};

export default CustomProjectRequest;
