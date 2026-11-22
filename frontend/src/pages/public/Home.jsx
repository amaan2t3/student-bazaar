import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Database, 
  ShieldCheck, 
  Search, 
  GraduationCap, 
  Cpu, 
  Layers, 
  Laptop, 
  Lock, 
  TrendingUp,
  Award
} from 'lucide-react';
import { DEGREES } from '../../data/academicData';
import ProjectCard from '../../components/cards/ProjectCard';
import Button from '../../components/common/Button';
import projectService from '../../services/projectService';

export const Home = () => {
  const [quickDegree, setQuickDegree] = useState('BSCS');
  const [quickSemester, setQuickSemester] = useState('3');
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    projectService.getProjects()
      .then((response) => {
        if (active) setFeaturedProjects(response.data || []);
      })
      .catch((error) => {
        if (active) {
          setProjectsError(typeof error === 'string' ? error : 'Failed to load featured projects.');
        }
      })
      .finally(() => {
        if (active) setProjectsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    navigate(`/browse?degree=${quickDegree}&semester=${quickSemester}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-soft/30 text-navy text-xs font-semibold tracking-wide border border-gold-soft">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Pakistan's Dedicated University CS/IT Project Hub</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Discover. Buy. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-mid to-teal-500">
                Learn. Build.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Access verified semester projects with runnable source code, complete IEEE documentation, and 3NF database schemas — or commission custom assignments from vetted student developers.
            </p>

            {/* Quick Academic Curricula Search Form */}
            <form 
              onSubmit={handleQuickSearch} 
              className="mt-8 p-3 bg-white rounded-2xl shadow-xl shadow-emerald-900/5 border border-slate-200 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 w-full flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <GraduationCap className="w-4 h-4 text-gold shrink-0" />
                <select
                  value={quickDegree}
                  onChange={(e) => setQuickDegree(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-medium text-slate-800 w-full focus:outline-none"
                >
                  {DEGREES.map((deg) => (
                    <option key={deg.id} value={deg.id}>
                      {deg.id} ({deg.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 w-full flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <Layers className="w-4 h-4 text-gold shrink-0" />
                <select
                  value={quickSemester}
                  onChange={(e) => setQuickSemester(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-medium text-slate-800 w-full focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" size="md" className="w-full sm:w-auto shrink-0 shadow-md">
                <Search className="w-4 h-4 mr-1.5" />
                Find Projects
              </Button>
            </form>

            {/* Trust points */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                100% Tested Source Code
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-gold" />
                SRS & UML Diagrams Included
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-gold" />
                PKR Escrow Protection
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 2. BROWSE BY COMPUTING DEGREE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gold mb-1">
              Academic Curricula
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore by University Degree
            </h2>
          </div>
          <Link to="/browse" className="text-sm font-semibold text-gold hover:text-navy-mid flex items-center gap-1">
            Browse All Degrees &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DEGREES.map((deg) => (
            <Link
              key={deg.id}
              to={`/browse?degree=${deg.id}`}
              className="p-5 bg-white rounded-xl border border-slate-200 hover:border-gold hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-ivory text-navy-mid flex items-center justify-center font-bold text-sm mb-3 group-hover:bg-gold group-hover:text-white transition-colors">
                  {deg.id}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm group-hover:text-navy-mid transition-colors">
                  {deg.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {deg.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-gold">
                <span>View Semesters 1-8</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. VERIFIED FEATURED PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gold mb-1">
              Hand-Vetted Packages
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Semester Projects
            </h2>
          </div>
          <Link to="/browse" className="text-sm font-semibold text-gold hover:text-navy-mid flex items-center gap-1">
            Browse All Approved Projects &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.slice(0, 6).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {projectsLoading && (
          <p className="mt-6 text-center text-sm text-slate-500">Loading approved projects...</p>
        )}
        {!projectsLoading && projectsError && (
          <p role="alert" className="mt-6 text-center text-sm text-red-600">{projectsError}</p>
        )}
        {!projectsLoading && !projectsError && featuredProjects.length === 0 && (
          <p className="mt-6 text-center text-sm text-slate-500">No approved projects are available yet.</p>
        )}
      </section>

      {/* 4. THE DUAL-SERVICE PIPELINE EXPLAINER */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-gold-soft text-xs font-bold uppercase tracking-wider">
              Two Services &bull; One Academic Platform
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-1">
              How studentBazaar Works for You
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Whether you need instant verified code for exam preparation or need a dedicated custom solution for an assignment prompt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Service 1: Ready-Made Marketplace */}
            <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-xl bg-gold/10 text-gold-soft border border-gold/20">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">1. Ready-Made Project Vault</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Browse verified projects built by top students from FAST, NUST, and PUCIT. Filter by your exact degree, semester, and course.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-soft shrink-0" />
                    <span>Instant access via secure, time-expiring signed download links</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-soft shrink-0" />
                    <span>Complete documentation: SRS, ERD, Schema, and Presentation Slides</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-soft shrink-0" />
                    <span>Fixed prices in PKR starting at Rs. 1,000</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700/60">
                <Link to="/browse">
                  <Button variant="primary" className="w-full">
                    Explore Ready-Made Catalog &rarr;
                  </Button>
                </Link>
              </div>
            </div>

            {/* Service 2: Custom Project Request System */}
            <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">2. Custom Assignment Requests</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Have an assignment with unique constraints? Upload your professor's rubric PDF and receive competitive proposals from approved student developers.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Submit your budget, semester constraints, and delivery deadline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Compare seller proposals, milestones, and ratings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Escrow safeguard: Sellers are paid only after you accept delivery</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700/60">
                <Link to="/custom-request">
                  <Button variant="secondary" className="w-full bg-slate-700 text-gold-soft hover:bg-slate-600 border-slate-600">
                    Post Custom Assignment Request &rarr;
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PACKAGE CONTENTS TRANSPARENCY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ivory rounded-2xl p-8 sm:p-12 border border-gold-soft">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-navy text-xs font-bold uppercase tracking-wider bg-gold-soft/30 px-3 py-1 rounded-full border border-emerald-300">
              Standardized Deliverables
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Every Project Is a Complete Academic Kit
            </h2>
            <p className="text-slate-600 text-sm">
              We prohibit raw, undocumented code. Every approved project must include the full academic package required for high marks and effortless viva defense.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-ivory-dark shadow-sm">
              <Code2 className="w-8 h-8 text-gold mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Clean Source Code</h4>
              <p className="text-[11px] text-slate-500 mt-1">Modular & commented</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-ivory-dark shadow-sm">
              <Database className="w-8 h-8 text-gold mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Database & Seeds</h4>
              <p className="text-[11px] text-slate-500 mt-1">SQL / Mongo scripts</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-ivory-dark shadow-sm">
              <FileText className="w-8 h-8 text-gold mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">SRS & Diagrams</h4>
              <p className="text-[11px] text-slate-500 mt-1">IEEE Standard + UML</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-ivory-dark shadow-sm">
              <Award className="w-8 h-8 text-gold mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Viva Slides & Readme</h4>
              <p className="text-[11px] text-slate-500 mt-1">Presentation ready</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
