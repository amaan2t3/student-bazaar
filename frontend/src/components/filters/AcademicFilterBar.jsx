import React from 'react';
import { Filter, X, RotateCcw, BookOpen, Layers } from 'lucide-react';
import { DEGREES, SEMESTERS, SUBJECTS_BY_DEGREE } from '../../data/mockAcademicData';
import Button from '../common/Button';

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

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold" />
          <h3 className="font-semibold text-slate-900 text-sm">University Curriculum Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-gold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Degree Dropdown */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Degree Program
          </label>
          <select
            value={selectedDegree}
            onChange={(e) => {
              setSelectedDegree(e.target.value);
              setSelectedSubject(''); // reset subject when degree changes
            }}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
          >
            <option value="">All Degrees (BSCS, BSIT...)</option>
            {DEGREES.map((deg) => (
              <option key={deg.id} value={deg.id}>
                {deg.id} — {deg.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Semester Dropdown */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              setSelectedSubject('');
            }}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
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
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Subject / Course
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedDegree || !selectedSemester}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-gold focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {!selectedDegree || !selectedSemester 
                ? 'Select Degree & Semester first' 
                : 'All Subjects for this Semester'}
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
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Difficulty Level
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-gold focus:bg-white"
          >
            <option value="">All Difficulties</option>
            <option value="Beginner">Beginner (Sem 1-2)</option>
            <option value="Intermediate">Intermediate (Sem 3-5)</option>
            <option value="Advanced">Advanced / Capstone (Sem 6-8)</option>
          </select>
        </div>
      </div>

      {/* Max Price Slider in PKR */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        <div className="flex items-center gap-2">
          <span>Max Budget:</span>
          <span className="font-bold text-navy-mid text-sm">
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
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicFilterBar;
