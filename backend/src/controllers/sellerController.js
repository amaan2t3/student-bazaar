import { supabase, isSupabaseConfigured } from '../config/supabase.js';

// In-memory application store for simulated local mode
const DEMO_SELLER_APPLICATIONS = [
  {
    id: 'app-demo-01',
    user_id: 'usr-buyer-01',
    user_name: 'Ali Raza',
    user_email: 'ali.raza@student.edu.pk',
    university: 'FAST-NUCES Lahore',
    degree: 'BSIT',
    semester: 4,
    github_url: 'https://github.com/aliraza-fast',
    portfolio_url: 'https://aliraza.dev',
    id_card_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
    specializations: ['React.js', 'Node.js', 'MySQL', 'Database Systems', 'C++'],
    bio: 'Dean’s Honor List student at FAST Lahore with 3.82 CGPA. Built top-grade database systems and MERN portals.',
    status: 'pending',
    admin_feedback: null,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

/**
 * @desc   Submit a seller onboarding application
 * @route  POST /api/v1/sellers/apply
 * @access Protected (Buyer only)
 */
export const applyToBecomeSeller = async (req, res) => {
  try {
    const { github_url, portfolio_url, id_card_url, specializations, bio } = req.body;

    // Check if user is already a seller
    if (req.user.role === 'seller') {
      return res.status(400).json({
        success: false,
        message: 'You are already an approved seller on studentBazaar.'
      });
    }

    if (!github_url || !id_card_url || !specializations || specializations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'GitHub profile URL, student ID proof, and at least one technical specialization are required.'
      });
    }

    // Live Supabase
    if (isSupabaseConfigured) {
      // Check existing application
      const { data: existingApp } = await supabase
        .from('seller_applications')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingApp) {
        return res.status(400).json({
          success: false,
          message: 'You already have an application under review by our admin team.'
        });
      }

      const { data, error } = await supabase
        .from('seller_applications')
        .insert([{
          user_id: req.user.id,
          github_url,
          portfolio_url: portfolio_url || null,
          id_card_url,
          specializations: Array.isArray(specializations) ? specializations : [specializations],
          bio: bio || null,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Seller application submitted successfully. Admin review takes 24-48 hours.',
        data
      });
    }

    // Simulated Local Mode
    const newApp = {
      id: `app-${Date.now()}`,
      user_id: req.user.id,
      user_name: req.user.full_name || req.user.name,
      user_email: req.user.email,
      university: req.user.university,
      degree: req.user.degree,
      semester: req.user.semester,
      github_url,
      portfolio_url: portfolio_url || '',
      id_card_url,
      specializations: Array.isArray(specializations) ? specializations : [specializations],
      bio: bio || '',
      status: 'pending',
      admin_feedback: null,
      created_at: new Date().toISOString()
    };

    DEMO_SELLER_APPLICATIONS.unshift(newApp);

    return res.status(201).json({
      success: true,
      message: 'Seller application submitted successfully for review.',
      data: newApp
    });
  } catch (err) {
    console.error('[Apply Seller Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error submitting seller application.'
    });
  }
};

/**
 * @desc   Get current user's seller application status
 * @route  GET /api/v1/sellers/my-application
 * @access Protected
 */
export const getMyApplication = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('seller_applications')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.status(200).json({
        success: true,
        data: data || null
      });
    }

    const app = DEMO_SELLER_APPLICATIONS.find(a => a.user_id === req.user.id) || null;
    return res.status(200).json({
      success: true,
      data: app
    });
  } catch (err) {
    console.error('[Get My App Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc   Get all applications for admin review
 * @route  GET /api/v1/sellers/admin/applications
 * @access Protected (Admin only)
 */
export const getAdminApplications = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('seller_applications')
        .select(`
          *,
          profile:user_id (
            full_name,
            email,
            university,
            degree,
            semester,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, data });
    }

    return res.status(200).json({
      success: true,
      data: DEMO_SELLER_APPLICATIONS
    });
  } catch (err) {
    console.error('[Admin Apps Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc   Approve or reject a seller application
 * @route  PUT /api/v1/sellers/admin/applications/:id/review
 * @access Protected (Admin only)
 */
export const reviewApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_feedback } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected".'
      });
    }

    if (isSupabaseConfigured) {
      // 1. Update application status
      const { data: updatedApp, error: appError } = await supabase
        .from('seller_applications')
        .update({
          status,
          admin_feedback,
          reviewed_by: req.user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (appError) {
        return res.status(400).json({ success: false, message: appError.message });
      }

      // 2. If approved, promote user role to 'seller' in public.profiles
      if (status === 'approved') {
        await supabase
          .from('profiles')
          .update({ role: 'seller', is_verified: true })
          .eq('id', updatedApp.user_id);
      }

      return res.status(200).json({
        success: true,
        message: `Seller application has been ${status}.`,
        data: updatedApp
      });
    }

    // Simulated Local Mode
    const target = DEMO_SELLER_APPLICATIONS.find(a => a.id === id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    target.status = status;
    target.admin_feedback = admin_feedback || null;
    target.reviewed_at = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: `Seller application marked as ${status}.`,
      data: target
    });
  } catch (err) {
    console.error('[Review App Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error reviewing application.' });
  }
};
