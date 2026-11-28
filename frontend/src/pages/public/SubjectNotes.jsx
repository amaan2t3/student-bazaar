import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Search,
  ChevronDown,
  FileText,
  Download,
  Filter,
  RefreshCw,
  ExternalLink,
  BookMarked,
  GraduationCap,
  Layers
} from 'lucide-react';
import noteService from '../../services/noteService';
import { DEGREES, SEMESTERS, SUBJECTS_BY_DEGREE } from '../../data/academicData';
import Badge from '../../components/common/Badge';

const DEGREE_OPTIONS = [{ id: '', name: 'All Degrees' }, ...DEGREES];

export const SubjectNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [expandedNote, setExpandedNote] = useState(null);

  // Subjects available based on selected degree + semester
  const availableSubjects = selectedDegree && selectedSemester
    ? (SUBJECTS_BY_DEGREE[selectedDegree]?.[Number(selectedSemester)] || [])
    : [];

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedDegree) params.degree = selectedDegree;
      if (selectedSemester) params.semester = selectedSemester;
      if (selectedSubject) params.subject = selectedSubject;
      if (search.trim()) params.search = search.trim();
      const res = await noteService.getNotes(params);
      setNotes(res.data || []);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, [selectedDegree, selectedSemester, selectedSubject, search]);

  useEffect(() => {
    const timer = setTimeout(fetchNotes, 350);
    return () => clearTimeout(timer);
  }, [fetchNotes]);

  const handleDegreeChange = (e) => {
    setSelectedDegree(e.target.value);
    setSelectedSemester('');
    setSelectedSubject('');
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
    setSelectedSubject('');
  };

  const resetFilters = () => {
    setSelectedDegree('');
    setSelectedSemester('');
    setSelectedSubject('');
    setSearch('');
  };

  const hasFilters = selectedDegree || selectedSemester || selectedSubject || search;

  // Group notes by degree → semester → subject
  const grouped = notes.reduce((acc, note) => {
    const deg = note.degree || 'General';
    const sem = note.semester ? `Semester ${note.semester}` : 'General';
    const sub = note.subject || 'Other';
    if (!acc[deg]) acc[deg] = {};
    if (!acc[deg][sem]) acc[deg][sem] = {};
    if (!acc[deg][sem][sub]) acc[deg][sem][sub] = [];
    acc[deg][sem][sub].push(note);
    return acc;
  }, {});

  const selectClass = 'h-9 pl-3 pr-8 text-sm bg-white border border-slate-200 text-slate-700 rounded-lg appearance-none cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookMarked className="w-5 h-5 text-[#C89D42]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Academic Resource Library</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Subject Notes</h1>
              <p className="mt-1.5 text-sm text-slate-500 max-w-xl">
                Course notes, study material, and reference documents organized by degree, semester, and subject.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <GraduationCap className="w-4 h-4" />
              <span>{loading ? '—' : notes.length} notes available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search notes…"
                className="h-9 w-full pl-9 pr-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {/* Degree */}
              <div className="relative">
                <select value={selectedDegree} onChange={handleDegreeChange} className={selectClass}>
                  {DEGREE_OPTIONS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Semester */}
              <div className="relative">
                <select value={selectedSemester} onChange={handleSemesterChange} className={selectClass} disabled={!selectedDegree}>
                  <option value="">All Semesters</option>
                  {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Subject */}
              <div className="relative">
                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className={selectClass} disabled={!availableSubjects.length}>
                  <option value="">All Subjects</option>
                  {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>

              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="h-9 px-3 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
            <p className="text-sm text-slate-500">Loading notes…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-sm font-medium text-slate-700">{error}</p>
            <button onClick={fetchNotes} className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2">Try again</button>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">No notes found</p>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or check back later.</p>
            </div>
            {hasFilters && (
              <button onClick={resetFilters} className="text-xs text-[#C89D42] hover:underline font-medium">Clear all filters</button>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([degree, semesters]) => (
              <div key={degree}>
                {/* Degree header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C89D42]" />
                    <h2 className="text-base font-bold text-slate-900">{degree}</h2>
                  </div>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div className="space-y-6">
                  {Object.entries(semesters).sort((a, b) => {
                    const aNum = parseInt(a[0].replace('Semester ', '')) || 999;
                    const bNum = parseInt(b[0].replace('Semester ', '')) || 999;
                    return aNum - bNum;
                  }).map(([semester, subjects]) => (
                    <div key={semester}>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">{semester}</h3>
                      <div className="space-y-3">
                        {Object.entries(subjects).map(([subject, subjectNotes]) => (
                          <div key={subject} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                            {/* Subject label */}
                            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-sm font-semibold text-slate-700">{subject}</span>
                              </div>
                              <Badge variant="default" size="sm">{subjectNotes.length} {subjectNotes.length === 1 ? 'note' : 'notes'}</Badge>
                            </div>

                            {/* Notes list */}
                            <div className="divide-y divide-slate-100">
                              {subjectNotes.map(note => (
                                <div key={note.id} className="px-4 py-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                      <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                      <div className="min-w-0">
                                        <button
                                          className="text-sm font-medium text-slate-800 hover:text-slate-900 text-left leading-snug"
                                          onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                                        >
                                          {note.title}
                                        </button>
                                        {note.content && expandedNote === note.id && (
                                          <div className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-2">
                                            {note.content}
                                          </div>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-xs text-slate-400">
                                            {new Date(note.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                          </span>
                                          {note.content && (
                                            <button
                                              onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                                              className="text-xs text-[#C89D42] hover:underline font-medium"
                                            >
                                              {expandedNote === note.id ? 'Show less' : 'Read more'}
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {note.file_url && (
                                      <a
                                        href={note.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-md transition-colors"
                                      >
                                        <Download className="w-3 h-3" />
                                        Download
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectNotes;
