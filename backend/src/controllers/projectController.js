import { supabase, isSupabaseConfigured } from '../config/supabase.js';

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

// Seed in-memory projects for local simulated mode
let DEMO_PROJECTS = [
  {
    id: 'proj-1',
    seller_id: 'usr-seller-01',
    seller: {
      name: 'Muhammad Usman',
      university: 'PUCIT Lahore',
      rating: 4.95,
      salesCount: 42,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    title: 'Hospital Management & Electronic Health Records System',
    slug: 'hospital-management-system-mysql-csharp',
    summary: 'Comprehensive relational DBMS semester project with 18 3NF normalized tables, stored procedures, triggers, and full C# GUI.',
    detailed_description: 'A high-distinction Database Systems semester project tailored for BSCS and BSIT students. Features clean architecture separating the data access layer (DAL) from the presentation layer.\n\nIncludes patient admission tracking, doctor duty scheduling, automated pharmacy inventory billing, lab test reporting, and admin analytics dashboards with exportable PDF receipts. Fully compliant with university rubric requirements.',
    degree: 'BSIT',
    semester: 4,
    subject: 'Database Systems',
    category: 'Database Management Systems',
    price_pkr: 2800,
    difficulty: 'intermediate',
    technologies: ['MySQL', 'C#', '.NET', 'SQL Server', 'Crystal Reports'],
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800'
    ],
    demo_video_url: null,
    features_list: ['Patient EMR Record Tracking', 'Pharmacy Inventory Automation', 'Role-Based Staff Login', 'PDF Invoice Export'],
    system_prerequisites: ['Visual Studio 2022', 'MySQL Server 8.0 or XAMPP', '.NET Framework 4.8'],
    installation_guide: '1. Import hospital_db.sql into MySQL. 2. Open HospitalSystem.sln in Visual Studio. 3. Update connection string in App.config. 4. Press F5 to build and launch.',
    package_includes: [
      { name: 'Complete Runnable C# .NET Source Code (.zip)', ready: true },
      { name: 'MySQL Database Script (.sql) with Seed Dummy Data', ready: true },
      { name: 'Normalized Schema Diagram (1NF, 2NF, 3NF Proofs)', ready: true },
      { name: 'Full SRS Documentation (IEEE 830 Standard, 32 Pages)', ready: true },
      { name: 'Presentation Slides (18 PowerPoint Slides for Viva)', ready: true }
    ],
    total_sales_count: 42,
    average_rating: 4.90,
    ratings_count: 38,
    status: 'approved',
    moderation_feedback: null,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'proj-2',
    seller_id: 'usr-seller-01',
    seller: {
      name: 'Ayesha Tariq',
      university: 'FAST-NUCES Islamabad',
      rating: 4.88,
      salesCount: 31,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'
    },
    title: 'University Campus Event & Ticket Booking Web Application',
    slug: 'mern-campus-event-management-portal',
    summary: 'Full-stack MERN portal featuring JWT authentication, role-based dashboards (Student, Society Head, Admin), and QR code verification.',
    detailed_description: 'Production-ready Web Engineering semester project built using MongoDB, Express.js, React 18, and Node.js. Allows student societies to publish academic competitions, hackathons, and sports events with live QR ticketing.',
    degree: 'BSSE',
    semester: 5,
    subject: 'Web Engineering',
    category: 'Web Engineering & Full Stack',
    price_pkr: 3500,
    difficulty: 'advanced',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
    screenshots: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    ],
    features_list: ['Student Ticket Booking', 'QR Code Attendance Scanner', 'Society Head Dashboard', 'Analytics & Export'],
    system_prerequisites: ['Node.js 18+', 'MongoDB Atlas or Local MongoDB', 'Modern Browser'],
    installation_guide: '1. npm install in frontend and backend. 2. Configure .env with MONGO_URI. 3. npm run dev.',
    package_includes: [
      { name: 'Full MERN Stack Source Code (Clean Controllers & Routes)', ready: true },
      { name: 'MongoDB Database Seed Script (.json / mongo-dump)', ready: true },
      { name: 'Postman Collection with 24 Documented REST Endpoints', ready: true },
      { name: 'Software Requirements Specification (SRS - 28 Pages)', ready: true }
    ],
    total_sales_count: 31,
    average_rating: 4.85,
    ratings_count: 29,
    status: 'approved',
    moderation_feedback: null,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

/**
 * @desc   Get public approved projects with academic filters
 * @route  GET /api/v1/projects
 * @access Public
 */
export const getProjects = async (req, res) => {
  try {
    const { degree, semester, subject, difficulty, maxPrice, search, sortBy } = req.query;

    if (isSupabaseConfigured) {
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
      if (error) return res.status(400).json({ success: false, message: error.message });

      return res.status(200).json({ success: true, count: data.length, data });
    }

    // Simulated Local Mode Filtering
    let results = DEMO_PROJECTS.filter(p => p.status === 'approved');

    if (degree) results = results.filter(p => p.degree === degree);
    if (semester) results = results.filter(p => p.semester === Number(semester));
    if (subject) results = results.filter(p => p.subject.toLowerCase().includes(subject.toLowerCase()));
    if (difficulty) results = results.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    if (maxPrice) results = results.filter(p => p.price_pkr <= Number(maxPrice));
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.summary.toLowerCase().includes(q) || 
        p.subject.toLowerCase().includes(q) ||
        p.technologies.some(t => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price_asc') results.sort((a, b) => a.price_pkr - b.price_pkr);
    else if (sortBy === 'price_desc') results.sort((a, b) => b.price_pkr - a.price_pkr);
    else if (sortBy === 'rating') results.sort((a, b) => b.average_rating - a.average_rating);
    else results.sort((a, b) => b.total_sales_count - a.total_sales_count);

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
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
    const { slug } = req.params;

    if (isSupabaseConfigured) {
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
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Project not found.' });
      }

      return res.status(200).json({ success: true, data });
    }

    const project = DEMO_PROJECTS.find(p => p.slug === slug);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.status(200).json({ success: true, data: project });
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
      package_includes,
      archive_file_name,
      archive_size_bytes
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
      const { data: newProject, error } = await supabase
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
          technologies: Array.isArray(technologies) ? technologies : [technologies],
          difficulty: difficulty || 'intermediate',
          price_pkr: Number(price_pkr),
          screenshots: Array.isArray(screenshots) ? screenshots : [screenshots],
          demo_video_url: demo_video_url || null,
          features_list: Array.isArray(features_list) ? features_list : [],
          system_prerequisites: Array.isArray(system_prerequisites) ? system_prerequisites : [],
          installation_guide,
          package_includes: package_includes || [],
          status: 'pending' // Listings must be approved by admin before public display
        }])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      // Store file metadata in project_files table
      await supabase
        .from('project_files')
        .insert([{
          project_id: newProject.id,
          archive_storage_key: `vault/projects/${newProject.id}/${slug}.zip`,
          archive_file_name: archive_file_name || `${slug}-package.zip`,
          archive_size_bytes: archive_size_bytes || 15400000,
          included_database_dump: true
        }]);

      return res.status(201).json({
        success: true,
        message: 'Project listing submitted successfully! It will go live after admin approval.',
        data: newProject
      });
    }

    // Simulated Local Mode
    const newMockProject = {
      id: `proj-${Date.now()}`,
      seller_id: req.user.id,
      seller: {
        name: req.user.full_name || req.user.name,
        university: req.user.university,
        rating: 5.0,
        salesCount: 0,
        avatar: req.user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
      },
      title,
      slug,
      summary,
      detailed_description,
      category: category || 'Web Development',
      degree,
      semester: Number(semester),
      subject,
      technologies: Array.isArray(technologies) ? technologies : [technologies],
      difficulty: difficulty || 'intermediate',
      price_pkr: Number(price_pkr),
      screenshots: Array.isArray(screenshots) && screenshots.length > 0 ? screenshots : [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
      ],
      demo_video_url: demo_video_url || null,
      features_list: Array.isArray(features_list) ? features_list : ['Complete Core Module', 'Clean Architecture', 'User Authentication'],
      system_prerequisites: Array.isArray(system_prerequisites) ? system_prerequisites : ['VS Code', 'Modern Browser', 'Git'],
      installation_guide,
      package_includes: package_includes || [
        { name: 'Source Code Package (.zip)', ready: true },
        { name: 'Database SQL / Mongo dump', ready: true },
        { name: 'IEEE SRS Documentation (PDF)', ready: true },
        { name: 'Presentation Slides (PPTX)', ready: true }
      ],
      total_sales_count: 0,
      average_rating: 0,
      ratings_count: 0,
      status: 'pending', // Starts in pending review
      moderation_feedback: null,
      created_at: new Date().toISOString()
    };

    DEMO_PROJECTS.unshift(newMockProject);

    return res.status(201).json({
      success: true,
      message: 'Project listing submitted successfully! Enters admin approval queue.',
      data: newMockProject
    });
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
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('seller_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) return res.status(400).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, data });
    }

    // In local simulated mode, return projects matching user or all demo projects if seller
    const myProjects = DEMO_PROJECTS.filter(p => p.seller_id === req.user.id || req.user.role === 'seller');
    return res.status(200).json({
      success: true,
      data: myProjects
    });
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
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          seller:seller_id (
            full_name,
            university,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) return res.status(400).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, data });
    }

    return res.status(200).json({
      success: true,
      data: DEMO_PROJECTS
    });
  } catch (err) {
    console.error('[Admin Queue Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
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
      const { data, error } = await supabase
        .from('projects')
        .update({
          status,
          moderation_feedback: moderation_feedback || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return res.status(400).json({ success: false, message: error.message });
      return res.status(200).json({
        success: true,
        message: `Project listing has been ${status}.`,
        data
      });
    }

    const project = DEMO_PROJECTS.find(p => p.id === id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    project.status = status;
    project.moderation_feedback = moderation_feedback || null;

    return res.status(200).json({
      success: true,
      message: `Project listing has been marked as ${status}.`,
      data: project
    });
  } catch (err) {
    console.error('[Moderate Project Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
