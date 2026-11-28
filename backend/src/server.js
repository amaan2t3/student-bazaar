import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customRequestRoutes from './routes/customRequestRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import { isSupabaseConfigured } from './config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedClientOrigins = new Set(
  (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const isAllowedClientOrigin = (origin) => {
  if (allowedClientOrigins.has(origin)) return true;
  if (process.env.NODE_ENV === 'production') return false;

  try {
    const url = new URL(origin);
    return url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
  } catch {
    return false;
  }
};

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || isAllowedClientOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Root and API v1 index endpoint
app.get(['/', '/api/v1'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'studentBazaar API v1 is active and running',
    database: isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Not configured',
    authentication: isSupabaseConfigured ? 'Supabase Auth' : 'Disabled',
    endpoints: {
      health: '/api/v1/health',
      projects: '/api/v1/projects',
      auth: '/api/v1/auth',
      sellers: '/api/v1/sellers',
      orders: '/api/v1/orders',
      customRequests: '/api/v1/custom-requests',
      contact: '/api/v1/contact',
      team: '/api/v1/team',
      admin: '/api/v1/admin'
    }
  });
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'studentBazaar API',
    database: isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Not configured',
    authentication: isSupabaseConfigured ? 'Supabase Auth' : 'Disabled',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sellers', sellerRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/custom-requests', customRequestRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/team', teamRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 studentBazaar Express Backend running on http://localhost:${PORT}`);
  console.log(`📡 Supabase: ${isSupabaseConfigured ? 'Configured' : 'Not configured; protected routes disabled'}`);
});
