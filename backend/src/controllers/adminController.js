export const getDashboardStats = async (req, res) => {
  try {
    const { data, error } = await req.supabase.rpc('admin_dashboard_totals');
    if (error) {
      console.error('[Admin Dashboard Stats Error]:', error);
      return res.status(500).json({
        success: false,
        message: 'Unable to load admin dashboard totals. Apply the latest Supabase schema or migration.'
      });
    }

    const totals = Array.isArray(data) ? data[0] : data;
    if (!totals) {
      return res.status(500).json({ success: false, message: 'Admin dashboard totals are unavailable.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        total_paid_revenue: Number(totals.total_paid_revenue || 0),
        total_request_budget: Number(totals.total_request_budget || 0)
      }
    });
  } catch (error) {
    console.error('[Admin Dashboard Stats Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error loading admin dashboard totals.' });
  }
};
