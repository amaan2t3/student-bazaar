import { supabase, isSupabaseConfigured } from '../config/supabase.js';

// Seed in-memory custom requests for simulated local mode
let DEMO_CUSTOM_REQUESTS = [
  {
    id: 'cr-demo-01',
    buyer_id: 'usr-buyer-01',
    buyer: {
      name: 'Ali Raza',
      university: 'FAST-NUCES Lahore',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
    },
    title: 'Online Examination Portal with WebCam Anti-Cheat System',
    degree: 'BSIT',
    semester: 6,
    subject: 'Web Engineering',
    detailed_scope: 'Looking for a React + Node.js portal where instructors can upload MCQs with time limits. Must include face-detection alert if student looks away from screen during quiz. Complete SRS and schema required.',
    budget_pkr: 6500,
    deadline: '2026-12-05',
    attachment_urls: ['exam_portal_assignment_rubric.pdf'],
    technologies_needed: ['React.js', 'Node.js', 'TensorFlow.js', 'MongoDB'],
    proposals_count: 3,
    status: 'open_for_bidding',
    admin_feedback: null,
    created_at: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 'cr-demo-02',
    buyer_id: 'usr-buyer-02',
    buyer: {
      name: 'Hamza Khan',
      university: 'PUCIT Lahore',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    title: 'Multi-Threaded Server-Client Chat Room in Java with RSA Encryption',
    degree: 'BSCS',
    semester: 5,
    subject: 'Computer Networks',
    detailed_scope: 'Requires Java Socket Programming with thread pool, RSA key exchange for encryption, and file transfer capability between clients. Swing GUI needed.',
    budget_pkr: 4500,
    deadline: '2026-12-02',
    attachment_urls: ['java_socket_lab_prompt.pdf'],
    technologies_needed: ['Java', 'Socket Programming', 'Cryptography', 'Swing GUI'],
    proposals_count: 5,
    status: 'open_for_bidding',
    admin_feedback: null,
    created_at: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'cr-demo-03',
    buyer_id: 'usr-buyer-01',
    buyer: {
      name: 'Ali Raza',
      university: 'FAST-NUCES Lahore',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
    },
    title: 'Real Estate Price Prediction Model using Random Forest & XGBoost',
    degree: 'BSDS',
    semester: 5,
    subject: 'Machine Learning for Data Science',
    detailed_scope: 'Need regression pipeline trained on Pakistani property dataset with outlier removal, hyperparameter tuning, and model evaluation metrics (RMSE, R2 score).',
    budget_pkr: 5000,
    deadline: '2026-12-10',
    attachment_urls: ['ml_project_spec.pdf'],
    technologies_needed: ['Python', 'Scikit-Learn', 'XGBoost', 'Pandas', 'Flask'],
    proposals_count: 0,
    status: 'pending_review',
    admin_feedback: null,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

/**
 * @desc   Submit a custom project / assignment request
 * @route  POST /api/v1/custom-requests
 * @access Protected (Buyer)
 */
export const createCustomRequest = async (req, res) => {
  try {
    const {
      title,
      degree,
      semester,
      subject,
      detailed_scope,
      budget_pkr,
      deadline,
      attachment_urls,
      technologies_needed
    } = req.body;

    if (!title || !degree || !semester || !subject || !detailed_scope || !budget_pkr || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'All fields (title, degree, semester, subject, detailed_scope, budget_pkr, deadline) are required.'
      });
    }

    if (Number(budget_pkr) < 1000) {
      return res.status(400).json({
        success: false,
        message: 'Minimum budget for custom university project requests is PKR 1,000.'
      });
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('custom_requests')
        .insert([{
          buyer_id: req.user.id,
          title: title.trim(),
          degree,
          semester: Number(semester),
          subject,
          detailed_scope: detailed_scope.trim(),
          budget_pkr: Number(budget_pkr),
          deadline,
          attachment_urls: Array.isArray(attachment_urls) ? attachment_urls : (attachment_urls ? [attachment_urls] : []),
          technologies_needed: Array.isArray(technologies_needed) ? technologies_needed : (technologies_needed ? [technologies_needed] : []),
          status: 'pending_review' // Must be approved by admin before appearing on seller board
        }])
        .select()
        .single();

      if (error) return res.status(400).json({ success: false, message: error.message });

      return res.status(201).json({
        success: true,
        message: 'Custom project request submitted! It will open for seller bidding after admin verification.',
        data
      });
    }

    // Simulated Local Mode
    const newRequest = {
      id: `cr-${Date.now()}`,
      buyer_id: req.user.id,
      buyer: {
        name: req.user.full_name || req.user.name,
        university: req.user.university,
        avatar: req.user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
      },
      title: title.trim(),
      degree,
      semester: Number(semester),
      subject,
      detailed_scope: detailed_scope.trim(),
      budget_pkr: Number(budget_pkr),
      deadline,
      attachment_urls: Array.isArray(attachment_urls) ? attachment_urls : (attachment_urls ? [attachment_urls] : ['assignment_manual.pdf']),
      technologies_needed: Array.isArray(technologies_needed) ? technologies_needed : ['React.js', 'Node.js', 'MongoDB'],
      proposals_count: 0,
      status: 'pending_review',
      admin_feedback: null,
      created_at: new Date().toISOString()
    };

    DEMO_CUSTOM_REQUESTS.unshift(newRequest);

    return res.status(201).json({
      success: true,
      message: 'Custom project request submitted successfully! Queued for admin review.',
      data: newRequest
    });
  } catch (err) {
    console.error('[Create Custom Request Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error creating custom request.' });
  }
};

/**
 * @desc   Get logged-in buyer's submitted requests
 * @route  GET /api/v1/custom-requests/my-requests
 * @access Protected (Buyer)
 */
export const getMyCustomRequests = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('custom_requests')
        .select('*')
        .eq('buyer_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) return res.status(400).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, count: data.length, data });
    }

    const myRequests = DEMO_CUSTOM_REQUESTS.filter(r => r.buyer_id === req.user.id || req.user.role === 'buyer');
    return res.status(200).json({
      success: true,
      count: myRequests.length,
      data: myRequests
    });
  } catch (err) {
    console.error('[Get My Requests Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc   Get open opportunities feed for approved sellers
 * @route  GET /api/v1/custom-requests/feed
 * @access Protected (Seller & Admin)
 */
export const getOpenRequestsFeed = async (req, res) => {
  try {
    const { degree, semester, subject, search } = req.query;

    if (isSupabaseConfigured) {
      let query = supabase
        .from('custom_requests')
        .select(`
          *,
          buyer:buyer_id (
            full_name,
            university,
            avatar_url
          )
        `)
        .eq('status', 'open_for_bidding');

      if (degree) query = query.eq('degree', degree);
      if (semester) query = query.eq('semester', Number(semester));
      if (subject) query = query.ilike('subject', `%${subject}%`);
      if (search) query = query.or(`title.ilike.%${search}%,detailed_scope.ilike.%${search}%`);

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) return res.status(400).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, count: data.length, data });
    }

    // Simulated Local Mode Feed
    let openRequests = DEMO_CUSTOM_REQUESTS.filter(r => r.status === 'open_for_bidding');

    if (degree) openRequests = openRequests.filter(r => r.degree === degree);
    if (semester) openRequests = openRequests.filter(r => r.semester === Number(semester));
    if (subject) openRequests = openRequests.filter(r => r.subject.toLowerCase().includes(subject.toLowerCase()));
    if (search) {
      const q = search.toLowerCase();
      openRequests = openRequests.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.detailed_scope.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: openRequests.length,
      data: openRequests
    });
  } catch (err) {
    console.error('[Get Opportunities Feed Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc   Get single custom request details
 * @route  GET /api/v1/custom-requests/:id
 * @access Protected
 */
export const getSingleCustomRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('custom_requests')
        .select(`
          *,
          buyer:buyer_id (
            id,
            full_name,
            university,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Custom request not found.' });
      }

      return res.status(200).json({ success: true, data });
    }

    const request = DEMO_CUSTOM_REQUESTS.find(r => r.id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Custom request not found.' });
    }

    return res.status(200).json({ success: true, data: request });
  } catch (err) {
    console.error('[Get Single Request Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc   Admin: Get all custom requests for moderation
 * @route  GET /api/v1/custom-requests/admin/moderation
 * @access Protected (Admin)
 */
export const getAdminCustomRequestsQueue = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('custom_requests')
        .select(`
          *,
          buyer:buyer_id (
            full_name,
            email,
            university
          )
        `)
        .order('created_at', { ascending: false });

      if (error) return res.status(400).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, count: data.length, data });
    }

    return res.status(200).json({
      success: true,
      count: DEMO_CUSTOM_REQUESTS.length,
      data: DEMO_CUSTOM_REQUESTS
    });
  } catch (err) {
    console.error('[Admin Custom Requests Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc   Admin: Approve or Reject a custom request
 * @route  PUT /api/v1/custom-requests/admin/:id/moderate
 * @access Protected (Admin)
 */
export const moderateCustomRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_feedback } = req.body; // status: 'open_for_bidding' | 'cancelled'

    if (!['open_for_bidding', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Moderation status must be either "open_for_bidding" or "cancelled".'
      });
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('custom_requests')
        .update({
          status,
          admin_feedback: admin_feedback || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return res.status(400).json({ success: false, message: error.message });
      return res.status(200).json({
        success: true,
        message: `Custom request status updated to ${status}.`,
        data
      });
    }

    const request = DEMO_CUSTOM_REQUESTS.find(r => r.id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    request.status = status;
    request.admin_feedback = admin_feedback || null;

    return res.status(200).json({
      success: true,
      message: `Custom request marked as ${status}.`,
      data: request
    });
  } catch (err) {
    console.error('[Moderate Request Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
