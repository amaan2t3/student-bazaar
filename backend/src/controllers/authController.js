import {
  createSupabaseAuthClient,
  createSupabaseUserClient,
  isSupabaseConfigured
} from '../config/supabase.js';

const PROFILE_COLUMNS = 'id, full_name, role, university, degree, semester, avatar_url';

const requireSupabase = (res) => {
  if (isSupabaseConfigured) return true;
  res.status(503).json({
    success: false,
    message: 'Supabase Auth is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env.'
  });
  return false;
};

const getProfileForSession = async (accessToken, authUser) => {
  const userSupabase = createSupabaseUserClient(accessToken);
  const { data: profile, error } = await userSupabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', authUser.id)
    .single();

  if (error || !profile) {
    throw new Error('Your account profile could not be loaded. Contact support.');
  }

  return { ...profile, email: authUser.email };
};

/**
 * Register through Supabase Auth. Supabase stores and hashes the password.
 */
export const register = async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { full_name, email, password, university, degree, semester } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (
      typeof full_name !== 'string' || !full_name.trim() ||
      !normalizedEmail || typeof password !== 'string' || !password ||
      typeof university !== 'string' || !university.trim() ||
      typeof degree !== 'string' || !degree.trim() ||
      !Number.isInteger(Number(semester)) || Number(semester) < 1 || Number(semester) > 8
    ) {
      return res.status(400).json({
        success: false,
        message: 'Valid name, email, password, university, degree, and semester are required.'
      });
    }

    const authClient = createSupabaseAuthClient();
    const { data, error } = await authClient.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: full_name.trim(),
          university: university.trim(),
          degree: degree.trim(),
          semester: Number(semester)
        }
      }
    });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = data.session
      ? await getProfileForSession(data.session.access_token, data.user)
      : null;

    return res.status(201).json({
      success: true,
      message: data.session
        ? 'Account created successfully.'
        : 'Account created. Check your email to confirm your address before signing in.',
      data: {
        user,
        token: data.session?.access_token || null,
        requiresEmailConfirmation: !data.session
      }
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.'
    });
  }
};

/**
 * Verify email and password with Supabase Auth and return the user's DB profile.
 */
export const login = async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail || typeof password !== 'string' || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const authClient = createSupabaseAuthClient();
    const { data, error } = await authClient.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error || !data.session || !data.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = await getProfileForSession(data.session.access_token, data.user);
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user,
        token: data.session.access_token
      }
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.'
    });
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: { user: req.user }
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { full_name, university, degree, semester, avatar_url } = req.body;
    const updates = {};

    if (full_name !== undefined) updates.full_name = full_name;
    if (university !== undefined) updates.university = university;
    if (degree !== undefined) updates.degree = degree;
    if (semester !== undefined) updates.semester = Number(semester);
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: 'At least one profile field is required.' });
    }

    if (
      (updates.full_name !== undefined && (typeof updates.full_name !== 'string' || !updates.full_name.trim())) ||
      (updates.university !== undefined && (typeof updates.university !== 'string' || !updates.university.trim())) ||
      (updates.degree !== undefined && (typeof updates.degree !== 'string' || !updates.degree.trim())) ||
      (updates.semester !== undefined && (!Number.isInteger(updates.semester) || updates.semester < 1 || updates.semester > 8)) ||
      (updates.avatar_url !== undefined && updates.avatar_url !== null && typeof updates.avatar_url !== 'string')
    ) {
      return res.status(400).json({ success: false, message: 'One or more profile fields are invalid.' });
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await req.supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select(PROFILE_COLUMNS)
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: { ...data, email: req.user.email } }
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile.'
    });
  }
};
