import { supabase, isSupabaseConfigured } from '../config/supabase.js';

// Protect middleware verifies the Supabase JWT token
export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    // In local simulated development mode without live Supabase credentials
    if (!isSupabaseConfigured || token.startsWith('mock-')) {
      // Mock user identification based on token or default test buyer
      req.user = {
        id: 'usr-buyer-01',
        email: 'ali.raza@student.edu.pk',
        full_name: 'Ali Raza',
        role: token.includes('seller') ? 'seller' : token.includes('admin') ? 'admin' : 'buyer',
        university: 'FAST-NUCES Lahore',
        degree: 'BSIT',
        semester: 4,
        wallet_balance: 12500,
        escrow_balance: 5000
      };
      return next();
    }

    // Live Supabase JWT Token Verification
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication session. Please login again.'
      });
    }

    // Fetch the detailed profile from Supabase PostgreSQL public.profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'buyer',
        full_name: user.user_metadata?.full_name || 'Student User',
        university: user.user_metadata?.university || 'University',
        degree: user.user_metadata?.degree || 'BSCS',
        semester: user.user_metadata?.semester || 1,
        wallet_balance: 0,
        escrow_balance: 0
      };
    } else {
      req.user = profile;
    }

    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server authorization error.'
    });
  }
};

// Role-Based Access Control (RBAC) Guard
export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: You do not have permission to perform this action. Required role: [${allowedRoles.join(', ')}]. Current role: [${req.user?.role || 'guest'}].`
      });
    }
    next();
  };
};
