import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isSupabaseConfigured, supabase, supabaseAdmin } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/team_members.json');

// Initial default seed members
const INITIAL_DEMO_TEAM_MEMBERS = [
  {
    id: 'team-01',
    name: 'Muhammad Daniyal',
    role: 'Founder & Full-Stack Architect',
    university: 'FAST-NUCES Lahore',
    bio: 'BS Computer Science senior passionate about distributed systems and empowering Pakistani student developers to monetize their coursework safely.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com',
    github_url: 'https://github.com',
    twitter_url: 'https://twitter.com',
    display_order: 1,
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 60).toISOString()
  },
  {
    id: 'team-02',
    name: 'Syeda Fatima Zahra',
    role: 'Co-Founder & UI/UX Product Designer',
    university: 'NUST SEECS Islamabad',
    bio: 'Software Engineering graduate specializing in intuitive student experiences, academic integrity workflows, and clean design systems.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com',
    github_url: 'https://github.com',
    twitter_url: 'https://twitter.com',
    display_order: 2,
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 50).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 50).toISOString()
  },
  {
    id: 'team-03',
    name: 'Bilal Ahmed',
    role: 'Lead Backend & Security Engineer',
    university: 'PUCIT Lahore',
    bio: 'Passionate about PostgreSQL, row-level security, and escrow verification pipelines ensuring authentic PKR university transactions.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com',
    github_url: 'https://github.com',
    twitter_url: null,
    display_order: 3,
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 40).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 40).toISOString()
  },
  {
    id: 'team-04',
    name: 'Amina Tariq',
    role: 'Academic Verification & Code Quality Lead',
    university: 'COMSATS Islamabad',
    bio: 'Oversees student ID validation, code review standards, and ensuring all uploaded repositories meet strict university viva guidelines.',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com',
    github_url: 'https://github.com',
    twitter_url: null,
    display_order: 4,
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString()
  }
];

// Persistent file-backed storage helpers
const loadDiskMembers = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Disk Storage Warning]:', err.message);
  }
  return [...INITIAL_DEMO_TEAM_MEMBERS];
};

const saveDiskMembers = (members) => {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Disk Save Warning]:', err.message);
  }
};

/**
 * @desc   Get active team members (Public)
 * @route  GET /api/v1/team
 * @access Public
 */
export const getTeamMembers = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await (req.supabase || supabaseAdmin || supabase)
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('[Supabase Team DB Fetch Error]:', error);
        return res.status(500).json({ success: false, message: 'Failed to load team members.' });
      }

      return res.status(200).json({ success: true, data: data || [] });
    }

    // Load from persistent disk storage
    const allMembers = loadDiskMembers();
    const activeMembers = allMembers
      .filter((m) => m.is_active)
      .sort((a, b) => a.display_order - b.display_order);

    return res.status(200).json({ success: true, data: activeMembers });
  } catch (error) {
    console.error('[Get Team Members Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to load team members.' });
  }
};

/**
 * @desc   Admin: Get all team members (including inactive)
 * @route  GET /api/v1/admin/team
 * @access Admin
 */
export const getAdminTeamMembers = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await (req.supabase || supabaseAdmin || supabase)
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('[Supabase Admin Team DB Fetch Error]:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve team members.' });
      }

      return res.status(200).json({ success: true, data: data || [] });
    }

    const members = loadDiskMembers().sort((a, b) => a.display_order - b.display_order);
    return res.status(200).json({ success: true, data: members });
  } catch (error) {
    console.error('[Admin Get Team Members Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve team members.' });
  }
};

/**
 * @desc   Admin: Create a new team member
 * @route  POST /api/v1/admin/team
 * @access Admin
 */
export const createTeamMember = async (req, res) => {
  try {
    const {
      name,
      role,
      university,
      bio,
      avatar_url,
      linkedin_url,
      github_url,
      twitter_url,
      display_order,
      is_active
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Team member name is required.' });
    }
    if (!role || !role.trim()) {
      return res.status(400).json({ success: false, message: 'Team member role/designation is required.' });
    }
    if (!university || !university.trim()) {
      return res.status(400).json({ success: false, message: 'University/Institution is required.' });
    }
    if (!bio || !bio.trim()) {
      return res.status(400).json({ success: false, message: 'A short bio is required.' });
    }

    const newMemberData = {
      name: name.trim(),
      role: role.trim(),
      university: university.trim(),
      bio: bio.trim(),
      avatar_url: avatar_url?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      linkedin_url: linkedin_url?.trim() || null,
      github_url: github_url?.trim() || null,
      twitter_url: twitter_url?.trim() || null,
      display_order: Number.isInteger(Number(display_order)) ? Number(display_order) : 1,
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await (req.supabase || supabaseAdmin || supabase)
        .from('team_members')
        .insert([newMemberData])
        .select()
        .single();

      if (error || !data) {
        console.error('[Supabase Create Team DB Insert Error]:', error);
        return res.status(500).json({ success: false, message: 'Failed to create team member.' });
      }

      return res.status(201).json({
        success: true,
        message: 'Team member added successfully.',
        data
      });
    }

    const currentMembers = loadDiskMembers();
    const fallbackMember = {
      ...newMemberData,
      id: `team-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString()
    };
    currentMembers.push(fallbackMember);
    saveDiskMembers(currentMembers);

    return res.status(201).json({
      success: true,
      message: 'Team member added successfully.',
      data: fallbackMember
    });
  } catch (error) {
    console.error('[Create Team Member Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to create team member.' });
  }
};

/**
 * @desc   Admin: Update an existing team member
 * @route  PUT /api/v1/admin/team/:id
 * @access Admin
 */
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      role,
      university,
      bio,
      avatar_url,
      linkedin_url,
      github_url,
      twitter_url,
      display_order,
      is_active
    } = req.body;

    const updates = {
      updated_at: new Date().toISOString()
    };
    if (name !== undefined) updates.name = name.trim();
    if (role !== undefined) updates.role = role.trim();
    if (university !== undefined) updates.university = university.trim();
    if (bio !== undefined) updates.bio = bio.trim();
    if (avatar_url !== undefined) updates.avatar_url = avatar_url?.trim();
    if (linkedin_url !== undefined) updates.linkedin_url = linkedin_url?.trim() || null;
    if (github_url !== undefined) updates.github_url = github_url?.trim() || null;
    if (twitter_url !== undefined) updates.twitter_url = twitter_url?.trim() || null;
    if (display_order !== undefined) updates.display_order = Number(display_order);
    if (is_active !== undefined) updates.is_active = Boolean(is_active);

    if (isSupabaseConfigured) {
      const { data, error } = await (req.supabase || supabaseAdmin || supabase)
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('[Supabase Update Team DB Error]:', error);
        return res.status(500).json({ success: false, message: 'Failed to update team member.' });
      }

      if (!data) {
        return res.status(404).json({ success: false, message: 'Team member not found.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Team member updated successfully.',
        data
      });
    }

    const currentMembers = loadDiskMembers();
    const memberIndex = currentMembers.findIndex((m) => m.id === id);
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    currentMembers[memberIndex] = { ...currentMembers[memberIndex], ...updates };
    saveDiskMembers(currentMembers);

    return res.status(200).json({
      success: true,
      message: 'Team member updated successfully.',
      data: currentMembers[memberIndex]
    });
  } catch (error) {
    console.error('[Update Team Member Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to update team member.' });
  }
};

/**
 * @desc   Admin: Delete a team member
 * @route  DELETE /api/v1/admin/team/:id
 * @access Admin
 */
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await (req.supabase || supabaseAdmin || supabase)
        .from('team_members')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle();

      if (error) {
        console.error('[Supabase Delete Team DB Error]:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete team member.' });
      }

      if (!data) {
        return res.status(404).json({ success: false, message: 'Team member not found.' });
      }

      return res.status(200).json({ success: true, message: 'Team member deleted successfully.' });
    }

    const currentMembers = loadDiskMembers();
    const filtered = currentMembers.filter((m) => m.id !== id);
    if (filtered.length === currentMembers.length) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    saveDiskMembers(filtered);
    return res.status(200).json({ success: true, message: 'Team member deleted successfully.' });
  } catch (error) {
    console.error('[Delete Team Member Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete team member.' });
  }
};
