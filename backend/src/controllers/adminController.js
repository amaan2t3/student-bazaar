import { getUnreadMessagesCount } from './contactController.js';

export const getDashboardStats = async (req, res) => {
  try {
    let totalPaidRevenue = 0;
    let totalRequestBudget = 0;
    let unreadMessagesCount = getUnreadMessagesCount();

    if (req.supabase) {
      try {
        const { data, error } = await req.supabase.rpc('admin_dashboard_totals');
        if (!error && data) {
          const totals = Array.isArray(data) ? data[0] : data;
          if (totals) {
            totalPaidRevenue = Number(totals.total_paid_revenue || 0);
            totalRequestBudget = Number(totals.total_request_budget || 0);
          }
        }
      } catch (rpcErr) {
        console.warn('[Admin Dashboard Stats RPC Warning]:', rpcErr.message);
      }

      try {
        const { count, error: countErr } = await req.supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'unread');

        if (!countErr && typeof count === 'number') {
          unreadMessagesCount = count;
        }
      } catch (countErr) {
        // Fallback to in-memory count
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        total_paid_revenue: totalPaidRevenue,
        total_request_budget: totalRequestBudget,
        unread_contact_messages: unreadMessagesCount
      }
    });
  } catch (error) {
    console.error('[Admin Dashboard Stats Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error loading admin dashboard totals.' });
  }
};
