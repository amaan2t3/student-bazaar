import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileCode2, 
  Database, 
  FileText, 
  Terminal, 
  ArrowRight, 
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { DEGREES, SEMESTERS, SUBJECTS_BY_DEGREE, CATEGORIES } from '../../data/academicData';
import { useAuth } from '../../context/AuthContext';
import projectService from '../../services/projectService';
import Button from '../../components/common/Button';
import { isSupabaseConfigured, supabase } from '../../services/supabase';

export const AddProject = () => {
  const { role } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = role === 'admin';
  const isEditing = Boolean(id);

  // Wizard Step State
  const [step, setStep] = useState(1);

  // Form Fields
  const [degree, setDegree] = useState('BSCS');
  const [semester, setSemester] = useState('4');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [category, setCategory] = useState('Database Management Systems');
  const [technologies, setTechnologies] = useState('');
  const [featuresList, setFeaturesList] = useState([]);
  const [additionalPackageIncludes, setAdditionalPackageIncludes] = useState([]);

  // Deliverables
  const [hasSourceCode, setHasSourceCode] = useState(false);
  const [hasDatabaseDump, setHasDatabaseDump] = useState(false);
  const [hasSRS, setHasSRS] = useState(false);
  const [hasDiagrams, setHasDiagrams] = useState(false);
  const [hasSlides, setHasSlides] = useState(false);

  // Setup Guide
  const [installationGuide, setInstallationGuide] = useState('');
  const [prerequisites, setPrerequisites] = useState('');

  // Pricing & Media
  const [pricePKR, setPricePKR] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [imageInputType, setImageInputType] = useState('url');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(isEditing);
  const [error, setError] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [projectLoadError, setProjectLoadError] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    let active = true;
    projectService.getAdminProject(id)
      .then((response) => {
        if (!active) return;
        const project = response.data;
        if (!project) throw new Error('Project not found.');
        setDegree(project.degree || '');
        setSemester(String(project.semester || ''));
        setSubject(project.subject || '');
        setDifficulty(project.difficulty || 'intermediate');
        setTitle(project.title || '');
        setSummary(project.summary || '');
        setDetailedDescription(project.detailed_description || '');
        setCategory(project.category || '');
        setTechnologies((project.technologies || []).join(', '));
        setFeaturesList(project.features_list || []);
        const includes = project.package_includes || [];
        const knownIncludes = [
          'Complete Runnable Source Code (.zip)',
          'Database SQL Schema & Sample Seed Data',
          'Comprehensive SRS Documentation (PDF)',
          'Normalized ER & UML Architecture Diagrams',
          'Viva Defense Presentation Slides (PPTX)'
        ];
        setHasSourceCode(includes.some((item) => item.name === knownIncludes[0]));
        setHasDatabaseDump(includes.some((item) => item.name === knownIncludes[1]));
        setHasSRS(includes.some((item) => item.name === knownIncludes[2]));
        setHasDiagrams(includes.some((item) => item.name === knownIncludes[3]));
        setHasSlides(includes.some((item) => item.name === knownIncludes[4]));
        setAdditionalPackageIncludes(includes.filter((item) => !knownIncludes.includes(item.name)));
        setInstallationGuide(project.installation_guide || '');
        setPrerequisites((project.system_prerequisites || []).join(', '));
        setPricePKR(String(project.price_pkr ?? ''));
        setScreenshotUrl(project.screenshots?.[0] || '');
        setDemoVideoUrl(project.demo_video_url || '');
      })
      .catch((loadError) => {
        if (active) setProjectLoadError(loadError.message || String(loadError));
      })
      .finally(() => {
        if (active) setLoadingProject(false);
      });
    return () => { active = false; };
  }, [id, isEditing]);

  // Dynamic available subjects
  const availableSubjects = (degree && semester && SUBJECTS_BY_DEGREE[degree]?.[semester])
    ? SUBJECTS_BY_DEGREE[degree][semester]
    : [];

  if (loadingProject) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading project details...</div>;
  }

  if (projectLoadError) {
    return (
      <div role="alert" className="max-w-3xl mx-auto p-8 text-center text-sm text-red-700">
        {projectLoadError}
        <div className="mt-4"><Link to="/admin/projects" className="underline">Return to projects</Link></div>
      </div>
    );
  }

  const handleNextStep = () => {
    setError('');
    if (step === 1 && !subject) {
      setError('Please select a course/subject.');
      return;
    }
    if (step === 2 && (!title.trim() || !summary.trim() || !detailedDescription.trim())) {
      setError('Title, Summary, and Detailed Description are required.');
      return;
    }
    if (step === 4 && !installationGuide.trim()) {
      setError('A step-by-step setup guide is mandatory to help buyers run your code.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Number(pricePKR) < 500) {
      setError('Minimum project price is PKR 500.');
      return;
    }

    setLoading(true);

    const packageIncludes = [...additionalPackageIncludes];
    if (hasSourceCode) packageIncludes.push({ name: 'Complete Runnable Source Code (.zip)', ready: true });
    if (hasDatabaseDump) packageIncludes.push({ name: 'Database SQL Schema & Sample Seed Data', ready: true });
    if (hasSRS) packageIncludes.push({ name: 'Comprehensive SRS Documentation (PDF)', ready: true });
    if (hasDiagrams) packageIncludes.push({ name: 'Normalized ER & UML Architecture Diagrams', ready: true });
    if (hasSlides) packageIncludes.push({ name: 'Viva Defense Presentation Slides (PPTX)', ready: true });

    try {
      let projectImageUrl = screenshotUrl.trim();
      if (screenshotFile) {
        if (!isSupabaseConfigured) {
          throw new Error('Configure Supabase before uploading a project image.');
        }
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('Sign in again before uploading a project image.');
        const safeName = screenshotFile.name.replace(/[^a-zA-Z0-9._-]/g, '-');
        const storagePath = `${user.id}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(storagePath, screenshotFile, { contentType: screenshotFile.type, upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('project-images').getPublicUrl(storagePath);
        projectImageUrl = data.publicUrl;
      }

      const projectData = {
        title: title.trim(),
        summary: summary.trim(),
        detailed_description: detailedDescription.trim(),
        category,
        degree,
        semester: Number(semester),
        subject,
        difficulty,
        price_pkr: Number(pricePKR),
        technologies: technologies.split(',').map(t => t.trim()),
        screenshots: projectImageUrl ? [projectImageUrl] : [],
        demo_video_url: demoVideoUrl.trim() || null,
        features_list: featuresList,
        installation_guide: installationGuide.trim(),
        system_prerequisites: prerequisites.split(',').map(p => p.trim()),
        package_includes: packageIncludes
      };
      if (isEditing) {
        await projectService.updateAdminProject(id, projectData);
      } else {
        await projectService.createProject(projectData);
      }

      setLoading(false);
      setSuccessModal(true);
    } catch (err) {
      setLoading(false);
      setError(typeof err === 'string' ? err : err.message || (isEditing ? 'Failed to update project.' : 'Failed to publish project listing.'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-soft/30 text-navy text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Seller Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEditing ? 'Edit Ready-Made Project' : isAdmin ? 'Add Ready-Made Project' : 'Upload Ready-Made Project Package'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isEditing
              ? 'Update project details and its marketplace image.'
              : isAdmin
              ? 'Add a project to the marketplace from the administration panel.'
              : 'Publish your completed semester project with source code, schemas, and IEEE SRS documentation.'}
          </p>
        </div>

      </div>

      {/* Wizard Progress Steps Bar */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
        {[
          { num: 1, label: 'Curriculum' },
          { num: 2, label: 'Metadata' },
          { num: 3, label: 'Package' },
          { num: 4, label: 'Setup Guide' },
          { num: 5, label: 'Pricing (PKR)' }
        ].map((s) => (
          <div 
            key={s.num}
            className={`pb-2 border-b-2 transition-colors ${
              step === s.num 
                ? 'border-gold text-navy-mid font-bold' 
                : step > s.num 
                ? 'border-emerald-400 text-gold' 
                : 'border-slate-200 text-slate-400'
            }`}
          >
            Step {s.num}: {s.label}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Wizard Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        {/* STEP 1: Academic Course Alignment */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Step 1: Academic Alignment (Pakistani University Syllabi)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Degree Program <span className="text-red-500">*</span>
                </label>
                <select
                  value={degree}
                  onChange={(e) => {
                    setDegree(e.target.value);
                    setSubject('');
                  }}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
                >
                  {DEGREES.map((deg) => (
                    <option key={deg.id} value={deg.id}>{deg.id} ({deg.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Semester <span className="text-red-500">*</span>
                </label>
                <select
                  value={semester}
                  onChange={(e) => {
                    setSemester(e.target.value);
                    setSubject('');
                  }}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
                >
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course / Subject <span className="text-red-500">*</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
                  required
                >
                  <option value="">Select course...</option>
                  {availableSubjects.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
                >
                  <option value="beginner">Beginner (Sem 1-2)</option>
                  <option value="intermediate">Intermediate (Sem 3-5)</option>
                  <option value="advanced">Advanced / Capstone (Sem 6-8)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Project Metadata */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Step 2: Title, Description & Technologies
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Hospital Management System with 3NF Normalized Schema & C# GUI"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Summary (Max 2 sentences) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary displayed on marketplace search cards..."
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Scope & Architectural Features <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                placeholder="Explain the modules implemented, user roles (Student, Teacher, Admin), database tables count, design patterns used..."
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="e.g., MySQL, C#, .NET, Crystal Reports"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Package Deliverables Checklist */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Step 3: What Is Included in This Package?
            </h3>
            <p className="text-xs text-slate-500">
              studentBazaar enforces strict deliverable standards. Select the components bundled inside your zip package:
            </p>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSourceCode}
                  onChange={(e) => setHasSourceCode(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <FileCode2 className="w-5 h-5 text-gold shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Complete Runnable Source Code (.zip)</span>
                  <span className="text-slate-500">Commented, modular, with zero missing dependencies.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDatabaseDump}
                  onChange={(e) => setHasDatabaseDump(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <Database className="w-5 h-5 text-gold shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Database Script (.sql / mongo-dump)</span>
                  <span className="text-slate-500">Includes create table schemas, stored procedures, and sample seed records.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSRS}
                  onChange={(e) => setHasSRS(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <FileText className="w-5 h-5 text-gold shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Software Requirements Specification (SRS PDF)</span>
                  <span className="text-slate-500">IEEE 830 formatted document with functional & non-functional requirements.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDiagrams}
                  onChange={(e) => setHasDiagrams(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <Sparkles className="w-5 h-5 text-gold shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Architecture & ER Diagrams (High Res)</span>
                  <span className="text-slate-500">Normalized ERD (1NF, 2NF, 3NF proofs) and UML class diagrams.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSlides}
                  onChange={(e) => setHasSlides(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <FileText className="w-5 h-5 text-gold shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Viva Defense Presentation Slides (PPTX)</span>
                  <span className="text-slate-500">Ready-to-present PowerPoint deck for university semester evaluation.</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: Installation Guide */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Step 4: System Prerequisites & Step-by-Step Setup
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required Tools / Software (Comma Separated)
              </label>
              <input
                type="text"
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
                placeholder="e.g., Visual Studio 2022, MySQL 8.0, Node.js 18+"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Step-by-Step Installation Walkthrough <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                value={installationGuide}
                onChange={(e) => setInstallationGuide(e.target.value)}
                placeholder="1. Extract the downloaded zip file&#10;2. Open your terminal or Visual Studio&#10;3. Import the SQL file in MySQL Workbench&#10;4. Press Run..."
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 font-mono focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>
        )}

        {/* STEP 5: Pricing in PKR & Media */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Step 5: Pricing (PKR) & Screenshots
            </h3>

            <div className="bg-ivory border border-gold-soft p-4 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-emerald-900 uppercase">
                Fixed Project Price (PKR) <span className="text-red-500">*</span>
              </label>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  min="500"
                  step="250"
                  value={pricePKR}
                  onChange={(e) => setPricePKR(e.target.value)}
                  className="w-full text-base font-bold bg-white border border-emerald-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-gold"
                  required
                />
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rs</span>
              </div>
              <div className="text-[11px] text-navy space-y-0.5">
                <div>&bull; Minimum price allowed: <strong>PKR 500</strong></div>
                <div>&bull; Platform commission: <strong>15%</strong> (You receive <strong>PKR {Math.round(Number(pricePKR) * 0.85).toLocaleString()}</strong> upon sale)</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Project image (optional)
              </label>
              <div className="flex gap-4 mb-3 text-xs">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="project-image-source"
                    checked={imageInputType === 'url'}
                    onChange={() => { setImageInputType('url'); setScreenshotFile(null); }}
                  />
                  Image URL
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="project-image-source"
                    checked={imageInputType === 'file'}
                    onChange={() => setImageInputType('file')}
                  />
                  Upload image
                </label>
              </div>
              {imageInputType === 'url' ? (
                <input
                  type="url"
                  value={screenshotUrl}
                  onChange={(e) => { setScreenshotUrl(e.target.value); setScreenshotFile(null); }}
                  placeholder="https://example.com/project-image.png"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file && (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024)) {
                      setError('Choose an image file no larger than 5 MB.');
                      e.target.value = '';
                      setScreenshotFile(null);
                      return;
                    }
                    setError('');
                    setScreenshotFile(file);
                  }}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
                />
              )}
              {screenshotFile && <p className="mt-1 text-xs text-slate-500">{screenshotFile.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Demo Video Walkthrough URL (YouTube/Vimeo, Optional)
              </label>
              <input
                type="url"
                value={demoVideoUrl}
                onChange={(e) => setDemoVideoUrl(e.target.value)}
                placeholder="https://youtu.be/your-video-link"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        )}

        {/* Wizard Navigation Actions */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="outline" size="md" onClick={handlePrevStep} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          ) : <div></div>}

          {step < 5 ? (
            <Button variant="primary" size="md" onClick={handleNextStep} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Step {step + 1}
            </Button>
          ) : (
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleSubmit} 
              isLoading={loading}
              className="shadow-md"
              leftIcon={<UploadCloud className="w-5 h-5" />}
            >
              {isEditing ? 'Save Project Changes' : isAdmin ? 'Publish Ready-Made Project' : 'Submit for Admin Review'}
            </Button>
          )}
        </div>

      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-gold-soft/30 text-navy-mid flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                {isEditing ? 'Project Updated' : isAdmin ? 'Project Published!' : 'Project Submitted for Review!'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isEditing
                  ? <>Changes to <strong>"{title}"</strong> have been saved.</>
                  : isAdmin
                  ? <>Your listing <strong>"{title}"</strong> has been published to the marketplace.</>
                  : <>Your listing <strong>"{title}"</strong> has been queued for admin code inspection. Once verified, it will be published to the marketplace.</>}
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link to={isAdmin ? '/admin/projects' : '/seller/my-projects'}>
                <Button variant="primary" className="w-full">
                  {isAdmin ? 'Manage Ready-Made Projects' : 'Go to My Projects Studio'}
                </Button>
              </Link>
              {!isAdmin && (
                <Link to="/admin/projects">
                  <Button variant="ghost" className="w-full text-xs text-amber-700">
                    (Admin Evaluation Shortcut: Moderate in Admin Panel &rarr;)
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddProject;
