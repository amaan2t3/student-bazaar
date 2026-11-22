import { isSupabaseConfigured } from '../config/supabase.js';
import { sendAdminDecisionEmail } from '../services/adminNotificationService.js';

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
      const { data: existingApp, error: existingAppError } = await req.supabase
        .from('seller_applications')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingAppError) {
        return res.status(400).json({ success: false, message: existingAppError.message });
      }

      if (existingApp) {
        return res.status(400).json({
          success: false,
          message: 'You already have an application under review by our admin team.'
        });
      }

      const { data, error } = await req.supabase
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

    return res.status(503).json({ success: false, message: 'Seller applications are unavailable until Supabase is configured.' });
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
      const { data, error } = await req.supabase
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

    return res.status(503).json({ success: false, message: 'Seller applications are unavailable until Supabase is configured.' });
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
      const { data, error } = await req.supabase
        .from('seller_applications')
        .select(`
          *,
          profile:user_id (
            full_name,
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

    return res.status(503).json({ success: false, message: 'Seller applications are unavailable until Supabase is configured.' });
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
      const { data: updatedApp, error: appError } = await req.supabase.rpc('review_seller_application', {
        application_id_param: id,
        status_param: status,
        feedback_param: admin_feedback || null
      });

      if (appError) {
        return res.status(400).json({ success: false, message: appError.message });
      }
      const application = Array.isArray(updatedApp) ? updatedApp[0] : updatedApp;
      const notification = await sendAdminDecisionEmail(req.supabase, {
        userId: application.user_id,
        subject: `StudentBazaar seller application ${status}`,
        text: [
          `Your seller application was ${status}.`,
          `Admin note: ${application.admin_feedback || 'No additional note was provided.'}`
        ].join('\n')
      });

      return res.status(200).json({
        success: true,
        message: notification.sent
          ? `Seller application ${status}. A notification email was sent.`
          : `Seller application ${status}, but the email was not sent: ${notification.message}`,
        notification,
        data: application
      });
    }

    return res.status(503).json({ success: false, message: 'Seller application review is unavailable until Supabase is configured.' });
  } catch (err) {
    console.error('[Review App Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error reviewing application.' });
  }
};
