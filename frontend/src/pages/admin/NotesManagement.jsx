import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  ChevronDown,
  Search,
  BookMarked
} from 'lucide-react';
import noteService from '../../services/noteService';
import { DEGREES, SEMESTERS, SUBJECTS_BY_DEGREE } from '../../data/academicData';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const DEGREE_OPTIONS = DEGREES;

const EMPTY_FORM = {
  title: '',
  subject: '',
  degree: '',
  semester: '',
  content: '',
  file_url: '',
};

export const NotesManagement = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [filterDegree, setFilterDegree] = useState('');
  const [filterSearch, setFilterSearch] = useState('');

  // Subjects for the form (based on formData.degree + formData.semester)
  const formSubjects = formData.degree && formData.semester
    ? (SUBJECTS_BY_DEGREE[formData.degree]?.[Number(formData.semester)] || [])
    : [];

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDegree) params.degree = filterDegree;
      if (filterSearch.trim()) params.search = filterSearch.trim();
      const res = await noteService.getNotes(params);
      setNotes(res.data || []);
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, [filterDegree, filterSearch]);

  useEffect(() => {
    const t = setTimeout(fetchNotes, 350);
    return () => clearTimeout(t);
  }, [fetchNotes]);

  const showSuccess = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const openAdd = () => {
    setEditingNote(null);
    setFormData(EMPTY_FORM);
    setActionError('');
    setModalOpen(true);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title || '',
      subject: note.subject || '',
      degree: note.degree || '',
      semester: note.semester?.toString() || '',
      content: note.content || '',
      file_url: note.file_url || '',
    });
    setActionError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingNote(null);
    setFormData(EMPTY_FORM);
    setActionError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Reset subject when degree or semester changes
      if (name === 'degree') { updated.semester = ''; updated.subject = ''; }
      if (name === 'semester') { updated.subject = ''; }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject.trim()) {
      setActionError('Title and subject are required.');
      return;
    }
    setSaving(true);
    setActionError('');
    try {
      const payload = {
        title: formData.title.trim(),
        subject: formData.subject.trim(),
        degree: formData.degree || null,
        semester: formData.semester ? Number(formData.semester) : null,
        content: formData.content.trim() || null,
        file_url: formData.file_url.trim() || null,
      };

      if (editingNote) {
        await noteService.updateNote(editingNote.id, payload);
        showSuccess('Note updated successfully.');
      } else {
        await noteService.createNote(payload);
        showSuccess('Note added successfully.');
      }
      closeModal();
      fetchNotes();
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to save note.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setActionError('');
    try {
      await noteService.deleteNote(id);
      showSuccess('Note deleted.');
      setConfirmDeleteId(null);
      fetchNotes();
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Failed to delete note.');
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass = 'w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors placeholder:text-slate-400';
  const selectClass = 'w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors appearance-none cursor-pointer';
  const labelClass = 'block text-xs font-semibold text-slate-700 mb-1.5';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookMarked className="w-4 h-4 text-[#C89D42]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Admin</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Notes Management</h1>
              <p className="text-sm text-slate-500 mt-0.5">Add, edit, and delete subject notes for all degrees.</p>
            </div>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={openAdd}
            >
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
              placeholder="Search notes…"
              className="h-8 pl-8 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <select value={filterDegree} onChange={e => setFilterDegree(e.target.value)} className="h-8 pl-3 pr-7 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors text-slate-700">
              <option value="">All Degrees</option>
              {DEGREE_OPTIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
          </div>
          <span className="text-xs text-slate-400 ml-auto">{loading ? '—' : notes.length} notes</span>
        </div>
      </div>

      {/* Feedback */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {actionSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg px-4 py-2.5 mb-4">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {actionSuccess}
          </div>
        )}
        {actionError && !modalOpen && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {actionError}
          </div>
        )}
      </div>

      {/* Notes table */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
            <span className="text-sm text-slate-500">Loading notes…</span>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">No notes yet</p>
              <p className="text-xs text-slate-500 mt-1">Click "Add Note" to create the first one.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Degree / Sem</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">File</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notes.map(note => (
                  <tr key={note.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-slate-800 leading-snug">{note.title}</p>
                          {note.content && (
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{note.content}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-slate-600">{note.subject}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        {note.degree && <Badge variant="default" size="sm">{note.degree}</Badge>}
                        {note.semester && <span className="text-xs text-slate-400">Sem {note.semester}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {note.file_url ? (
                        <a href={note.file_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#C89D42] hover:underline font-medium">
                          <Download className="w-3 h-3" /> Link
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {confirmDeleteId === note.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-red-600 font-medium">Delete?</span>
                            <button
                              onClick={() => handleDelete(note.id)}
                              disabled={deletingId === note.id}
                              className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
                            >
                              {deletingId === note.id ? '…' : 'Yes'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => openEdit(note)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(note.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </h2>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {actionError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {actionError}
                </div>
              )}

              {/* Title */}
              <div>
                <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Chapter 3: Linked Lists"
                  required
                  className={inputClass}
                />
              </div>

              {/* Degree + Semester */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Degree</label>
                  <div className="relative">
                    <select name="degree" value={formData.degree} onChange={handleChange} className={selectClass}>
                      <option value="">Select degree</option>
                      {DEGREE_OPTIONS.map(d => <option key={d.id} value={d.id}>{d.id} — {d.name}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Semester</label>
                  <div className="relative">
                    <select name="semester" value={formData.semester} onChange={handleChange} disabled={!formData.degree} className={`${selectClass} disabled:opacity-50`}>
                      <option value="">Select semester</option>
                      {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className={labelClass}>Subject <span className="text-red-500">*</span></label>
                {formSubjects.length > 0 ? (
                  <div className="relative">
                    <select name="subject" value={formData.subject} onChange={handleChange} required className={selectClass}>
                      <option value="">Select subject</option>
                      {formSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  </div>
                ) : (
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Data Structures and Algorithms"
                    required
                    className={inputClass}
                  />
                )}
                {!formSubjects.length && formData.degree && formData.semester && (
                  <p className="text-xs text-slate-400 mt-1">No subjects found — enter manually.</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className={labelClass}>Content / Description</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Paste note content, summary, or key points here…"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors placeholder:text-slate-400 resize-y min-h-[96px]"
                />
              </div>

              {/* File URL */}
              <div>
                <label className={labelClass}>File / Download URL</label>
                <input
                  name="file_url"
                  value={formData.file_url}
                  onChange={handleChange}
                  type="url"
                  placeholder="https://drive.google.com/… or PDF link"
                  className={inputClass}
                />
                <p className="text-xs text-slate-400 mt-1">Link to Google Drive, Dropbox, or any direct download.</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="md" onClick={closeModal} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={saving}>
                  {editingNote ? 'Save Changes' : 'Add Note'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesManagement;
