import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, PackageOpen, Sparkles, AlertCircle } from 'lucide-react';
import ProjectCard from '../../components/cards/ProjectCard';
import AcademicFilterBar from '../../components/filters/AcademicFilterBar';
import Button from '../../components/common/Button';
import projectService from '../../services/projectService';

export const BrowseProjects = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL search params
  const [degree, setDegree] = useState(searchParams.get('degree') || '');
  const [semester, setSemester] = useState(searchParams.get('semester') || '');
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '8000');
  const [sortBy, setSortBy] = useState('popular');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await projectService.getProjects();
      setProjects(response.data || []);
    } catch (error) {
      setLoadError(typeof error === 'string' ? error : 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  // Sync state back to URL params
  useEffect(() => {
    const params = {};
    if (degree) params.degree = degree;
    if (semester) params.semester = semester;
    if (subject) params.subject = subject;
    if (difficulty) params.difficulty = difficulty;
    if (searchQuery) params.search = searchQuery;
    if (maxPrice && maxPrice !== '8000') params.maxPrice = maxPrice;
    setSearchParams(params, { replace: true });
  }, [degree, semester, subject, difficulty, searchQuery, maxPrice, setSearchParams]);

  // Reset filters helper
  const handleResetFilters = () => {
    setDegree('');
    setSemester('');
    setSubject('');
    setDifficulty('');
    setSearchQuery('');
    setMaxPrice('8000');
    setSearchParams({});
  };

  // Filtered & Sorted Projects Calculation
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Degree match
      if (degree && project.degree !== degree) return false;
      // Semester match
      if (semester && project.semester !== Number(semester)) return false;
      // Subject match
      if (subject && !project.subject.toLowerCase().includes(subject.toLowerCase())) return false;
      // Difficulty match
      if (difficulty && project.difficulty.toLowerCase() !== difficulty.toLowerCase()) return false;
      // Max price in PKR
      if (project.pricePKR > Number(maxPrice)) return false;
      // Search term (across title, summary, technologies, and subject)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesSummary = project.summary.toLowerCase().includes(query);
        const matchesSubject = project.subject.toLowerCase().includes(query);
        const matchesTech = project.technologies.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesSummary && !matchesSubject && !matchesTech) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePKR - b.pricePKR;
      if (sortBy === 'price_desc') return b.pricePKR - a.pricePKR;
      if (sortBy === 'rating') return b.rating - a.rating;
      // default: popular (reviewsCount)
      return b.reviewsCount - a.reviewsCount;
    });
  }, [projects, degree, semester, subject, difficulty, searchQuery, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Browse Ready-Made Computing Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover verified semester projects tailored for Pakistani CS, IT, and SE syllabi.
          </p>
        </div>

        {/* Search input in header */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, tech, frameworks..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/30 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* University Curricula Filter Bar Component */}
      <AcademicFilterBar
        selectedDegree={degree}
        setSelectedDegree={setDegree}
        selectedSemester={semester}
        setSelectedSemester={setSemester}
        selectedSubject={subject}
        setSelectedSubject={setSubject}
        selectedDifficulty={difficulty}
        setSelectedDifficulty={setDifficulty}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onReset={handleResetFilters}
      />

      {/* Results Header: Count & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-600">
          Showing <span className="font-bold text-slate-900">{filteredProjects.length}</span> verified project packages
          {degree && <span className="ml-1 font-semibold text-navy-mid">in {degree}</span>}
          {semester && <span className="ml-1 font-semibold text-navy-mid">(Sem {semester})</span>}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-gold shadow-sm"
          >
            <option value="popular">Most Popular & Downloaded</option>
            <option value="rating">Highest Rated (★)</option>
            <option value="price_asc">Price: Low to High (PKR)</option>
            <option value="price_desc">Price: High to Low (PKR)</option>
          </select>
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {loading ? (
        <p className="py-12 text-center text-sm text-slate-500">Loading approved projects...</p>
      ) : loadError ? (
        <div role="alert" className="mx-auto my-8 max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-600" />
          <p className="mt-3 text-sm text-red-700">{loadError}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={loadProjects}>
            Try Again
          </Button>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Empty State with Custom Request CTA */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 my-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-ivory text-gold flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No projects matched your exact filter
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            We couldn't find any ready-made packages for your current criteria. You can post a custom assignment request or reset the filters.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
            <Link to="/custom-request">
              <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
                Post Custom Assignment Request
              </Button>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default BrowseProjects;
