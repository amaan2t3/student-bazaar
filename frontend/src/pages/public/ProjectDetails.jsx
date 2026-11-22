import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  CheckCircle2, 
  FileText, 
  Database, 
  Code2, 
  ShieldCheck, 
  Download, 
  Terminal, 
  UserCircle, 
  Award, 
  Clock, 
  ArrowLeft,
  Share2,
  Sparkles,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import CheckoutModal from '../../components/modals/CheckoutModal';
import projectService from '../../services/projectService';

export const ProjectDetails = () => {
  const { slug } = useParams();
  const { addToCart, isInCart, toggleWishlist, isInWishlist } = useCart();
  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'package' | 'installation' | 'reviews'
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setProjectLoading(true);
    setProjectError('');
    projectService.getProjectBySlug(slug)
      .then((response) => {
        if (active) {
          setProject(response.data);
          setActiveImageIndex(0);
        }
      })
      .catch((error) => {
        if (active) {
          setProject(null);
          setProjectError(typeof error === 'string' ? error : 'Failed to load project details.');
        }
      })
      .finally(() => {
        if (active) setProjectLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (projectLoading) {
    return <p className="py-16 text-center text-sm text-slate-500">Loading project details...</p>;
  }

  if (projectError || !project) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">Project unavailable</h1>
        <p role="alert" className="mt-2 text-sm text-slate-600">
          {projectError || 'This project could not be found.'}
        </p>
        <Link to="/browse" className="mt-5 inline-block text-sm font-semibold text-navy-mid hover:underline">
          Browse available projects
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(project.id);
  const inCart = isInCart(project.id);

  // Simulated instant purchase & download handler launches CheckoutModal
  const handleInstantBuy = () => {
    setCheckoutModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/browse?degree=${project.degree}`} className="hover:text-gold transition-colors">{project.degree}</Link>
        <span>/</span>
        <Link to={`/browse?degree=${project.degree}&semester=${project.semester}`} className="hover:text-gold transition-colors">Semester {project.semester}</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-[200px]">{project.title}</span>
      </nav>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: 7 to 8 Columns (Project Media & Detailed Tabs) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Title & Academic Metadata */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-ivory text-navy font-bold text-xs px-2.5 py-1 rounded-full border border-gold-soft">
                {project.degree} &bull; Semester {project.semester}
              </span>
              <span className="bg-slate-100 text-slate-700 font-medium text-xs px-2.5 py-1 rounded-full border border-slate-200">
                {project.subject}
              </span>
              <span className="bg-gold text-white font-medium text-xs px-2 py-0.5 rounded-full">
                {project.difficulty}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{project.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({project.reviewsCount} ratings)</span>
              </div>
              <span>&bull;</span>
              <span>Total Sales: <strong>{project.seller.salesCount} packages</strong></span>
            </div>
          </div>

          {/* Screenshots Gallery */}
          <div className="space-y-3">
            {project.screenshots.length > 0 ? (
              <>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm relative group">
                  <img
                    src={project.screenshots[activeImageIndex]}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-md font-medium">
                    Screenshot {activeImageIndex + 1} of {project.screenshots.length}
                  </div>
                </div>
                {project.screenshots.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {project.screenshots.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-20 sm:w-24 aspect-video rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                          activeImageIndex === idx
                            ? 'border-gold shadow-sm ring-2 ring-gold-soft/30 scale-105'
                            : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-video w-full rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center text-sm text-slate-500">
                No project image provided.
              </div>
            )}
          </div>

          {/* Tabbed Content Navigation */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-200 overflow-x-auto text-xs sm:text-sm font-medium">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 sm:px-6 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'overview'
                    ? 'border-gold text-navy-mid font-semibold bg-ivory/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Project Overview & Features
              </button>
              <button
                onClick={() => setActiveTab('package')}
                className={`px-4 sm:px-6 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'package'
                    ? 'border-gold text-navy-mid font-semibold bg-ivory/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Package Contents Checklist ({project.packageIncludes.length})
              </button>
              <button
                onClick={() => setActiveTab('installation')}
                className={`px-4 sm:px-6 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'installation'
                    ? 'border-gold text-navy-mid font-semibold bg-ivory/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Prerequisites & Setup Guide
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 sm:px-6 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-gold text-navy-mid font-semibold bg-ivory/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Student Reviews ({project.reviewsCount})
              </button>
            </div>

            {/* TAB PANELS */}
            <div className="p-6 text-sm text-slate-700 leading-relaxed">
              
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">Detailed Scope</h3>
                    <p className="whitespace-pre-line text-slate-600 leading-relaxed text-xs sm:text-sm">
                      {project.detailedDescription}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">Technologies & Architecture</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-800 font-medium px-3 py-1 rounded-lg text-xs border border-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-ivory rounded-xl p-4 border border-gold-soft text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-navy">
                      <ShieldCheck className="w-4 h-4 text-gold" />
                      Academic Defense Ready
                    </div>
                    <p className="text-navy/90 leading-relaxed">
                      This project package has been verified by the studentBazaar moderation board to compile cleanly and adhere to university grading standards.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Package Contents Checklist */}
              {activeTab === 'package' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    When you purchase this package, you receive instant, perpetual access to the complete digital archive:
                  </p>
                  <div className="space-y-2.5">
                    {project.packageIncludes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-slate-800">{item.name}</span>
                        <span className="ml-auto text-[10px] bg-gold-soft/30 text-navy px-2 py-0.5 rounded font-semibold">
                          VERIFIED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Installation & Prerequisites */}
              {activeTab === 'installation' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">System Prerequisites</h3>
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {project.systemRequirements.map((req, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-600">
                          <Terminal className="w-4 h-4 text-gold shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">Quick Run Summary</h3>
                    <div className="bg-slate-900 text-gold-soft p-4 rounded-xl font-mono text-xs overflow-x-auto">
                      <code>{project.installationSummary}</code>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      * Full illustrated step-by-step setup walkthrough PDF is included inside the root of the downloadable zip package.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 4: Student Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xl font-bold text-slate-900">{project.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-500 ml-1">out of 5 stars</span>
                    </div>
                  </div>
                  {project.reviewsCount === 0 && (
                    <p className="text-sm text-slate-500">No reviews yet.</p>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 to 5 Columns (Sticky Purchase & Seller Card) */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
          
          {/* Purchase Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Fixed Project Price (PKR)</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-slate-900">
                  Rs. {project.pricePKR.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">PKR</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <Button
                variant="primary"
                size="lg"
                onClick={handleInstantBuy}
                className="w-full text-base shadow-md shadow-emerald-700/10"
                leftIcon={<Download className="w-5 h-5" />}
              >
                Buy Now & Instant Download
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addToCart(project)}
                  className="w-full"
                >
                  {inCart ? 'In Cart ✓' : 'Add to Cart'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWishlist(project.id)}
                  className={`w-full ${wishlisted ? 'text-red-600' : ''}`}
                >
                  <Heart className={`w-4 h-4 mr-1.5 ${wishlisted ? 'fill-current' : ''}`} />
                  {wishlisted ? 'Saved' : 'Wishlist'}
                </Button>
              </div>
            </div>

            {/* Guarantees List */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>Instant pre-signed secure download link</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                <span>Zero broken dependencies guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold shrink-0" />
                <span>Editable SRS Word / PDF document</span>
              </div>
            </div>
          </div>

          {/* Seller Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Student Creator
            </h4>

            <div className="flex items-center gap-3">
              <img
                src={project.seller.avatar}
                alt={project.seller.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gold shadow-sm"
              />
              <div>
                <h5 className="font-bold text-slate-900 text-sm">{project.seller.name}</h5>
                <p className="text-xs text-navy-mid font-medium">{project.seller.university}</p>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{project.seller.rating.toFixed(2)} Rating</span>
                  <span className="text-slate-400 font-normal">({project.seller.salesCount} sold)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Approved senior developer verified with university student ID and GitHub portfolio.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
              onClick={() => alert(`Pre-order inquiry chat modal with ${project.seller.name} will open here.`)}
            >
              Message Creator
            </Button>
          </div>

        </div>

      </div>

      {/* Checkout Payment Modal */}
      <CheckoutModal
        project={project}
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />

    </div>
  );
};

export default ProjectDetails;
