import { supabase, isSupabaseConfigured } from '../config/supabase.js';

// Demo in-memory accounts for offline/evaluation mode
const DEMO_ACCOUNTS = {
  'ali.raza@student.edu.pk': {
    id: 'usr-buyer-01',
    email: 'ali.raza@student.edu.pk',
    full_name: 'Ali Raza',
    role: 'buyer',
    university: 'FAST-NUCES Lahore',
    degree: 'BSIT',
    semester: 4,
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    wallet_balance: 12500,
    escrow_balance: 5000
  },
  'usman.dev@student.edu.pk': {
    id: 'usr-seller-01',
    email: 'usman.dev@student.edu.pk',
    full_name: 'Muhammad Usman (Seller)',
    role: 'seller',
    university: 'PUCIT Lahore',
    degree: 'BSCS',
    semester: 7,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    wallet_balance: 48500,
    escrow_balance: 11000
  },
  'admin@studentbazaar.pk': {
    id: 'usr-admin-01',
    email: 'admin@studentbazaar.pk',
    full_name: 'Prof. Tariq Mahmood (Admin)',
    role: 'admin',
    university: 'Platform Operations',
    degree: 'Faculty / Admin',
    semester: 8,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    wallet_balance: 0,
    escrow_balance: 0
  }
};

/**
 * @desc   Register a new student account
 * @route  POST /api/v1/auth/register
 * @access Public
 */
export const register = async (req, res) => {
  try {
    const { full_name, email, password, university, degree, semester } = req.body;

    // 1. Validation
    if (!full_name || !email || !password || !university || !degree || !semester) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (full_name, email, password, university, degree, semester).'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters in length.'
      });
    }

    // 2. Live Supabase Registration
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            university,
            degree,
            semester: Number(semester),
            role: 'buyer' // Default role for all student registrations
          }
        }
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Student account registered successfully. Please check your email to verify.',
        data: {
          user: data.user,
          session: data.session
        }
      });
    }

    // 3. Simulated Local Mode Registration
    const newMockUser = {
      id: `usr-${Date.now()}`,
      email,
      full_name,
      role: 'buyer',
      university,
      degree,
      semester: Number(semester),
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      wallet_balance: 0,
      escrow_balance: 0
    };

    DEMO_ACCOUNTS[email] = newMockUser;

    return res.status(201).json({
      success: true,
      message: 'Account created successfully (Simulated mode).',
      data: {
        user: newMockUser,
        token: `mock-token-${newMockUser.id}`
      }
    });
  } catch (err) {
    console.error('[Register Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.'
    });
  }
};

/**
 * @desc   Authenticate user & obtain JWT session
 * @route  POST /api/v1/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Live Supabase Authentication
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      // Fetch profile from public.profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          user: profile || data.user,
          token: data.session?.access_token
        }
      });
    }

    // Simulated Local Mode Authentication
    const existing = DEMO_ACCOUNTS[email.toLowerCase().trim()];
    if (!existing) {
      // Auto-generate test profile if logging in with any email in dev mode
      const generatedUser = {
        id: `usr-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : email.includes('seller') ? 'seller' : 'buyer',
        university: 'FAST-NUCES',
        degree: 'BSCS',
        semester: 4,
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        wallet_balance: 5000,
        escrow_balance: 0
      };
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        data: {
          user: generatedUser,
          token: `mock-token-${generatedUser.role}`
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: existing,
        token: `mock-token-${existing.role}`
      }
    });
  } catch (err) {
    console.error('[Login Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};

/**
 * @desc   Get current authenticated user profile
 * @route  GET /api/v1/auth/me
 * @access Protected
 */
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
};

/**
 * @desc   Update student profile
 * @route  PUT /api/v1/auth/update-profile
 * @access Protected
 */
export const updateProfile = async (req, res) => {
  try {
    const { full_name, university, degree, semester, avatar_url } = req.body;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name,
          university,
          degree,
          semester: Number(semester),
          avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.user.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: { user: data }
      });
    }

    // Local simulated update
    const updated = {
      ...req.user,
      full_name: full_name || req.user.full_name,
      university: university || req.user.university,
      degree: degree || req.user.degree,
      semester: semester ? Number(semester) : req.user.semester,
      avatar_url: avatar_url || req.user.avatar_url
    };

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: updated }
    });
  } catch (err) {
    console.error('[Update Profile Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile.'
    });
  }
};
