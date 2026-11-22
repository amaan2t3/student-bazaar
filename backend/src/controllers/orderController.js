import crypto from 'crypto';
import { isSupabaseConfigured } from '../config/supabase.js';

/**
 * @desc   Checkout and purchase ready-made project package
 * @route  POST /api/v1/orders/checkout
 * @access Protected (Buyer)
 */
export const checkout = async (req, res) => {
  try {
    const { projectId, paymentMethod } = req.body;

    if (!projectId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and payment method are required.'
      });
    }

    const orderNumber = `SB-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const transactionReference = `TXN-${paymentMethod.substring(0, 4).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Live Supabase Transaction
    if (isSupabaseConfigured) {
      // 1. Fetch project price and seller
      const { data: project, error: projErr } = await req.supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('status', 'approved')
        .single();

      if (projErr || !project) {
        return res.status(404).json({ success: false, message: 'Project not found.' });
      }

      const totalAmount = Number(project.price_pkr);
      const platformCommission = Math.round(totalAmount * 0.15); // 15% Platform fee
      const sellerEarnings = totalAmount - platformCommission; // 85% to seller

      // 2. Insert Order record
      const { data: newOrder, error: orderErr } = await req.supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          buyer_id: req.user.id,
          seller_id: project.seller_id,
          order_type: 'ready_made',
          project_id: project.id,
          total_amount_pkr: totalAmount,
          platform_commission_pkr: platformCommission,
          seller_net_earnings_pkr: sellerEarnings,
          payment_status: 'paid',
          fulfillment_status: 'completed'
        }])
        .select()
        .single();

      if (orderErr) {
        return res.status(400).json({ success: false, message: orderErr.message });
      }

      // 3. Insert Payment record
      const { error: paymentError } = await req.supabase
        .from('payments')
        .insert([{
          order_id: newOrder.id,
          payer_id: req.user.id,
          amount_pkr: totalAmount,
          payment_method: paymentMethod,
          transaction_reference: transactionReference,
          status: 'successful'
        }]);

      if (paymentError) {
        console.error('[Checkout Payment Record Error]:', paymentError);
        return res.status(500).json({ success: false, message: 'Order created but payment record could not be saved.' });
      }

      // 4. Increment project sales and credit seller wallet
      const { error: salesError } = await req.supabase.rpc('increment_project_sales', { project_id_param: project.id });
      if (salesError) {
        console.error('[Checkout Sales Update Error]:', salesError);
        return res.status(500).json({ success: false, message: 'Order created but project sales could not be updated.' });
      }
      
      return res.status(201).json({
        success: true,
        message: 'Payment verified and order placed successfully!',
        data: {
          order: newOrder,
          receipt: {
            orderNumber,
            transactionReference,
            totalAmountPKR: totalAmount,
            paymentMethod,
            timestamp: new Date().toISOString()
          }
        }
      });
    }

    return res.status(503).json({ success: false, message: 'Checkout is unavailable until Supabase is configured.' });
  } catch (err) {
    console.error('[Checkout Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error processing checkout.' });
  }
};

/**
 * @desc   Get current student's purchased project packages
 * @route  GET /api/v1/orders/my-purchases
 * @access Protected (Buyer)
 */
export const getMyPurchases = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await req.supabase
        .from('orders')
        .select(`
          *,
          project:project_id (
            id,
            title,
            slug,
            degree,
            semester,
            subject,
            price_pkr,
            screenshots,
            package_includes,
            installation_guide
          ),
          payment:payments(
            transaction_reference,
            payment_method,
            created_at
          )
        `)
        .eq('buyer_id', req.user.id)
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false });

      if (error) return res.status(400).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, count: data.length, data });
    }

    return res.status(503).json({ success: false, message: 'Purchase history is unavailable until Supabase is configured.' });
  } catch (err) {
    console.error('[Get Purchases Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving purchases.' });
  }
};

/**
 * @desc   Generate short-lived signed download URL (15-Minute Expiry)
 * @route  GET /api/v1/downloads/:projectId
 * @access Protected (Verified Buyer only)
 */
export const generateSecureDownloadUrl = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 1. STRICT AUTHORIZATION CHECK: Does the user own a paid order for this project?
    if (isSupabaseConfigured) {
      const { data: order, error } = await req.supabase
        .from('orders')
        .select('id, payment_status')
        .eq('buyer_id', req.user.id)
        .eq('project_id', projectId)
        .eq('payment_status', 'paid')
        .maybeSingle();

      if (error) {
        console.error('[Download Order Verification Error]:', error);
        return res.status(500).json({ success: false, message: 'Unable to verify your purchase.' });
      }
      if (!order) {
        return res.status(403).json({
          success: false,
          message: 'You must purchase this project before requesting its download.'
        });
      }
    }

    if (!isSupabaseConfigured) {
      return res.status(503).json({ success: false, message: 'Downloads are unavailable until Supabase is configured.' });
    }

    return res.status(501).json({
      success: false,
      message: 'Project archive storage is not configured, so downloads are not available yet.'
    });
  } catch (err) {
    console.error('[Download URL Generation Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error generating secure download URL.' });
  }
};
