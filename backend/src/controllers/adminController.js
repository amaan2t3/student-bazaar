export const getDashboardStats = async (req, res) => {
  try {
    if (!req.supabase) {
      return res.status(503).json({ success: false, message: 'Dashboard data is unavailable until Supabase is configured.' });
    }

    const { data: totalsData, error: totalsError } = await req.supabase.rpc('admin_dashboard_totals');
    if (totalsError) return res.status(400).json({ success: false, message: totalsError.message });

    const { count: unreadMessagesCount, error: countError } = await req.supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'unread');
    if (countError) return res.status(400).json({ success: false, message: countError.message });

    const totals = Array.isArray(totalsData) ? totalsData[0] : totalsData;
    return res.status(200).json({
      success: true,
      data: {
        total_paid_revenue: Number(totals?.total_paid_revenue || 0),
        total_request_budget: Number(totals?.total_request_budget || 0),
        unread_contact_messages: unreadMessagesCount || 0
      }
    });
  } catch (error) {
    console.error('[Admin Dashboard Stats Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error loading admin dashboard totals.' });
  }
};
