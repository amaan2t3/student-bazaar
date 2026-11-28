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
      
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#C89D42] font-semibold">
            Catalog Explorer
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Browse Ready-Made Computing Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Inspected semester projects aligned with accredited Pakistani CS, IT, and SE syllabi.
          </p>
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
          Showing <span className="font-bold text-slate-900 font-mono">{filteredProjects.length}</span> verified packages
          {degree && <span className="ml-1 font-semibold text-slate-900">in {degree}</span>}
          {semester && <span className="ml-1 font-semibold text-slate-900">(Sem {semester})</span>}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 shadow-xs cursor-pointer"
          >
            <option value="popular">Most Popular &amp; Downloaded</option>
            <option value="rating">Highest Rated</option>
            <option value="price_asc">Price: Low to High (PKR)</option>
            <option value="price_desc">Price: High to Low (PKR)</option>
          </select>
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 font-mono">
          Loading catalog items...
        </div>
      ) : loadError ? (
        <div role="alert" className="mx-auto my-8 max-w-xl rounded-lg border border-rose-200 bg-rose-50 p-6 text-center space-y-3">
          <AlertCircle className="mx-auto h-7 w-7 text-rose-600" />
          <p className="text-xs sm:text-sm text-rose-700">{loadError}</p>
          <Button variant="outline" size="sm" onClick={loadProjects}>
            Try Again
          </Button>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Empty State with Custom Request CTA */
        <div className="bg-white rounded-lg border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 my-8 shadow-subtle">
          <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mx-auto border border-slate-200">
            <PackageOpen className="w-6 h-6 stroke-1" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No projects matched your exact criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            We couldn't find any ready-made packages matching this filter. You can submit a custom assignment request or clear filters to view all.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
            <Link to="/custom-request">
              <Button variant="primary" size="sm">
                Submit Custom Project Request &rarr;
              </Button>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default BrowseProjects;
