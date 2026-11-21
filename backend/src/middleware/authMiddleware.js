import { createSupabaseUserClient, isSupabaseConfigured } from '../config/supabase.js';

export const protect = async (req, res, next) => {
  try {
    if (!isSupabaseConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Supabase Auth is not configured on the server.'
      });
    }

    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    const userSupabase = createSupabaseUserClient(token);
    const { data: { user }, error } = await userSupabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication session. Please login again.'
      });
    }

    const { data: profile, error: profileError } = await userSupabase
      .from('profiles')
      .select('id, full_name, role, university, degree, semester, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('[Profile Lookup Error]:', profileError);
      return res.status(500).json({
        success: false,
        message: 'Unable to load your account profile.'
      });
    }

    if (!profile) {
      return res.status(403).json({
        success: false,
        message: 'No student profile is linked to this account.'
      });
    }

    req.supabase = userSupabase;
    req.authUser = user;
    req.user = { ...profile, email: user.email };
    return next();
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
