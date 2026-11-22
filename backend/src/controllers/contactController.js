import { isSupabaseConfigured, supabase } from '../config/supabase.js';

// In-memory store for Contact Page settings
let DEMO_CONTACT_SETTINGS = {
  key: 'default_contact',
  headline: 'Get in Touch with studentBazaar',
  subheadline: 'Have questions about university projects, custom requests, or seller verification? We are here to support your academic journey.',
  email: 'support@studentbazaar.pk',
  phone: '+92 300 1234567',
  address: 'FAST-NUCES Student Hub / CS Department, Lahore, Pakistan',
  office_hours: 'Monday to Saturday, 9:00 AM – 7:00 PM (PKT)',
  response_time: 'Usually replies within 2–4 hours during campus hours.',
  social_links: {
    linkedin: 'https://linkedin.com/company/studentbazaar',
    github: 'https://github.com/studentbazaar',
    twitter: 'https://twitter.com/studentbazaar',
    instagram: 'https://instagram.com/studentbazaar'
  },
  updated_at: new Date().toISOString()
};

// In-memory store for Contact Messages
let DEMO_CONTACT_MESSAGES = [
  {
    id: 'msg-demo-01',
    name: 'Hamza Malik',
    email: 'hamza.malik@fast.edu.pk',
    phone: '+92 321 9876543',
    subject: 'Question regarding custom project delivery timeline',
    message: 'Hello studentBazaar team! I want to submit a custom semester project request for Distributed Systems with Raft consensus. Can sellers complete it within 5 days? Thank you!',
    status: 'unread',
    admin_notes: null,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'msg-demo-02',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.s@nust.edu.pk',
    phone: '+92 302 4567890',
    subject: 'Seller Account Verification Inquiry',
    message: 'I submitted my student ID card and GitHub repo for seller verification yesterday. Could you please check when my application will be reviewed? Excited to publish my Web and ML projects.',
    status: 'read',
    admin_notes: 'Verified FAST student ID; pending GitHub code review.',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'msg-demo-03',
    name: 'Zainab Fatima',
    email: 'zainab.f@pucit.edu.pk',
    phone: '+92 333 1122334',
    subject: 'Academic Integrity & Viva Defense Guidance',
    message: 'Does studentBazaar provide viva defense slide templates with architectural project downloads? Our external viva is next month.',
    status: 'replied',
    admin_notes: 'Replied with educational guide link and PowerPoint template info.',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

/**
 * @desc   Submit a message via the public Contact Us form
 * @route  POST /api/v1/contact/messages
 * @access Public
 */
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a message subject.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please write your message.' });
    }

    const newMessageData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      subject: subject.trim(),
      message: message.trim(),
      status: 'unread',
      admin_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([newMessageData])
        .select()
        .single();

      if (error || !data) {
        console.error('[Supabase Contact Insert Error]:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to save your message. Please try again.'
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully! Our academic support team will review it shortly.',
        data
      });
    }

    // In-memory fallback
    const fallbackMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...newMessageData
    };
    DEMO_CONTACT_MESSAGES.unshift(fallbackMessage);

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! Our academic support team will review it shortly.',
      data: fallbackMessage
    });
  } catch (error) {
    console.error('[Submit Contact Message Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit contact message. Please try again.'
    });
  }
};

/**
 * @desc   Get public contact page settings (info, email, phone, office hours, etc.)
 * @route  GET /api/v1/contact/info
 * @access Public
 */
export const getContactSettings = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      try {
        const client = req.supabase || supabase;
        const { data, error } = await client
          .from('contact_settings')
          .select('*')
          .eq('key', 'default_contact')
          .maybeSingle();

        if (!error && data) {
          return res.status(200).json({ success: true, data });
        }
      } catch (dbErr) {
        console.warn('[Supabase Contact Settings DB Error]:', dbErr.message);
      }
    }

    return res.status(200).json({ success: true, data: DEMO_CONTACT_SETTINGS });
  } catch (error) {
    console.error('[Get Contact Settings Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to load contact settings.'
    });
  }
};

/**
 * @desc   Admin: Get all contact messages with filters and search
 * @route  GET /api/v1/admin/contact-messages
 * @access Admin
 */
export const getAdminContactMessages = async (req, res) => {
  try {
    const { status, search } = req.query;

    if (isSupabaseConfigured) {
      let query = req.supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (search && search.trim()) {
        const s = search.trim();
        query = query.or(`name.ilike.%${s}%,email.ilike.%${s}%,subject.ilike.%${s}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[Supabase Admin Contact Messages DB Error]:', error);
        return res.status(500).json({ success: false, message: 'Failed to load contact messages.' });
      }

      const messages = data || [];
      const unreadCount = messages.filter((m) => m.status === 'unread').length;
      return res.status(200).json({
        success: true,
        data: messages,
        unreadCount
      });
    }

    // In-memory fallback
    let filtered = [...DEMO_CONTACT_MESSAGES];
    if (status && status !== 'all') {
      filtered = filtered.filter((m) => m.status === status);
    }
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(s) ||
          m.email.toLowerCase().includes(s) ||
          m.subject.toLowerCase().includes(s)
      );
    }

    const unreadCount = DEMO_CONTACT_MESSAGES.filter((m) => m.status === 'unread').length;

    return res.status(200).json({
      success: true,
      data: filtered,
      unreadCount
    });
  } catch (error) {
    console.error('[Admin Get Contact Messages Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load contact messages.'
    });
  }
};

/**
 * @desc   Admin: Get message details by ID
 * @route  GET /api/v1/admin/contact-messages/:id
 * @access Admin
 */
export const getAdminContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await req.supabase
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('[Supabase Admin Contact Message By ID DB Error]:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve message details.' });
      }

      if (!data) {
        return res.status(404).json({ success: false, message: 'Message not found.' });
      }

      return res.status(200).json({ success: true, data });
    }

    const message = DEMO_CONTACT_MESSAGES.find((m) => m.id === id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    return res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error('[Admin Get Message Detail Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve message details.' });
  }
};

/**
 * @desc   Admin: Update message status ('unread', 'read', 'replied', 'archived') and admin notes
 * @route  PATCH /api/v1/admin/contact-messages/:id
 * @access Admin
 */
export const updateContactMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updates = {
      updated_at: new Date().toISOString()
    };
    if (status) updates.status = status;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    if (isSupabaseConfigured) {
      const { data, error } = await req.supabase
        .from('contact_messages')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('[Supabase Admin Update Contact Message DB Error]:', error);
        return res.status(500).json({ success: false, message: 'Failed to update message.' });
      }

      if (!data) {
        return res.status(404).json({ success: false, message: 'Message not found.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Message status updated successfully.',
        data
      });
    }

    // In-memory fallback
    const msgIndex = DEMO_CONTACT_MESSAGES.findIndex((m) => m.id === id);
    if (msgIndex === -1) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    DEMO_CONTACT_MESSAGES[msgIndex] = {
      ...DEMO_CONTACT_MESSAGES[msgIndex],
      ...updates
    };

    return res.status(200).json({
      success: true,
      message: 'Message updated successfully.',
      data: DEMO_CONTACT_MESSAGES[msgIndex]
    });
  } catch (error) {
    console.error('[Update Contact Message Status Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to update message.' });
  }
};

/**
 * @desc   Admin: Delete contact message
 * @route  DELETE /api/v1/admin/contact-messages/:id
 * @access Admin
 */
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await req.supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle();

      if (error) {
        console.error('[Supabase Admin Delete Contact Message DB Error]:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete message.' });
      }

      if (!data) {
        return res.status(404).json({ success: false, message: 'Message not found.' });
      }

      return res.status(200).json({ success: true, message: 'Message deleted successfully.' });
    }

    const initialLen = DEMO_CONTACT_MESSAGES.length;
    DEMO_CONTACT_MESSAGES = DEMO_CONTACT_MESSAGES.filter((m) => m.id !== id);

    if (DEMO_CONTACT_MESSAGES.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    return res.status(200).json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('[Delete Contact Message Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
};

/**
 * @desc   Admin: Update Contact Page Settings
 * @route  PUT /api/v1/admin/contact-settings
 * @access Admin
 */
export const updateContactSettings = async (req, res) => {
  try {
    const {
      headline,
      subheadline,
      email,
      phone,
      address,
      office_hours,
      response_time,
      social_links
    } = req.body;

    const updatedData = {
      key: 'default_contact',
      headline: headline || DEMO_CONTACT_SETTINGS.headline,
      subheadline: subheadline || DEMO_CONTACT_SETTINGS.subheadline,
      email: email || DEMO_CONTACT_SETTINGS.email,
      phone: phone || DEMO_CONTACT_SETTINGS.phone,
      address: address || DEMO_CONTACT_SETTINGS.address,
      office_hours: office_hours || DEMO_CONTACT_SETTINGS.office_hours,
      response_time: response_time || DEMO_CONTACT_SETTINGS.response_time,
      social_links: social_links || DEMO_CONTACT_SETTINGS.social_links,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && req.supabase) {
      try {
        const { data, error } = await req.supabase
          .from('contact_settings')
          .upsert([updatedData], { onConflict: 'key' })
          .select()
          .single();

        if (!error && data) {
          DEMO_CONTACT_SETTINGS = data;
          return res.status(200).json({
            success: true,
            message: 'Contact page settings updated successfully.',
            data
          });
        }
      } catch (dbErr) {
        console.warn('[Supabase Update Contact Settings DB Error]:', dbErr.message);
      }
    }

    DEMO_CONTACT_SETTINGS = {
      ...DEMO_CONTACT_SETTINGS,
      ...updatedData
    };

    return res.status(200).json({
      success: true,
      message: 'Contact page settings updated successfully.',
      data: DEMO_CONTACT_SETTINGS
    });
  } catch (error) {
    console.error('[Update Contact Settings Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update contact settings.'
    });
  }
};

export const getUnreadMessagesCount = () => {
  return DEMO_CONTACT_MESSAGES.filter((m) => m.status === 'unread').length;
};
