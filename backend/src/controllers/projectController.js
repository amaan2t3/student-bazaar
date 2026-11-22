import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { sendAdminDecisionEmail } from '../services/adminNotificationService.js';

// Helper for clean slug generation
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .concat('-', Math.random().toString(36).substring(2, 6));
};

/**
 * @desc   Get public approved projects with academic filters
 * @route  GET /api/v1/projects
 * @access Public
 */
export const getProjects = async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      return res.status(503).json({ success: false, message: 'Project catalog is unavailable until Supabase is configured.' });
    }

    const { degree, semester, subject, difficulty, maxPrice, search, sortBy } = req.query;

    let query = supabase
        .from('projects')
        .select(`
          *,
          seller:seller_id (
            full_name,
            university,
            avatar_url
          )
        `)
        .eq('status', 'approved');

      if (degree) query = query.eq('degree', degree);
      if (semester) query = query.eq('semester', Number(semester));
      if (subject) query = query.ilike('subject', `%${subject}%`);
      if (difficulty) query = query.eq('difficulty', difficulty.toLowerCase());
      if (maxPrice) query = query.lte('price_pkr', Number(maxPrice));
      if (search) query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,subject.ilike.%${search}%`);

      if (sortBy === 'price_asc') query = query.order('price_pkr', { ascending: true });
      else if (sortBy === 'price_desc') query = query.order('price_pkr', { ascending: false });
      else if (sortBy === 'rating') query = query.order('average_rating', { ascending: false });
      else query = query.order('total_sales_count', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error('[Supabase Projects Query Error]:', error.message);
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('[Get Projects Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving projects.' });
  }
};

/**
 * @desc   Get single project by slug
 * @route  GET /api/v1/projects/:slug
 * @access Public
 */
export const getProjectBySlug = async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      return res.status(503).json({ success: false, message: 'Project catalog is unavailable until Supabase is configured.' });
    }

    const { slug } = req.params;

    const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          seller:seller_id (
            id,
            full_name,
            university,
            avatar_url
          )
        `)
        .eq('slug', slug)
        .eq('status', 'approved')
        .single();

    if (error || !data) {
      if (error?.code !== 'PGRST116') {
        console.error('[Supabase Project Detail Query Error]:', error);
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('[Get Single Project Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc   Create new project listing
 * @route  POST /api/v1/projects
 * @access Protected (Seller & Admin)
 */
export const createProject = async (req, res) => {
  try {
    const {
      title,
      summary,
      detailed_description,
      category,
      degree,
      semester,
      subject,
      technologies,
      difficulty,
      price_pkr,
      screenshots,
      demo_video_url,
      features_list,
      system_prerequisites,
      installation_guide,
      package_includes
    } = req.body;

    if (!title || !summary || !detailed_description || !degree || !semester || !subject || !price_pkr || !installation_guide) {
      return res.status(400).json({
        success: false,
        message: 'Missing required project fields (title, summary, description, degree, semester, subject, price, installation_guide).'
      });
    }

    if (Number(price_pkr) < 500) {
      return res.status(400).json({
        success: false,
        message: 'Minimum project price is PKR 500.'
      });
    }

    const slug = slugify(title);

    if (isSupabaseConfigured) {
      const { data: newProject, error } = await req.supabase
        .from('projects')
        .insert([{
          seller_id: req.user.id,
          title,
          slug,
          summary,
          detailed_description,
          category: category || 'Web Development',
          degree,
          semester: Number(semester),
          subject,
          technologies: Array.isArray(technologies) ? technologies : (technologies ? [technologies] : []),
          difficulty: difficulty || 'intermediate',
          price_pkr: Number(price_pkr),
          screenshots: Array.isArray(screenshots) ? screenshots.filter(Boolean) : (screenshots ? [screenshots] : []),
          demo_video_url: demo_video_url || null,
          features_list: Array.isArray(features_list) ? features_list : [],
          system_prerequisites: Array.isArray(system_prerequisites) ? system_prerequisites : [],
          installation_guide,
          package_includes: package_includes || [],
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      let projectToReturn = newProject;
      if (req.user.role === 'admin') {
        const { data: publishedProject, error: publishError } = await req.supabase
          .from('projects')
          .update({ status: 'approved', updated_at: new Date().toISOString() })
          .eq('id', newProject.id)
          .select()
          .single();

        if (publishError) {
          console.error('[Publish Admin Project Error]:', publishError);
          return res.status(500).json({
            success: false,
            message: 'Project was created but could not be published. Review it in the admin queue.'
          });
        }
        projectToReturn = publishedProject;
      }

      return res.status(201).json({
        success: true,
        message: req.user.role === 'admin'
          ? 'Ready-made project created and published.'
          : 'Project listing submitted successfully! It will go live after admin approval.',
        data: projectToReturn
      });
    }

    return res.status(503).json({ success: false, message: 'Project creation is unavailable until Supabase is configured.' });
  } catch (err) {
    console.error('[Create Project Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error creating project.' });
  }
};

/**
 * @desc   Get projects created by logged-in seller
 * @route  GET /api/v1/projects/seller/my-projects
 * @access Protected (Seller)
 */
export const getSellerProjects = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await req.supabase
        .from('projects')
        .select('*')
        .eq('seller_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Admin Queue Error]:', error.message);
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(200).json({ success: true, data });
    }

    return res.status(503).json({ success: false, message: 'Project catalog is unavailable until Supabase is configured.' });
  } catch (err) {
    console.error('[Get Seller Projects Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc   Get admin project moderation queue
 * @route  GET /api/v1/projects/admin/moderation
 * @access Protected (Admin)
 */
export const getAdminModerationQueue = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await req.supabase
        .from('projects')
        .select(`
          *,
          seller:seller_id (
            full_name,
            university
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Admin Queue Error]:', error.message);
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(200).json({ success: true, data });
    }

    return res.status(503).json({ success: false, message: 'Project catalog is unavailable until Supabase is configured.' });
  } catch (err) {
    console.error('[Admin Queue Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const getAdminProjectById = async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('projects')
      .select(`
        *,
        seller:seller_id (
          full_name,
          university,
          avatar_url
        )
      `)
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) return res.status(400).json({ success: false, message: error.message });
    if (!data) return res.status(404).json({ success: false, message: 'Project not found.' });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[Admin Project Details Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error loading project details.' });
  }
};

export const updateAdminProject = async (req, res) => {
  try {
    const {
      title,
      summary,
      detailed_description,
      category,
      degree,
      semester,
      subject,
      technologies,
      difficulty,
      price_pkr,
      screenshots,
      demo_video_url,
      features_list,
      system_prerequisites,
      installation_guide,
      package_includes
    } = req.body;

    if (!title?.trim() || !summary?.trim() || !detailed_description?.trim() ||
        !category?.trim() || !degree || !semester || !subject?.trim() ||
        !installation_guide?.trim() || !Number.isFinite(Number(price_pkr)) ||
        Number(price_pkr) < 500) {
      return res.status(400).json({
        success: false,
        message: 'Valid project details and a price of at least PKR 500 are required.'
      });
    }

    const { data: current, error: currentError } = await req.supabase
      .from('projects')
      .select('id, title')
      .eq('id', req.params.id)
      .maybeSingle();

    if (currentError) return res.status(400).json({ success: false, message: currentError.message });
    if (!current) return res.status(404).json({ success: false, message: 'Project not found.' });

    const updates = {
      title: title.trim(),
      summary: summary.trim(),
      detailed_description: detailed_description.trim(),
      category: category.trim(),
      degree,
      semester: Number(semester),
      subject: subject.trim(),
      technologies: Array.isArray(technologies) ? technologies.filter(Boolean) : [],
      difficulty,
      price_pkr: Number(price_pkr),
      screenshots: Array.isArray(screenshots) ? screenshots.filter(Boolean) : [],
      demo_video_url: demo_video_url || null,
      features_list: Array.isArray(features_list) ? features_list : [],
      system_prerequisites: Array.isArray(system_prerequisites) ? system_prerequisites.filter(Boolean) : [],
      installation_guide: installation_guide.trim(),
      package_includes: Array.isArray(package_includes) ? package_includes : [],
      updated_at: new Date().toISOString()
    };

    if (title.trim() !== current.title) updates.slug = slugify(title);

    const { data, error } = await req.supabase
      .from('projects')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: 'Project updated successfully.', data });
  } catch (error) {
    console.error('[Admin Project Update Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error updating project.' });
  }
};

export const deleteAdminProject = async (req, res) => {
  try {
    const { count, error: ordersError } = await req.supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', req.params.id);

    if (ordersError) return res.status(400).json({ success: false, message: ordersError.message });
    if (count > 0) {
      return res.status(409).json({
        success: false,
        message: 'This project has purchase history and cannot be deleted.'
      });
    }

    const { data, error } = await req.supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id)
      .select('id')
      .maybeSingle();

    if (error?.code === '23503') {
      return res.status(409).json({
        success: false,
        message: 'This project is referenced by other records and cannot be deleted.'
      });
    }
    if (error) return res.status(400).json({ success: false, message: error.message });
    if (!data) return res.status(404).json({ success: false, message: 'Project not found.' });

    return res.status(200).json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('[Admin Project Delete Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting project.' });
  }
};

/**
 * @desc   Admin: Approve or Reject a project listing
 * @route  PUT /api/v1/projects/admin/:id/moderate
 * @access Protected (Admin)
 */
export const moderateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, moderation_feedback } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Moderation status must be "approved" or "rejected".'
      });
    }

    if (isSupabaseConfigured) {
      const { data, error } = await req.supabase
        .from('projects')
        .update({
          status,
          moderation_feedback: moderation_feedback || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Admin Queue Error]:', error.message);
        return res.status(400).json({ success: false, message: error.message });
      }
      const notification = await sendAdminDecisionEmail(req.supabase, {
        userId: data.seller_id,
        subject: `StudentBazaar project listing ${status}: ${data.title}`,
        text: [
          `Your ready-made project "${data.title}" was ${status}.`,
          `Listed amount: PKR ${Number(data.price_pkr).toLocaleString()}.`,
          `Admin note: ${data.moderation_feedback || 'No additional note was provided.'}`
        ].join('\n')
      });

      return res.status(200).json({
        success: true,
        message: notification.sent
          ? `Project listing ${status}. A notification email was sent.`
          : `Project listing ${status}, but the email was not sent: ${notification.message}`,
        notification,
        data
      });
    }

    return res.status(503).json({ success: false, message: 'Project moderation is unavailable until Supabase is configured.' });
  } catch (err) {
    console.error('[Moderate Project Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
