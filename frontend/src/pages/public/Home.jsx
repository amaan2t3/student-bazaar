import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileCode2, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Database, 
  ShieldCheck, 
  Search, 
  GraduationCap, 
  Cpu, 
  Layers, 
  FolderCheck,
  Award,
  Sparkles,
  Check,
  ChevronRight,
  ExternalLink,
  Lock,
  DownloadCloud
} from 'lucide-react';
import { DEGREES } from '../../data/academicData';
import ProjectCard from '../../components/cards/ProjectCard';
import Button from '../../components/common/Button';
import projectService from '../../services/projectService';

export const Home = () => {
  const [quickDegree, setQuickDegree] = useState('BSCS');
  const [quickSemester, setQuickSemester] = useState('3');
  const [activeCurriculumTab, setActiveCurriculumTab] = useState('BSCS');
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

  const selectedDegreeMeta = DEGREES.find((d) => d.id === activeCurriculumTab) || DEGREES[0];

  return (
    <div className="space-y-20 pb-20">
      
      {/* ── 1. ASYMMETRICAL EDITORIAL HERO SECTION ── */}
      <section className="border-b border-slate-200/90 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left 7 Columns: Authoritative Headline, Purpose, and Search Ergonomics */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Context Kicker */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-700 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C89D42]" />
                <span className="font-semibold text-slate-900">ACADEMIC COMPUTING REPOSITORY</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500">FALL 2026</span>
              </div>

              {/* Main Editorial Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.14]">
                Verified computing projects for Pakistani university students.
              </h1>

              {/* Realistic Narrative */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Access peer-inspected semester projects with executable source code, normalized 3NF database schemas, and IEEE-format SRS documentation. Built by verified students across FAST, NUST, PUCIT, COMSATS, and UET.
              </p>

              {/* Unified Academic Curricula Search Form */}
              <form 
                onSubmit={handleQuickSearch} 
                className="p-1.5 bg-slate-50 rounded-lg border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row items-center gap-1.5 max-w-xl"
              >
                {/* Degree Select */}
                <div className="w-full sm:w-1/2 relative">
                  <label htmlFor="hero-degree" className="sr-only">Degree Program</label>
                  <select
                    id="hero-degree"
                    value={quickDegree}
                    onChange={(e) => setQuickDegree(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-slate-400 appearance-none cursor-pointer"
                  >
                    {DEGREES.map((deg) => (
                      <option key={deg.id} value={deg.id}>
                        {deg.id} &bull; {deg.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester Select */}
                <div className="w-full sm:w-1/3 relative">
                  <label htmlFor="hero-semester" className="sr-only">Semester</label>
                  <select
                    id="hero-semester"
                    value={quickSemester}
                    onChange={(e) => setQuickSemester(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-slate-400 appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Action */}
                <Button type="submit" size="sm" variant="primary" className="w-full sm:w-auto shrink-0 px-4 py-2 text-xs whitespace-nowrap">
                  <span>Search Catalog</span>
                 </Button>
              </form>

              {/* Realistic University Proof Ticker */}
              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-2 font-medium">
                  Curriculum aligned with accredited universities
                </span>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500 font-mono">
                  <span>FAST-NUCES</span>
                  <span className="text-slate-300">&bull;</span>
                  <span>NUST SEECS</span>
                  <span className="text-slate-300">&bull;</span>
                  <span>PUCIT</span>
                  <span className="text-slate-300">&bull;</span>
                  <span>COMSATS</span>
                  <span className="text-slate-300">&bull;</span>
                  <span>UET Lahore</span>
                  <span className="text-slate-300">&bull;</span>
                  <span>GIKI</span>
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Realistic "Package Dossier" Live Specimen */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 rounded-lg text-slate-200 border border-slate-800 shadow-elevated overflow-hidden font-sans">
                
                {/* Dossier Header Bar */}
                <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-mono text-slate-400 text-[11px]">SPECIMEN-DOSSIER #SB-402</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded">
                    VERIFIED &bull; READY
                  </span>
                </div>

                {/* Specimen Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>BSCS &bull; Semester 6 &bull; Web Engineering</span>
                      <span className="text-slate-300 font-mono">Rs. 3,000 PKR</span>
                    </div>
                    <h2 className="text-base font-semibold text-white tracking-tight">
                      PlayArena: Sports Turf Booking &amp; Tournament System
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Complete full-stack booking application with slot collision locking, JWT auth, and admin dashboard.
                    </p>
                  </div>

                  {/* Included Deliverable File Tree Breakdown */}
                  <div className="bg-slate-950/80 rounded border border-slate-800 p-3 space-y-2 text-xs font-mono">
                    <div className="text-[11px] text-slate-400 font-sans uppercase tracking-wider font-semibold">
                      Deliverables Manifest
                    </div>
                    
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-2">
                          <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>/src (React 18 + Node Express)</span>
                        </span>
                        <span className="text-emerald-400 text-[10px]">Zero Errors</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-amber-400" />
                          <span>/schema.sql (PostgreSQL 3NF DDL)</span>
                        </span>
                        <span className="text-slate-400 text-[10px]">Sample Seeds</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>IEEE-SRS-Documentation.docx</span>
                        </span>
                        <span className="text-slate-400 text-[10px]">42 Pages</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-purple-400" />
                          <span>Viva-Presentation-Deck.pptx</span>
                        </span>
                        <span className="text-slate-400 text-[10px]">18 Slides</span>
                      </div>
                    </div>
                  </div>

                  {/* Audit Guarantees */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Node 20 runtime tested</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>UML diagrams editable</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Signed download link</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Student ID verified author</span>
                    </div>
                  </div>

                  {/* CTA row inside specimen */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Standard Package Delivery
                    </span>
                    <Link
                      to="/browse"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors"
                    >
                      <span>Explore verified library</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. EDITORIAL CURRICULUM DIRECTORY (NO GENERIC CARDS) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C89D42] font-semibold">
                Degree Pathways
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Browse by Academic Curriculum
              </h2>
            </div>
            <Link 
              to="/browse" 
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <span>View full catalog by semester (1–8)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Curriculum Switcher Bar */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-3">
            {DEGREES.map((deg) => (
              <button
                key={deg.id}
                onClick={() => setActiveCurriculumTab(deg.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeCurriculumTab === deg.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span className="font-bold">{deg.id}</span> &bull; {deg.name}
              </button>
            ))}
          </div>

          {/* Curriculum Focus Details Table */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-subtle grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-3 pr-0 md:pr-4 md:border-r border-slate-200">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Selected Curriculum</span>
              <h3 className="text-xl font-bold text-slate-900">{selectedDegreeMeta.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedDegreeMeta.description}
              </p>
              <div className="pt-2">
                <Link to={`/browse?degree=${selectedDegreeMeta.id}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View all {selectedDegreeMeta.id} projects &rarr;
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:col-span-8">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-3">
                Key Semester Milestones &amp; Typical Projects
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center justify-between">
                    <span>Semesters 1 &ndash; 2: Core Fundamentals</span>
                    <span className="text-[10px] font-mono text-slate-500">C++ / Java / Python</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Console management systems, file-handling utilities, student record management, and basic algorithmic logic.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center justify-between">
                    <span>Semesters 3 &ndash; 4: Data &amp; Systems</span>
                    <span className="text-[10px] font-mono text-slate-500">DSA / DBMS / OOP</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Relational database applications in MySQL/PostgreSQL, graphical desktop applications, and memory data structure simulations.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center justify-between">
                    <span>Semesters 5 &ndash; 6: Architecture &amp; Web</span>
                    <span className="text-[10px] font-mono text-slate-500">MERN / Django / APIs</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Multi-tier web portals, booking systems, role-based governance tools, and RESTful client-server platforms with full SRS documentation.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center justify-between">
                    <span>Semesters 7 &ndash; 8: Capstone &amp; FYP</span>
                    <span className="text-[10px] font-mono text-slate-500">ML / Cloud / Microservices</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    AI models, computer vision pipelines, multi-service systems, cloud deployment configurations, and viva-ready research decks.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. CURATED FEATURED PROJECTS SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C89D42] font-semibold">
                Peer-Inspected Packages
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Featured Semester Projects
              </h2>
            </div>
            <Link 
              to="/browse" 
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <span>Explore all catalog items &rarr;</span>
            </Link>
          </div>

          {/* Grid of Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {projectsLoading && (
            <div className="p-12 text-center text-xs text-slate-500 font-mono">
              Loading inspected projects catalog...
            </div>
          )}

          {!projectsLoading && projectsError && (
            <div role="alert" className="p-4 rounded border border-rose-200 bg-rose-50 text-xs text-rose-700 text-center">
              {projectsError}
            </div>
          )}

          {!projectsLoading && !projectsError && featuredProjects.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded">
              No approved projects found. Check back shortly.
            </div>
          )}

        </div>
      </section>

      {/* ── 4. TWO-SERVICE OPERATING MODEL (ASYMMETRICAL SPLIT) ── */}
      <section className="bg-slate-900 text-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
              The Operating Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Two transparent pathways for academic success.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              Whether you need tested code immediately for reference study or need an experienced student developer to construct a unique assignment under strict rubric guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Pathway 1: Pre-Verified Repository */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-lg border border-slate-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-300 uppercase tracking-wider">Pathway 01</span>
                  <span className="text-[11px] text-slate-400 font-mono">Instant Download</span>
                </div>
                
                <h3 className="text-xl font-bold text-white">Pre-Verified Ready-Made Vault</h3>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Browse completed semester assignments built by high-GPA senior students from FAST, NUST, and PUCIT. Filter by course code and semester.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Instant delivery via pre-signed, secure, time-expiring storage download links</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Comprehensive documentation pack: IEEE SRS, ERD, Schema, and PowerPoint defense deck</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Affordable, fixed student pricing in Pakistani Rupees (PKR)</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link to="/browse">
                  <Button variant="accent" className="w-full text-xs">
                    Browse Ready-Made Vault &rarr;
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pathway 2: Custom Project Assignment Requests */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-lg border border-slate-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-300 uppercase tracking-wider">Pathway 02</span>
                  <span className="text-[11px] text-slate-400 font-mono">Custom Commission</span>
                </div>
                
                <h3 className="text-xl font-bold text-white">Custom Assignment Requests</h3>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Have an assignment prompt with specific constraints or unconventional framework requirements? Submit your requirements for vetted developer proposals.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Upload your professor's rubric PDF, define deadline constraints, and specify target budget</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Inspect peer developer portfolios, GitHub links, and past university delivery ratings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Escrow protection guarantee: Funds released to creator only upon successful rubric acceptance</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link to="/custom-request">
                  <Button variant="outline" className="w-full text-xs bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white">
                    Submit Custom Request &rarr;
                  </Button>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. TECHNICAL SPECIFICATION TABLE: DELIVERABLES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-subtle space-y-6">
          
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C89D42] font-semibold">
              Quality Assurance
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Every package is an end-to-end academic asset.
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              We reject raw, undocumented source code. All approved projects include standardized documentation required for evaluation and defense.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="pb-3 font-semibold">Deliverable</th>
                  <th className="pb-3 font-semibold">Standard Requirement</th>
                  <th className="pb-3 font-semibold">Format</th>
                  <th className="pb-3 font-semibold text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-slate-500" />
                    <span>Executable Source Code</span>
                  </td>
                  <td className="py-3 text-slate-500">Modular structure, inline commentary, and clean package.json / requirements.txt</td>
                  <td className="py-3 font-mono text-slate-500">ZIP archive</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-200">
                      Syntax Checked
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-500" />
                    <span>Database Scripts &amp; Seeds</span>
                  </td>
                  <td className="py-3 text-slate-500">Normalized 3NF relational schema, foreign key constraints, and sample records</td>
                  <td className="py-3 font-mono text-slate-500">.sql / .json</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-200">
                      Import Tested
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>IEEE SRS Document</span>
                  </td>
                  <td className="py-3 text-slate-500">Complete functional requirements, use cases, ERD diagrams, and sequence flows</td>
                  <td className="py-3 font-mono text-slate-500">DOCX &amp; PDF</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-200">
                      Editable Format
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-500" />
                    <span>Viva Defense Presentation</span>
                  </td>
                  <td className="py-3 text-slate-500">15–20 editable slide deck with system architecture, flowcharts, and anticipated Q&amp;A</td>
                  <td className="py-3 font-mono text-slate-500">PPTX</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-200">
                      Defense Ready
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
