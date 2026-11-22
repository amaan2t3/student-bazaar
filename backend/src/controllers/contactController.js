import { isSupabaseConfigured, supabase } from '../config/supabase.js';

/**
 * @desc   Submit a message via the public Contact Us form
 * @route  POST /api/v1/contact/messages
 * @access Public
 */
export const submitContactMessage = async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      return res.status(503).json({ success: false, message: 'Contact messaging is unavailable until Supabase is configured.' });
    }

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
      const { error } = await supabase
        .from('contact_messages')
        .insert([newMessageData]);

      if (error) {
        console.error('[Supabase Contact Insert Error]:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to save your message. Please try again.'
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully! Our academic support team will review it shortly.',
        data: newMessageData
      });
    }

    return res.status(503).json({ success: false, message: 'Contact messaging is unavailable until Supabase is configured.' });
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
    if (!isSupabaseConfigured) {
      return res.status(503).json({ success: false, message: 'Contact information is unavailable until Supabase is configured.' });
    }

    const client = req.supabase || supabase;
    const { data, error } = await client
      .from('contact_settings')
      .select('*')
      .eq('key', 'default_contact')
      .maybeSingle();

    if (error) {
      console.error('[Supabase Contact Settings DB Error]:', error);
      return res.status(500).json({ success: false, message: 'Unable to load contact settings.' });
    }
    if (!data) return res.status(404).json({ success: false, message: 'Contact settings have not been configured.' });

    return res.status(200).json({ success: true, data });
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

    return res.status(503).json({ success: false, message: 'Contact message storage is unavailable until Supabase is configured.' });
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

    return res.status(503).json({ success: false, message: 'Contact message storage is unavailable until Supabase is configured.' });
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

    return res.status(503).json({ success: false, message: 'Contact message storage is unavailable until Supabase is configured.' });
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

    return res.status(503).json({ success: false, message: 'Contact message storage is unavailable until Supabase is configured.' });
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

    if (!isSupabaseConfigured || !req.supabase) {
      return res.status(503).json({ success: false, message: 'Contact settings are unavailable until Supabase is configured.' });
    }

    if ([headline, subheadline, email, phone, address, office_hours, response_time]
      .some((value) => typeof value !== 'string' || !value.trim())) {
      return res.status(400).json({ success: false, message: 'Complete contact information is required.' });
    }

    const updatedData = {
      key: 'default_contact',
      headline: headline.trim(),
      subheadline: subheadline.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      office_hours: office_hours.trim(),
      response_time: response_time.trim(),
      social_links: social_links || {},
      updated_at: new Date().toISOString()
    };

    const { data, error } = await req.supabase
      .from('contact_settings')
      .upsert([updatedData], { onConflict: 'key' })
      .select()
      .single();

    if (error) {
      console.error('[Supabase Update Contact Settings DB Error]:', error);
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact page settings updated successfully.',
      data
    });
  } catch (error) {
    console.error('[Update Contact Settings Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update contact settings.'
    });
  }
};
