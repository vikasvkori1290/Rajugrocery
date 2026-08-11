import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Diagnostics endpoint to debug Vercel database connections
app.get('/api/diagnostic', async (req, res) => {
  const uri = process.env.MONGODB_URI;
  let maskedUri = 'undefined';
  let connectionError = null;
  let connectionSuccess = false;
  
  if (uri) {
    // Mask username/password for privacy
    maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//******:******@');
    try {
      // Run a quick fresh connection attempt
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      connectionSuccess = true;
    } catch (err) {
      connectionError = err.message + '\n' + err.stack;
    }
  }

  // Check email SMTP configuration
  const smtpConfig = {
    SMTP_HOST: process.env.SMTP_HOST || 'not set',
    SMTP_PORT: process.env.SMTP_PORT || 'not set',
    SMTP_USER: process.env.SMTP_USER ? 'configured (not showing email for privacy)' : 'not set',
    SMTP_PASS: process.env.SMTP_PASS ? 'configured (hidden)' : 'not set'
  };

  res.status(200).json({
    mongodbUriPresent: !!uri,
    mongodbUriMasked: maskedUri,
    connectionSuccess,
    connectionError,
    mongooseConnectionState: mongoose.connection.readyState,
    mongooseConnectionStateString: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    smtpConfig,
    nodeEnv: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;
