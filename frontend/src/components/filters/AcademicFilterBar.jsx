import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { DEGREES, SEMESTERS, SUBJECTS_BY_DEGREE } from '../../data/academicData';

export const AcademicFilterBar = ({
  selectedDegree,
  setSelectedDegree,
  selectedSemester,
  setSelectedSemester,
  selectedSubject,
  setSelectedSubject,
  selectedDifficulty,
  setSelectedDifficulty,
  maxPrice,
  setMaxPrice,
  onReset
}) => {
  // Compute available subjects dynamically based on degree and semester
  const availableSubjects = (selectedDegree && selectedSemester && SUBJECTS_BY_DEGREE[selectedDegree]?.[selectedSemester])
    ? SUBJECTS_BY_DEGREE[selectedDegree][selectedSemester]
    : [];

  const hasActiveFilters = Boolean(selectedDegree || selectedSemester || selectedSubject || selectedDifficulty || (maxPrice && maxPrice !== '8000'));

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-subtle space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <h3 className="font-semibold text-slate-900 text-xs tracking-tight uppercase font-mono">Curricular Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Degree Dropdown */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Degree Program
          </label>
          <select
            value={selectedDegree}
            onChange={(e) => {
              setSelectedDegree(e.target.value);
              setSelectedSubject(''); // reset subject when degree changes
            }}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
          >
            <option value="">All Degrees (BSCS, BSIT...)</option>
            {DEGREES.map((deg) => (
              <option key={deg.id} value={deg.id}>
                {deg.id} &bull; {deg.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Semester Dropdown */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              setSelectedSubject('');
            }}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
          >
            <option value="">All Semesters (1 to 8)</option>
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Dynamic Subject Dropdown */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Course Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedDegree || !selectedSemester}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">
              {!selectedDegree || !selectedSemester 
                ? 'Select Degree & Sem first' 
                : 'All Subjects for Semester'}
            </option>
            {availableSubjects.map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Difficulty Level */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Academic Scope
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
          >
            <option value="">All Scopes</option>
            <option value="Beginner">Beginner (Sem 1-2)</option>
            <option value="Intermediate">Intermediate (Sem 3-5)</option>
            <option value="Advanced">Advanced / Capstone (Sem 6-8)</option>
          </select>
        </div>
      </div>

      {/* Max Price Slider in PKR */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Max Budget Ceiling:</span>
          <span className="font-bold text-slate-900 font-mono text-xs">
            Rs. {Number(maxPrice).toLocaleString()} PKR
          </span>
        </div>
        <div className="w-full sm:w-64">
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full accent-slate-900 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicFilterBar;
