import { supabase, isSupabaseConfigured } from '../config/supabase.js';

// Helper: return 503 if Supabase is not configured
const requireSupabase = (res) => {
  if (!isSupabaseConfigured || !supabase) {
    res.status(503).json({ success: false, message: 'Database not configured.' });
    return true;
  }
  return false;
};

// GET /api/v1/notes — public list (optionally filter by degree, semester, subject)
export const getNotes = async (req, res) => {
  if (requireSupabase(res)) return;
  try {
    const { degree, semester, subject, search } = req.query;
    let query = supabase.from('notes').select('*').order('degree').order('semester').order('subject').order('created_at', { ascending: false });

    if (degree) query = query.eq('degree', degree);
    if (semester) query = query.eq('semester', Number(semester));
    if (subject) query = query.eq('subject', subject);
    if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, data: data || [], count: (data || []).length });
  } catch (err) {
    console.error('[getNotes]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch notes.' });
  }
};

// GET /api/v1/notes/:id — public single note
export const getNoteById = async (req, res) => {
  if (requireSupabase(res)) return;
  try {
    const { data, error } = await supabase.from('notes').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, data });
  } catch (err) {
    console.error('[getNoteById]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch note.' });
  }
};

// POST /api/v1/notes — admin only (middleware checks auth)
export const createNote = async (req, res) => {
  if (requireSupabase(res)) return;
  try {
    const { title, subject, degree, semester, content, file_url } = req.body;
    if (!title || !subject) return res.status(400).json({ success: false, message: 'Title and subject are required.' });

    const payload = {
      title: title.trim(),
      subject: subject.trim(),
      degree: degree?.trim() || null,
      semester: semester ? Number(semester) : null,
      content: content?.trim() || null,
      file_url: file_url?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('notes').insert([payload]).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data, message: 'Note created successfully.' });
  } catch (err) {
    console.error('[createNote]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create note.' });
  }
};

// PUT /api/v1/notes/:id — admin only
export const updateNote = async (req, res) => {
  if (requireSupabase(res)) return;
  try {
    const { title, subject, degree, semester, content, file_url } = req.body;
    const payload = { updated_at: new Date().toISOString() };

    if (title !== undefined) payload.title = title.trim();
    if (subject !== undefined) payload.subject = subject.trim();
    if (degree !== undefined) payload.degree = degree?.trim() || null;
    if (semester !== undefined) payload.semester = semester ? Number(semester) : null;
    if (content !== undefined) payload.content = content?.trim() || null;
    if (file_url !== undefined) payload.file_url = file_url?.trim() || null;

    const { data, error } = await supabase.from('notes').update(payload).eq('id', req.params.id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, data, message: 'Note updated successfully.' });
  } catch (err) {
    console.error('[updateNote]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to update note.' });
  }
};

// DELETE /api/v1/notes/:id — admin only
export const deleteNote = async (req, res) => {
  if (requireSupabase(res)) return;
  try {
    const { error } = await supabase.from('notes').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Note deleted successfully.' });
  } catch (err) {
    console.error('[deleteNote]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to delete note.' });
  }
};
