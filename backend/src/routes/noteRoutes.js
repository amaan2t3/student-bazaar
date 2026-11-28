import express from 'express';
import { getNotes, getNoteById, createNote, updateNote, deleteNote } from '../controllers/noteController.js';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

const router = express.Router();

// ── Lightweight admin auth middleware ─────────────────────────────────────────
// Verifies the Bearer JWT from Supabase and checks the user's role in profiles.
const requireAdmin = async (req, res, next) => {
  if (!isSupabaseConfigured || !supabase) {
    return res.status(503).json({ success: false, message: 'Auth service not configured.' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No auth token provided.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
    }

    // Check role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('[requireAdmin]', err);
    return res.status(500).json({ success: false, message: 'Auth check failed.' });
  }
};

// Public routes
router.get('/', getNotes);
router.get('/:id', getNoteById);

// Admin-only routes
router.post('/', requireAdmin, createNote);
router.put('/:id', requireAdmin, updateNote);
router.delete('/:id', requireAdmin, deleteNote);

export default router;
