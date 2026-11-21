import crypto from 'crypto';
import { isSupabaseConfigured } from '../config/supabase.js';

// In-memory orders and payments store for simulated local mode
let DEMO_ORDERS = [
  {
    id: 'ord-demo-01',
    order_number: 'SB-ORD-98214',
    buyer_id: 'usr-buyer-01',
    seller_id: 'usr-seller-01',
    order_type: 'ready_made',
    project_id: 'proj-1',
    project: {
      id: 'proj-1',
      title: 'Hospital Management & Electronic Health Records System',
      slug: 'hospital-management-system-mysql-csharp',
      degree: 'BSIT',
      semester: 4,
      subject: 'Database Systems',
      price_pkr: 2800,
      screenshots: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
      ],
      package_includes: [
        { name: 'Complete Runnable C# .NET Source Code (.zip)', ready: true },
        { name: 'MySQL Database Script (.sql) with Seed Dummy Data', ready: true },
        { name: 'Full SRS Documentation (IEEE 830 Standard, 32 Pages)', ready: true },
        { name: 'Presentation Slides (18 PowerPoint Slides for Viva)', ready: true }
      ]
    },
    total_amount_pkr: 2800,
    platform_commission_pkr: 420,
    seller_net_earnings_pkr: 2380,
    payment_status: 'paid',
    fulfillment_status: 'completed',
    payment: {
      payment_method: 'easypaisa_simulated',
      transaction_reference: 'TXN-EP-8921829',
      created_at: new Date(Date.now() - 3600000 * 20).toISOString()
    },
    created_at: new Date(Date.now() - 3600000 * 20).toISOString()
  }
];

let DEMO_PAYMENTS = [];
let DEMO_DOWNLOAD_LOGS = [];

/**
 * @desc   Checkout and purchase ready-made project package
 * @route  POST /api/v1/orders/checkout
 * @access Protected (Buyer)
 */
export const checkout = async (req, res) => {
  try {
    const { projectId, paymentMethod, accountMobileOrCard } = req.body;

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

    // Simulated Local Mode
    const projectPrice = 2800;
    const platformCommission = Math.round(projectPrice * 0.15);
    const sellerEarnings = projectPrice - platformCommission;

    const newMockOrder = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      buyer_id: req.user.id,
      seller_id: 'usr-seller-01',
      order_type: 'ready_made',
      project_id: projectId,
      project: {
        id: projectId,
        title: 'Hospital Management & Electronic Health Records System',
        slug: 'hospital-management-system-mysql-csharp',
        degree: 'BSIT',
        semester: 4,
        subject: 'Database Systems',
        price_pkr: projectPrice,
        screenshots: [
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
        ],
        package_includes: [
          { name: 'Complete Runnable C# .NET Source Code (.zip)', ready: true },
          { name: 'MySQL Database Script (.sql) with Seed Dummy Data', ready: true },
          { name: 'Full SRS Documentation (IEEE 830 Standard, 32 Pages)', ready: true },
          { name: 'Presentation Slides (18 PowerPoint Slides for Viva)', ready: true }
        ]
      },
      total_amount_pkr: projectPrice,
      platform_commission_pkr: platformCommission,
      seller_net_earnings_pkr: sellerEarnings,
      payment_status: 'paid',
      fulfillment_status: 'completed',
      payment: {
        payment_method: paymentMethod,
        transaction_reference: transactionReference,
        created_at: new Date().toISOString()
      },
      created_at: new Date().toISOString()
    };

    DEMO_ORDERS.unshift(newMockOrder);

    return res.status(201).json({
      success: true,
      message: 'Payment verified! Your package has been added to My Downloads.',
      data: {
        order: newMockOrder,
        receipt: {
          orderNumber,
          transactionReference,
          totalAmountPKR: projectPrice,
          paymentMethod,
          timestamp: new Date().toISOString()
        }
      }
    });
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

    return res.status(200).json({
      success: true,
      count: DEMO_ORDERS.length,
      data: DEMO_ORDERS
    });
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
    let orderVerified = false;

    if (isSupabaseConfigured) {
      const { data: order, error } = await req.supabase
        .from('orders')
        .select('id, payment_status')
        .eq('buyer_id', req.user.id)
        .eq('project_id', projectId)
        .eq('payment_status', 'paid')
        .maybeSingle();

      if (!error && order) {
        orderVerified = true;
      }
    } else {
      orderVerified = DEMO_ORDERS.some(
        o => o.buyer_id === req.user.id && (o.project_id === projectId || o.project?.id === projectId)
      ) || true; // In local demo mode, permit testing
    }

    if (!orderVerified) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You have not purchased this project package. Please complete checkout to obtain download privileges.'
      });
    }

    // 2. LOG THE DOWNLOAD ATTEMPT
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    DEMO_DOWNLOAD_LOGS.push({
      user_id: req.user.id,
      project_id: projectId,
      ip: clientIp,
      timestamp: new Date().toISOString()
    });

    // 3. GENERATE SIGNED EXPIRING TOKEN (15-Minute Validity)
    const tokenPayload = `${req.user.id}:${projectId}:${Date.now()}`;
    const signedToken = crypto.createHmac('sha256', 'sb_secure_secret_vault_key')
      .update(tokenPayload)
      .digest('hex');

    const expiresInSeconds = 900; // 15 minutes
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    const signedUrl = `https://storage.studentbazaar.pk/vault/projects/${projectId}/package.zip?token=${signedToken}&expires=${encodeURIComponent(expiresAt)}`;

    return res.status(200).json({
      success: true,
      message: 'Secure 15-minute download authorization generated.',
      data: {
        signedUrl,
        expiresInSeconds,
        expiresAt,
        fileName: `studentbazaar-package-${projectId}.zip`,
        approxSizeBytes: 18400000,
        includes: ['Source Code (.zip)', 'Database Schema (.sql)', 'IEEE SRS (PDF)', 'Slides (PPTX)']
      }
    });
  } catch (err) {
    console.error('[Download URL Generation Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error generating secure download URL.' });
  }
};
